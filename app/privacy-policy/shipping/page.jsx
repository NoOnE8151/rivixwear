// app/sections/ShippingInfoPage.js
const sections = [
  {
    title: "Shipping Coverage",
    content:
      "RIVIX delivers orders across India. We work with reliable third-party courier and logistics services to deliver your order to the address provided during checkout. Courier partners may vary depending on your location, availability, and delivery requirements.",
  },
  {
    title: "Shipping Charges",
    content:
      "Shipping charges, if applicable, are calculated and displayed during checkout before you place your order. RIVIX may offer free shipping on eligible orders or during selected promotions. Any applicable shipping conditions will be clearly mentioned at the time of purchase.",
  },
  {
    title: "Processing Time",
    content:
      "Orders are generally processed and prepared for dispatch after successful payment confirmation. Processing may take additional time during weekends, public holidays, product launches, promotional periods, or periods of unusually high order volume.",
  },
  {
    title: "Delivery Time",
    content:
      "Delivery times depend on your location and the courier service assigned to your order. Estimated delivery timelines are provided as a general indication and are not guaranteed. Remote locations, adverse weather, public holidays, operational disruptions, or other circumstances beyond our control may cause delays.",
  },
  {
    title: "Order Tracking",
    content:
      "Once your order has been dispatched, tracking information may be shared with you through the contact details provided during checkout. You can use the tracking information to follow the progress of your shipment through the assigned courier service.",
  },
  {
    title: "Courier Partners",
    content:
      "RIVIX may use third-party courier and logistics providers such as Delhivery, Blue Dart, or other suitable delivery services. These providers are independent service providers and are not partners, affiliates, or representatives of RIVIX. The courier assigned to an order may vary based on operational requirements and destination.",
  },
  {
    title: "Delivery Issues",
    content:
      "If a delivery attempt is unsuccessful because of an incorrect address, unavailable recipient, incomplete contact information, or other customer-related reasons, additional delivery attempts or further instructions may be required. Please ensure that your shipping details and contact information are accurate before placing an order.",
  },
  {
    title: "Delayed or Lost Orders",
    content:
      "While RIVIX works to ensure orders are dispatched and delivered efficiently, delays may occur due to circumstances outside our control. If your order appears significantly delayed or is reported as lost in transit, please contact us with your order details so we can assist in coordinating with the relevant courier service.",
  },
  {
    title: "Damaged Packages",
    content:
      "If your package appears visibly damaged or tampered with at the time of delivery, please document the condition of the package and contact RIVIX as soon as possible. Providing photographs or other relevant information may help us investigate the issue with the delivery provider and determine the appropriate resolution.",
  },
  {
    title: "Address Changes",
    content:
      "Please carefully verify your shipping address before completing your purchase. If you need to change the delivery address after placing an order, contact us as soon as possible. Address changes may not be possible once an order has been dispatched.",
  },
];

export default function ShippingInfoPage() {
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
          .shipping-grid {
            grid-template-columns: 1fr !important;
          }

          .shipping-sidebar {
            position: relative !important;
            top: 0 !important;
          }

          .shipping-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 640px) {
          .shipping-padding {
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
          className="delivery-strip shipping-padding"
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
          className="shipping-padding"
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
            Rivix Information
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
            Shipping
            <br />
            Info.
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
            Everything you need to know about how RIVIX processes, ships, and
            delivers your orders across India.
          </p>
        </section>

        {/* CONTENT GRID */}
        <section
          className="shipping-grid shipping-padding"
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
            className="shipping-sidebar"
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
            className="shipping-footer shipping-padding"
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
              We deliver across India through reliable third-party courier and
              logistics services to get your RIVIX order to you.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}