
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import fetchCollection from "@/utils/shop/product/fetchCollection";

export default function CollectionSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);

  const getCollection = async () => { 
    const collection = await fetchCollection('coldwear');
    setProducts(collection);
   }

  useEffect(() => {
    getCollection();
  }, [])

  return (
    <section
      id="essentials"
      className="px-6 md:px-18 py-24"
      style={{ background: "var(--white)" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-14 gap-4">
        <div>
          <div className="eyebrow reveal mb-6">
            Featured Collection
          </div>

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
            RIVIX{" "}
            <em
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "0.8em",
              }}
            >
              COLDWEAR
            </em>
          </h2>
        </div>

        <Link
          href="/collection/coldwear"
          className="btn-ghost reveal"
        >
          View All →
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((p, i) => {
          const variant = p.variants?.[0];

          const image = variant?.images?.[0];

          const price = variant?.price ?? 0;

          const isComingSoon = p.comingSoon;

          const discount = p.was
            ? Math.round(((p.was - price) / p.was) * 100)
            : 0;

          return (
            <div
              key={p._id || p.name}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`product-card reveal${i > 0 ? ` reveal-d${i}` : ""}`}
              style={{ background: "var(--cream)" }}
            >
              <Link
                href={
                  p._id
                    ? `/product/${p._id}`
                    : "/collection/motion"
                }
                onClick={(e) => {
                  if (isComingSoon) e.preventDefault();
                }}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={image}
                    alt={`${p.name} - ${variant?.name || ""}`}
                    className="h-full w-full object-cover"
                  />

                  {hoveredCard === i && (
                    <div className="absolute w-full bottom-0 py-3 bg-background-inverse text-foreground-inverse font-semibold text-center text-xl quick-label">
                      {isComingSoon ? "Coming Soon" : "View Product"}
                    </div>
                  )}

                  {isComingSoon && (
                    <div
                      className="card-overlay absolute inset-0"
                      style={{
                        background: "rgba(10,10,10,0.18)",
                      }}
                    />
                  )}

                  {/* Product Tag */}
                  <div
                    className="absolute top-4 left-4 text-white"
                    style={{
                      background:
                        p.tag === "Best Seller"
                          ? "var(--rivix-red)"
                          : "var(--black)",
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

                {/* Product Info */}
                <div style={{ padding: "20px 16px 24px" }} >
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
                    {p.name} — {variant?.name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--mid-gray)",
                      marginBottom: 12,
                      letterSpacing: "0.04em",
                    }}
                    className="hidden md:block"
                  >
                    {p.fabricCare?.fabric}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 18,
                        letterSpacing: "0.04em",
                        color: "var(--black)",
                      }}
                    >
                      {isComingSoon
                        ? "Coming Soon"
                        : `₹${price.toLocaleString("en-IN")}`}
                    </span>

                    {!isComingSoon && p.was && (
                      <>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--mid-gray)",
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{p.was.toLocaleString("en-IN")}
                        </span>

                        <span
                          style={{
                            fontSize: 9,
                            color: "var(--rivix-red)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
