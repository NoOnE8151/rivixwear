// app/sections/CollectionSection.js
"use client";
import { useState } from "react";
import Link from "next/link";

const products = [
  {
    _id: '6a06a07335a61a15b0a7c46d',
    name: "RIVIX ESSENSTIAL TEE — Dust Pink",
    desc: "260GSM Terry Knit Fabric · Premium Oversized fit",
    image:
      "https://res.cloudinary.com/dwfhnflws/image/upload/file_0000000092e4720b83602cd6063c5e73_f4xbj7.jpeg",
    price: "₹599",
    was: "₹799",
    save: "Save ₹200",
    tag: "New",
    tagStyle: { background: "var(--black)" },
    bg: "#f0ebe2",
    bodyColor: "#f5f0e8",
    shadeColor: "#ece7de",
    collarColor: "#ece7de",
    logoFill: "#0a0a0a",
    quickLabel: "View Product",
  },
  {
    _id: "6a059d4156782c6428f6e1ca",
    name: "RIVIX ESSENTIAL Sweatpants — Off-White",
    desc: "260GSM Terry Fabric - Premium Sweatpants",
    image:
      "https://res.cloudinary.com/dwfhnflws/image/upload/file_000000001158720b870542e0eb8171ad_ds3awm.jpeg",
    price: "₹1199",
    was: "₹1,599",
    save: "Save ₹400",
    tag: "Best Seller",
    tagStyle: { background: "var(--rivix-red)" },
    bg: "#1a1a1a",
    bodyColor: "#111",
    shadeColor: "#0a0a0a",
    collarColor: "#0d0d0d",
    logoFill: "#fafafa",
    quickLabel: "View Product",
  },
  {
    name: "RIVIX MOTION Discipline Tee — White",
    desc: "260GSM Terry Knit · Dropping On July",
    image:
      "https://res.cloudinary.com/dwfhnflws/image/upload/ChatGPT_Image_May_11_2026_10_51_50_AM_catw3l.jpeg",
    price: "₹???",
    was: null,
    save: null,
    tag: "Coming Soon",
    tagStyle: { background: "var(--black)" },
    bg: "#d8d5cf",
    bodyColor: "#c8c5bf",
    shadeColor: "#bbb8b2",
    collarColor: "#bbb8b2",
    logoFill: "#0a0a0a",
    quickLabel: "Coming Soon",
  },
];

export default function CollectionSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  return (
    <section
      id="essentials"
      className="px-6 md:px-18 py-24"
      style={{ background: "var(--white)" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-14 gap-4">
        <div>
          <div className="eyebrow reveal mb-6">Featured Collection</div>
          <h2
            className="reveal reveal-d1"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 4vw, 64px)",
              letterSpacing: "0.02em",
              lineHeight: 1,
              color: "var(--black)",
            }}
          >
            THE{" "}
            <em
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "0.8em",
              }}
            >
              Essentials
            </em>
          </h2>
        </div>
        <Link href="/collection/essentials" className="btn-ghost reveal">
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`product-card reveal${i > 0 ? ` reveal-d${i}` : ""}`}
            style={{ background: "var(--cream)" }}
            >
          <Link href={p._id ? `/product/${p._id}` : ''}>
            {/* Image */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
              >
              {hoveredCard === i && (
                <div className="absolute w-full bottom-0 py-3 bg-background-inverse text-foreground-inverse font-semibold text-center text-xl quick-label">
                  {p?.quickLabel}
                </div>
              )}
              <img src={p.image} alt="" className="h-full w-full" />
              <div
                className="card-img-inner w-full h-full flex items-center justify-center"
                style={{ background: p.bg }}
                ></div>
              {p.tag === "Coming Soon" && (
                <div
                className="card-overlay absolute inset-0"
                style={{ background: "rgba(10,10,10,0.18)" }}
                />
              )}
              <div
                className="absolute top-4 left-4 text-white"
                style={{
                  ...p.tagStyle,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  fontWeight: 500,
                }}
                >
                {p.tag}
              </div>
            </div>
            {/* Info */}
            <div style={{ padding: "20px 16px 24px" }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--black)",
                  marginBottom: 6,
                  fontWeight: 400,
                }}
                >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--mid-gray)",
                  marginBottom: 12,
                  letterSpacing: "0.04em",
                }}
                >
                {p.desc}
              </div>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 18,
                    letterSpacing: "0.04em",
                    color: "var(--black)",
                  }}
                  >
                  {p.price}
                </span>
                {p.was && (
                  <span
                  style={{
                    fontSize: 12,
                    color: "var(--mid-gray)",
                    textDecoration: "line-through",
                  }}
                  >
                    {p.was}
                  </span>
                )}
                {p.save && (
                  <span
                  style={{
                    fontSize: 9,
                    color: "var(--rivix-red)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                  >
                    {p.save}
                  </span>
                )}
              </div>
            </div>
        </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
