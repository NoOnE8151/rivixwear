"use client";

import { useEffect, useState } from "react";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Active", value: "active" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
];

const statusConfig = {
  pending: {
    label: "Pending",
    className: "border-accent/30 bg-accent/10 text-accent",
  },
  accepted: {
    label: "Accepted",
    className:
      "border-foreground-subtle/40 bg-foreground-subtle/15 text-foreground-dim",
  },
  active: {
    label: "Active",
    className:
      "border-element-border bg-background-muted text-foreground",
  },
  fulfilled: {
    label: "Fulfilled",
    className:
      "border-status-success/20 bg-status-success/10 text-status-success",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-status-danger/20 bg-status-danger/10 text-status-danger",
  },
};

const nextStatus = {
  pending: {
    status: "accepted",
    label: "Accept Order",
  },
  accepted: {
    status: "active",
    label: "Start Processing",
  },
  active: {
    status: "fulfilled",
    label: "Mark Fulfilled",
  },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getOrderTotal(products = []) {
  return products.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );
}

function getTotalItems(products = []) {
  return products.reduce(
    (total, product) => total + product.quantity,
    0
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function PackageIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function ConfirmationModal({
  order,
  targetStatus,
  onConfirm,
  onCancel,
  loading,
}) {
  if (!order || !targetStatus) {
    return null;
  }

  const currentStatus =
    statusConfig[order.status]?.label || order.status;

  const targetLabel =
    statusConfig[targetStatus]?.label || targetStatus;

  const isCancel = targetStatus === "cancelled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-element-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              Confirm Action
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Change order status?
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-1.5 text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-element-border bg-background-soft p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground-muted">
              Order
            </span>

            <span className="font-mono text-xs font-medium">
              #{String(order._id).slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                Current
              </p>

              <p className="mt-1 font-medium">
                {currentStatus}
              </p>
            </div>

            <span className="text-foreground-muted">
              →
            </span>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                New status
              </p>

              <p
                className={`mt-1 font-medium ${
                  isCancel
                    ? "text-status-danger"
                    : "text-accent"
                }`}
              >
                {targetLabel}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-foreground-muted">
          {isCancel
            ? "This will cancel the order. Make sure you want to perform this action."
            : "This will update the order status and the customer will see the updated status on their order page."}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-element-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-background-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep Order
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground-inverse transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isCancel
                ? "bg-status-danger hover:bg-status-danger-soft"
                : "bg-element hover:bg-element-hover"
            }`}
          >
            {loading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-xl border border-element-border bg-background-soft p-5"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-background-muted" />

              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-background-muted" />
                <div className="h-3 w-48 rounded bg-background-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[1, 2, 3, 4].map((column) => (
                <div
                  key={column}
                  className="space-y-2"
                >
                  <div className="h-2 w-12 rounded bg-background-muted" />
                  <div className="h-3 w-16 rounded bg-background-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [confirmation, setConfirmation] = useState({
    order: null,
    targetStatus: null,
  });

  const [updating, setUpdating] = useState(false);

  /*
   * Fetch all orders
   */
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/admin/orders/getAll",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch orders (${response.status})`
          );
        }

        const data = await response.json();

        /*
         * Supports both:
         *
         * API → [...]
         *
         * and
         *
         * API → { orders: [...] }
         */
        const fetchedOrders = Array.isArray(data)
          ? data
          : data.orders;

        if (!Array.isArray(fetchedOrders)) {
          throw new Error(
            "Invalid orders response from API"
          );
        }

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);

        setError(
          err.message || "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
          (order) => order.status === filter
        );

  /*
   * Open confirmation modal
   */
  function requestStatusChange(order, targetStatus) {
    setConfirmation({
      order,
      targetStatus,
    });
  }

  /*
   * Update status
   *
   * IMPORTANT:
   * Change the endpoint below to your actual
   * status-update API when you create it.
   */
  async function confirmStatusChange() {
    const { order, targetStatus } = confirmation;

    if (!order || !targetStatus) {
      return;
    }

    try {
      setUpdating(true);

      /*
       * Example expected endpoint:
       *
       * PATCH /api/admin/orders/updateStatus
       *
       * Body:
       * {
       *   orderId: order._id,
       *   status: targetStatus
       * }
       */

      const response = await fetch(
        "/api/admin/orders/updateStatus",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order._id,
            status: targetStatus,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(
          () => null
        );

        throw new Error(
          data?.message ||
            `Failed to update order (${response.status})`
        );
      }

      /*
       * Update local UI only after the database
       * update succeeds.
       */
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          String(currentOrder._id) ===
          String(order._id)
            ? {
                ...currentOrder,
                status: targetStatus,
                updatedAt:
                  new Date().toISOString(),
              }
            : currentOrder
        )
      );

      setConfirmation({
        order: null,
        targetStatus: null,
      });
    } catch (err) {
      console.error(
        "Failed to update order status:",
        err
      );

      setError(
        err.message || "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-element-border">
          <div className="px-5 py-6 sm:px-8">
            <div className="mx-auto max-w-[1500px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Management
              </p>

              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="font-heading text-4xl tracking-wide sm:text-5xl">
                    Orders
                  </h1>

                  <p className="mt-2 max-w-xl text-sm text-foreground-muted">
                    Review customer orders and manage
                    their fulfillment status.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-lg border border-element-border bg-background-soft px-3 py-2">
                  <PackageIcon />

                  <span className="text-sm font-medium">
                    {orders.length}
                  </span>

                  <span className="text-xs text-foreground-muted">
                    total orders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-[1500px]">
            {/* Error */}
            {error && (
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-status-danger/20 bg-status-danger/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-status-danger">
                    Failed to load orders
                  </p>

                  <p className="mt-1 text-xs text-status-danger/80">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-fit rounded-lg border border-status-danger/20 px-3 py-2 text-xs font-medium text-status-danger hover:bg-status-danger/10"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Filters */}
            {!loading && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex min-w-max gap-2">
                  {statusFilters.map((item) => {
                    const active =
                      filter === item.value;

                    const count =
                      item.value === "all"
                        ? orders.length
                        : orders.filter(
                            (order) =>
                              order.status ===
                              item.value
                          ).length;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setFilter(item.value)
                        }
                        className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                          active
                            ? "border-element bg-element text-foreground-inverse"
                            : "border-element-border bg-background text-foreground-muted hover:bg-background-muted hover:text-foreground"
                        }`}
                      >
                        {item.label}

                        <span
                          className={`ml-2 ${
                            active
                              ? "text-foreground-inverse/60"
                              : "text-foreground-muted"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && <LoadingState />}

            {/* Orders */}
            {!loading && filteredOrders.length > 0 && (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const isExpanded =
                    expandedOrder === order._id;

                  const action =
                    nextStatus[order.status];

                  const total = getOrderTotal(
                    order.products
                  );

                  const itemCount = getTotalItems(
                    order.products
                  );

                  return (
                    <div
                      key={order._id}
                      className="overflow-hidden rounded-xl border border-element-border bg-background-soft"
                    >
                      {/* Order Summary */}
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          {/* Order identity */}
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-muted text-foreground-dim">
                              <PackageIcon />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="font-mono text-sm font-semibold">
                                  #
                                  {String(
                                    order._id
                                  )
                                    .slice(-6)
                                    .toUpperCase()}
                                </h2>

                                <StatusBadge
                                  status={
                                    order.status
                                  }
                                />
                              </div>

                              <p className="mt-1 truncate text-xs text-foreground-muted">
                                User ID:{" "}
                                {order.userId}
                              </p>
                            </div>
                          </div>

                          {/* Order information */}
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 xl:flex xl:items-center xl:gap-10">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                Items
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {itemCount}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                Total
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {formatCurrency(
                                  total
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                Payment
                              </p>

                              <p className="mt-1 text-sm font-medium uppercase">
                                {order.paymentMethod ||
                                  "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                Placed
                              </p>

                              <p className="mt-1 text-xs font-medium">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 flex flex-col gap-2 border-t border-element-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrder(
                                isExpanded
                                  ? null
                                  : order._id
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground sm:justify-start"
                          >
                            {isExpanded
                              ? "Hide details"
                              : "View order details"}

                            <ChevronIcon
                              open={isExpanded}
                            />
                          </button>

                          <div className="flex flex-col gap-2 sm:flex-row">
                            {/* Cancel */}
                            {order.status !==
                              "cancelled" &&
                              order.status !==
                                "fulfilled" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    requestStatusChange(
                                      order,
                                      "cancelled"
                                    )
                                  }
                                  disabled={updating}
                                  className="rounded-lg border border-status-danger/20 px-4 py-2.5 text-xs font-medium text-status-danger transition-colors hover:bg-status-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Cancel Order
                                </button>
                              )}

                            {/* Next status */}
                            {action && (
                              <button
                                type="button"
                                onClick={() =>
                                  requestStatusChange(
                                    order,
                                    action.status
                                  )
                                }
                                disabled={updating}
                                className="rounded-lg bg-element px-4 py-2.5 text-xs font-medium text-foreground-inverse transition-colors hover:bg-element-hover disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {action.label}
                              </button>
                            )}

                            {/* Fulfilled */}
                            {order.status ===
                              "fulfilled" && (
                              <button
                                type="button"
                                disabled
                                className="cursor-not-allowed rounded-lg border border-status-success/20 bg-status-success/10 px-4 py-2.5 text-xs font-medium text-status-success opacity-80"
                              >
                                Order Fulfilled
                              </button>
                            )}

                            {/* Cancelled */}
                            {order.status ===
                              "cancelled" && (
                              <button
                                type="button"
                                disabled
                                className="cursor-not-allowed rounded-lg border border-status-danger/20 bg-status-danger/10 px-4 py-2.5 text-xs font-medium text-status-danger opacity-70"
                              >
                                Order Cancelled
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="border-t border-element-border bg-background px-4 py-5 sm:px-5">
                          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                            {/* Products */}
                            <div>
                              <div className="mb-3">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.15em]">
                                  Products
                                </h3>

                                <p className="mt-1 text-xs text-foreground-muted">
                                  Items included in this
                                  order
                                </p>
                              </div>

                              <div className="overflow-hidden rounded-lg border border-element-border">
                                <div className="hidden grid-cols-[1fr_100px_80px_100px] border-b border-element-border px-4 py-3 text-[10px] uppercase tracking-wider text-foreground-muted sm:grid">
                                  <span>Product</span>
                                  <span>Size</span>
                                  <span>Qty</span>
                                  <span>Price</span>
                                </div>

                                {order.products?.map(
                                  (
                                    product,
                                    index
                                  ) => (
                                    <div
                                      key={`${product.variantId}-${index}`}
                                      className="grid gap-3 border-b border-element-border p-4 last:border-0 sm:grid-cols-[1fr_100px_80px_100px] sm:items-center sm:gap-0 sm:px-4 sm:py-3"
                                    >
                                      <div>
                                        <p className="text-xs font-medium">
                                          {
                                            product.productId
                                          }
                                        </p>

                                        <p className="mt-1 text-[10px] text-foreground-muted">
                                          Variant:{" "}
                                          {
                                            product.variantId
                                          }
                                        </p>
                                      </div>

                                      <div className="flex items-center justify-between sm:block">
                                        <span className="text-[10px] text-foreground-muted sm:hidden">
                                          Size
                                        </span>

                                        <span className="text-xs font-medium">
                                          {
                                            product.size
                                          }
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between sm:block">
                                        <span className="text-[10px] text-foreground-muted sm:hidden">
                                          Quantity
                                        </span>

                                        <span className="text-xs font-medium">
                                          {
                                            product.quantity
                                          }
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between sm:block">
                                        <span className="text-[10px] text-foreground-muted sm:hidden">
                                          Price
                                        </span>

                                        <span className="text-xs font-medium">
                                          {formatCurrency(
                                            product.price *
                                              product.quantity
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Order information */}
                            <div>
                              <div className="mb-3">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.15em]">
                                  Order Information
                                </h3>

                                <p className="mt-1 text-xs text-foreground-muted">
                                  Order metadata
                                </p>
                              </div>

                              <div className="rounded-lg border border-element-border">
                                <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-element-border p-4">
                                  <span className="text-xs text-foreground-muted">
                                    User ID
                                  </span>

                                  <span className="break-all text-right font-mono text-[11px]">
                                    {order.userId}
                                  </span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-element-border p-4">
                                  <span className="text-xs text-foreground-muted">
                                    Order ID
                                  </span>

                                  <span className="break-all text-right font-mono text-[11px]">
                                    {order._id}
                                  </span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-element-border p-4">
                                  <span className="text-xs text-foreground-muted">
                                    Payment
                                  </span>

                                  <span className="text-right text-xs font-medium uppercase">
                                    {order.paymentMethod ||
                                      "—"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-element-border p-4">
                                  <span className="text-xs text-foreground-muted">
                                    Created
                                  </span>

                                  <span className="text-right text-xs">
                                    {formatDate(
                                      order.createdAt
                                    )}
                                  </span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-4 p-4">
                                  <span className="text-xs text-foreground-muted">
                                    Updated
                                  </span>

                                  <span className="text-right text-xs">
                                    {formatDate(
                                      order.updatedAt
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty */}
            {!loading && filteredOrders.length === 0 && !error && (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-element-border bg-background-soft px-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-muted text-foreground-muted">
                  <PackageIcon />
                </div>

                <h2 className="mt-4 text-sm font-semibold">
                  No orders found
                </h2>

                <p className="mt-1 max-w-sm text-xs leading-5 text-foreground-muted">
                  There are no orders matching the
                  selected status.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        order={confirmation.order}
        targetStatus={confirmation.targetStatus}
        onConfirm={confirmStatusChange}
        onCancel={() =>
          setConfirmation({
            order: null,
            targetStatus: null,
          })
        }
        loading={updating}
      />
    </>
  );
}