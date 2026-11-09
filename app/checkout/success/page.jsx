
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Check,
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export default function OrderPlaced() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Generate a display-only reference for this confirmation.
    // Replace this with your actual order ID from the order API.
    const params = new URLSearchParams(window.location.search);
    const existingOrderId = params.get("orderId");

    if (existingOrderId) {
      setOrderId(existingOrderId);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0a0a0a] flex flex-col">
      {/* Main content */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Brand */}
          <div className="flex justify-center mb-10 sm:mb-14">
            <Link
              href="/"
              aria-label="RIVIX home"
              className="inline-flex items-center gap-2.5"
            >
              <svg
                viewBox="0 0 40 32"
                className="w-8 h-7 sm:w-9 sm:h-8"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 27 36 2 24 29 20 18 3 27Z" />
              </svg>
              <span className="text-2xl sm:text-3xl font-black tracking-tight">
                RIVIX
              </span>
            </Link>
          </div>

          {/* Confirmation card */}
          <div className="bg-white border border-black/[0.07] rounded-2xl sm:rounded-3xl px-5 py-8 sm:px-10 sm:py-12 md:px-14 shadow-[0_8px_40px_rgba(0,0,0,0.025)]">
            {/* Success icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-[68px] h-[68px] sm:w-20 sm:h-20 rounded-full bg-[#f5f0e8] flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                  <Check
                    size={28}
                    strokeWidth={2.2}
                    className="text-white"
                  />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#a89478] mb-3">
                Order Confirmed
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.055em] leading-[1.08]">
                YOU&apos;RE ALL
                <br />
                <span className="font-serif italic font-medium tracking-[-0.04em]">
                  set.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#77736e] leading-6 sm:leading-7 max-w-md mx-auto mt-5">
                Your order is in. Thanks for choosing RIVIX.
                We&apos;ll keep you updated as your pieces make
                their way to you.
              </p>
            </div>

            {/* Order reference */}
            {orderId && (
              <div className="mt-8 sm:mt-10 p-4 sm:px-5 sm:py-4 bg-[#fafafa] border border-black/[0.06] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b8680]">
                  Order Reference
                </span>
                <span className="text-sm font-semibold tracking-wide break-all">
                  {orderId}
                </span>
              </div>
            )}

            {/* Order journey */}
            <div className="mt-9 sm:mt-11">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs sm:text-sm font-bold tracking-wide">
                  WHAT HAPPENS NEXT
                </h2>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#a19b94]">
                  Your journey
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#f5f0e8] flex items-center justify-center">
                    <Check size={18} strokeWidth={1.8} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold">
                      Order placed
                    </p>
                    <p className="text-xs sm:text-sm text-[#858079] mt-1 leading-5">
                      Your order has been submitted successfully.
                    </p>
                  </div>
                  <span className="ml-auto text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#8d7959] pt-1">
                    Done
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 rounded-full border border-black/10 flex items-center justify-center">
                    <Package size={18} strokeWidth={1.6} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold">
                      Getting your order ready
                    </p>
                    <p className="text-xs sm:text-sm text-[#858079] mt-1 leading-5">
                      We&apos;ll prepare your pieces for dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 rounded-full border border-black/10 flex items-center justify-center">
                    <Truck size={18} strokeWidth={1.6} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold">
                      On its way to you
                    </p>
                    <p className="text-xs sm:text-sm text-[#858079] mt-1 leading-5">
                      Track your order for status updates and
                      delivery information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.07] my-8 sm:my-10" />

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="group min-h-12 px-5 py-3.5 bg-[#0a0a0a] text-white flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#292929] transition-colors duration-200 rounded-lg"
              >
                KEEP SHOPPING
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/profile"
                className="min-h-12 px-5 py-3.5 border border-black/15 text-[#0a0a0a] flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#fafafa] transition-colors duration-200 rounded-lg"
              >
                TRACK YOUR ORDER
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Reassurance */}
            <div className="flex items-center justify-center gap-2 mt-6 text-[#858079]">
              <ShieldCheck size={15} strokeWidth={1.6} />
              <p className="text-[10px] sm:text-xs text-center leading-5">
                Need help? We&apos;re here to make it right.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[10px] sm:text-xs tracking-[0.16em] uppercase text-[#a19b94] mt-7 sm:mt-9">
            RIVIX — Define Your Direction.
          </p>
        </div>
      </section>
    </main>
  );
}
