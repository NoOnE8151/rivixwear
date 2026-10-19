"use client";

import React from "react";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const variants = product?.variants || [];

  const defaultVariant = variants[0];

  const image = defaultVariant?.images?.[0];
  const price = defaultVariant?.price;

  // Product is sold out only when ALL variants are out of stock
  const isSoldOut =
    variants.length > 0 &&
    variants.every((variant) => variant?.stock <= 0);

  const hasAvailableVariant = variants.some(
    (variant) => variant?.stock > 0
  );

  return (
    <div className="group w-full">
      <Link href={`/product/${product?._id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-zinc-100 md:rounded-3xl">
          {/* Product Image */}
          <div className="relative aspect-4/5 overflow-hidden">
            <img
              src={image}
              alt={product?.name || "Product"}
              className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                !isSoldOut ? "group-hover:scale-105" : ""
              }`}
            />

            {/* Sold Out Overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
                <div className="flex flex-col items-center text-center">
                  <span className="font-poppins text-xs font-medium uppercase tracking-[0.25em] text-white/80">
                    Sold Out
                  </span>

                  <span className="mt-2 font-poppins text-sm font-medium text-white">
                    Stock will be back soon
                  </span>
                </div>
              </div>
            )}

            {/* Quick Add */}
            {!isSoldOut && hasAvailableVariant && (
              <div
                className="
                  absolute bottom-0 left-0 right-0
                  translate-y-full opacity-0
                  transition-all duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  className="
                    w-full
                    cursor-pointer
                    rounded-b-lg
                    bg-background-inverse
                    px-5 py-4
                    font-poppins text-sm font-medium
                    tracking-wide
                    text-foreground-inverse
                    backdrop-blur-md
                    transition-all duration-300
                    ease-out
                    hover:brightness-110
                    active:scale-[0.985]
                    md:rounded-b-3xl
                  "
                >
                  Quick Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex items-start justify-between gap-3 px-1 pt-4">
          <div className="space-y-1">
            <h2 className="line-clamp-1 text-base font-medium text-zinc-900 md:text-lg">
              {product?.name}
            </h2>

            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-semibold ${
                  isSoldOut ? "text-zinc-400" : "text-zinc-900"
                }`}
              >
                ₹{price}
              </span>

              <span className="text-sm text-zinc-400 line-through">
                ₹{Math.floor(price * 1.5)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;