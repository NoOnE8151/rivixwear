// app/sections/BrandStorySection.js

export default function BrandStorySection() {
  return (
    <section className="grid md:grid-cols-2">

      {/* Visual side */}
      <div className="relative overflow-hidden flex items-center justify-center bg-background-inverse min-h-150">
        <div className="absolute select-none pointer-events-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 200, color: "rgba(255,255,255,0.04)" }}>
          RVX
        </div>
        <div className="relative z-10 text-center">
          <svg viewBox="0 0 280 120" width="220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="8,110 38,18 76,110 52,110 38,62 24,110" fill="white" opacity="0.85" />
            <polygon points="38,18 76,18 76,50 52,50" fill="white" opacity="0.2" />
            <text x="90" y="98" fontFamily="'Bebas Neue', sans-serif" fontSize="90" letterSpacing="6" fill="white" opacity="0.85">
              RIVIX
            </text>
          </svg>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 20, fontFamily: "'DM Sans', sans-serif" }}>
            Est. 2026 · Chhattisgarh, India
          </div>
        </div>
      </div>

      {/* Content side */}
      <div id="about" className="flex flex-col justify-center px-10 md:px-20 py-24 bg-[#f5f0e8]">
        <div className="eyebrow reveal mb-6">Our Story</div>
        <blockquote className="reveal reveal-d1" style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(28px, 2.5vw, 40px)",
          fontStyle: "italic", lineHeight: 1.4, color: "var(--black)", marginBottom: 32,
        }}>
          &ldquo;Wear it like you mean it.&rdquo;
        </blockquote>
        <p className="reveal reveal-d2 text-foreground-muted" style={{
          fontSize: 14, lineHeight: 1.9, fontWeight: 300, marginBottom: 40,
        }}>
          Rivix was born from a simple frustration — premium streetwear was either
          unaffordable or unauthentically Indian. We wanted to fix that.
          <br /><br />
          Every piece we design starts with one question: would we actually wear
          this? The answer drives everything — the fabric weight, the silhouette,
          the logo placement, the price. Nothing is random.
          <br /><br />
          We&apos;re not chasing hype. We&apos;re building something that lasts.
          Welcome to Rivix.
        </p>
        <a href="#" className="story-cta reveal reveal-d3">
          Get Something For You →
        </a>
      </div>
    </section>
  );
}