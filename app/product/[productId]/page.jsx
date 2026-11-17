"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { use } from "react";
import fetchProduct from "@/utils/shop/product/fetchProduct";
import LoginRequired from "@/app/components/utils/LoginRequired";
import { useAuth } from "@clerk/nextjs";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

// a variant is sold out only when its stock is a number below 1
const isSoldOut = (variant) => Number(variant?.stock) < 1;

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

function ProductImage({ src, color, variantName, fading, soldOut }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden w-full !h-[70vw] sm:!h-[65vw] md:!h-[600px] xl:!h-full"
      style={{ background: color }}
    >
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-200 [background:var(--color-background)]"
        style={{ opacity: fading ? 1 : 0 }}
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
            className="[opacity:0.3]" 
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span
            className="[font-family:'Bebas_Neue',_sans-serif] [font-size:13px] [letter-spacing:0.15em] [color:rgba(13,13,13,0.3)]" 
          >
            {variantName}
          </span>
        </div>
      )}

      <img
        src={src}
        alt={variantName}
        onLoad={() => setLoaded(true)}
        className="[position:absolute] [inset:0] [width:100%] [height:100%] [object-fit:contain] [transition:opacity_0.4s_ease,_filter_0.4s_ease]" style={{ opacity: loaded ? 1 : 0, filter: soldOut ? "grayscale(1)" : "none" }}
      />

      {/* SOLD OUT SCREEN */}
      {soldOut && (
        <div
          className="[position:absolute] [inset:0] [z-index:15] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [padding:24px] [background:rgba(13,13,13,0.58)] [backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)] [color:#ffffff]" 
        >
          <span
            className="[font-family:'Bebas_Neue',_sans-serif] [font-size:13px] [letter-spacing:0.3em] [text-transform:uppercase] [padding:6px_16px] [border-radius:100px] [border:1px_solid_rgba(255,255,255,0.6)]" 
          >
            Sold Out
          </span>

          <div
            className="[font-family:'Bebas_Neue',_sans-serif] [font-size:34px] [letter-spacing:0.06em] [line-height:1] [margin:16px_0_8px]" 
          >
            Currently Unavailable
          </div>

          <p
            className="[margin:0] [max-width:300px] [font-size:13px] [line-height:1.7] [font-weight:300] [color:rgba(255,255,255,0.8)]" 
          >
            This colour has sold out. Fresh stock will be back soon — please
            check back shortly.
          </p>
        </div>
      )}
    </div>
  );
}

function StockBar({ stock }) {
  const pct = Math.min(Math.round((stock / 30) * 100), 100);
  const isLow = stock <= 8;

  return (
    <div className="mb-7 mt-1">
      <div
        className="flex justify-between items-center mb-1.5 [font-size:11px] [letter-spacing:0.08em] [text-transform:uppercase]"
        
      >
        <span className="[color:#6b6560]" >Stock level</span>
        <strong className="[color:#0d0d0d]" >{stock} left</strong>
      </div>

      <div
        className="[height:3px] [background:rgba(13,13,13,0.08)] [border-radius:100px] [overflow:hidden]" 
      >
        <div
          className="[height:100%] [border-radius:100px] [transition:width_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)]" style={{ background: isLow ? "#c97c30" : "#b8965a", width: pct + "%" }}
        />
      </div>
    </div>
  );
}

function SoldOutNotice() {
  return (
    <div
      className="mb-7 mt-1 [padding:12px_14px] [border-radius:8px] [background:rgba(13,13,13,0.04)] [border:1px_solid_rgba(13,13,13,0.12)] [font-size:12px] [line-height:1.6] [letter-spacing:0.03em] [color:#6b6560]"
      
    >
      <strong
        className="[display:block] [color:#0d0d0d] [font-size:11px] [letter-spacing:0.12em] [text-transform:uppercase] [margin-bottom:2px]" 
      >
        Sold out
      </strong>
      This colour is currently unavailable. Stock will be back soon — explore
      the other colours in the meantime.
    </div>
  );
}

