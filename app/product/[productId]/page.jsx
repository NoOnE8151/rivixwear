"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { use } from "react";
import fetchProduct from "@/utils/shop/product/fetchProduct";
import LoginRequired from "@/app/components/utils/LoginRequired";
import { useAuth } from "@clerk/nextjs";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

function useToast() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const timerRef = useRef(null);
  const show = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ visible: true, message });
    timerRef.current = setTimeout(
      () => setToast({ visible: false, message: "" }),
      2200,
    );
  }, []);
  return { toast, showToast: show };
}

function ProductImage({ src, color, variantName, fading }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden w-full h-full"
      style={{ background: color }}
    >
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-200"
        style={{
          background: "var(--color-background)",
          opacity: fading ? 1 : 0,
        }}
      />

      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{ opacity: 0.3 }}
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 13,
              letterSpacing: "0.15em",
              color: "rgba(13,13,13,0.3)",
            }}
          >
            {variantName}
          </span>
        </div>
      )}

      <img
        src={src}
        alt={variantName}
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

function StockBar({ stock }) {
  const pct = Math.min(Math.round((stock / 30) * 100), 100);
  const isLow = stock <= 8;
  return (
    <div className="mb-7 mt-1">
      <div
        className="flex justify-between items-center mb-1.5"
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#6b6560" }}>Stock level</span>
        <strong style={{ color: "#0d0d0d" }}>{stock} left</strong>
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(13,13,13,0.08)",
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 100,
            background: isLow ? "#c97c30" : "#b8965a",
            width: pct + "%",
            transition: "width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
      </div>
    </div>
  );
}

function LowStockAlert({ stock }) {
  if (stock > 8) return null;
  return (
    <div
      className="flex items-center gap-2 mb-5"
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        background: "rgba(184,150,90,0.1)",
        border: "1px solid rgba(184,150,90,0.25)",
        fontSize: 12,
        color: "#8a6830",
        letterSpacing: "0.03em",
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#b8965a",
          flexShrink: 0,
          animation: "rivix-pulse 1.5s infinite",
        }}
      />
      Only {stock} left — selling fast
    </div>
  );
}

function VariantPills({ variants, selectedIdx, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-7">
      {variants?.map((v, i) => {
        const active = i === selectedIdx;
        return (
          <button
            key={v?.name}
            onClick={() => onSelect(i)}
            className="cursor-pointer flex items-center gap-2.5 transition-all duration-200"
            style={{
              padding: "8px 16px 8px 10px",
              borderRadius: 100,
              border: active
                ? "1.5px solid #0d0d0d"
                : "1.5px solid rgba(13,13,13,0.25)",
              background: active ? "#0d0d0d" : "transparent",
              color: active ? "#ffffff" : "#6b6560",
              fontSize: 13,
              fontFamily: "inherit",
              transform: active ? "translateY(-1px)" : "none",
              boxShadow: active ? "0 4px 16px rgba(13,13,13,0.18)" : "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#0d0d0d";
                e.currentTarget.style.color = "#0d0d0d";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "rgba(13,13,13,0.25)";
                e.currentTarget.style.color = "#6b6560";
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: v.color,
                border: active
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(0,0,0,0.08)",
                flexShrink: 0,
              }}
            />
            {v.name}
          </button>
        );
      })}
    </div>
  );
}

