"use client";
import { useEffect, useState } from "react";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchInput from "./utils/SearchInput";
import Cart from "./shop/Cart";
import { useAuth } from "@clerk/nextjs";
import LoginRequired from "./utils/LoginRequired";
import ActiveOrders from "./utils/ActiveOrders";
import MobileNavbar from "./MobileNavbar";
import { AnimatePresence } from "motion/react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(
    pathname === "/" || "/profile" ? false : true,
  );
  const { isLoaded, isSignedIn } = useAuth();
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // handling shopping cart toggle
  const [isCartOpen, setIsCartOpen] = useState(false);

  //fetching orders to show if user has an order
  const [orders, setOrders] = useState([]);

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

  //handling mobile navbar
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);

  return (
    <nav
      className={`
        sticky top-0 z-100
        flex items-center justify-between
        px-6 md:px-22 h-16
        bg-[rgba(250,250,250,0.92)]
        border-b border-black/6
        transition-shadow duration-300
        ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : ""}
      `}
    >
<AnimatePresence mode="wait">
  {isMobileNavbarOpen && (
    <MobileNavbar
      setIsMobileNavbarOpen={setIsMobileNavbarOpen}
    />
  )}
</AnimatePresence>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline w-[25%]">
        <img src="/assets/logo/rivix-symbol-black.png" alt="logo" width={40} />
        <img
          src="/assets/logo/rivix-wordmark-black.png"
          alt="logo"
          width={80}
          className="pt-1 md:block hidden"
        />
      </Link>

      {/* Links — hidden on mobile */}
      {pathname === "/" && !isSearchActive && (
        <ul className="hidden md:flex gap-9 list-none w-[50%] justify-center">
          {[
            { label: "Rivix Essentials", id: "essentials" },
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

      {isSearchActive && (
        <div className="w-[50%]">
          <SearchInput></SearchInput>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-5 w-[25%]">
        <button
          onClick={() => setIsSearchActive((prev) => !prev)}
          className=" hidden md:inline text-[11px] cursor-pointer"
        >
          {pathname === "/" && <Search />}
        </button>
        <Link
          href={isSignedIn ? "/profile" : "/sign-up"}
          className="nav-link hidden md:inline text-[11px]"
        >
          <User />
        </Link>
        <button
          onClick={() => {
            isSignedIn ? setIsCartOpen(true) : setShowLoginRequired(true);
          }}
          className="hidden md:inline cart-btn cursor-pointer"
        >
          <ShoppingBag />
        </button>
        <button onClick={() => setIsMobileNavbarOpen(true)}
          className="md:hidden">
          <Menu />
        </button>
      </div>
      {isCartOpen && <Cart setIsCartOpen={setIsCartOpen} />}

      {showLoginRequired && (
        <LoginRequired setShowLoginRequired={setShowLoginRequired} />
      )}
      <ActiveOrders orders={orders} />
    </nav>
  );
}
