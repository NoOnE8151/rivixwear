// app/sections/ReturnPolicyPage.js
const sections = [
  {
    title: "Return Window",
    content:
      "RIVIX accepts eligible return requests within 7 days of delivery. The return period begins from the date your order is marked as delivered. Requests submitted after this period may not be eligible for a return.",
  },
  {
    title: "Return Eligibility",
    content:
      "To be eligible for a return, the product must be unused, unworn, unwashed, and in its original condition. The product should include its original tags, packaging, and other accessories provided with the order. Items that show signs of use, washing, damage, or alteration may not be accepted.",
  },
  {
    title: "Non-Returnable Items",
    content:
      "Certain products or orders may not be eligible for return where specified on the product page or at the time of purchase. Items that have been worn, washed, damaged, altered, or otherwise used may also be excluded from the return policy.",
  },
  {
    title: "Return Request",
    content:
      "To initiate a return, contact RIVIX through our customer support channel with your order number and the reason for the return. We may request photographs or additional information to verify the condition of the product before approving the return.",
  },
  {
    title: "Return Approval",
    content:
      "Once your return request is reviewed and approved, you will receive instructions regarding the return process. Please do not send products back without receiving return instructions from RIVIX, as unauthorized returns may not be accepted or processed.",
  },
  {
    title: "Return Shipping",
    content:
      "Return shipping arrangements may depend on the reason for the return and the condition of the product. If the return is due to an incorrect, defective, damaged, or otherwise eligible product issue attributable to RIVIX, we will provide appropriate assistance. For other eligible returns, applicable return shipping conditions may apply.",
  },
  {
    title: "Quality Inspection",
    content:
      "All returned products are subject to inspection after they are received. The product must meet the eligibility requirements stated in this policy. If the returned item does not meet those requirements, RIVIX may reject the return and the product may be sent back to the customer.",
  },
  {
    title: "Refunds",
    content:
      "Once an approved return passes inspection, the applicable refund will be processed through the original payment method where possible. The time required for the refund to appear in your account may depend on your payment provider or bank.",
  },
  {
    title: "Exchange Requests",
    content:
      "If you need a different size or product, please contact us regarding availability. Exchanges may depend on stock availability and may be handled separately from the standard return process.",
  },
  {
    title: "Damaged or Incorrect Items",
    content:
      "If you receive a damaged, defective, or incorrect product, please contact RIVIX as soon as possible after delivery. Provide your order number along with clear photographs or other relevant details so that we can review the issue and assist with the appropriate resolution.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,0..40,300&display=swap');

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
          .return-grid {
            grid-template-columns: 1fr !important;
          }

          .return-sidebar {
            position: relative !important;
            top: 0 !important;
          }

          .return-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 640px) {
          .return-padding {
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
          className="delivery-strip return-padding"
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
          className="return-padding"
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
            Return
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
            Our return policy explains when and how eligible RIVIX products can
            be returned, inspected, and refunded.
          </p>
        </section>

        {/* CONTENT GRID */}
        <section
          className="return-grid return-padding"
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
            className="return-sidebar"
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
            className="return-footer return-padding"
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
              We want every RIVIX order to reach you exactly as intended.
              Eligible returns are handled with care and reviewed individually.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}