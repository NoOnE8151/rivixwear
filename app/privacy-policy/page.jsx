export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "When you interact with the RIVIX website, we may collect personal information such as your name, email address, phone number, shipping address, billing address, and order-related details required to process purchases and improve your experience.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Your information is used to process orders, manage deliveries, provide customer support, improve website functionality, prevent fraud, and communicate important updates related to your purchases or our brand.",
    },
    {
      title: "Payments & Security",
      content:
        "Payments are securely processed through trusted third-party payment gateways. RIVIX does not store complete debit card, credit card, or banking details. We take reasonable measures to protect customer data and website security.",
    },
    {
      title: "Cookies & Analytics",
      content:
        "Our website may use cookies and analytics tools to improve browsing experience, remember preferences, and understand how visitors interact with the store. These tools help us optimize performance and user experience.",
    },
    {
      title: "Third-Party Services",
      content:
        "We may share limited necessary information with trusted third-party services including payment providers, shipping partners, analytics platforms, and marketing tools required to operate the website and fulfill orders.",
    },
    {
      title: "Marketing Communication",
      content:
        "RIVIX may send updates regarding launches, offers, orders, or brand announcements through email, SMS, WhatsApp, or other communication channels. Users may opt out of promotional communication at any time.",
    },
    {
      title: "Data Protection",
      content:
        "We take reasonable steps to protect customer information against unauthorized access, misuse, disclosure, or loss. However, no online platform can guarantee absolute security.",
    },
    {
      title: "Your Rights",
      content:
        "You may request access, correction, or deletion of your personal information by contacting us directly. Certain information may be retained where legally or operationally required.",
    },
    {
      title: "Policy Updates",
      content:
        "RIVIX reserves the right to modify or update this Privacy Policy at any time without prior notice. Continued use of the website after updates are posted constitutes acceptance of those changes.",
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
          .privacy-grid {
            grid-template-columns: 1fr !important;
          }

          .privacy-sidebar {
            position: relative !important;
            top: 0 !important;
          }

          .privacy-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 640px) {
          .privacy-padding {
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
          className="delivery-strip privacy-padding"
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
          className="privacy-padding"
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
            Privacy
            <br />
            Policy.
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
            Your privacy matters. This Privacy Policy explains how RIVIX
            collects, uses, stores, and protects your information while using
            our website or purchasing from our store.
          </p>
        </section>

        {/* CONTENT GRID */}
        <section
          className="privacy-grid privacy-padding"
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
            className="privacy-sidebar"
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
            className="privacy-footer privacy-padding"
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
              the privacy practices outlined above.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
