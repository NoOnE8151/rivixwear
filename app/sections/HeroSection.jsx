
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";

const OFFER_CODE = "RVXWINTER30";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(OFFER_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy coupon:", error);
    }
  };

  const content = (
    <>
      {/* Campaign label */}
      <div className="flex items-center gap-3">
        <span className="h-px w-7 bg-accent" />
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#8c795b] sm:text-xs">
          RIVIX / The Winter Edit
        </p>
      </div>

      {/* Heading */}
      <h1 className="mt-7 text-[clamp(3rem,5.5vw,5.4rem)] font-semibold uppercase leading-[0.94] tracking-[-0.065em] text-[#111111]">
        Cold days.
        <br />
        <span className="font-serif font-normal italic normal-case tracking-[-0.055em] text-[#8b7962]">
          Better layers.
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-[410px] text-sm leading-7 text-[#68645e] sm:text-base">
        The layers you'll reach for all winter.
        Discover the RIVIX collection and make
        your next rotation count.
      </p>

      {/* Discount */}
      {/* <div className="mt-8 flex w-fit max-w-full items-center gap-4 border border-[#ded8ce] bg-white/85 px-4 py-4 shadow-[0_5px_24px_rgba(0,0,0,0.035)] sm:gap-6 sm:px-5">

        <div className="shrink-0">
          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#858078]">
            Winter offer
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-semibold leading-none tracking-[-0.075em] text-[#171717] sm:text-6xl">
              30%
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#8b7962]">
              OFF
            </span>
          </div>
        </div>

        <div className="h-14 w-px shrink-0 bg-[#e5dfd5]" />

        <div className="min-w-0">
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.15em] text-[#858078]">
            Apply at checkout
          </p>

          <div className="flex items-center gap-2">
            <code className="whitespace-nowrap text-xs font-semibold tracking-[0.09em] text-[#222] sm:text-sm">
              {OFFER_CODE}
            </code>

            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="Copy discount code"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-[#ded8ce] text-[#5f574b] transition-colors hover:border-accent hover:bg-[#b8965a]/10"
            >
              {copied ? <Check size={14} /> : <Copy size={13} />}
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-1.5 text-[9px] text-[#9a896e]"
          >
            {copied ? "Code copied!" : "Tap to copy code"}
          </p>
        </div>
      </div> */}

      {/* CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          href="#"
          className="group inline-flex min-h-[52px] items-center gap-7 bg-[#111111] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#b8965a] hover:text-[#111111]"
        >
          Explore Collection
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <span className="text-[10px] tracking-wide text-[#827c73]">
          Use code at checkout
        </span>
      </div>
    </>
  );

  
return (
  <section className="w-full overflow-hidden bg-gray-200">

    {/* Desktop Hero */}
    <div className="relative hidden h-[calc(100svh-126px)] min-h-[600px] max-h-[800px] w-full items-center lg:flex">

      {/* Background image - no mask */}
      <img
        src="/assets/covers/winterCover.png"
        alt="RIVIX winter collection"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Left blending - reduced spread */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              #e5e7eb 0%,
              #e5e7eb 25%,
              rgba(229, 231, 235, 0.94) 34%,
              rgba(229, 231, 235, 0.72) 42%,
              rgba(229, 231, 235, 0.24) 50%,
              transparent 56%
            )
          `,
        }}
      />

      {/* Subtle top and bottom blending */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              #e5e7eb 0%,
              rgba(229, 231, 235, 0.65) 2%,
              rgba(229, 231, 235, 0.15) 6%,
              transparent 10%,
              transparent 90%,
              rgba(229, 231, 235, 0.15) 94%,
              rgba(229, 231, 235, 0.65) 98%,
              #e5e7eb 100%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-12 xl:px-20">
        <div className="max-w-[540px]">
          {content}
        </div>
      </div>

    </div>

    {/* Mobile Hero */}
    <div className="lg:hidden">

      <div className="relative h-[300px] w-full bg-gray-200 sm:h-[400px]">

        <img
          src="/assets/covers/winterCover.png"
          alt="RIVIX winter collection"
          className="h-full w-full object-cover object-[65%_center]"
        />

        {/* Top and bottom fades */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #e5e7eb 0%, transparent 13%, transparent 87%, #e5e7eb 100%)",
          }}
        />

      </div>
      <div className="px-5 pb-12 pt-14 sm:px-10 sm:pt-16">
        {content}
      </div>

    </div>

  </section>
);

}
