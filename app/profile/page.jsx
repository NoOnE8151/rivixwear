"use client";

import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Navbar from "../components/Navbar";

const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "border-accent/30 bg-accent/10 text-accent",
  },

  accepted: {
    label: "Accepted",
    className:
      "border-foreground-subtle/40 bg-foreground-subtle/10 text-foreground-dim",
  },

  active: {
    label: "Processing",
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

function getItemCount(products = []) {
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
  }).format(new Date(date));
}

function formatMemberSince(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function StatusBadge({ status }) {
  const config = statusConfig[status];

  if (!config) return null;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
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

function PackageIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function LogoutIcon() {
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
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
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

function LoadingOrders() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-xl border border-element-border bg-background-soft p-5"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-background-muted" />
              <div className="h-3 w-24 rounded bg-background-muted" />
            </div>

            <div className="h-8 w-20 rounded bg-background-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoutModal({
  onCancel,
  onConfirm,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-element-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              Account
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Log out of your account?
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

        <p className="mt-4 text-sm leading-6 text-foreground-muted">
          You will need to sign in again to access your
          account and order history.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-element-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-background-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stay Logged In
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-status-danger px-4 py-2.5 text-sm font-medium text-foreground-inverse transition-colors hover:bg-status-danger-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(true);
  const [ordersError, setOrdersError] =
    useState(null);

  const [expandedOrder, setExpandedOrder] =
    useState(null);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);

        const res = await fetch(
          "/api/protected/orders/get"
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch orders (${res.status})`
          );
        }

        const data = await res.json();

        if (!Array.isArray(data.orders)) {
          throw new Error(
            "Invalid orders response"
          );
        }

        setOrders(data.orders);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );

        setOrdersError(
          "Unable to load your orders."
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isLoaded, user]);

  async function handleLogout() {
    try {
      setLogoutLoading(true);

      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-element-border border-t-element" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "fulfilled"
  ).length;

  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (total, order) =>
        total + getOrderTotal(order.products),
      0
    );

  const profileName =
    user.fullName ||
    user.firstName ||
    user.username ||
    "RIVIX Member";

  const username =
    user.username || user.firstName || "member";

  return (
    <div>
      {/* ==================== STATS ==================== */}

      <section className="grid grid-cols-3 overflow-hidden rounded-xl border border-element-border bg-background-soft">
        {/* Orders */}
        <div className="border-r border-element-border px-4 py-5 sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-foreground-muted">
            Orders
          </p>

          <p className="mt-2 text-xl font-semibold sm:text-2xl">
            {totalOrders}
          </p>
        </div>

        {/* Completed */}
        <div className="border-r border-element-border px-4 py-5 sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-foreground-muted">
            Completed
          </p>

          <p className="mt-2 text-xl font-semibold sm:text-2xl">
            {completedOrders}
          </p>
        </div>

        {/* Spent */}
        <div className="px-4 py-5 sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-foreground-muted">
            Spent
          </p>

          <p className="mt-2 text-xl font-semibold sm:text-2xl">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </section>

      {/* ==================== ORDERS ==================== */}

      <section className="mt-10">
        {/* Section Header */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              Purchase History
            </p>

            <h2 className="mt-1 font-heading text-3xl tracking-wide sm:text-4xl">
              Orders
            </h2>
          </div>

          <span className="text-xs text-foreground-muted">
            {totalOrders}{" "}
            {totalOrders === 1
              ? "order"
              : "orders"}
          </span>
        </div>

        {/* Loading */}
        {ordersLoading && <LoadingOrders />}

        {/* Error */}
        {!ordersLoading && ordersError && (
          <div className="rounded-xl border border-status-danger/20 bg-status-danger/10 p-5">
            <p className="text-sm font-medium text-status-danger">
              {ordersError}
            </p>
          </div>
        )}

        {/* Empty */}
        {!ordersLoading &&
          !ordersError &&
          orders.length === 0 && (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-element-border bg-background-soft px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-muted text-foreground-muted">
                <PackageIcon />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No orders yet
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-foreground-muted">
                Your RIVIX orders will appear here
                once you place your first order.
              </p>
            </div>
          )}

        {/* Orders */}
        {!ordersLoading &&
          !ordersError &&
          orders.length > 0 && (
            <div className="max-h-[620px] overflow-y-auto overscroll-contain pr-2">
              <div className="space-y-3">
                {orders.map((order) => {
                  const isExpanded =
                    expandedOrder === order._id;

                  return (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-xl border border-element-border bg-background-soft"
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          {/* Order ID / Status */}
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-muted text-foreground-muted">
                              <PackageIcon />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-mono text-sm font-semibold">
                                  #
                                  {String(
                                    order._id
                                  )
                                    .slice(-6)
                                    .toUpperCase()}
                                </h3>

                                <StatusBadge
                                  status={
                                    order.status
                                  }
                                />
                              </div>

                              <p className="mt-1 text-xs text-foreground-muted">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Order Stats */}
                          <div className="flex items-center justify-between gap-8 sm:justify-end">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                Items
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {getItemCount(
                                  order.products
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                Total
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {formatCurrency(
                                  getOrderTotal(
                                    order.products
                                  )
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOrder(
                              isExpanded
                                ? null
                                : order._id
                            )
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 border-t border-element-border pt-4 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
                        >
                          {isExpanded
                            ? "Hide order details"
                            : "View order details"}

                          <ChevronIcon
                            open={isExpanded}
                          />
                        </button>
                      </div>

                      {/* ==================== ORDER DETAILS ==================== */}

                      {isExpanded && (
                        <div className="border-t border-element-border bg-background px-4 py-5 sm:px-5">
                          {/* Status Progress */}
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                              Order Status
                            </p>

                            <div className="mt-5 overflow-x-auto">
                              <div className="flex min-w-[500px] items-start">
                                {[
                                  "pending",
                                  "accepted",
                                  "active",
                                  "fulfilled",
                                ].map(
                                  (
                                    status,
                                    index
                                  ) => {
                                    const statusOrder =
                                      [
                                        "pending",
                                        "accepted",
                                        "active",
                                        "fulfilled",
                                      ];

                                    const currentIndex =
                                      statusOrder.indexOf(
                                        order.status
                                      );

                                    const statusIndex =
                                      statusOrder.indexOf(
                                        status
                                      );

                                    const completed =
                                      statusIndex <=
                                        currentIndex &&
                                      order.status !==
                                        "cancelled";

                                    return (
                                      <div
                                        key={status}
                                        className="flex flex-1 items-start"
                                      >
                                        <div className="flex flex-col items-center">
                                          <div
                                            className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold ${
                                              completed
                                                ? "border-element bg-element text-foreground-inverse"
                                                : "border-element-border bg-background text-foreground-muted"
                                            }`}
                                          >
                                            {completed
                                              ? "✓"
                                              : index +
                                                1}
                                          </div>

                                          <span className="mt-2 text-[10px] uppercase tracking-wider text-foreground-muted">
                                            {
                                              statusConfig[
                                                status
                                              ].label
                                            }
                                          </span>
                                        </div>

                                        {index <
                                          3 && (
                                          <div
                                            className={`mt-3 h-px flex-1 ${
                                              statusIndex <
                                              currentIndex
                                                ? "bg-element"
                                                : "bg-element-border"
                                            }`}
                                          />
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Cancelled Status */}
                          {order.status ===
                            "cancelled" && (
                            <div className="mt-5 rounded-lg border border-status-danger/20 bg-status-danger/10 px-4 py-3">
                              <p className="text-xs font-medium text-status-danger">
                                This order was
                                cancelled.
                              </p>
                            </div>
                          )}

                          {/* Products */}
                          <div className="mt-8">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                              Products
                            </p>

                            <div className="mt-3 overflow-hidden rounded-lg border border-element-border">
                              {order.products?.map(
                                (
                                  product,
                                  index
                                ) => (
                                  <div
                                    key={`${product.variantId}-${index}`}
                                    className="flex flex-col gap-3 border-b border-element-border p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <div>
                                      <p className="text-sm font-medium">
                                        {
                                          product.productId
                                        }
                                      </p>

                                      <p className="mt-1 text-xs text-foreground-muted">
                                        Variant:{" "}
                                        {
                                          product.variantId
                                        }
                                      </p>

                                      <p className="mt-1 text-xs text-foreground-muted">
                                        Size:{" "}
                                        {
                                          product.size
                                        }{" "}
                                        · Qty:{" "}
                                        {
                                          product.quantity
                                        }
                                      </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                      <p className="text-[10px] uppercase tracking-wider text-foreground-muted">
                                        Price
                                      </p>

                                      <p className="mt-1 text-sm font-medium">
                                        {formatCurrency(
                                          product.price *
                                            product.quantity
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Order Information */}
                          <div className="mt-8">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                              Order Information
                            </p>

                            <div className="mt-3 overflow-hidden rounded-lg border border-element-border">
                              <div className="grid grid-cols-2 gap-4 border-b border-element-border p-4">
                                <span className="text-xs text-foreground-muted">
                                  Payment
                                </span>

                                <span className="text-right text-xs font-medium uppercase">
                                  {order.paymentMethod ||
                                    "—"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 p-4">
                                <span className="text-xs text-foreground-muted">
                                  Order placed
                                </span>

                                <span className="text-right text-xs">
                                  {formatDate(
                                    order.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
      </section>

      {/* ==================== ACCOUNT ==================== */}

      <section className="mt-10 border-t border-element-border pt-8">
        <div className="rounded-xl border border-element-border bg-background-soft p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Account Information */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Account
              </p>

              <h2 className="mt-1 text-sm font-semibold">
                {profileName}
              </h2>

              <p className="mt-1 text-xs text-foreground-muted">
                @{username}
              </p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() =>
                setShowLogoutModal(true)
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-status-danger/20 px-4 py-2.5 text-xs font-medium text-status-danger transition-colors hover:bg-status-danger/10 sm:w-auto"
            >
              <LogoutIcon />

              Log out
            </button>
          </div>
        </div>
      </section>

      {/* ==================== LOGOUT MODAL ==================== */}

      {showLogoutModal && (
        <LogoutModal
          onCancel={() =>
            setShowLogoutModal(false)
          }
          onConfirm={handleLogout}
          loading={logoutLoading}
        />
      )}
    </div>
  );
}