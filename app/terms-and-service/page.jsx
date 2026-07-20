export default function TermsServicePage() {
  const sections = [
    {
      title: "General",
      content:
        "RIVIX is a premium streetwear clothing brand offering apparel and related products through our online store. By accessing or using this website, you confirm that you are at least 18 years old or using the website under parental supervision. You also agree that the information you provide is accurate and complete.",
    },
    {
      title: "Products & Availability",
      content:
        "All products listed on the website are subject to availability. We reserve the right to modify, discontinue, or limit quantities of any product without prior notice. Product colors and appearance may vary slightly depending on screen settings, lighting, or manufacturing differences.",
    },
    {
      title: "Pricing & Payments",
      content:
        "All prices listed on the website are displayed in INR (Indian Rupees). We accept UPI, debit cards, credit cards, wallets, net banking, and Cash on Delivery where available. Orders are confirmed only after successful payment verification or order confirmation.",
    },
    {
      title: "Shipping & Delivery",
      content:
        "Orders are generally processed within 1–3 business days. Delivery timelines may vary depending on location, courier delays, or public holidays. Customers are responsible for providing accurate shipping information. RIVIX is not responsible for delays caused by incorrect address details.",
    },
    {
      title: "Returns & Exchanges",
      content:
        "Returns or exchanges are accepted only for damaged, defective, or incorrect products delivered. Requests must be made within 48 hours of delivery along with clear proof of the issue. Returned products must remain unused, unwashed, and in original condition.",
    },
    {
      title: "Intellectual Property",
      content:
        "All website content including logos, graphics, product designs, images, branding elements, and text are the intellectual property of RIVIX. Unauthorized copying, reproduction, or commercial use is strictly prohibited.",
    },
    {
      title: "User Conduct",
      content:
        "Users may not misuse the website, attempt unauthorized access, interfere with functionality, or engage in unlawful activities while using the platform. RIVIX reserves the right to block access or cancel orders in cases of suspicious activity.",
    },
    {
      title: "Limitation of Liability",
      content:
        "RIVIX shall not be held responsible for indirect, incidental, or consequential damages arising from use of the website, delayed deliveries caused by third parties, or temporary website interruptions.",
    },
    {
      title: "Changes to Terms",
      content:
        "RIVIX reserves the right to update or modify these Terms of Service at any time without prior notice. Continued use of the website after changes are posted constitutes acceptance of those changes.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #ffffff;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 900px) {
          .terms-grid {
            grid-template-columns: 1fr !important;
          }

          .terms-sidebar {
            position: relative !important;
            top: 0 !important;
          }

          .terms-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 640px) {
          .terms-padding {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .delivery-strip {
            flex-direction: column !important;
            gap: 8px !important;
            text-align: center;
          }
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          color: "#0d0d0d",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* DELIVERY STRIP */}
        <div
          className="delivery-strip terms-padding"
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
          }}
        >
          {[
            "Free shipping above ₹999",
            "Cash on delivery available",
            "Easy 15-day returns",
          ].map((t, i) => (
            <span key={i} style={{ opacity: 0.8 }}>
              {t}
            </span>
          ))}
        </div>

        {/* HERO */}
        <section
          className="terms-padding"
          style={{
            borderBottom: "1px solid rgba(13,13,13,0.12)",
            padding: "80px 48px 72px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#b8965a",
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            Rivix Legal
          </p>

          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(64px, 10vw, 120px)",
              letterSpacing: "0.03em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Terms of
            <br />
            Service.
          </h1>

          <p
            style={{
              maxWidth: 560,
              fontSize: 14,
              lineHeight: 1.75,
              color: "#6b6560",
              fontWeight: 300,
            }}
          >
            These Terms of Service govern your use of the RIVIX website,
            products, and services. By accessing or purchasing from our store,
            you agree to the terms outlined below.
          </p>
        </section>

        {/* CONTENT GRID */}
        <section
          className="terms-grid terms-padding"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "64px 48px 96px",
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "0 64px",
            alignItems: "start",
          }}
        >
          {/* SIDEBAR */}
          <aside
            className="terms-sidebar"
            style={{
              position: "sticky",
              top: 32,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8965a",
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              Sections
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    color: "#6b6560",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(13,13,13,0.08)",
                    transition: "color 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 11,
                      color: "#b8965a",
                      letterSpacing: "0.08em",
                      minWidth: 22,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {section.title}
                </a>
              ))}
            </div>
          </aside>

          {/* SECTIONS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {sections.map((section, index) => (
              <div
                key={section.title}
                id={`section-${index}`}
                style={{
                  padding: "40px 0",
                  borderBottom: "1px solid rgba(13,13,13,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      color: "#b8965a",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 36,
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: "#6b6560",
                    fontWeight: 300,
                    maxWidth: 680,
                  }}
                >
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid rgba(13,13,13,0.12)",
            background: "#0d0d0d",
          }}
        >
          <div
            className="terms-footer terms-padding"
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              padding: "40px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28,
                  letterSpacing: "0.2em",
                  color: "#ffffff",
                }}
              >
                RIVIX
              </h3>

              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#b8965a",
                  marginTop: 4,
                }}
              >
                Built to Rise.
              </p>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.35)",
                maxWidth: 400,
                textAlign: "right",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              By continuing to use this website, you acknowledge and agree to
              the terms outlined above.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}