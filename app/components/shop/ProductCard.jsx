"use client";

import React from "react";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const image = product?.variants?.[0]?.images?.[0];
  const price = product?.variants?.[0]?.price;



  return (
    <div className="group w-full cursor-pointer">
        <Link href={`/product/${product?._id}`}>
        <div className="relative overflow-hidden rounded-lg md:rounded-3xl bg-zinc-100">
          <div className="aspect-4/5 overflow-hidden">
            <img
              src={image}
              alt={product?.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

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
              className="
            cursor-pointer
            w-full
            rounded-b-3xl
            bg-background-inverse
            px-5 py-4
            font-poppins text-sm font-medium tracking-wide
            text-foreground-inverse
            backdrop-blur-md
            transition-all duration-300 ease-out
            hover:brightness-110
            active:scale-[0.985]
            "
            >
              Quick Add
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 px-1 pt-4">
          <div className="space-y-1">
            <h2 className="line-clamp-1 text-base font-medium text-zinc-900 md:text-lg">
              {product?.name}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-zinc-900">
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
