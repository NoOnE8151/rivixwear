import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; }
        body { background: #f5f0e8; margin: 0; }
        @keyframes rivix-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes rivix-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes rivix-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .r-fade-1 { animation: rivix-fadeUp 0.6s ease 0.1s both; }
        .r-fade-2 { animation: rivix-fadeUp 0.6s ease 0.25s both; }
        .r-fade-3 { animation: rivix-fadeUp 0.6s ease 0.4s both; }
        .r-fade-4 { animation: rivix-fadeUp 0.6s ease 0.55s both; }
        .r-float { animation: rivix-float 4s ease-in-out infinite; }
        .r-ticker { animation: rivix-ticker 18s linear infinite; }
        .r-nav-link { color: #6b6560; transition: color 0.2s; }
        .r-nav-link:hover { color: #0d0d0d; }
        .r-footer-link { color: #6b6560; text-decoration: none; transition: color 0.2s; }
        .r-footer-link:hover { color: #0d0d0d; }
        .r-btn-primary {
          padding: 14px 28px; border-radius: 8px;
          background: #0d0d0d; color: #f5f0e8;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          text-decoration: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
          display: inline-block; transition: all 0.2s;
        }
        .r-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,13,13,0.2); }
        .r-btn-outline {
          padding: 14px 28px; border-radius: 8px;
          border: 1.5px solid rgba(13,13,13,0.25); color: #0d0d0d;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          text-decoration: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
          display: inline-block; transition: all 0.2s;
        }
        .r-btn-outline:hover { border-color: #0d0d0d; transform: translateY(-2px); }
      `}</style>

      <div style={{ background: "#f5f0e8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#0d0d0d" }}>

        {/* TICKER STRIP */}
        <div style={{ background: "#0d0d0d", color: "#f5f0e8", padding: "12px 0", overflow: "hidden", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="r-ticker" style={{ display: "inline-flex", gap: 0 }}>
            {[0, 1].map((i) => (
              <span
                key={i}
                aria-hidden={i === 1 ? "true" : undefined}
                style={{ display: "inline-flex", gap: 48, paddingRight: 48, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}
              >
                {["Page not found", "Free shipping above ₹999", "New drop incoming", "280 GSM heavyweight cotton"].map((t, j) => (
                  <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
                    <span>{t}</span>
                    <span style={{ color: "#b8965a" }}>·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* NAV */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(13,13,13,0.12)" }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.12em", textDecoration: "none", color: "#0d0d0d" }}>
            RIVIX
          </Link>
          <Link href="/" className="r-nav-link" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to home
          </Link>
        </nav>

        {/* MAIN */}
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 130px)", padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>

          {/* BG 404 WATERMARK */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", userSelect: "none", overflow: "hidden" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(180px, 35vw, 400px)", color: "rgba(13,13,13,0.04)", letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
              404
            </span>
          </div>

          {/* CONTENT */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 520 }}>

            <div className="r-fade-1" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#b8965a", fontWeight: 500, marginBottom: 20 }}>
              Error 404
            </div>

            {/* FLOATING ICON */}
            <div className="r-float r-fade-2" style={{ marginBottom: 32 }}>
              <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="18" width="60" height="50" rx="4" stroke="#0d0d0d" strokeWidth="1.2" fill="none" />
                <path d="M10 30 Q25 22 40 30 Q55 38 70 30" stroke="#0d0d0d" strokeWidth="1.2" fill="none" />
                <circle cx="25" cy="24" r="3" fill="#b8965a" opacity="0.7" />
                <circle cx="40" cy="20" r="3" fill="#b8965a" opacity="0.7" />
                <circle cx="55" cy="24" r="3" fill="#b8965a" opacity="0.7" />
                <line x1="26" y1="45" x2="54" y2="45" stroke="#0d0d0d" strokeWidth="1" opacity="0.2" />
                <line x1="26" y1="53" x2="46" y2="53" stroke="#0d0d0d" strokeWidth="1" opacity="0.2" />
                <path d="M36 40 L44 48 M44 40 L36 48" stroke="#b8965a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h1 className="r-fade-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 8vw, 72px)", letterSpacing: "0.04em", lineHeight: 0.95, marginBottom: 20 }}>
              Lost the<br />thread
            </h1>

            <p className="r-fade-3" style={{ fontSize: 14, lineHeight: 1.75, color: "#6b6560", fontWeight: 300, marginBottom: 40, maxWidth: 360 }}>
              This page packed up and left. Maybe it was a limited drop that sold out, or you followed a dead link. Either way — it&apos;s not here anymore.
            </p>

            {/* CTAs */}
            <div className="r-fade-4" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
              <Link href="/" className="r-btn-primary">Go home</Link>
              <Link href="/shop" className="r-btn-outline">Shop all</Link>
            </div>

            {/* QUICK LINKS */}
            <div className="r-fade-4" style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <Link href="/drops" className="r-footer-link">Drops</Link>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#b8965a", display: "inline-block" }} />
              <Link href="/lookbook" className="r-footer-link">Lookbook</Link>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#b8965a", display: "inline-block" }} />
              <Link href="/contact" className="r-footer-link">Contact</Link>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid rgba(13,13,13,0.12)", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: "0.12em", opacity: 0.4 }}>RIVIX</span>
          <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6560" }}>© 2025 Rivix. All rights reserved.</span>
        </footer>

      </div>
    </>
  );
}