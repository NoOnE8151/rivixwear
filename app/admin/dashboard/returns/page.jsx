
"use client";

import { useEffect, useMemo, useState } from "react";

const ORDERS_API = "/api/admin/orders/getAll";
const PRODUCT_API = "/api/public/shop/product/get";
const RETURN_UPDATE_API = "/api/admin/orders/returns/update";

const filters = [
  { label: "All", value: "all" },
  { label: "Review", value: "requested" },
  { label: "Approved", value: "approved" },
  { label: "Received", value: "received" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

const statusConfig = {
  requested: {
    label: "Awaiting Review",
    className: "bg-accent/10 text-accent",
  },
  approved: {
    label: "Approved",
    className: "bg-status-success/10 text-status-success",
  },
  rejected: {
    label: "Rejected",
    className: "bg-status-danger/10 text-status-danger",
  },
  received: {
    label: "Item Received",
    className: "bg-background-muted text-foreground",
  },
  completed: {
    label: "Completed",
    className: "bg-status-success/10 text-status-success",
  },
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCustomerName(order) {
  const shipping = order?.shippingAddress || {};

  return [
    shipping.firstName,
    shipping.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "Customer";
}

function getProductInfo(product, variantId) {
  if (!product) return null;

  const variant = product.variants?.find(
    (item) => String(item.id) === String(variantId)
  );

  return {
    name: product.name || "Product",
    collection: product.collection || "",
    variantName: variant?.name || "",
    image: variant?.images?.[0] || null,
  };
}

function ReturnBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || "Unknown",
    className: "bg-background-muted text-foreground-muted",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function ProductImage({ src, name }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-20 w-16 shrink-0 items-center justify-center bg-background-muted text-[10px] text-foreground-muted">
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Product"}
      onError={() => setFailed(true)}
      className="h-20 w-16 shrink-0 bg-background-muted object-cover"
    />
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "dark",
}) {
  const variants = {
    dark: "bg-background-inverse text-foreground-inverse hover:opacity-80",
    light: "border border-element-border text-foreground hover:bg-background-muted",
    danger: "border border-status-danger/30 bg-status-danger/10 text-status-danger hover:bg-status-danger/15",
    success: "bg-status-success text-white hover:opacity-90",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function ReturnCard({
  order,
  item,
  productInfo,
  onUpdated,
}) {
  const request = item.returnRequest || {};
  const status = request.status || "requested";

  const [resolutionType, setResolutionType] = useState(
    request.resolutionType || "refund"
  );

  const [adminNote, setAdminNote] = useState(
    request.adminNote || ""
  );

  const [courier, setCourier] = useState(
    request.pickupCourier || ""
  );

  const [trackingNumber, setTrackingNumber] = useState(
    request.pickupTrackingNumber || ""
  );

  const [pickupDate, setPickupDate] = useState(
    request.pickupScheduledAt
      ? new Date(request.pickupScheduledAt)
          .toISOString()
          .slice(0, 10)
      : ""
  );

  const [refundAmount, setRefundAmount] = useState(
    String(
      Number(item.price || 0) *
      Number(item.quantity || 0)
    )
  );

  const [resolutionReference, setResolutionReference] =
    useState(request.resolutionReference || "");

  const [resolutionNote, setResolutionNote] = useState(
    request.resolutionNote || ""
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const itemTotal =
    Number(item.price || 0) *
    Number(item.quantity || 0);

  const customer = order.shippingAddress || {};

  async function performAction(action, extra = {}) {
    try {
      setBusy(true);
      setError("");

      const response = await fetch(RETURN_UPDATE_API, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          productItemId: item._id,
          action,
          ...extra,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to update return request."
        );
      }

      onUpdated(data.order);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function approveReturn() {
    performAction("approve", {
      resolutionType,
      adminNote,
    });
  }

  function rejectReturn() {
    if (adminNote.trim().length < 5) {
      setError("Enter a clear reason for rejecting this request.");
      return;
    }

    performAction("reject", { adminNote });
  }

  function schedulePickup() {
    if (!courier.trim() || !trackingNumber.trim()) {
      setError("Enter the courier and tracking number.");
      return;
    }

    performAction("schedule_pickup", {
      pickupCourier: courier,
      pickupTrackingNumber: trackingNumber,
      pickupScheduledAt: pickupDate || null,
    });
  }

  function completeResolution() {
    if (!resolutionReference.trim()) {
      setError(
        "Enter the refund transaction or replacement reference."
      );
      return;
    }

    if (
      request.resolutionType === "refund" &&
      (
        !Number.isFinite(Number(refundAmount)) ||
        Number(refundAmount) <= 0 ||
        Number(refundAmount) > itemTotal
      )
    ) {
      setError(
        `Enter a refund amount between ₹0 and ${currency.format(itemTotal)}.`
      );
      return;
    }

    performAction("complete_resolution", {
      resolutionAmount:
        request.resolutionType === "refund"
          ? Number(refundAmount)
          : undefined,
      resolutionReference,
      resolutionNote,
    });
  }

  return (
    <article className="overflow-hidden rounded-xl border border-element-border bg-background-soft">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-element-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
            Order #{String(order._id).slice(-8).toUpperCase()}
          </p>

          <p className="mt-1 text-xs text-foreground-muted">
            Requested {formatDate(request.requestedAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ReturnBadge status={status} />

          {request.resolutionType && (
            <span className="rounded-full border border-element-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
              {request.resolutionType}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_0.9fr]">
        {/* Left: Customer and product */}
        <div className="min-w-0">
          <div className="flex gap-4">
            <ProductImage
              src={productInfo?.image}
              name={productInfo?.name}
            />

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                {productInfo?.name || "Product information unavailable"}
              </h3>

              {productInfo?.collection && (
                <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground-muted">
                  {productInfo.collection}
                </p>
              )}

              <p className="mt-2 text-xs text-foreground-muted">
                {productInfo?.variantName || "Variant unavailable"}
                {" · "}
                Size: {item.size || "—"}
              </p>

              <p className="mt-1 text-xs text-foreground-muted">
                Quantity: {item.quantity}
              </p>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {currency.format(itemTotal)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-element-border pt-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                Customer
              </p>

              <p className="mt-1 text-sm font-medium">
                {getCustomerName(order)}
              </p>

              <p className="mt-1 break-all text-xs text-foreground-muted">
                {order.email || "Email unavailable"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                Contact
              </p>

              <p className="mt-1 text-sm">
                {customer.phone || "Phone unavailable"}
              </p>

              <p className="mt-1 text-xs text-foreground-muted">
                {customer.city || ""}
                {customer.city && customer.state ? ", " : ""}
                {customer.state || ""}
                {customer.pincode ? ` - ${customer.pincode}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-element-border pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
              Customer's reason
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {request.reasonCategory || "Not specified"}
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground-muted">
              {request.reasonDetails || "No additional explanation provided."}
            </p>
          </div>

          {request.adminNote && (
            <div className="mt-4 border-l-2 border-accent bg-background-muted px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                Admin note
              </p>

              <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">
                {request.adminNote}
              </p>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="min-w-0 border-t border-element-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
            Return management
          </p>

          {error && (
            <div
              role="alert"
              className="mt-3 border border-status-danger/20 bg-status-danger/10 px-3 py-2 text-xs text-status-danger"
            >
              {error}
            </div>
          )}

          {/* STEP 1: Review */}
          {status === "requested" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium">
                  Resolution type
                </label>

                <select
                  value={resolutionType}
                  onChange={(event) =>
                    setResolutionType(event.target.value)
                  }
                  className="w-full border border-element-border bg-background px-3 py-3 text-sm outline-none focus:border-accent"
                  disabled={busy}
                >
                  <option value="refund">Refund</option>
                  <option value="exchange">Exchange</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Admin note
                </label>

                <textarea
                  value={adminNote}
                  onChange={(event) =>
                    setAdminNote(event.target.value)
                  }
                  rows={3}
                  maxLength={1000}
                  placeholder="Add a note for the customer..."
                  className="w-full resize-y border border-element-border bg-background px-3 py-3 text-sm outline-none focus:border-accent"
                  disabled={busy}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionButton
                  onClick={approveReturn}
                  disabled={busy}
                  variant="success"
                >
                  Approve Return
                </ActionButton>

                <ActionButton
                  onClick={rejectReturn}
                  disabled={busy}
                  variant="danger"
                >
                  Reject Request
                </ActionButton>
              </div>
            </div>
          )}

          {/* STEP 2: Pickup */}
          {status === "approved" && (
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-status-success/20 bg-status-success/5 p-3">
                <p className="text-xs font-semibold text-status-success">
                  Return approved
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Resolution: {request.resolutionType}
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Arrange reverse pickup before marking the item received.
                </p>
              </div>

              {request.pickupStatus !== "not_scheduled" ? (
                <div className="space-y-2 rounded-lg border border-element-border p-3">
                  <p className="text-xs font-semibold">
                    Pickup details
                  </p>

                  <p className="text-xs text-foreground-muted">
                    Courier: {request.pickupCourier || "—"}
                  </p>

                  <p className="break-all text-xs text-foreground-muted">
                    Tracking: {request.pickupTrackingNumber || "—"}
                  </p>

                  <p className="text-xs text-foreground-muted">
                    Scheduled: {formatDate(request.pickupScheduledAt)}
                  </p>

                  <p className="text-xs text-foreground-muted">
                    Pickup status: {request.pickupStatus}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold">
                    Schedule reverse pickup
                  </p>

                  <input
                    value={courier}
                    onChange={(event) => setCourier(event.target.value)}
                    placeholder="Courier / delivery service"
                    className="w-full border border-element-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                    disabled={busy}
                  />

                  <input
                    value={trackingNumber}
                    onChange={(event) =>
                      setTrackingNumber(event.target.value)
                    }
                    placeholder="Pickup tracking number"
                    className="w-full border border-element-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                    disabled={busy}
                  />

                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(event) => setPickupDate(event.target.value)}
                    className="w-full border border-element-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                    disabled={busy}
                  />

                  <ActionButton
                    onClick={schedulePickup}
                    disabled={busy}
                  >
                    Save Pickup Details
                  </ActionButton>
                </div>
              )}

              {request.pickupStatus === "scheduled" && (
                <ActionButton
                  onClick={() => performAction("mark_picked_up")}
                  disabled={busy}
                  variant="light"
                >
                  Mark Picked Up
                </ActionButton>
              )}

              <div className="border-t border-element-border pt-4">
                <p className="mb-3 text-xs text-foreground-muted">
                  Once the returned item physically reaches your location:
                </p>

                <ActionButton
                  onClick={() => performAction("mark_received")}
                  disabled={busy}
                  variant="success"
                >
                  Mark Item Received
                </ActionButton>
              </div>
            </div>
          )}

          {/* STEP 3: Inspection and resolution */}
          {status === "received" && (
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-element-border bg-background-muted p-3">
                <p className="text-xs font-semibold">
                  Item received
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Received on {formatDate(request.receivedAt)}
                </p>

                <p className="mt-2 text-xs text-foreground-muted">
                  Inspect the product before issuing a refund or arranging
                  the replacement.
                </p>
              </div>

              {request.resolutionStatus === "pending" && (
                <ActionButton
                  onClick={() => performAction("start_resolution")}
                  disabled={busy}
                >
                  Start {request.resolutionType} Processing
                </ActionButton>
              )}

              {request.resolutionStatus === "processing" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold">
                    Complete {request.resolutionType}
                  </p>

                  {request.resolutionType === "refund" && (
                    <div>
                      <label className="mb-2 block text-xs font-medium">
                        Refund amount (maximum {currency.format(itemTotal)})
                      </label>

                      <input
                        type="number"
                        min="0.01"
                        max={itemTotal}
                        step="0.01"
                        value={refundAmount}
                        onChange={(event) =>
                          setRefundAmount(event.target.value)
                        }
                        className="w-full border border-element-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                        disabled={busy}
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      {request.resolutionType === "refund"
                        ? "Refund transaction reference"
                        : "Replacement order / shipment reference"}
                    </label>

                    <input
                      value={resolutionReference}
                      onChange={(event) =>
                        setResolutionReference(event.target.value)
                      }
                      placeholder={
                        request.resolutionType === "refund"
                          ? "Transaction ID"
                          : "Replacement order or tracking ID"
                      }
                      className="w-full border border-element-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                      disabled={busy}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      Resolution note
                    </label>

                    <textarea
                      value={resolutionNote}
                      onChange={(event) =>
                        setResolutionNote(event.target.value)
                      }
                      rows={2}
                      maxLength={1000}
                      placeholder="Optional internal/customer-facing note"
                      className="w-full resize-y border border-element-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                      disabled={busy}
                    />
                  </div>

                  <ActionButton
                    onClick={completeResolution}
                    disabled={busy}
                    variant="success"
                  >
                    Complete {request.resolutionType}
                  </ActionButton>

                  <p className="text-[10px] leading-relaxed text-foreground-muted">
                    Record this only after the refund has actually been
                    issued or the replacement has actually been arranged
                    and dispatched.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Completed */}
          {status === "completed" && (
            <div className="mt-4 rounded-lg border border-status-success/20 bg-status-success/5 p-4">
              <p className="text-sm font-semibold text-status-success">
                Return completed
              </p>

              <p className="mt-2 text-xs text-foreground-muted">
                Resolution: {request.resolutionType}
              </p>

              {request.resolutionType === "refund" && (
                <p className="mt-1 text-xs text-foreground-muted">
                  Refund amount: {currency.format(request.resolutionAmount || 0)}
                </p>
              )}

              <p className="mt-1 break-all text-xs text-foreground-muted">
                Reference: {request.resolutionReference || "—"}
              </p>

              <p className="mt-1 text-xs text-foreground-muted">
                Completed: {formatDate(request.completedAt)}
              </p>
            </div>
          )}

          {/* Rejected */}
          {status === "rejected" && (
            <div className="mt-4 rounded-lg border border-status-danger/20 bg-status-danger/5 p-4">
              <p className="text-sm font-semibold text-status-danger">
                Request rejected
              </p>

              <p className="mt-1 text-xs text-foreground-muted">
                The rejection note is displayed above.
              </p>
            </div>
          )}

          {busy && (
            <p className="mt-3 text-xs text-foreground-muted">
              Updating return request...
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AdminReturnsPage() {
  const [orders, setOrders] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(ORDERS_API, {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || data?.success === false) {
          throw new Error(
            data?.message || "Unable to fetch orders."
          );
        }

        const fetchedOrders = Array.isArray(data)
          ? data
          : data?.orders;

        if (!Array.isArray(fetchedOrders)) {
          throw new Error("Invalid orders response.");
        }

        setOrders(fetchedOrders);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(err.message || "Unable to load return requests.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, []);

  // Fetch unique product data using the existing public product API.
  useEffect(() => {
    const controller = new AbortController();

    const productIds = [
      ...new Set(
        orders
          .flatMap((order) =>
            (order.products || []).map((item) =>
              String(item.productId || "")
            )
          )
          .filter(Boolean)
      ),
    ];

    if (!productIds.length) {
      setProductDetails({});
      return () => controller.abort();
    }

    async function fetchProduct(productId) {
      try {
        const response = await fetch(PRODUCT_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
          return [productId, null];
        }

        let product = data.products;

        if (Array.isArray(product)) {
          product =
            product.find(
              (item) => String(item._id) === productId
            ) || null;
        }

        return [productId, product];
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Product lookup failed:", err);
        }

        return [productId, null];
      }
    }

    async function loadProducts() {
      const results = await Promise.all(
        productIds.map(fetchProduct)
      );

      if (!controller.signal.aborted) {
        setProductDetails(
          Object.fromEntries(results)
        );
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [orders]);

  const returnEntries = useMemo(() => {
    return orders.flatMap((order) =>
      (order.products || [])
        .filter((item) => {
          const status =
            item.returnRequest?.status || "not_requested";

          return status !== "not_requested";
        })
        .map((item) => ({
          order,
          item,
        }))
    );
  }, [orders]);

  const counts = useMemo(() => {
    const result = {
      all: returnEntries.length,
      requested: 0,
      approved: 0,
      received: 0,
      completed: 0,
      rejected: 0,
    };

    returnEntries.forEach(({ item }) => {
      const status = item.returnRequest?.status;

      if (Object.hasOwn(result, status)) {
        result[status] += 1;
      }
    });

    return result;
  }, [returnEntries]);

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase();

    return returnEntries.filter(({ order, item }) => {
      const status =
        item.returnRequest?.status || "requested";

      if (filter !== "all" && status !== filter) {
        return false;
      }

      if (!term) return true;

      const searchText = [
        order._id,
        order.email,
        getCustomerName(order),
        order.shippingAddress?.phone,
        item.returnRequest?.reasonCategory,
        item.returnRequest?.reasonDetails,
        item.returnRequest?.resolutionReference,
        productDetails[String(item.productId)]?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchText.includes(term);
    });
  }, [returnEntries, filter, search, productDetails]);

  function handleUpdatedOrder(updatedOrder) {
    setOrders((current) =>
      current.map((order) =>
        String(order._id) === String(updatedOrder._id)
          ? updatedOrder
          : order
      )
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-element-border">
        <div className="px-5 py-7 sm:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              Management
            </p>

            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="font-heading text-4xl tracking-wide sm:text-5xl">
                  Returns
                </h1>

                <p className="mt-2 text-sm text-foreground-muted">
                  Review return requests, coordinate pickups and manage
                  refunds or exchanges.
                </p>
              </div>

              <div className="rounded-lg border border-element-border bg-background-soft px-4 py-3">
                <p className="text-2xl font-semibold tabular-nums">
                  {counts.all}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                  Total return requests
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1500px]">
          {/* Summary */}
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {[
              ["Awaiting Review", counts.requested, "text-accent"],
              ["Approved", counts.approved, "text-status-success"],
              ["Received", counts.received, "text-foreground"],
              ["Completed", counts.completed, "text-status-success"],
              ["Rejected", counts.rejected, "text-status-danger"],
            ].map(([label, count, color]) => (
              <div
                key={label}
                className="border border-element-border bg-background-soft p-4"
              >
                <p className={`text-2xl font-semibold tabular-nums ${color}`}>
                  {count}
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Search and filters */}
          <div className="mb-6 space-y-4">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order, customer, email or product..."
              className="w-full border border-element-border bg-background-soft px-4 py-3 text-sm outline-none transition focus:border-accent"
            />

            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`border px-4 py-2 text-xs font-semibold transition ${
                    filter === item.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-element-border text-foreground-muted hover:bg-background-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {" "}
                  <span className="ml-1 opacity-70">
                    {counts[item.value] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 border border-status-danger/20 bg-status-danger/10 p-4 text-sm text-status-danger"
            >
              {error}

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="ml-3 font-semibold underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-foreground-muted">
              Loading return requests...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center border border-element-border px-5 text-center">
              <h2 className="text-lg font-semibold">
                {returnEntries.length
                  ? "No matching requests"
                  : "No return requests yet"}
              </h2>

              <p className="mt-2 max-w-md text-sm text-foreground-muted">
                {returnEntries.length
                  ? "Try another filter or search term."
                  : "Customer return requests will appear here when submitted."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredEntries.map(({ order, item }) => {
                const product =
                  productDetails[String(item.productId)];

                const productInfo = getProductInfo(
                  product,
                  item.variantId
                );

                return (
                  <ReturnCard
                    key={`${order._id}-${item._id}`}
                    order={order}
                    item={item}
                    productInfo={productInfo}
                    onUpdated={handleUpdatedOrder}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