function SizeGrid({ allSizes, availableSizes, selectedSize, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-7">
      {allSizes.map((s, i) => {
        const available = availableSizes?.includes(s);
        const selected = s === selectedSize;
        return (
          <button
            key={i}
            onClick={() => available && onSelect(s)}
            style={{
              width: 54,
              height: 54,
              borderRadius: 8,
              border: selected
                ? "1.5px solid #0d0d0d"
                : "1.5px solid rgba(13,13,13,0.25)",
              background: selected ? "#0d0d0d" : "transparent",
              color: selected ? "#ffffff" : "#0d0d0d",
              fontSize: 13,
              fontFamily: "inherit",
              fontWeight: 400,
              letterSpacing: "0.05em",
              opacity: available ? 1 : 0.28,
              cursor: available ? "pointer" : "not-allowed",
              textDecoration: available ? "none" : "line-through",
              transition: "all 0.18s ease",
              transform: selected ? "translateY(-1px)" : "none",
              boxShadow: selected ? "0 4px 12px rgba(13,13,13,0.2)" : "none",
            }}
            onMouseEnter={(e) => {
              if (available && !selected) {
                e.currentTarget.style.borderColor = "#0d0d0d";
                e.currentTarget.style.background = "rgba(13,13,13,0.05)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (available && !selected) {
                e.currentTarget.style.borderColor = "rgba(13,13,13,0.25)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  return (
    <div style={{ borderBottom: "1px solid rgba(13,13,13,0.12)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between cursor-pointer"
        style={{
          padding: "16px 0",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          background: "none",
          border: "none",
          color: "#0d0d0d",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            opacity: 0.5,
            transition: "transform 0.25s ease",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        ref={bodyRef}
        style={{
          maxHeight: open ? (bodyRef.current?.scrollHeight || 300) + "px" : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <div
          style={{
            paddingBottom: 18,
            fontSize: 13,
            lineHeight: 1.75,
            color: "#6b6560",
            fontWeight: 300,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Toast({ visible, message }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
        background: "#0d0d0d",
        color: "#ffffff",
        padding: "14px 28px",
        borderRadius: 100,
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: 999,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

export default function ProductPage({ params }) {
   const { isLoaded, isSignedIn, userId } = useAuth();
  const { productId } = use(params);

  const [showLoginRequired, setShowLoginRequired] = useState(false);

  useEffect(() => {
    console.log(showLoginRequired)
  }, [showLoginRequired])


  const [product, setProduct] = useState({});
  useEffect(() => {
    fetchProduct(productId)
      .then((products) => {
        const featuredProduct = products;
        setProduct(featuredProduct);
        console.log("fetched product in promise", featuredProduct);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    console.log("im fetched product", product);
  }, [product]);

  const [variantIdx, setVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [fading, setFading] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [sizeShake, setSizeShake] = useState(false);
  const { toast, showToast } = useToast();

  const variant = product?.variants?.[variantIdx];

  const switchVariant = (idx) => {
    if (idx === variantIdx) return;
    setFading(true);
    setTimeout(() => {
      setVariantIdx(idx);
      setSelectedSize((prev) =>
        prev && !product?.variants[idx]?.sizes?.includes(prev) ? null : prev,
      );
      setFading(false);
    }, 180);
  };

  const handleAddToBag = async () => {
    if (!selectedSize) {
      setSizeShake(true);
      return;
    }

      if (!isSignedIn) {
        setShowLoginRequired(true)
        return 
      }

      console.log('im the price', product)

    const res = await fetch('/api/protected/user/cart/add', {
      method: "POST",
      headers: {
        'Content-Type': 'aplication/json'
      },
      body: JSON.stringify({
        productId: productId,
        variantId: variant.id,
        size: selectedSize,
        price: variant.price
      })
    })

    const r = await res.json();

    console.log('add to cart api called', r)

    setBagCount((c) => c + 1);
    showToast("Added to Bag ✓");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      handleAddToBag();
      return;
    }
    showToast("Redirecting to checkout...");
  };

  if (!isLoaded) {
    return <div> Loading </div>
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        * { box-sizing: border-box; }
        body { background: #ffffff; margin: 0; }
        @keyframes rivix-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes rivix-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .rivix-shake { animation: rivix-shake 0.35s ease; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        style={{
          background: "#ffffff",
          minHeight: "100vh",
          fontFamily: "'DM Sans', sans-serif",
          color: "#0d0d0d",
        }}
      >
        {/* DELIVERY STRIP */}
        <div
          style={{
            background: "#0d0d0d",
            color: "#ffffff",
            padding: "12px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            flexWrap: "wrap",
          }}
        >
          {[
            "Free shipping for all orders",
            "Cash on delivery available",
            "Easy 3-day returns",
          ].map((t, i) => (
            <span key={i} style={{ opacity: 0.8 }}>
              {t}
            </span>
          ))}
        </div>

        <Navbar />

        {/* BREADCRUMB */}
        <div
          style={{
            padding: "16px 48px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "#6b6560",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Shop
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Tops
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{ color: "#0d0d0d" }}>{product?.name}</span>
        </div>

        {/* MAIN LAYOUT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 480px",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 48px 80px",
          }}
        >
          {/* GALLERY */}
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              gap: 16,
              padding: "32px 40px 32px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflowY: "auto",
              }}
            >
              {variant?.images?.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 64,
                    height: 80,
                    borderRadius: 6,
                    border: "1.5px solid #0d0d0d",
                    background: variant.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      color: "rgba(13,13,13,0.35)",
                    }}
                  >
                    {variant.name}
                  </span>
                </div>
              ))}
            </div>
            <ProductImage
              src={variant?.images[0]}
              color={variant?.color}
              variantName={variant?.name}
              fading={fading}
            />
          </div>

          {/* INFO */}
          <div
            style={{
              padding: "40px 0 40px 48px",
              borderLeft: "1px solid rgba(13,13,13,0.12)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8965a",
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Rivix Essentials · SS25
            </div>

            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 52,
                letterSpacing: "0.04em",
                lineHeight: 0.95,
                marginBottom: 20,
              }}
            >
              {product?.name?.split(" ").slice(0, -1).join(" ")}
              <br />
              {product?.name?.split(" ").slice(-1)}
            </h1>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                }}
              >
                ₹{variant?.price}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "#6b6560",
                  textDecoration: "line-through",
                }}
              >
                ₹1,199
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: "#b8965a",
                  color: "#ffffff",
                  padding: "2px 8px",
                  borderRadius: 100,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                Save {Math.round((1 - variant?.price / 1199) * 100)}%
              </span>
            </div>

            <StockBar stock={variant?.stock} />

            <div
              style={{
                height: 1,
                background: "rgba(13,13,13,0.12)",
                margin: "0 0 24px",
              }}
            />

            {/* Variants */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6b6560",
                  marginBottom: 14,
                }}
              >
                Color —{" "}
                <span style={{ color: "#0d0d0d", fontWeight: 500 }}>
                  {variant?.name}
                </span>
              </div>
              <VariantPills
                variants={product?.variants}
                selectedIdx={variantIdx}
                onSelect={switchVariant}
              />
            </div>

            {/* Sizes */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6b6560",
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  Size —{" "}
                  <span style={{ color: "#0d0d0d", fontWeight: 500 }}>
                    {selectedSize || "Select size"}
                  </span>
                </span>
                <button
                  onClick={() => alert("Size guide coming soon!")}
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#6b6560",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    fontFamily: "inherit",
                  }}
                >
                  Size guide
                </button>
              </div>
              <div className={sizeShake ? "rivix-shake" : ""}>
                <SizeGrid
                  allSizes={ALL_SIZES}
                  availableSizes={variant?.sizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>
            </div>

            <LowStockAlert stock={variant?.stock} />

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 24,
              }}
            >
              <button
                onClick={handleAddToBag}
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  borderRadius: 10,
                  border: "1.5px solid #0d0d0d",
                  background: "transparent",
                  color: "#0d0d0d",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily: "inherit",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(13,13,13,0.06)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(13,13,13,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Add to Bag
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "#0d0d0d",
                  color: "#ffffff",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily: "inherit",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a1a1a";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(13,13,13,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0d0d0d";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(13,13,13,0.12)",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              {[
                {
                  icon: (
                    <>
                      <rect x="1" y="3" width="22" height="18" rx="2" />
                      <path d="M1 9h22" />
                    </>
                  ),
                  label: "COD Available",
                },
                {
                  icon: (
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  ),
                  label: "Secure Checkout",
                },
                {
                  icon: (
                    <>
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-5" />
                    </>
                  ),
                  label: "Easy Returns",
                },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    textAlign: "center",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#6b6560",
                    borderRight:
                      i < arr.length - 1
                        ? "1px solid rgba(13,13,13,0.12)"
                        : "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    lineHeight: 1.4,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ opacity: 0.5 }}
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.75,
                color: "#6b6560",
                marginBottom: 24,
                fontWeight: 300,
              }}
            >
              {product?.description}
            </p>

            {/* Accordions */}
            <Accordion title="Fabric & Care">
              {product?.fabricAndCare?.split("\n\n").map((para, i) => (
                <p key={i} style={{ margin: i > 0 ? "12px 0 0" : 0 }}>
                  {para}
                </p>
              ))}
            </Accordion>
            <Accordion title="Shipping & Delivery">
              Free standard shipping on orders above ₹999. Express delivery
              available at checkout. Estimated delivery: 3–5 business days.
              Pan-India shipping available.
            </Accordion>
            <Accordion title="Returns & Exchange">
              15-day hassle-free returns. Items must be unworn and in original
              packaging with tags attached. Exchanges processed within 3–5
              business days of receipt.
            </Accordion>
          </div>
        </div>
      </div>

      <Toast visible={toast.visible} message={toast.message} />

      {showLoginRequired && <LoginRequired setShowLoginRequired={setShowLoginRequired} />}
    </>
  );
}