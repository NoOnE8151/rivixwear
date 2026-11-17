"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Package,
  CalendarDays,
  RefreshCw,
  X,
  RotateCcw,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const ORDERS_API = "/api/protected/orders/get";
const PRODUCT_API = "/api/public/shop/product/get";
const RETURN_API = "/api/protected/orders/return";

const RETURN_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

const returnReasonOptions = [
  "Damaged or defective",
  "Wrong product received",
  "Size or fit issue",
  "Product quality issue",
  "Item not as described",
  "Other",
];

const returnStatusConfig = {
  requested: {
    label: "Return Requested",
    className: "bg-accent/10 text-accent",
  },
  approved: {
    label: "Return Approved",
    className: "bg-status-success/10 text-status-success",
  },
  rejected: {
    label: "Return Rejected",
    className: "bg-status-danger/10 text-status-danger",
  },
  received: {
    label: "Item Received",
    className: "bg-background-muted text-foreground",
  },
  completed: {
    label: "Returned",
    className: "bg-status-success/10 text-status-success",
  },
  requested: {
    label: "Submitted for Return",
    className: "bg-accent/10 text-accent",
  },
};

function getProductReturnStatus(item) {
  return item?.returnRequest?.status || "not_requested";
}

function canReturnProduct(order, item) {
  const fulfilledAt = order?.fulfilledAt
    ? new Date(order.fulfilledAt).getTime()
    : NaN;

  const now = Date.now();

  return (
    order?.status === "fulfilled" &&
    getProductReturnStatus(item) === "not_requested" &&
    Boolean(item?._id) &&
    Number.isFinite(fulfilledAt) &&
    now >= fulfilledAt &&
    now < fulfilledAt + RETURN_WINDOW_MS
  );
}

function ReturnResolutionInfo({ returnRequest }) {
  if (!returnRequest || returnRequest.status === "not_requested") {
    return null;
  }

  const {
    status,
    resolutionType,
    resolutionStatus,
    resolutionAmount,
    resolutionReference,
    resolutionNote,
    pickupStatus,
    pickupCourier,
    pickupTrackingNumber,
    pickupScheduledAt,
    adminNote,
  } = returnRequest;

  let message = "";

  if (status === "requested") {
    message = "Your return request has been submitted and is awaiting review.";
  } else if (status === "rejected") {
    message = "Your return request was declined.";
  } else if (status === "approved") {
    message = `Your return has been approved for a ${resolutionType || "return"}.`;
  } else if (status === "received") {
    message = "We have received your returned item.";
  } else if (status === "completed") {
    message =
      resolutionType === "refund"
        ? "Your refund has been processed."
        : "Your exchange has been completed.";
  }

  if (status === "received" && resolutionStatus === "processing") {
    message =
      resolutionType === "refund"
        ? "Your refund is being processed."
        : "Your replacement is being arranged.";
  }

  return (
    <div className="mt-4 border border-element-border bg-background-soft p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
        Return update
      </p>

      <p className="mt-2 text-sm font-semibold text-foreground">{message}</p>

      {resolutionType && (
        <p className="mt-2 text-xs text-foreground-muted">
          Resolution:{" "}
          <span className="font-medium capitalize text-foreground">
            {resolutionType}
          </span>
        </p>
      )}

      {pickupStatus === "scheduled" && (
        <div className="mt-3 space-y-1 border-t border-element-border pt-3">
          <p className="text-xs font-semibold">Reverse pickup scheduled</p>

          {pickupCourier && (
            <p className="text-xs text-foreground-muted">
              Courier: {pickupCourier}
            </p>
          )}

          {pickupTrackingNumber && (
            <p className="break-all text-xs text-foreground-muted">
              Tracking number: {pickupTrackingNumber}
            </p>
          )}

          {pickupScheduledAt && (
            <p className="text-xs text-foreground-muted">
              Pickup date:{" "}
              {new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(pickupScheduledAt))}
            </p>
          )}
        </div>
      )}

      {pickupStatus === "picked_up" && (
        <p className="mt-3 text-xs text-foreground-muted">
          Your returned item has been collected by the courier.
        </p>
      )}

      {status === "completed" && resolutionType === "refund" && (
        <div className="mt-3 border-t border-element-border pt-3">
          <p className="text-xs text-foreground-muted">
            Refund amount:{" "}
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              }).format(Number(resolutionAmount || 0))}
            </span>
          </p>

          {resolutionReference && (
            <p className="mt-1 break-all text-xs text-foreground-muted">
              Transaction reference: {resolutionReference}
            </p>
          )}
        </div>
      )}

      {status === "completed" &&
        resolutionType === "exchange" &&
        resolutionReference && (
          <p className="mt-3 break-all text-xs text-foreground-muted">
            Replacement reference: {resolutionReference}
          </p>
        )}

      {resolutionNote && (
        <p className="mt-3 text-xs text-foreground-muted">{resolutionNote}</p>
      )}

      {adminNote && (
        <div className="mt-3 border-t border-element-border pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
            Message from RIVIX
          </p>

          <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">
            {adminNote}
          </p>
        </div>
      )}
    </div>
  );
}

