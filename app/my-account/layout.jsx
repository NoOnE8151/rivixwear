
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ShoppingBag, MapPin } from "lucide-react";

const navigationItems = [
  {
    label: "My Orders",
    href: "/my-account/my-orders",
    icon: ShoppingBag,
  },
  {
    label: "Saved Addresses",
    href: "/my-account/saved-address",
    icon: MapPin,
  },
];

function ProfileSkeleton({ mobile = false }) {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div
        className={`shrink-0 rounded-full bg-background-muted ${
          mobile ? "h-12 w-12" : "h-16 w-16"
        }`}
      />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-32 max-w-full rounded bg-background-muted" />
        <div className="h-3 w-24 rounded bg-background-muted" />
      </div>
    </div>
  );
}

function ProfileIdentity({ user, isLoaded, mobile = false }) {
  if (!isLoaded) {
    return <ProfileSkeleton mobile={mobile} />;
  }

  const displayName =
    user?.fullName ||
    user?.username ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "RIVIX Customer";

  const email = user?.primaryEmailAddress?.emailAddress;

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "R";

  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
      }).format(user.createdAt)
    : null;

  return (
    <div
      className={`flex items-center ${
        mobile ? "gap-3" : "flex-col items-start gap-4"
      }`}
    >
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-element-border bg-background-soft ${
          mobile ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={`${displayName}'s profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-heading text-xl text-foreground">
            {initials}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
          {displayName}
        </h2>

        {email && (
          <p className="mt-1 truncate text-xs text-foreground-muted">
            {email}
          </p>
        )}

        {memberSince && (
          <p className="mt-1.5 text-[11px] text-foreground-muted">
            Member since {memberSince}
          </p>
        )}
      </div>
    </div>
  );
}

function NavigationLink({ item, active, mobile = false }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`
        flex items-center gap-3 border transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-accent focus-visible:ring-offset-2
        ${
          mobile
            ? "min-w-0 justify-center px-3 py-3 text-xs font-semibold sm:text-sm"
            : "w-full px-4 py-3 text-sm font-medium"
        }
        ${
          active
            ? "border-background-inverse bg-background-inverse text-foreground-inverse"
            : mobile
              ? "border-element-border bg-background text-foreground-muted hover:bg-background-soft"
              : "border-transparent text-foreground-muted hover:border-element-border hover:bg-background-soft hover:text-foreground"
        }
      `}
    >
      <Icon
        size={mobile ? 16 : 18}
        strokeWidth={1.8}
        className="shrink-0"
      />

      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function MyAccountLayout({ children }) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <div className="min-h-[60vh] w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 xl:gap-14">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:flex lg:min-h-[500px] lg:flex-col lg:border-r lg:border-element-border lg:pr-7">

            {/* Personal Information */}
            <div className="border-b border-element-border pb-8">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Personal Information
              </p>

              <ProfileIdentity
                user={user}
                isLoaded={isLoaded}
              />
            </div>

            {/* Navigation */}
            <nav
              aria-label="Account navigation"
              className="mt-8 flex flex-col gap-2"
            >
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Account
              </p>

              {navigationItems.map((item) => (
                <NavigationLink
                  key={item.href}
                  item={item}
                  active={pathname === item.href}
                />
              ))}
            </nav>

            {/* Logout will be added in Step 5 */}

          </aside>

          {/* MOBILE & TABLET NAVIGATION */}
          <section className="flex flex-col gap-5 lg:hidden">

            {/* Profile Information */}
            <div className="border-b border-element-border pb-5">
              <ProfileIdentity
                user={user}
                isLoaded={isLoaded}
                mobile
              />
            </div>

            {/* Navigation */}
            <nav
              aria-label="Account navigation"
              className="grid grid-cols-2 gap-2"
            >
              {navigationItems.map((item) => (
                <NavigationLink
                  key={item.href}
                  item={item}
                  active={pathname === item.href}
                  mobile
                />
              ))}
            </nav>

          </section>

          {/* ACCOUNT CONTENT */}
          <main className="min-w-0 w-full">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
