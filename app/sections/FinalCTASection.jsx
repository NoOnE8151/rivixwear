// app/sections/FinalCTASection.js

export default function FinalCTASection() {
  const trust = [
    { icon: "🔒", label: "100% Secure Checkout" },
    { icon: "📦", label: "COD Available" },
    { icon: "↩️", label: "7-Day Returns" },
    { icon: "⚡", label: "Ships in 48 Hours" },
  ];

  return (
    <section className="relative overflow-hidden text-center px-6 md:px-18 py-28 md:py-36 bg-background-inverse text-foreground-inverse">

      {/* Ghost bg text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="select-none" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(120px, 22vw, 300px)",
          color: "rgba(255,255,255,0.025)",
          whiteSpace: "nowrap",
        }}>
          RIVIX
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="eyebrow eyebrow-gold reveal justify-center mb-6">Drop One — Live Now</div>
        <h2 className="reveal reveal-d1" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(56px, 6vw, 96px)",
          letterSpacing: "0.03em", lineHeight: 0.95, marginBottom: 24,
        }}>
          DON&apos;T MISS<br />
          <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "0.75em" }}>
            Your Size.
          </em>
        </h2>

        <p className="reveal reveal-d2 mx-auto" style={{
          fontSize: 14, color: "rgba(255,255,255,0.45)",
          maxWidth: 480, lineHeight: 1.8, fontWeight: 300, marginBottom: 48,
        }}>
          Limited units. No restocks promised. If it&apos;s gone, it&apos;s gone.
          This is your direction — take it.
        </p>

        <div className="flex justify-center items-center gap-6 flex-wrap reveal reveal-d3">
          <a href="#" className="btn-primary"><span>Shop the Drop</span></a>
          <a href="#" className="btn-outline">Size Guide</a>
        </div>

        {/* Trust row */}
        <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap mt-20 pt-12 reveal"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-2"
              style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}