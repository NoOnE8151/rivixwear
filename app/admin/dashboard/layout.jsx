import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "⌂",
  },
  {
    name: "Orders",
    href: "/admin/dashboard/orders",
    icon: "▣",
  },
  {
    name: "Products",
    href: "/admin/dashboard/products",
    icon: "◇",
  },
  {
    name: "Customers",
    href: "/admin/dashboard/customers",
    icon: "○",
  },
];

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/admin/dashboard/settings",
    icon: "⚙",
  },
];

export default async function AdminDashboardLayout({ children }) {
  const { sessionClaims, redirectToSignIn } = await auth();

  // Authentication
  if (!sessionClaims) {
    return redirectToSignIn();
  }

  // Authorization
  const userRole = sessionClaims.metadata?.role;

  if (userRole !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-element-border bg-background-soft lg:flex lg:flex-col">
          {/* Brand */}
          <div className="flex h-20 items-center border-b border-element-border px-6">
            <div>
              <h1 className="font-heading text-3xl leading-none tracking-wide">
                RIVIX
              </h1>

              <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-foreground-muted">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              Management
            </p>

            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
                >
                  <span className="flex w-5 items-center justify-center text-base">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              System
            </p>

            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
                >
                  <span className="flex w-5 items-center justify-center text-base">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Admin */}
          <div className="border-t border-element-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-background-muted p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-element text-xs font-semibold text-foreground-inverse">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Administrator
                </p>

                <p className="text-[11px] text-foreground-muted">
                  Admin access
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}