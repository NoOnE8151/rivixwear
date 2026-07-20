"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";

const CART_ITEMS = [
  {
    id: "p1",
    variantId: "v1",
    name: "Oversized Bomber Jacket",
    variant: "Charcoal Black",
    size: "L",
    price: 3499,
    qty: 1,
    image: "/assets/products/featured product/variant1.jpeg",
  },
  {
    id: "p2",
    variantId: "v2",
    name: "Signature Cargo Pants",
    variant: "Sand Beige",
    size: "M",
    price: 2799,
    qty: 1,
    image: "/assets/products/featured product/variant1.jpeg",
  },
];

const Cart = ({ setIsCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    console.log("fetch cart function called");

    try {
      const res = await fetch("/api/protected/user/cart/get");
      const r = await res.json();
      setCartItems(r);
      console.log(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const [items, setItems] = useState(CART_ITEMS);
  const [selected, setSelected] = useState(
    () => new Set(CART_ITEMS.map((i) => i.id)),
  );

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const selectedItems = useMemo(
    () => items.filter((item) => selected.has(item.id)),
    [items, selected],
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems],
  );

  const allSelected = items.length > 0 && selected.size === items.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));
  };

  const handleCheckout = () => {
    const params = new URLSearchParams();
    selectedItems.forEach((item) => {
      params.append("productId", item.id);
      params.append("variantId", item.variantId);
    });
    window.location.href = `/checkout?${params.toString()}`;
  };

  return (
    <div className="bg-background fixed right-0 top-0 bottom-0 w-[25%] flex flex-col shadow-2xl">
      {/* header */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-foreground/10">
        <h1 className="font-heading text-3xl font-semibold tracking-wide">
          rivix
        </h1>
        <button
          onClick={() => setIsCartOpen(false)}
          className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      {/* select all */}
      {items.length > 0 && (
        <div className="flex items-center justify-between px-7 pt-5 pb-2">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                border: allSelected ? "none" : "1.5px solid rgba(0,0,0,0.25)",
                background: allSelected ? "#b8965a" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
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
            <span className="text-xs uppercase tracking-widest text-foreground/60 group-hover:text-foreground/90 transition-colors duration-200">
              {allSelected ? "Deselect all" : "Select all"}
            </span>
          </button>
          <span className="text-xs uppercase tracking-widest text-foreground/40">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      {/* body */}
      <div className="flex-1 overflow-y-auto px-7 pb-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <p className="font-heading text-2xl">Your cart is empty</p>
            <p className="text-sm text-foreground/50">
              Add something you love.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 py-5 border-b border-foreground/10 last:border-none"
              >
                {/* checkbox */}
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="cursor-pointer mt-1 shrink-0"
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      border: isSelected
                        ? "none"
                        : "1.5px solid rgba(0,0,0,0.25)",
                      background: isSelected ? "#b8965a" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
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

                {/* image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[85px] h-[105px] object-cover rounded-sm shrink-0"
                  style={{
                    opacity: isSelected ? 1 : 0.45,
                    transition: "opacity 0.25s ease",
                  }}
                />

                {/* details */}
                <div
                  className="flex-1 flex flex-col gap-1.5 min-w-0"
                  style={{
                    opacity: isSelected ? 1 : 0.45,
                    transition: "opacity 0.25s ease",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-heading text-lg leading-tight truncate">
                      {item.name}
                    </h2>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="cursor-pointer text-foreground/30 hover:text-foreground/70 transition-colors duration-200 shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <p className="text-xs text-foreground/50 uppercase tracking-wider">
                    {item.variant} &middot; Size {item.size}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    {/* quantity stepper */}
                    <div className="flex items-center gap-3 border border-foreground/15 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="cursor-pointer w-5 h-5 flex items-center justify-center hover:text-[#b8965a] transition-colors duration-200"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="cursor-pointer w-5 h-5 flex items-center justify-center hover:text-[#b8965a] transition-colors duration-200"
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

      {/* fixed checkout footer */}
      {items.length > 0 && (
        <div className="px-7 py-6 border-t border-foreground/10">
          <div className="flex items-center justify-between mb-4">
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
            className="bg-background-inverse text-foreground-inverse w-full py-4 rounded-sm font-heading text-lg tracking-wide uppercase cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-200"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