// This is the aggregate status shown in the order header.
// It does not change the stored fulfillment status.
function getOrderDisplayStatus(order) {
  const products = Array.isArray(order?.products) ? order.products : [];

  if (!products.length) return order?.status;

  const statuses = products.map(getProductReturnStatus);

  if (
    statuses.some((status) =>
      ["requested", "approved", "received"].includes(status),
    )
  ) {
    return "returning";
  }

  const completedCount = statuses.filter(
    (status) => status === "completed",
  ).length;

  if (completedCount === products.length) {
    return "returned";
  }

  if (completedCount > 0) {
    return "partially_returned";
  }

  return order?.status;
}

// ========================================
// CONFIGURATION
// ========================================

const statusFilters = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "active" },
  { label: "Accepted", value: "accepted" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returning", value: "returning" },
  { label: "Partially Returned", value: "partially_returned" },
  { label: "Returned", value: "returned" },
];

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-accent/10 text-accent",
    dot: "bg-accent",
  },
  active: {
    label: "Processing",
    className: "bg-background-muted text-foreground",
    dot: "bg-foreground-muted",
  },
  accepted: {
    label: "Accepted",
    className: "bg-accent-light/20 text-foreground",
    dot: "bg-accent",
  },
  fulfilled: {
    label: "Fulfilled",
    className: "bg-status-success/10 text-status-success",
    dot: "bg-status-success",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-status-danger/10 text-status-danger",
    dot: "bg-status-danger",
  },
  returning: {
    label: "Returning",
    className: "bg-accent/10 text-accent",
    dot: "bg-accent",
  },

  partially_returned: {
    label: "Partially Returned",
    className: "bg-accent/10 text-accent",
    dot: "bg-accent",
  },

  returned: {
    label: "Returned",
    className: "bg-status-success/10 text-status-success",
    dot: "bg-status-success",
  },
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatCurrency(value) {
  const amount = Number(value);

  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

function getOrderId(order) {
  const id = String(order?._id || order?.id || "");

  return id ? id.slice(-8).toUpperCase() : "UNAVAILABLE";
}

function getOrderTotal(products = []) {
  return products.reduce((total, product) => {
    const price = Number(product?.price);
    const quantity = Number(product?.quantity);

    return (
      total +
      (Number.isFinite(price) ? price : 0) *
        (Number.isFinite(quantity) ? quantity : 0)
    );
  }, 0);
}

function getPaymentLabel(method) {
  switch (method?.toLowerCase()) {
    case "cod":
      return "Cash on Delivery";
    case "prepaid":
      return "Prepaid";
    default:
      return "Not specified";
  }
}

// ========================================
// PRODUCT INFORMATION
// ========================================

// Uses the exact Product schema provided.

function getProductInfo(product, variantId) {
  if (!product) return null;

  const variant = product.variants?.find(
    (item) => String(item.id) === String(variantId),
  );

  return {
    name: product.name,
    collection: product.collection,
    variantName: variant?.name || null,
    image: variant?.images?.[0] || null,
  };
}

// ========================================
// PRODUCT IMAGE
// ========================================

function ProductImage({ src, alt, isLoading }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className="relative flex h-[104px] w-[84px] shrink-0 items-center justify-center overflow-hidden border border-element-border bg-background-soft sm:h-[120px] sm:w-[96px]">
      {isLoading ? (
        <div className="h-full w-full animate-pulse bg-background-muted" />
      ) : src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-foreground-muted">
          <ShoppingBag size={25} strokeWidth={1.3} />

          <span className="text-[9px] font-medium uppercase tracking-wider">
            RIVIX
          </span>
        </div>
      )}
    </div>
  );
}

