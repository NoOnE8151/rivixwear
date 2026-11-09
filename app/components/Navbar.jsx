"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence } from "motion/react";

import SearchInput from "./utils/SearchInput";
import Cart from "./shop/Cart";
import LoginRequired from "./utils/LoginRequired";
import ActiveOrders from "./utils/ActiveOrders";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(
    pathname !== "/" && pathname !== "/profile",
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);

  const [orders, setOrders] = useState([]);

  // Update search state when navigating between routes
  useEffect(() => {
    setIsSearchActive(pathname !== "/" && pathname !== "/profile");
  }, [pathname]);

  // Handle navbar scroll shadow
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch user orders
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/protected/orders/get");

        if (!res.ok) {
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data.orders ?? []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [isLoaded, isSignedIn]);

  return (
    <>
      <nav
        className={`
        sticky top-0 z-100
        flex items-center
        w-full md:h-20 h-14
        md:px-10 px-4 lg:px-12 gap-3
        bg-[rgba(250,250,250,0.92)]
        border-b border-black/6
        transition-shadow duration-300
        ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : ""}
        `}
      >
        {/* Mobile Navbar */}
        <AnimatePresence mode="wait">
          {isMobileNavbarOpen && (
            <MobileNavbar setIsMobileNavbarOpen={setIsMobileNavbarOpen} />
          )}
        </AnimatePresence>

        {/* LEFT: Logo */}
        <div className="flex items-center justify-start md:w-1/4 h-full shrink-0">
          <Link href="/" className="flex items-center">
            {" "}
            {/*logo for desktop*/}
            <img
              src="/assets/logo/rivix-wordmark-black.png"
              alt="RIVIX"
              width={100}
              className="w-20 md:w-25 h-auto"
            />
          </Link>
        </div>

        {/* CENTER: Navigation Links / Search */}
        <div className="flex flex-1 items-center justify-center min-w-0 h-full gap">
          {pathname === "/" && !isSearchActive && (
            <ul className="hidden md:flex items-center justify-center gap-9 list-none whitespace-nowrap">
              {[
                { label: "Essentials", id: "essentials" },
                { label: "Motion", id: "motion" },
                { label: "About", id: "about" },
              ].map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center justify-end gap-5 md:w-1/3 h-full shrink-0">
          {/* Search for desktop */}
          <div className="w-full max-w-[320px] hidden md:block">
            <SearchInput />
          </div>

          {/* Profile */}
          <Link
            href={isSignedIn ? "/profile" : "/sign-up"}
            className="nav-link hidden md:inline-flex items-center justify-center"
            aria-label="Profile"
          >
            <User size={20} />
          </Link>

          {/* Shopping Cart */}
          <button
            onClick={() => {
              isSignedIn ? setIsCartOpen(true) : setShowLoginRequired(true);
            }}
            className="hidden md:inline-flex items-center justify-center cart-btn cursor-pointer"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} />
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileNavbarOpen(true)}
            className="md:hidden inline-flex items-center justify-center cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Cart */}
        {isCartOpen && <Cart setIsCartOpen={setIsCartOpen} />}

        {/* Login Required */}
        {showLoginRequired && (
          <LoginRequired setShowLoginRequired={setShowLoginRequired} />
        )}

        {/* Active Orders */}
        <ActiveOrders orders={orders} />
      </nav>
       <div className="w-full px-2 block md:hidden">
            <SearchInput />
          </div>
    </>
  );
}
