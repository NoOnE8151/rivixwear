
"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Minus, Plus, ShoppingBag } from "lucide-react";

const getItemKey = (item) =>
  `${item.id}-${item.variantId}-${item.size}`;

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const debounceTimers = useRef({});

  // Fetch cart
  const fetchCart = useCallback(async (signal) => {
    setIsLoading(true);
    setLoadError("");

    try {
      const res = await fetch("/api/protected/user/cart/get", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal,
      });

      const contentType = res.headers.get("content-type") || "";
      const rawResponse = await res.text();

      if (!contentType.includes("application/json")) {
        throw new Error("Unable to load your cart. Please try again.");
      }

      const data = JSON.parse(rawResponse);

      if (!res.ok) {
        throw new Error(data.message || "Failed to load your cart.");
      }

      const fetchedItems = Array.isArray(data.cart) ? data.cart : [];

      setItems(fetchedItems);
      setSelected(
        new Set(fetchedItems.map((item) => getItemKey(item)))
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Cart fetch failed:", error);
        setLoadError(error.message || "Something went wrong.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchCart(controller.signal);

    return () => {
      controller.abort();

      Object.values(debounceTimers.current).forEach(clearTimeout);
      debounceTimers.current = {};
    };
  }, [fetchCart]);

  // Selection
  const toggleSelect = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);

      next.has(key) ? next.delete(key) : next.add(key);

      return next;
    });
  };

  const allSelected =
    items.length > 0 &&
    items.every((item) => selected.has(getItemKey(item)));

  const toggleSelectAll = () => {
    setSelected(
      allSelected
        ? new Set()
        : new Set(items.map((item) => getItemKey(item)))
    );
  };

  // Quantity update
  const updateQty = (item, delta) => {
    const key = getItemKey(item);

    const updatedItem = {
      ...item,
      qty: Math.max(1, item.qty + delta),
    };

    setItems((prev) =>
      prev.map((currentItem) =>
        getItemKey(currentItem) === key
          ? updatedItem
          : currentItem
      )
    );

    clearTimeout(debounceTimers.current[key]);

    debounceTimers.current[key] = setTimeout(async () => {
      try {
        const res = await fetch(
          "/api/protected/user/cart/updateQuantity",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: updatedItem.id,
              variantId: updatedItem.variantId,
              size: updatedItem.size,
              quantity: updatedItem.qty,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Failed to update quantity"
          );
        }
      } catch (error) {
        console.error("Cart quantity sync failed:", error);
      } finally {
        delete debounceTimers.current[key];
      }
    }, 500);
  };

  // Remove item
  const removeItem = async (item) => {
    const key = getItemKey(item);

    try {
      clearTimeout(debounceTimers.current[key]);
      delete debounceTimers.current[key];

      const res = await fetch("/api/protected/user/cart/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.id,
          variantId: item.variantId,
          size: item.size,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.deleted) {
        throw new Error(
          data.message || "Failed to remove product."
        );
      }

      setItems((prev) =>
        prev.filter(
          (prevItem) => getItemKey(prevItem) !== key
        )
      );

      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });

    } catch (error) {
      console.error("Cart deletion failed:", error);
    }
  };

  // Calculations
  const selectedItems = useMemo(
    () =>
      items.filter((item) =>
        selected.has(getItemKey(item))
      ),
    [items, selected]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ),
    [selectedItems]
  );

  // Checkout
  const handleCheckout = () => {
    const checkoutItems = selectedItems.map((item) => ({
      productId: item.id,
      variantId: item.variantId,
      size: item.size,
      quantity: item.qty,
    }));

    const params = new URLSearchParams({
      items: JSON.stringify(checkoutItems),
    });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <main
      aria-busy={isLoading}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-5 py-4 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <Link
          href="/"
          className="font-heading text-2xl font-semibold tracking-widest"
        >
          RIVIX
        </Link>
      </header>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-2xl px-5 pb-10 pt-8">

        {/* Page Heading */}
        <div className="mb-7">
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#b8965a]">
            Your selection
          </p>

          <div className="flex items-end justify-between">
            <h1 className="font-heading text-3xl font-semibold tracking-wide">
              Shopping Bag
            </h1>

            {!isLoading && !loadError && (
              <span className="pb-1 text-xs text-foreground/45">
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex gap-4 border-b border-foreground/10 py-5"
              >
                <div className="h-32 w-24 shrink-0 rounded-sm bg-foreground/[0.07]" />

                <div className="flex-1 space-y-4 pt-2">
                  <div className="h-4 w-3/4 bg-foreground/[0.08]" />
                  <div className="h-3 w-1/2 bg-foreground/[0.06]" />
                  <div className="mt-8 h-7 w-20 bg-foreground/[0.08]" />
                </div>
              </div>
            ))}
          </div>

        ) : loadError ? (
          /* Error */
          <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <p className="font-heading text-xl">
              Couldn't load your cart
            </p>

            <p className="mt-2 max-w-xs text-sm text-foreground/50">
              {loadError}
            </p>

            <button
              onClick={() => fetchCart()}
              className="mt-6 bg-background-inverse px-8 py-3 text-xs uppercase tracking-widest text-foreground-inverse"
            >
              Try Again
            </button>
          </div>

        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <ShoppingBag
              size={38}
              strokeWidth={1}
              className="mb-6 text-foreground/30"
            />

            <h2 className="font-heading text-2xl">
              Your bag is empty
            </h2>

            <p className="mt-2 text-sm text-foreground/50">
              Add something you love.
            </p>

            <Link
              href="/shop"
              className="mt-8 bg-background-inverse px-9 py-4 text-xs uppercase tracking-widest text-foreground-inverse transition-opacity hover:opacity-80"
            >
              Explore Collection
            </Link>
          </div>

        ) : (
          <>
            {/* Selection Controls */}
            <div className="mb-2 flex items-center justify-between border-b border-foreground/10 pb-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2.5 text-xs uppercase tracking-widest text-foreground/60"
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-[3px] border"
                  style={{
                    borderColor: allSelected ? "#b8965a" : "rgba(0,0,0,0.25)",
                    background: allSelected ? "#b8965a" : "transparent",
                  }}
                >
                  {allSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#f5f0e8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                {allSelected ? "Deselect all" : "Select all"}
              </button>

              <span className="text-[10px] uppercase tracking-widest text-foreground/40">
                {selectedItems.length} selected
              </span>
            </div>

            {/* Cart Items */}
            <div>
              {items.map((item) => {
                const key = getItemKey(item);
                const isSelected = selected.has(key);

                return (
                  <article
                    key={key}
                    className="flex gap-3 border-b border-foreground/10 py-5"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(key)}
                      aria-label={`Select ${item.name}`}
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center"
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-[3px] border"
                        style={{
                          borderColor: isSelected
                            ? "#b8965a"
                            : "rgba(0,0,0,0.25)",
                          background: isSelected
                            ? "#b8965a"
                            : "transparent",
                        }}
                      >
                        {isSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="#f5f0e8"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </button>

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[130px] w-[100px] shrink-0 rounded-sm object-cover"
                      style={{
                        opacity: isSelected ? 1 : 0.4,
                        transition: "opacity 0.2s ease",
                      }}
                    />

                    {/* Details */}
                    <div
                      className="flex min-w-0 flex-1 flex-col"
                      style={{
                        opacity: isSelected ? 1 : 0.4,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-heading line-clamp-2 text-base leading-snug">
                          {item.name}
                        </h2>

                        <button
                          onClick={() => removeItem(item)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 p-1 text-foreground/35"
                        >
                          <X size={17} />
                        </button>
                      </div>

                      <p className="mt-2 text-[10px] uppercase tracking-wider text-foreground/50">
                        {item.variant} · Size {item.size}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-3 rounded-full border border-foreground/15 px-2.5 py-1.5">
                          <button
                            onClick={() => updateQty(item, -1)}
                            aria-label="Decrease quantity"
                            className="flex h-5 w-5 items-center justify-center"
                          >
                            <Minus size={13} />
                          </button>

                          <span className="w-4 text-center text-sm tabular-nums">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => updateQty(item, 1)}
                            aria-label="Increase quantity"
                            className="flex h-5 w-5 items-center justify-center"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <span className="font-heading text-base font-medium">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sticky Checkout Footer */}
      {!isLoading && !loadError && items.length > 0 && (
        <footer className="sticky bottom-0 z-20 border-t border-foreground/10 bg-background/95 px-5 pb-6 pt-5 backdrop-blur-md">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/50">
                  Subtotal
                </p>

                <p className="mt-1 text-[10px] text-foreground/35">
                  {selectedItems.length} selected {selectedItems.length === 1 ? "item" : "items"}
                </p>
              </div>

              <span className="font-heading text-2xl font-semibold">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="w-full rounded-sm bg-background-inverse py-4 font-heading text-base uppercase tracking-widest text-foreground-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.2em] text-foreground/35">
              Secure checkout · RIVIX
            </p>
          </div>
        </footer>
      )}
    </main>
  );
}
