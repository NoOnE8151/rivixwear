const stats = [
  {
    label: "Total Earnings",
    value: "₹0",
    description: "All time",
  },
  {
    label: "This Month",
    value: "₹0",
    description: "Current month",
  },
  {
    label: "Pending Orders",
    value: "0",
    description: "Requires your attention",
  },
  {
    label: "Active Orders",
    value: "0",
    description: "Currently processing",
  },
];

const recentOrders = [
  // Replace this with database data later
  // {
  //   id: "RVX-1024",
  //   customer: "Rahul Sharma",
  //   items: 2,
  //   amount: "₹1,598",
  //   status: "Pending",
  // },
];

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function TrendIcon() {
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
      <path d="M3 17 9 11l4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

function OrderIcon() {
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
      <path d="M6 2h12l3 5v15H3V7l3-5Z" />
      <path d="M3 7h18" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ActivityIcon() {
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
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

function StatIcon({ index }) {
  const icons = [TrendIcon, TrendIcon, ClockIcon, ActivityIcon];
  const Icon = icons[index];

  return <Icon />;
}

function StatusBadge({ status }) {
  const statusStyles = {
    Pending:
      "bg-accent/10 text-accent border-accent/20",
    Processing:
      "bg-foreground-dim/10 text-foreground-dim border-foreground-dim/20",
    Shipped:
      "bg-foreground-subtle/20 text-foreground-dim border-foreground-subtle/30",
    Delivered:
      "bg-status-success/10 text-status-success border-status-success/20",
    Cancelled:
      "bg-status-danger/10 text-status-danger border-status-danger/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        statusStyles[status] ||
        "border-element-border bg-background-muted text-foreground-muted"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-element-border bg-background">
        <div className="flex h-20 items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-foreground-muted">
              Overview
            </p>

            <h1 className="mt-1 font-heading text-3xl tracking-wide">
              Dashboard
            </h1>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">RIVIX Store</p>

            <p className="mt-0.5 text-xs text-foreground-muted">
              Admin Dashboard
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1500px]">
          {/* Welcome */}
          <div className="mb-7">
            <h2 className="text-lg font-medium">
              Store overview
            </h2>

            <p className="mt-1 text-sm text-foreground-muted">
              Monitor your store and manage incoming orders.
            </p>
          </div>

          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-xl border border-element-border bg-background-soft p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground-muted">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-muted text-foreground-dim">
                    <StatIcon index={index} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-foreground-muted">
                  {stat.description}
                </p>
              </div>
            ))}
          </section>

          {/* Main dashboard */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* Revenue */}
            <div className="rounded-xl border border-element-border bg-background-soft">
              <div className="flex items-center justify-between border-b border-element-border px-5 py-5">
                <div>
                  <h2 className="text-sm font-semibold">
                    Revenue Overview
                  </h2>

                  <p className="mt-1 text-xs text-foreground-muted">
                    Earnings over the last 7 days
                  </p>
                </div>

                <span className="rounded-lg border border-element-border bg-background px-3 py-1.5 text-xs text-foreground-muted">
                  Last 7 days
                </span>
              </div>

              {/* Chart placeholder */}
              <div className="px-5 py-6">
                <div className="flex h-56 items-end gap-2 sm:gap-4">
                  {[20, 35, 25, 48, 40, 60, 52].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="group flex h-full flex-1 flex-col justify-end"
                      >
                        <div
                          className="w-full rounded-t-md bg-accent/25 transition-colors group-hover:bg-accent/40"
                          style={{ height: `${height}%` }}
                        />

                        <span className="mt-3 text-center text-[10px] text-foreground-muted">
                          {
                            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                              index
                            ]
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Orders requiring attention */}
            <div className="rounded-xl border border-element-border bg-background-soft">
              <div className="flex items-center justify-between border-b border-element-border px-5 py-5">
                <div>
                  <h2 className="text-sm font-semibold">
                    Orders
                  </h2>

                  <p className="mt-1 text-xs text-foreground-muted">
                    Current order activity
                  </p>
                </div>

                <a
                  href="/admin/dashboard/orders"
                  className="text-xs font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  Manage
                </a>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-element-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <ClockIcon />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Pending
                        </p>

                        <p className="mt-0.5 text-xs text-foreground-muted">
                          Waiting for approval
                        </p>
                      </div>
                    </div>

                    <span className="text-lg font-semibold">
                      0
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-element-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-muted text-foreground-dim">
                        <OrderIcon />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Processing
                        </p>

                        <p className="mt-0.5 text-xs text-foreground-muted">
                          Currently being prepared
                        </p>
                      </div>
                    </div>

                    <span className="text-lg font-semibold">
                      0
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-element-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-success/10 text-status-success">
                        <ActivityIcon />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Completed
                        </p>

                        <p className="mt-0.5 text-xs text-foreground-muted">
                          Successfully delivered
                        </p>
                      </div>
                    </div>

                    <span className="text-lg font-semibold">
                      0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Orders */}
          <section className="mt-6 overflow-hidden rounded-xl border border-element-border bg-background-soft">
            <div className="flex items-center justify-between border-b border-element-border px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold">
                  Recent Orders
                </h2>

                <p className="mt-1 text-xs text-foreground-muted">
                  Latest orders placed by customers
                </p>
              </div>

              <a
                href="/admin/dashboard/orders"
                className="flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
              >
                View all
                <ArrowIcon />
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-muted text-foreground-muted">
                  <OrderIcon />
                </div>

                <h3 className="mt-4 text-sm font-medium">
                  No orders yet
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-foreground-muted">
                  Customer orders will appear here once your store
                  starts receiving them.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-element-border text-[10px] uppercase tracking-[0.15em] text-foreground-muted">
                        <th className="px-6 py-4 font-medium">
                          Order
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Customer
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Items
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Amount
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Status
                        </th>

                        <th className="px-6 py-4" />
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-element-border">
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="text-sm transition-colors hover:bg-background-muted/50"
                        >
                          <td className="px-6 py-4 font-medium">
                            {order.id}
                          </td>

                          <td className="px-6 py-4 text-foreground-muted">
                            {order.customer}
                          </td>

                          <td className="px-6 py-4 text-foreground-muted">
                            {order.items}
                          </td>

                          <td className="px-6 py-4">
                            {order.amount}
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge status={order.status} />
                          </td>

                          <td className="px-6 py-4 text-right">
                            <a
                              href={`/admin/dashboard/orders/${order.id}`}
                              className="text-xs text-foreground-muted transition-colors hover:text-foreground"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}