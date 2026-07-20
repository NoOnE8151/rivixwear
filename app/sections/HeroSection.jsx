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

  // auto slide every 5 sec
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % product?.variants?.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [product?.variants?.length]);

  const activeProduct = product?.variants?.[activeIndex];

  return (
    <section className="md:flex h-[calc(100vh-100px)] w-screen bg-background overflow-hidden">
      {/* left side */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 py-8 md:pl-32 md:pr-10">
        <h1 className="text-5xl md:text-8xl font-heading font-bold tracking-wider leading-[0.92]">
          define <br />
          your <br />
          <span className="font-serif italic capitalize text-4xl md:text-7xl tracking-normal">
            direction.
          </span>
        </h1>

        <div className="mt-8">
          <button className="bg-element text-foreground-inverse px-6 py-3 md:w-1/3 font-semibold uppercase hover:bg-element-hover transition-colors duration-300">
            Shop Now
          </button>
        </div>
      </div>

      {/* right side */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-[520px]">
          <p className="uppercase tracking-[0.35em] text-xs text-neutral-500 mb-4">
            Featured Product
          </p>

          <div className="group relative h-[52vh] md:h-[68vh] max-h-[620px] min-h-[320px] rounded-[1.35rem] overflow-hidden bg-neutral-100">
            {product?.variants?.map((item, index) => (
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
                <Image
                  src={item?.images[0]}
                  alt={item?.name}
                  fill
                  priority={index === 0}
                  className="object-cover rounded-[1.35rem] transition-transform duration-700 group-hover:scale-[1.04] group-hover:rotate-[0.4deg]"
                />
              </div>
            ))}

            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-30">
              <h3 className="text-2xl md:text-3xl font-semibold drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]">
                {activeProduct?.name}
              </h3>

              <p className="text-sm text-white/90 mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                Oversized Signature Tee
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-lg font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                  ₹{activeProduct?.price}
                </span>

                <Link
                  href={`/product/${product._id}`}
                  className="px-6 py-3 rounded-full bg-element text-foreground-inverse text-sm uppercase tracking-wider hover:bg-element-hover hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Buy Now
                </Link>
              </div>

              <div className="flex gap-2 mt-5">
                {product?.variants?.map((_, index) => (
                  <span
                    key={index}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
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
