
"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { X, Minus, Plus } from "lucide-react";

// Unique identifier for each cart entry
const getItemKey = (item) =>
  `${item.id}-${item.variantId}-${item.size}`;

const Cart = ({ setIsCartOpen }) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const debounceTimers = useRef({});

  // Fetch cart products
  const fetchCart = useCallback(async (signal) => {
    setIsLoading(true);
    setLoadError("");

    try {
      const res = await fetch("/api/protected/user/cart/get", {
        signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load your cart.");
      }

      const fetchedItems = Array.isArray(data.cart) ? data.cart : [];

      setItems(fetchedItems);

      // Select individual cart entries, not just product IDs
      setSelected(
        new Set(fetchedItems.map((item) => getItemKey(item)))
      );

      console.log("Successfully fetched all cart items");
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

  // Toggle individual selection
  const toggleSelect = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);

      next.has(key) ? next.delete(key) : next.add(key);

      return next;
    });
  };

  // Update product quantity
  const updateQty = (item, delta) => {
    const key = getItemKey(item);

    const updatedItem = {
      ...item,
      qty: Math.max(1, item.qty + delta),
    };

    // Update only the exact variant and size
    setItems((prev) =>
      prev.map((currentItem) =>
        getItemKey(currentItem) === key
          ? updatedItem
          : currentItem
      )
    );

    // Clear previous debounce for this specific cart entry
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

  // Remove individual cart entry
  const removeItem = async (item) => {
    const key = getItemKey(item);

    try {
      // Prevent pending quantity updates for the deleted entry
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

      // Remove only the exact cart entry
      setItems((prev) =>
        prev.filter(
          (prevItem) => getItemKey(prevItem) !== key
        )
      );

      // Remove only its selection
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });

      return data;
    } catch (error) {
      console.error("Cart deletion failed:", error);
    }
  };

  // Calculate selected items
  const selectedItems = useMemo(
    () =>
      items.filter((item) =>
        selected.has(getItemKey(item))
      ),
    [items, selected]
  );

  // Calculate subtotal
  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ),
    [selectedItems]
  );

  // Check if every cart entry is selected
  const allSelected =
    items.length > 0 &&
    items.every((item) => selected.has(getItemKey(item)));

  // Select / deselect all
  const toggleSelectAll = () => {
    setSelected(
      allSelected
        ? new Set()
        : new Set(items.map((item) => getItemKey(item)))
    );
  };

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

    window.location.href = `/checkout?${params.toString()}`;
  };

  return (
    <div
      aria-busy={isLoading}
      className="bg-background fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col shadow-2xl sm:w-[420px] lg:w-[460px]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-foreground/10 px-5 py-5 sm:px-7">
        <h1 className="font-heading text-3xl font-semibold tracking-wide">
          rivix
        </h1>

        <button
          onClick={() => setIsCartOpen(false)}
          aria-label="Close cart"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-foreground/5"
        >
          <X size={20} />
        </button>
      </div>

      {/* Select All */}
      {!isLoading && !loadError && items.length > 0 && (
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5 sm:px-7">
          <button
            onClick={toggleSelectAll}
            className="group flex cursor-pointer items-center gap-2.5"
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                border: allSelected
                  ? "none"
                  : "1.5px solid rgba(0,0,0,0.25)",
                background: allSelected ? "#b8965a" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {allSelected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                >
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

            <span className="text-xs uppercase tracking-widest text-foreground/60 transition-colors duration-200 group-hover:text-foreground/90">
              {allSelected ? "Deselect all" : "Select all"}
            </span>
          </button>

          <span className="text-xs uppercase tracking-widest text-foreground/40">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      {/* Cart Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 sm:px-7">

        {/* LOADING SCREEN */}
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-full flex-col"
          >
            <div className="flex flex-col items-center pb-8 pt-9 text-center">
              <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-[#b8965a]/20" />
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#b8965a]" />

                <span className="font-heading text-lg font-semibold tracking-widest text-[#b8965a]">
                  R
                </span>
              </div>

              <p className="font-heading text-xl tracking-wide">
                Preparing your cart
              </p>

              <p className="mt-1.5 text-xs text-foreground/45">
                Just a moment. We're gathering your selected pieces.
              </p>

              <div className="mt-4 flex items-center gap-1.5">
                <span className="h-1 w-1 animate-pulse rounded-full bg-[#b8965a]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-[#b8965a] [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-[#b8965a] [animation-delay:300ms]" />
              </div>
            </div>

            {/* Product skeletons */}
            <div className="space-y-0">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-start gap-4 border-b border-foreground/10 py-5 last:border-none"
                >
                  <div className="h-[105px] w-[85px] shrink-0 rounded-sm bg-foreground/[0.07]" />

                  <div className="min-w-0 flex-1 space-y-3 pt-1">
                    <div className="h-3.5 w-3/4 rounded-sm bg-foreground/[0.09]" />
                    <div className="h-2.5 w-1/2 rounded-sm bg-foreground/[0.06]" />

                    <div className="mt-5 flex items-center justify-between">
                      <div className="h-7 w-20 rounded-full bg-foreground/[0.07]" />
                      <div className="h-3.5 w-14 rounded-sm bg-foreground/[0.09]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : loadError ? (
          /* FETCH ERROR */
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <p className="font-heading text-xl">
              Couldn't load your cart
            </p>

            <p className="mt-2 max-w-[260px] text-sm text-foreground/50">
              {loadError}
            </p>

            <button
              onClick={() => fetchCart()}
              className="mt-6 cursor-pointer bg-background-inverse px-7 py-3 text-xs font-medium uppercase tracking-widest text-foreground-inverse transition-opacity hover:opacity-80"
            >
              Try again
            </button>
          </div>

        ) : items.length === 0 ? (
          /* EMPTY CART */
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-center">
            <p className="font-heading text-2xl">
              Your cart is empty
            </p>

            <p className="text-sm text-foreground/50">
              Add something you love.
            </p>
          </div>

        ) : (
          /* CART PRODUCTS */
          items.map((item) => {
            const key = getItemKey(item);
            const isSelected = selected.has(key);

            return (
              <div
                key={key}
                className="flex items-start gap-4 border-b border-foreground/10 py-5 last:border-none"
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(key)}
                  aria-label={`Select ${item.name}`}
                  className="mt-1 shrink-0 cursor-pointer"
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      border: isSelected
                        ? "none"
                        : "1.5px solid rgba(0,0,0,0.25)",
                      background: isSelected
                        ? "#b8965a"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSelected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
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

                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[105px] w-[85px] shrink-0 rounded-sm object-cover"
                  style={{
                    opacity: isSelected ? 1 : 0.45,
                    transition: "opacity 0.25s ease",
                  }}
                />

                {/* Product Details */}
                <div
                  className="flex min-w-0 flex-1 flex-col gap-1.5"
                  style={{
                    opacity: isSelected ? 1 : 0.45,
                    transition: "opacity 0.25s ease",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-heading truncate text-lg leading-tight">
                      {item.name}
                    </h2>

                    <button
                      onClick={() => removeItem(item)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 cursor-pointer text-foreground/30 transition-colors duration-200 hover:text-foreground/70"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-foreground/50">
                    {item.variant} &middot; Size {item.size}
                  </p>

                  <div className="mt-1 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-3 rounded-full border border-foreground/15 px-2 py-1">
                      <button
                        onClick={() => updateQty(item, -1)}
                        aria-label="Decrease quantity"
                        className="flex h-5 w-5 cursor-pointer items-center justify-center transition-colors duration-200 hover:text-[#b8965a]"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="w-4 text-center text-sm">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => updateQty(item, 1)}
                        aria-label="Increase quantity"
                        className="flex h-5 w-5 cursor-pointer items-center justify-center transition-colors duration-200 hover:text-[#b8965a]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-heading text-base">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Footer */}
      {isLoading ? (
        /* Footer skeleton */
        <div className="shrink-0 animate-pulse border-t border-foreground/10 px-5 py-6 sm:px-7">
          <div className="mb-5 flex items-center justify-between">
            <div className="h-2.5 w-32 rounded-sm bg-foreground/[0.08]" />
            <div className="h-6 w-20 rounded-sm bg-foreground/[0.09]" />
          </div>

          <div className="h-[52px] w-full rounded-sm bg-foreground/[0.09]" />
        </div>

      ) : (
        items.length > 0 && !loadError && (
          <div className="shrink-0 border-t border-foreground/10 px-5 py-6 sm:px-7">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-foreground/50">
                Subtotal ({selectedItems.length} selected)
              </span>

              <span className="font-heading text-2xl">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="w-full cursor-pointer rounded-sm bg-background-inverse py-4 font-heading text-lg uppercase tracking-wide text-foreground-inverse transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Checkout
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Cart;
