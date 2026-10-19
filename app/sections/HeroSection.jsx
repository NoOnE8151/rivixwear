"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import fetchProduct from "@/utils/shop/product/fetchProduct";

export default function HeroSection() {
  const [product, setProduct] = useState({});

  useEffect(() => {
    fetchProduct("6a015366bb8a0b86f902833f")
      .then((products) => {
        const featuredProduct = products;
        setProduct(featuredProduct);
      })
      .catch(console.error);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const variantCount = product?.variants?.length || 0;

  // auto slide every 5 sec
  useEffect(() => {
    if (variantCount < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % variantCount);
    }, 5000);

    return () => clearInterval(timer);
  }, [variantCount]);

  const activeProduct = product?.variants?.[activeIndex];

  // a variant is sold out only when its stock is a number below 1
  const isOutOfStock = (variant) => Number(variant?.stock) < 1;
  const activeSoldOut = isOutOfStock(activeProduct);

  return (
    <section className="md:flex min-h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] w-screen bg-background overflow-hidden">
      {/* left side */}
      <div className="w-full md:w-1/2 h-auto md:h-full flex flex-col justify-center px-6 py-10 md:pl-32 md:pr-10 md:py-8">
        <h1 className="text-5xl md:text-8xl font-heading font-bold tracking-wider leading-[0.92]">
          define <br />
          your <br />
          <span className="font-serif italic capitalize text-4xl md:text-7xl tracking-normal">
            direction.
          </span>
        </h1>

        <div className="mt-8">
          <Link
            href={"/shop"}
            className="bg-element text-foreground-inverse px-6 py-3 md:w-1/3 font-semibold uppercase hover:bg-element-hover transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* right side */}
      <div className="w-full md:w-1/2 h-auto md:h-full flex items-center justify-center px-6 pb-10 md:pb-8">
        <div className="w-full max-w-[520px]">
          <p className="uppercase tracking-[0.35em] text-xs text-neutral-500 mb-4">
            Featured Product
          </p>

          <div className="group relative h-[55vh] md:h-[68vh] max-h-[620px] min-h-[320px] rounded-[1.35rem] overflow-hidden bg-neutral-100">
            {product?.variants?.map((item, index) => {
              const soldOut = isOutOfStock(item);

              return (
                <div
                  key={item._id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    activeIndex === index
                      ? "opacity-100 translate-x-0 scale-100 z-20"
                      : index < activeIndex
                        ? "opacity-0 -translate-x-full scale-[1.02] z-10"
                        : "opacity-0 translate-x-full scale-[1.02] z-10"
                  }`}
                >
                  {item?.images?.[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item?.name || "Featured product"}
                      fill
                      priority={index === 0}
                      className={`object-cover rounded-[1.35rem] transition-transform duration-700 ${
                        soldOut
                          ? "grayscale"
                          : "group-hover:scale-[1.04] group-hover:rotate-[0.4deg]"
                      }`}
                    />
                  )}

                  {/* sold out screen */}
                  {soldOut && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-center px-6 pb-44 md:pb-48 text-white">
                      <div className="max-w-[320px]">
                        <span className="inline-block px-4 py-1.5 rounded-full border border-white/70 text-xs uppercase tracking-[0.3em]">
                          Sold Out
                        </span>

                        <p className="mt-4 text-lg md:text-xl font-semibold">
                          Currently Unavailable
                        </p>

                        <p className="mt-2 text-sm text-white/80 leading-relaxed">
                          This style has sold out. Fresh stock will be back
                          soon — check back shortly.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-30">
              <h3 className="text-2xl md:text-3xl font-semibold drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]">
                {activeProduct?.name}
              </h3>

              <p className="text-sm text-white/90 mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                Oversized Signature Tee
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span
                  className={`text-lg font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] ${
                    activeSoldOut ? "text-white/60 line-through" : ""
                  }`}
                >
                  ₹{activeProduct?.price}
                </span>

                {activeSoldOut ? (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="px-6 py-3 rounded-full bg-white/20 text-white/70 text-sm uppercase tracking-wider cursor-not-allowed backdrop-blur-sm"
                  >
                    Sold Out
                  </button>
                ) : (
                  <Link
                    href={`/product/${product._id}`}
                    className="px-6 py-3 rounded-full bg-element text-foreground-inverse text-sm uppercase tracking-wider hover:bg-element-hover hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Buy Now
                  </Link>
                )}
              </div>

              <div className="flex gap-2 mt-5">
                {product?.variants?.map((_, index) => (
                  <span
                    key={index}
                    className={`h-0.75 rounded-full transition-all duration-500 ${
                      activeIndex === index
                        ? "w-10 bg-white"
                        : "w-4 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}