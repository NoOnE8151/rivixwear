"use client";
import React, { useEffect, useState } from "react";
import { use } from "react";
import ProductCard from "@/app/components/shop/ProductCard";
import Navbar from "@/app/components/Navbar";

const NotFoundPlaceholder = ({ query }) => (
  <>
    <style>{`
      @keyframes rivix-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes rivix-fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .r-nf-fade-1 { animation: rivix-fadeUp 0.5s ease 0.05s both; }
      .r-nf-fade-2 { animation: rivix-fadeUp 0.5s ease 0.15s both; }
      .r-nf-fade-3 { animation: rivix-fadeUp 0.5s ease 0.25s both; }
      .r-nf-fade-4 { animation: rivix-fadeUp 0.5s ease 0.35s both; }
      .r-nf-float  { animation: rivix-float 3.5s ease-in-out infinite; }
      .r-nf-btn-primary {
        padding: 13px 26px; border-radius: 8px;
        background: #0d0d0d; color: #f5f0e8;
        font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
        text-decoration: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
        display: inline-block; transition: all 0.2s; border: none; cursor: pointer;
      }
      .r-nf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,13,13,0.18); }
      .r-nf-btn-outline {
        padding: 13px 26px; border-radius: 8px;
        border: 1.5px solid rgba(13,13,13,0.22); color: #0d0d0d;
        font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
        text-decoration: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
        display: inline-block; transition: all 0.2s; background: transparent; cursor: pointer;
      }
      .r-nf-btn-outline:hover { border-color: #0d0d0d; transform: translateY(-2px); }
      .r-nf-quick-link { color: #6b6560; text-decoration: none; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; transition: color 0.2s; }
      .r-nf-quick-link:hover { color: #0d0d0d; }
    `}</style>

    <div style={{
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "80px 24px",
      position: "relative",
      overflow: "hidden",
      minHeight: "60vh",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* BG WATERMARK */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", userSelect: "none", overflow: "hidden",
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(100px, 22vw, 260px)",
          color: "rgba(13,13,13,0.04)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}>
          NO RESULTS
        </span>
      </div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 480 }}>

        <div className="r-nf-fade-1" style={{
          fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
          color: "#b8965a", fontWeight: 500, marginBottom: 20,
        }}>
          Search · No match
        </div>

        {/* FLOATING ICON */}
        <div className="r-nf-float r-nf-fade-2" style={{ marginBottom: 28 }}>
          <svg width="68" height="68" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="22" stroke="#0d0d0d" strokeWidth="1.2" fill="none" />
            <line x1="52" y1="52" x2="68" y2="68" stroke="#0d0d0d" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M29 29 L43 43 M43 29 L29 43" stroke="#b8965a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="r-nf-fade-2" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(34px, 6vw, 54px)",
          letterSpacing: "0.04em",
          lineHeight: 0.95,
          color: "#0d0d0d",
          marginBottom: 18,
        }}>
          Nothing dropped<br />for &ldquo;{query}&rdquo;
        </h2>

        <p className="r-nf-fade-3" style={{
          fontSize: 13.5, lineHeight: 1.75, color: "#6b6560",
          fontWeight: 300, marginBottom: 36, maxWidth: 340,
        }}>
          We couldn&apos;t find any products matching that search. Try a different keyword, or browse what&apos;s in the drop right now.
        </p>

        {/* CTAs */}
        <div className="r-nf-fade-4" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 40 }}>
          <a href="/shop" className="r-nf-btn-primary">Browse all</a>
          <a href="/" className="r-nf-btn-outline">Go home</a>
        </div>

        {/* QUICK LINKS */}
        <div className="r-nf-fade-4" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/shop?category=tees" className="r-nf-quick-link">Tees</a>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#b8965a", display: "inline-block" }} />
          <a href="/shop?category=hoodies" className="r-nf-quick-link">Hoodies</a>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#b8965a", display: "inline-block" }} />
          <a href="/drops" className="r-nf-quick-link">Latest drop</a>
        </div>

      </div>
    </div>
  </>
);

const Search = ({ params }) => {
  const { query } = use(params);
  const searchQuery = query;
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    const res = await fetch("/api/public/shop/product/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchQuery }),
    });
    const r = await res.json();
    setSearchResult(r.result);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <main>
      <Navbar />
      <div className="md:grid md:grid-cols-4 flex flex-col md:px-22 md:py-10 p-10 gap-10">
        {searchResult !== null && searchResult?.length === 0 && (
          <NotFoundPlaceholder query={decodeURIComponent(searchQuery)} />
        )}
        {searchResult?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Search;