// ========================================
// LOADING SKELETON
// ========================================

function OrdersSkeleton() {
  return (
    <div
      className="animate-pulse space-y-5"
      role="status"
      aria-label="Loading orders"
    >
      {[1, 2].map((item) => (
        <div key={item} className="border border-element-border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4 border-b border-element-border pb-4">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-background-muted" />
              <div className="h-3 w-20 bg-background-muted" />
            </div>

            <div className="h-7 w-24 bg-background-muted" />
          </div>

          {[1, 2].map((product) => (
            <div
              key={product}
              className="flex gap-4 border-b border-element-border py-5 last:border-0"
            >
              <div className="h-[104px] w-[84px] shrink-0 bg-background-muted" />

              <div className="flex-1 space-y-3 pt-2">
                <div className="h-4 w-3/4 bg-background-muted" />
                <div className="h-3 w-1/3 bg-background-muted" />
                <div className="h-3 w-1/4 bg-background-muted" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ========================================
// EMPTY STATE
// ========================================

function EmptyOrders({ filtered = false, onClear }) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center border border-dashed border-element-border px-5 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-background-soft">
        {filtered ? (
          <Search
            size={26}
            strokeWidth={1.5}
            className="text-foreground-muted"
          />
        ) : (
          <Package
            size={26}
            strokeWidth={1.5}
            className="text-foreground-muted"
          />
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {filtered ? "No matching orders" : "No orders yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground-muted">
        {filtered
          ? "We couldn't find any orders matching your search. Try changing your filters."
          : "Your RIVIX purchases will appear here. Once you place your first order, you can track its status here."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-accent"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

// ========================================
// ERROR STATE
// ========================================

function OrdersError({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex min-h-[300px] flex-col items-center justify-center border border-element-border px-5 py-12 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-status-danger/10">
        <RefreshCw size={23} className="text-status-danger" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        Unable to load your orders
      </h3>

      <p className="mt-2 max-w-sm text-sm text-foreground-muted">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 bg-background-inverse px-5 py-3 text-sm font-medium text-foreground-inverse transition-colors hover:bg-element-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <RefreshCw size={15} />
        Try Again
      </button>
    </div>
  );
}

// ========================================
// ORDER STATUS
// ========================================

function OrderStatus({ status }) {
  const config = statusConfig[status?.toLowerCase()] || {
    label: "Unknown",
    className: "bg-background-muted text-foreground-muted",
    dot: "bg-foreground-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />

      {config.label}
    </span>
  );
}

// ========================================
// ORDER PRODUCT ITEM
// ========================================

function OrderProduct({
  order,
  item,
  productInfo,
  isProductLoading,
  onRequestReturn,
  isSubmittingReturn,
}) {
  const quantity = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const subtotal = quantity * price;

  const returnStatus = getProductReturnStatus(item);
  const hasReturnRequest = returnStatus !== "not_requested";

  const returnStatusInfo = returnStatusConfig[returnStatus];

  const fulfilledAt = order?.fulfilledAt
    ? new Date(order.fulfilledAt).getTime()
    : NaN;

  const hasFulfillmentDate = Number.isFinite(fulfilledAt);

  const returnWindowExpired =
    hasFulfillmentDate && Date.now() >= fulfilledAt + RETURN_WINDOW_MS;

  const eligible = canReturnProduct(order, item);

  return (
    <div
      className={`
        flex gap-4 border-b border-element-border py-5 last:border-b-0 last:pb-0
        transition-colors
        ${hasReturnRequest ? "border-l-2 border-l-accent bg-accent/5 pl-3" : ""}
      `}
    >
      {/* Product Image */}
      <ProductImage
        src={productInfo?.image}
        alt={productInfo?.name || "RIVIX product"}
        isLoading={isProductLoading}
      />

      {/* Product Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold leading-snug text-foreground sm:text-base">
            {isProductLoading
              ? "Loading product..."
              : productInfo?.name || "Product information unavailable"}
          </h3>

          {productInfo?.collection && (
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-foreground-muted">
              {productInfo.collection}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
            {productInfo?.variantName && <span>{productInfo.variantName}</span>}

            {item.size && <span>Size: {item.size}</span>}
          </div>

          <p className="mt-2.5 text-xs text-foreground-muted">
            Quantity:{" "}
            <span className="font-semibold text-foreground">{quantity}</span>
          </p>
        </div>

        {/* Product Pricing and Return */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-element-border pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <div>
            <p className="text-xs text-foreground-muted">
              {formatCurrency(price)} × {quantity}
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatCurrency(subtotal)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {hasReturnRequest ? (
              returnStatus === "requested" ? (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex cursor-not-allowed items-center gap-2 border border-accent/20 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent opacity-90"
                >
                  <CheckCircle2 size={14} />
                  Submitted for Return
                </button>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                    returnStatusInfo?.className ||
                    "bg-background-muted text-foreground-muted"
                  }`}
                >
                  <RotateCcw size={12} />
                  {returnStatusInfo?.label || "Return Processing"}
                </span>
              )
            ) : eligible ? (
              <button
                type="button"
                onClick={() => onRequestReturn(order, item, productInfo)}
                disabled={isSubmittingReturn}
                className="inline-flex items-center gap-2 border border-element-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingReturn ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RotateCcw size={14} />
                )}
                Return Item
              </button>
            ) : order?.status === "fulfilled" && !hasFulfillmentDate ? (
              <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
                Return date unavailable — contact support
              </span>
            ) : order?.status === "fulfilled" && returnWindowExpired ? (
              <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
                Return window closed
              </span>
            ) : null}
          </div>
          {hasReturnRequest && (
            <ReturnResolutionInfo returnRequest={item.returnRequest} />
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// ORDER CARD
// ========================================

function OrderCard({
  order,
  productDetails,
  onRequestReturn,
  submittingReturnItemId,
}) {
  const products = Array.isArray(order.products) ? order.products : [];

  const orderTotal = getOrderTotal(products);

  const totalQuantity = products.reduce(
    (total, product) => total + (Number(product.quantity) || 0),
    0,
  );

  const displayStatus = getOrderDisplayStatus(order);

  return (
    <article className="overflow-hidden border border-element-border bg-background transition-colors duration-200 hover:border-background-muted">
      {/* ORDER HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-element-border bg-background-soft/40 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted">
              Order
            </span>

            <span className="text-sm font-bold tracking-wide text-foreground">
              #{getOrderId(order)}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatDate(order.createdAt)}
            </span>

            <span>
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>

        <OrderStatus status={displayStatus} />
      </div>

      {/* ORDERED PRODUCTS */}
      <div className="px-4 sm:px-5">
        {products.length > 0 ? (
          products.map((item, index) => {
            const productId = String(item.productId);
            const lookup = productDetails[productId];

            const productInfo = lookup?.product
              ? getProductInfo(lookup.product, item.variantId)
              : null;

            return (
              <OrderProduct
                key={item._id || `${productId}-${item.variantId}-${index}`}
                order={order}
                item={item}
                productInfo={productInfo}
                isProductLoading={lookup?.loading === true}
                onRequestReturn={onRequestReturn}
                isSubmittingReturn={submittingReturnItemId === String(item._id)}
              />
            );
          })
        ) : (
          <p className="py-8 text-center text-sm text-foreground-muted">
            No product information available.
          </p>
        )}
      </div>

      {/* ORDER FOOTER */}
      <div className="flex flex-col gap-4 border-t border-element-border bg-background-soft/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-foreground-muted">
          <span>
            Payment:{" "}
            <span className="font-medium text-foreground">
              {getPaymentLabel(order.paymentMethod)}
            </span>
          </span>

          <span>
            {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-5 sm:justify-end">
          <span className="text-xs text-foreground-muted">Total Amount</span>

          <span className="text-lg font-bold text-foreground">
            {formatCurrency(orderTotal)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ========================================
// MAIN MY ORDERS PAGE
// ========================================

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reloadKey, setReloadKey] = useState(0);

  const [returnDialog, setReturnDialog] = useState(null);
  const [returnReasonCategory, setReturnReasonCategory] = useState("");
  const [returnReasonDetails, setReturnReasonDetails] = useState("");
  const [returnError, setReturnError] = useState("");
  const [returnNotice, setReturnNotice] = useState("");
  const [submittingReturnItemId, setSubmittingReturnItemId] = useState(null);

  const openReturnConfirmation = (order, item, productInfo) => {
    setReturnError("");
    setReturnReasonCategory("");
    setReturnReasonDetails("");

    setReturnDialog({
      stage: "confirm",
      order,
      item,
      productInfo,
    });
  };

  const closeReturnDialog = () => {
    if (submittingReturnItemId) return;

    setReturnDialog(null);
    setReturnError("");
    setReturnReasonCategory("");
    setReturnReasonDetails("");
  };

  const continueToReturnReason = () => {
    setReturnError("");

    setReturnDialog((current) =>
      current ? { ...current, stage: "reason" } : null,
    );
  };

  const submitReturnRequest = async (event) => {
    event.preventDefault();

    if (!returnDialog) return;

    if (!returnReasonCategory) {
      setReturnError("Please select a return reason.");
      return;
    }

    const cleanDetails = returnReasonDetails.trim();

    if (cleanDetails.length < 15) {
      setReturnError(
        "Please provide at least 15 characters explaining your reason.",
      );
      return;
    }

    if (cleanDetails.length > 1000) {
      setReturnError("Your explanation cannot exceed 1000 characters.");
      return;
    }

    const { order, item } = returnDialog;
    const itemId = String(item?._id || "");

    if (!itemId) {
      setReturnError(
        "This product cannot be identified. Please contact support.",
      );
      return;
    }

    setSubmittingReturnItemId(itemId);
    setReturnError("");

    try {
      const response = await fetch(RETURN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          productItemId: itemId,
          reasonCategory: returnReasonCategory,
          reasonDetails: cleanDetails,
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to submit your return request.",
        );
      }

      // Update only the matching order with the server's updated version.
      const submittedItem = data.order?.products?.find(
        (product) => String(product._id) === itemId,
      );

      setOrders((previousOrders) =>
        previousOrders.map((existingOrder) => {
          if (String(existingOrder._id) !== String(order._id)) {
            return existingOrder;
          }

          return {
            ...existingOrder,
            products: existingOrder.products.map((product) => {
              if (String(product._id) !== itemId) {
                return product;
              }

              return {
                ...product,
                returnRequest: submittedItem?.returnRequest || {
                  ...product.returnRequest,
                  status: "requested",
                  reasonCategory: returnReasonCategory,
                  reasonDetails: cleanDetails,
                  requestedAt: new Date().toISOString(),
                },
              };
            }),
          };
        }),
      );

      setReturnNotice(
        data.message || "Your return request has been submitted.",
      );

      setReturnDialog(null);
      setReturnReasonCategory("");
      setReturnReasonDetails("");
      setReturnError("");
    } catch (error) {
      setReturnError(
        error.message || "Something went wrong while submitting your return.",
      );
    } finally {
      setSubmittingReturnItemId(null);
    }
  };

  // ======================================
  // FETCH CUSTOMER ORDERS
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      setProductDetails({});

      try {
        const response = await fetch(ORDERS_API, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error("Invalid server response.");
        }

        if (response.status === 401) {
          throw new Error("Please sign in to view your orders.");
        }

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message === "internal server error"
              ? "A server error occurred while fetching your orders."
              : data?.message || "Unable to fetch your orders.",
          );
        }

        if (!Array.isArray(data.orders)) {
          throw new Error("Invalid order data received.");
        }

        setOrders(data.orders);
      } catch (err) {
        if (err.name === "AbortError") return;

        setOrders([]);

        setError(err.message || "Something went wrong while fetching orders.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, [reloadKey]);

  // ======================================
  // FETCH UNIQUE PRODUCTS
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    const productIds = [
      ...new Set(
        orders
          .flatMap((order) =>
            Array.isArray(order.products)
              ? order.products.map((item) => String(item.productId || ""))
              : [],
          )
          .filter(Boolean),
      ),
    ];

    if (!productIds.length) {
      setProductDetails({});
      return;
    }

    // Set loading state for all unique products.
    setProductDetails(
      Object.fromEntries(
        productIds.map((id) => [id, { loading: true, product: null }]),
      ),
    );

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

        if (!response.ok) {
          throw new Error("Product request failed.");
        }

        const data = await response.json();

        if (!data?.success) {
          throw new Error(data?.message || "Unable to fetch product.");
        }

        let product = data.products;

        // The API returns either one product or an array
        // when the requested product is not found.

        if (Array.isArray(product)) {
          product =
            product.find((item) => String(item._id) === productId) || null;
        }

        return {
          productId,
          product:
            product && typeof product === "object" && !Array.isArray(product)
              ? product
              : null,
        };
      } catch (err) {
        if (err.name === "AbortError") {
          return {
            productId,
            product: null,
          };
        }

        // Individual product failures should not
        // prevent the remaining orders from rendering.

        return {
          productId,
          product: null,
        };
      }
    }

    async function fetchAllProducts() {
      const results = await Promise.all(productIds.map(fetchProduct));

      if (controller.signal.aborted) return;

      setProductDetails(
        Object.fromEntries(
          results.map((result) => [
            result.productId,
            {
              loading: false,
              product: result.product,
            },
          ]),
        ),
      );
    }

    fetchAllProducts();

    return () => controller.abort();
  }, [orders]);

  // ======================================
  // SEARCH & STATUS FILTERS
  // ======================================

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;

        return dateB - dateA;
      })
      .filter((order) => {
        const matchesStatus =
          activeFilter === "all" ||
          getOrderDisplayStatus(order)?.toLowerCase() === activeFilter;

        const productSearchData = (order.products || [])
          .map((item) => {
            const product = productDetails[String(item.productId)]?.product;

            const info = getProductInfo(product, item.variantId);

            return [
              info?.name,
              info?.collection,
              info?.variantName,
              item.productId,
              item.variantId,
              item.size,
              item.quantity,
              item.price,
            ].join(" ");
          })
          .join(" ");

        const searchableContent = [
          order._id,
          order.status,
          getPaymentLabel(order.paymentMethod),
          order.paymentMethod,
          productSearchData,
        ]
          .join(" ")
          .toLowerCase();

        return matchesStatus && (!query || searchableContent.includes(query));
      });
  }, [orders, activeFilter, searchQuery, productDetails]);

  // ======================================
  // FILTER COUNTS
  // ======================================

  const filterCounts = useMemo(() => {
    const counts = {
      all: orders.length,
    };

    statusFilters.forEach(({ value }) => {
      if (value !== "all") {
        counts[value] = orders.filter(
          (order) => getOrderDisplayStatus(order)?.toLowerCase() === value,
        ).length;
      }
    });

    return counts;
  }, [orders]);

  // ======================================
  // HANDLERS
  // ======================================

  const clearFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
  };

  const retryFetching = () => {
    setReloadKey((previous) => previous + 1);
  };

  // ======================================
  // RENDER
  // ======================================

  return (
    <section className="min-w-0 w-full">
      {/* PAGE HEADER */}
      <div className="mb-7 border-b border-element-border pb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Your RIVIX Account
            </p>

            <h1 className="font-heading text-4xl leading-none tracking-wide text-foreground sm:text-5xl">
              MY ORDERS
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-muted">
              All your purchases, in one place. Keep track of your order history
              and delivery status.
            </p>
          </div>

          {/* RETURN SUCCESS MESSAGE */}
          {returnNotice && (
            <div className="mb-5 flex items-center justify-between gap-3 border border-status-success/20 bg-status-success/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-status-success">
                <CheckCircle2 size={17} />
                <span>{returnNotice}</span>
              </div>

              <button
                type="button"
                onClick={() => setReturnNotice("")}
                aria-label="Dismiss success message"
                className="text-status-success hover:opacity-70"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* RETURN DIALOG */}
          {returnDialog && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
              role="presentation"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="return-dialog-title"
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-element-border bg-background shadow-2xl"
              >
                {/* DIALOG HEADER */}
                <div className="flex items-start justify-between gap-4 border-b border-element-border px-5 py-5 sm:px-6">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      RIVIX CUSTOMER SUPPORT
                    </p>

                    <h2
                      id="return-dialog-title"
                      className="text-xl font-bold tracking-wide text-foreground"
                    >
                      {returnDialog.stage === "confirm"
                        ? "RETURN THIS ITEM?"
                        : "RETURN REASON"}
                    </h2>

                    <p className="mt-1 text-xs text-foreground-muted">
                      Step {returnDialog.stage === "confirm" ? "1" : "2"} of 2
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeReturnDialog}
                    disabled={Boolean(submittingReturnItemId)}
                    aria-label="Close return dialog"
                    className="text-foreground-muted transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* SELECTED PRODUCT SUMMARY */}
                <div className="border-b border-element-border px-5 py-5 sm:px-6">
                  <div className="flex gap-4">
                    <ProductImage
                      src={returnDialog.productInfo?.image}
                      alt={returnDialog.productInfo?.name || "RIVIX product"}
                      isLoading={false}
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-semibold text-foreground">
                        {returnDialog.productInfo?.name ||
                          "Product information unavailable"}
                      </h3>

                      {returnDialog.productInfo?.variantName && (
                        <p className="mt-1 text-xs text-foreground-muted">
                          {returnDialog.productInfo.variantName}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-foreground-muted">
                        Size: {returnDialog.item.size}
                      </p>

                      <p className="mt-1 text-xs text-foreground-muted">
                        Quantity: {returnDialog.item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {formatCurrency(
                          Number(returnDialog.item.price || 0) *
                            Number(returnDialog.item.quantity || 0),
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-element-border pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                        Order ID
                      </p>
                      <p className="mt-1 text-xs font-semibold text-foreground">
                        #{getOrderId(returnDialog.order)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                        Order Date
                      </p>
                      <p className="mt-1 text-xs font-semibold text-foreground">
                        {formatDate(returnDialog.order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* STEP 1: CONFIRM RETURN */}
                {returnDialog.stage === "confirm" && (
                  <div className="px-5 py-5 sm:px-6">
                    <p className="text-sm leading-relaxed text-foreground-muted">
                      Are you sure you want to initiate a return for this item?
                      Only this product will be submitted for return. Other
                      products from the same order will remain unaffected.
                    </p>

                    <div className="mt-4 border border-accent/20 bg-accent/5 px-4 py-3">
                      <p className="text-xs leading-relaxed text-foreground">
                        You will be asked to select a return reason and provide
                        an explanation in the next step. Your request will then
                        be sent for review.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={closeReturnDialog}
                        className="border border-element-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-background-soft"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={continueToReturnReason}
                        className="bg-background-inverse px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-inverse transition-colors hover:opacity-80"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: REASON AND FINAL CONFIRMATION */}
                {returnDialog.stage === "reason" && (
                  <form
                    onSubmit={submitReturnRequest}
                    className="px-5 py-5 sm:px-6"
                  >
                    <p className="mb-5 text-sm leading-relaxed text-foreground-muted">
                      Select the reason that best describes why you are
                      returning this product. Provide accurate details to help
                      us review your request.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="returnReasonCategory"
                          className="mb-2 block text-xs font-semibold text-foreground"
                        >
                          Reason for return{" "}
                          <span className="text-status-danger">*</span>
                        </label>

                        <select
                          id="returnReasonCategory"
                          required
                          value={returnReasonCategory}
                          onChange={(event) =>
                            setReturnReasonCategory(event.target.value)
                          }
                          className="h-12 w-full border border-element-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent"
                        >
                          <option value="" disabled>
                            Select a reason
                          </option>

                          {returnReasonOptions.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="returnReasonDetails"
                          className="mb-2 block text-xs font-semibold text-foreground"
                        >
                          Explain your reason{" "}
                          <span className="text-status-danger">*</span>
                        </label>

                        <textarea
                          id="returnReasonDetails"
                          required
                          minLength={15}
                          maxLength={1000}
                          rows={5}
                          value={returnReasonDetails}
                          onChange={(event) =>
                            setReturnReasonDetails(event.target.value)
                          }
                          placeholder="Please explain the issue with this product..."
                          className="w-full resize-y border border-element-border bg-background p-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-foreground-muted focus:border-accent"
                        />

                        <div className="mt-1 flex justify-between gap-3 text-[10px] text-foreground-muted">
                          <span>Minimum 15 characters required.</span>
                          <span>{returnReasonDetails.length}/1000</span>
                        </div>
                      </div>
                    </div>

                    {returnError && (
                      <p
                        role="alert"
                        className="mt-4 border border-status-danger/20 bg-status-danger/10 px-3 py-2 text-xs leading-relaxed text-status-danger"
                      >
                        {returnError}
                      </p>
                    )}

                    <div className="mt-5 border border-accent/20 bg-accent/5 px-4 py-3">
                      <p className="text-xs leading-relaxed text-foreground">
                        By submitting, you confirm that the information provided
                        is accurate and that you want to request a return for
                        this specific item.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        disabled={Boolean(submittingReturnItemId)}
                        onClick={() => {
                          setReturnError("");
                          setReturnDialog((current) =>
                            current ? { ...current, stage: "confirm" } : null,
                          );
                        }}
                        className="border border-element-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-background-soft disabled:opacity-50"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={Boolean(submittingReturnItemId)}
                        className="inline-flex items-center justify-center gap-2 bg-background-inverse px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-inverse transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingReturnItemId ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <RotateCcw size={14} />
                            Confirm Return Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <ShoppingBag size={15} />

              <span>
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <OrdersSkeleton />
      ) : error ? (
        /* ERROR */
        <OrdersError message={error} onRetry={retryFetching} />
      ) : orders.length === 0 ? (
        /* EMPTY ORDERS */
        <EmptyOrders />
      ) : (
        <>
          {/* SEARCH */}
          <div className="relative mb-5">
            <Search
              size={17}
              strokeWidth={1.7}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your orders..."
              aria-label="Search your orders"
              className="h-12 w-full border border-element-border bg-background pl-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-accent"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* STATUS FILTERS */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                Filter by status
              </p>

              {(activeFilter !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-foreground-muted underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {statusFilters.map((filter) => {
                const active = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={active}
                    className={`
                      inline-flex shrink-0 items-center gap-2 border px-3 py-2
                      text-xs font-medium transition-colors
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-accent focus-visible:ring-offset-2
                      ${
                        active
                          ? "border-background-inverse bg-background-inverse text-foreground-inverse"
                          : "border-element-border bg-background text-foreground-muted hover:border-background-inverse hover:text-foreground"
                      }
                    `}
                  >
                    {filter.label}

                    <span
                      className={
                        active
                          ? "text-foreground-subtle"
                          : "text-foreground-muted"
                      }
                    >
                      {filterCounts[filter.value] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RESULTS COUNT */}
          <div className="mb-4 flex items-center justify-between border-b border-element-border pb-3">
            <p className="text-xs text-foreground-muted">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {orders.length}
              </span>{" "}
              orders
            </p>
          </div>

          {/* ORDER LIST */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  productDetails={productDetails}
                  onRequestReturn={openReturnConfirmation}
                  submittingReturnItemId={submittingReturnItemId}
                />
              ))}
            </div>
          ) : (
            <EmptyOrders filtered onClear={clearFilters} />
          )}
        </>
      )}
    </section>
  );
}