function LowStockAlert({ stock }) {
  if (!(stock >= 1 && stock <= 8)) return null;

  return (
    <div
      className="flex items-center gap-2 mb-5 [padding:10px_14px] [border-radius:8px] [background:rgba(184,150,90,0.1)] [border:1px_solid_rgba(184,150,90,0.25)] [font-size:12px] [color:#8a6830] [letter-spacing:0.03em]"
      
    >
      <div
        className="[width:7px] [height:7px] [border-radius:50%] [background:#b8965a] [flex-shrink:0] [animation:rivix-pulse_1.5s_infinite]" 
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
        const soldOut = isSoldOut(v);

        return (
          <button
            key={v?.name}
            onClick={() => onSelect(i)}
            className="cursor-pointer flex items-center gap-2.5 transition-all duration-200 [padding:8px_16px_8px_10px] [border-radius:100px] [font-size:13px] [font-family:inherit] [cursor:pointer]"
            style={{ border: active
                ? "1.5px solid #0d0d0d"
                : "1.5px solid rgba(13,13,13,0.25)", background: active ? "#0d0d0d" : "transparent", color: active ? "#ffffff" : "#6b6560", transform: active ? "translateY(-1px)" : "none", boxShadow: active ? "0 4px 16px rgba(13,13,13,0.18)" : "none" }}
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
              className="[width:18px] [height:18px] [border-radius:50%] [flex-shrink:0]" style={{ background: v.color, border: active
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(0,0,0,0.08)", opacity: soldOut ? 0.45 : 1 }}
            />
            {v.name}
            {soldOut && (
              <span
                className="[font-size:9px] [letter-spacing:0.1em] [text-transform:uppercase] [opacity:0.65]" 
              >
                Sold out
              </span>
            )}
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
            className="[width:54px] [height:54px] [border-radius:8px] [font-size:13px] [font-family:inherit] [font-weight:400] [letter-spacing:0.05em] [transition:all_0.18s_ease]" style={{ border: selected
                ? "1.5px solid #0d0d0d"
                : "1.5px solid rgba(13,13,13,0.25)", background: selected ? "#0d0d0d" : "transparent", color: selected ? "#ffffff" : "#0d0d0d", opacity: available ? 1 : 0.28, cursor: available ? "pointer" : "not-allowed", textDecoration: available ? "none" : "line-through", transform: selected ? "translateY(-1px)" : "none", boxShadow: selected ? "0 4px 12px rgba(13,13,13,0.2)" : "none" }}
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
    <div className="[border-bottom:1px_solid_rgba(13,13,13,0.12)]" >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between cursor-pointer [padding:16px_0] [font-size:11px] [letter-spacing:0.12em] [text-transform:uppercase] [background:none] [border:none] [color:#0d0d0d] [font-family:inherit] [cursor:pointer]"
        
      >
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="[opacity:0.5] [transition:transform_0.25s_ease]" style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        ref={bodyRef}
        className="[overflow:hidden] [transition:max-height_0.35s_ease]" style={{ maxHeight: open ? (bodyRef.current?.scrollHeight || 300) + "px" : 0 }}
      >
        <div
          className="[padding-bottom:18px] [font-size:13px] [line-height:1.75] [color:#6b6560] [font-weight:300]" 
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
      className="[position:fixed] [bottom:32px] [left:50%] [background:#0d0d0d] [color:#ffffff] [padding:14px_28px] [border-radius:100px] [font-size:12px] [letter-spacing:0.1em] [text-transform:uppercase] [transition:all_0.35s_cubic-bezier(0.34,1.56,0.64,1)] [z-index:999] [white-space:nowrap] [pointer-events:none]" style={{ transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`, opacity: visible ? 1 : 0 }}
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
    console.log(showLoginRequired);
  }, [showLoginRequired]);

  const [product, setProduct] = useState({});

  useEffect(() => {
    fetchProduct(productId)
      .then((products) => {
        const featuredProduct = products;
        setProduct(featuredProduct);
      })
      .catch(console.error);
  }, []);

  const [variantIdx, setVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [fading, setFading] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [sizeShake, setSizeShake] = useState(false);

  const { toast, showToast } = useToast();

  const variant = product?.variants?.[variantIdx];
  const soldOut = isSoldOut(variant);

  const switchVariant = (idx) => {
    if (idx === variantIdx) return;

    setFading(true);

    setTimeout(() => {
      setVariantIdx(idx);

      setSelectedSize((prev) => {
        const next = product?.variants?.[idx];
        if (!prev) return prev;
        if (isSoldOut(next) || !next?.sizes?.includes(prev)) return null;
        return prev;
      });

      setFading(false);
    }, 180);
  };

//check if product already in cart before
const [isProductInCart, setIsProductInCart] = useState(false)
const checkCart = async () => {
  if (!product?._id || !variant?.id || !selectedSize) {
    return false;
  }

  try {
    const res = await fetch('/api/protected/user/cart/checkProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: product._id,
        variantId: variant.id,
        size: selectedSize
      })
    });

    const r = await res.json();

    setIsProductInCart(r.exists);

    console.log('Checking product availability in cart:', r);

    return r.exists;
  } catch (error) {
    console.error('Cart check failed:', error);
    return false;
  }
};

 useEffect(() => {
  if (product?._id && variant?.id && selectedSize) {
    checkCart();
  } else {
    setIsProductInCart(false);
  }
}, [product, variantIdx, selectedSize]);

  const handleAddToBag = async () => {
    if (soldOut) return;
    
    if (!selectedSize) {
      setSizeShake(true);
      return;
    }
    
    if (!isSignedIn) {
      setShowLoginRequired(true);
      return;
    }
    await checkCart();
    setIsProductInCart(true)

    const res = await fetch("/api/protected/user/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "aplication/json",
      },
      body: JSON.stringify({
        productId: productId,
        variantId: variant.id,
        size: selectedSize,
        price: variant.price,
      }),
    });

    const r = await res.json();

    setBagCount((c) => c + 1);
    showToast("Added to Bag ✓");
  };

  const handleBuyNow = async () => {
    if (soldOut) return;

    if (!selectedSize) {
      setSizeShake(true);
      return;
    }

    if (!isSignedIn) {
      setShowLoginRequired(true);
      return;
    }

    showToast("Redirecting to checkout...");
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 300);
  };

  if (!isLoaded) {
    return <div> Loading </div>;
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
        className="[background:#ffffff] [min-height:100vh] [font-family:'DM_Sans',_sans-serif] [color:#0d0d0d]" 
      >
        {/* DELIVERY STRIP */}
        <div
          className="w-full px-4 sm:px-6 xl:px-12 bg-background text-foreground hidden md:flex justify-center items-center [background:#0d0d0d] [color:#ffffff] [padding:12px_48px] [gap:32px] [font-size:10px] [letter-spacing:0.14em] [text-transform:uppercase] [flex-wrap:wrap]"
          
        >
          {[
            "Free shipping for all orders",
            "Cash on delivery available",
            "Easy 3-day returns",
          ].map((t, i) => (
            <span key={i} className="[opacity:0.8]" >
              {t}
            </span>
          ))}
        </div>

        <Navbar />

        {/* BREADCRUMB */}
        <div
          className="w-full px-4 sm:px-6 xl:px-12 [padding:16px_48px] [display:flex] [align-items:center] [gap:8px] [font-size:11px] [color:#6b6560] [letter-spacing:0.08em] [text-transform:uppercase]"
          
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
          <span className="[color:#0d0d0d]" >{product?.name}</span>
        </div>

        {/* MAIN LAYOUT */}
        <div
          className="w-full !grid-cols-1 !px-4 sm:!px-6 xl:!grid-cols-[minmax(0,1fr)_480px] xl:!px-12 [display:grid] [grid-template-columns:1fr_480px] [max-width:1400px] [margin:0_auto] [padding:0_48px_80px]"
          
        >
          {/* GALLERY */}
          <div
            className="!relative !h-auto !grid-cols-1 !grid-rows-[auto_minmax(0,1fr)] !gap-3 !p-0 xl:!sticky xl:!h-screen xl:!grid-cols-[72px_1fr] xl:!grid-rows-none xl:!gap-4 xl:!p-[32px_40px_32px_0] [position:sticky] [top:0] [height:100vh] [display:grid] [grid-template-columns:72px_1fr] [gap:16px] [padding:32px_40px_32px_0]"
            
          >
            <div
              className="!flex-row !overflow-x-auto !overflow-y-hidden xl:!flex-col xl:!overflow-y-auto xl:!overflow-x-visible [display:flex] [flex-direction:column] [gap:10px] [overflow-y:auto]"
              
            >
              {variant?.images?.map((_, i) => (
                <div
                  key={i}
                  className="[width:64px] [height:80px] [border-radius:6px] [border:1.5px_solid_#0d0d0d] [display:flex] [align-items:center] [justify-content:center] [cursor:pointer] [flex-shrink:0]" style={{ background: variant.color }}
                >
                  <span
                    className="[font-family:'Bebas_Neue',_sans-serif] [font-size:8px] [letter-spacing:0.1em] [color:rgba(13,13,13,0.35)]" 
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
              soldOut={soldOut}
            />
          </div>

          {/* INFO */}
          <div
            className="!border-l-0 !p-0 sm:!px-2 xl:!border-l xl:!p-[40px_0_40px_48px] [padding:40px_0_40px_48px] [border-left:1px_solid_rgba(13,13,13,0.12)]"
            
          >
            <div
              className="[font-size:10px] [letter-spacing:0.2em] [text-transform:uppercase] [color:#b8965a] [font-weight:500] [margin-bottom:10px]" 
            >
              Rivix Essentials · SS25
            </div>

            <h1
              className="[font-family:'Bebas_Neue',_sans-serif] [font-size:52px] [letter-spacing:0.04em] [line-height:0.95] [margin-bottom:20px]" 
            >
              {product?.name?.split(" ").slice(0, -1).join(" ")}
              <br />
              {product?.name?.split(" ").slice(-1)}
            </h1>

            {/* Price */}
            <div
              className="!flex-wrap sm:!flex-nowrap [display:flex] [align-items:baseline] [gap:12px] [margin-bottom:8px]"
              
            >
              <span
                className="[font-size:26px] [font-weight:300] [letter-spacing:-0.01em]" 
              >
                ₹{variant?.price}
              </span>

              <span
                className="[font-size:14px] [color:#6b6560] [text-decoration:line-through]" 
              >
                ₹1,199
              </span>

              <span
                className="[font-size:11px] [background:#b8965a] [color:#ffffff] [padding:2px_8px] [border-radius:100px] [font-weight:500] [letter-spacing:0.05em]" 
              >
                Save {Math.round((1 - variant?.price / 1199) * 100)}%
              </span>
            </div>

            {soldOut ? <SoldOutNotice /> : <StockBar stock={variant?.stock} />}

            <div
              className="[height:1px] [background:rgba(13,13,13,0.12)] [margin:0_0_24px]" 
            />

            {/* Variants */}
            <div>
              <div
                className="[font-size:10px] [letter-spacing:0.2em] [text-transform:uppercase] [color:#6b6560] [margin-bottom:14px]" 
              >
                Color —{" "}
                <span className="[color:#0d0d0d] [font-weight:500]" >
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
                className="[font-size:10px] [letter-spacing:0.2em] [text-transform:uppercase] [color:#6b6560] [margin-bottom:10px] [display:flex] [justify-content:space-between] [align-items:center]" 
              >
                <span>
                  Size —{" "}
                  <span className="[color:#0d0d0d] [font-weight:500]" >
                    {selectedSize || "Select size"}
                  </span>
                </span>

                <button
                  onClick={() => alert("Size guide coming soon!")}
                  className="[font-size:11px] [letter-spacing:0.08em] [text-transform:uppercase] [color:#6b6560] [text-decoration:underline] [text-underline-offset:3px] [cursor:pointer] [background:none] [border:none] [font-family:inherit]" 
                >
                  Size guide
                </button>
              </div>

              <div className={sizeShake ? "rivix-shake" : ""}>
                <SizeGrid
                  allSizes={ALL_SIZES}
                  availableSizes={soldOut ? [] : variant?.sizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>
            </div>

            <LowStockAlert stock={variant?.stock} />

            {/* CTAs */}
            <div
              className="[display:flex] [flex-direction:column] [gap:10px] [margin-bottom:24px]" 
            >
              {soldOut ? (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="[width:100%] [padding:18px_24px] [border-radius:10px] [border:1.5px_solid_rgba(13,13,13,0.15)] [background:rgba(13,13,13,0.06)] [color:rgba(13,13,13,0.45)] [font-size:12px] [letter-spacing:0.14em] [text-transform:uppercase] [font-family:inherit] [font-weight:500] [cursor:not-allowed]" 
                >
                  Sold Out — Back Soon
                </button>
              ) : (
                <>
                  <button
                    disabled={isProductInCart}
                    onClick={handleAddToBag}
                    className={`w-full px-6 py-4.5 rounded-[10px] border-[1.5px]  ${isProductInCart ? "bg-gray-500 border-gray-500 cursor-not-allowed" : 'bg-element border-[#0d0d0d] cursor-pointer'} text-foreground-inverse text-xs tracking-[0.14em] uppercase font-[inherit] font-medium flex items-center justify-center`}
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
                    {isProductInCart ? `Already in cart` : `Add to Bag`}
                  </button>

                </>
              )}
            </div>

            {/* Trust badges */}
            <div
              className="[display:flex] [border:1px_solid_rgba(13,13,13,0.12)] [border-radius:10px] [overflow:hidden] [margin-bottom:24px]" 
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
                  className="[flex:1] [padding:12px_8px] [text-align:center] [font-size:10px] [letter-spacing:0.06em] [text-transform:uppercase] [color:#6b6560] [display:flex] [flex-direction:column] [align-items:center] [gap:5px] [line-height:1.4]" style={{ borderRight: i < arr.length - 1
                        ? "1px solid rgba(13,13,13,0.12)"
                        : "none" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="[opacity:0.5]" 
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Description */}
            <p
              className="[font-size:13.5px] [line-height:1.75] [color:#6b6560] [margin-bottom:24px] [font-weight:300]" 
            >
              {product?.description}
            </p>

            {/* Accordions */}
            <Accordion title="Fabric & Care">
              <div className="space-y-3">
                <p>{product?.fabricCare?.fabric}</p>
                <p>{product?.fabricCare?.care}</p>
              </div>
            </Accordion>

            <Accordion title="Shipping & Delivery">
              Free standard shipping on every order. Estimated delivery: 4-10
              business days. Pan-India shipping available.
            </Accordion>

            <Accordion title="Returns & Exchange">
              7-day hassle-free returns. Items must be unworn and in original
              packaging with tags attached. Exchanges processed within 3–5
              business days of receipt.
            </Accordion>
          </div>
        </div>
      </div>

      <Toast visible={toast.visible} message={toast.message} />

      {showLoginRequired && (
        <LoginRequired setShowLoginRequired={setShowLoginRequired} />
      )}
    </>
  );
}
