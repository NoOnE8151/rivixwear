// app/sections/Footer.js
const shopLinks    = ["New Arrivals", "All Products"];
const helpLinks    = ["Size Guide", "Shipping Info", "Returns Policy", "Contact Us"];
const companyLinks = ["Our Story", "Privacy Policy", "Terms of Service"];

const colTitle = {
  fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
  color: "white", marginBottom: 24, fontWeight: 500,
};

export default function Footer() {
  return (
    <footer style={{ background: "#050505", color: "rgba(255,255,255,0.5)", padding: "72px 72px 40px" }}>
      <div className="grid gap-14" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", marginBottom: 64 }}>

        {/* Brand */}
        <div>
          <a href="#" className="flex items-center gap-2 no-underline mb-5">
           <img src="logo-wordmark-black.png" alt="" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.12em", color: "white" }}>
              RIVIX
            </span>
          </a>
          <p style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", marginBottom: 28, maxWidth: 240 }}>
            Premium streetwear. Built in India. Worn everywhere. Define your direction.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/rivixwear?igsh=NHB5NWNnNWR5Z2hi" target="_blank">
            <img src="/assets/logo/brand/instagram.svg" alt="instagram" className="w-7" />
            </a>
            <a href="https://wa.link/upp53l" target="_blank">
            <img src="/assets/logo/brand/whatsapp.svg" alt="whatsapp" className="w-7" />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <div style={colTitle}>Shop</div>
          <ul className="flex flex-col gap-3 list-none">
            {shopLinks.map((l) => <li key={l}><a href="#" className="footer-link">{l}</a></li>)}
          </ul>
        </div>

        {/* Help */}
        <div>
          <div style={colTitle}>Help</div>
          <ul className="flex flex-col gap-3 list-none">
            {helpLinks.map((l) => <li key={l}><a href="#" className="footer-link">{l}</a></li>)}
          </ul>
        </div>

        {/* Company */}
        <div>
          <div style={colTitle}>Company</div>
          <ul className="flex flex-col gap-3 list-none">
            {companyLinks.map((l) => <li key={l}><a href="#" className="footer-link">{l}</a></li>)}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
          © 2026 Rivix. All rights reserved. Made with intent.
        </div>
        <div className="flex items-center gap-3">
          {["UPI", "Visa", "Mastercard", "COD", "RazorPay"].map((p) => (
            <div key={p} style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 3, padding: "4px 10px",
              fontSize: 9, letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
            }}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}