
// app/sections/ReturnPolicyPage.js

const sections = [
  {
    title: "Return Window",
    paragraphs: [
      "RIVIX accepts eligible return requests within five days (120 hours) from the fulfillment date recorded for your order. The return request must be submitted through the My Orders section of your RIVIX account within this period.",
      "The return window is calculated from the fulfillment timestamp recorded in our order system, not the date you open or receive a notification. Once this period expires, the online return request option will no longer be available.",
      "If you believe your order was incorrectly marked as fulfilled or you are unable to submit a request due to a technical issue, contact our support team with your order details.",
    ],
  },
  {
    title: "Return Eligibility",
    paragraphs: [
      "Returns are reviewed individually and are subject to approval by RIVIX. A return request does not automatically guarantee a refund or exchange.",
      "To qualify for a return, the product should generally be unused, unworn, unwashed, unaltered and in its original condition. Original tags, packaging and accessories should be retained wherever applicable.",
      "Products showing signs of use, washing, accidental damage, alteration or mishandling may be considered ineligible after inspection.",
      "For damaged, defective, misprinted or incorrect products, customers may be asked to provide photographs, an unboxing video and images of the original packaging to help us verify the issue.",
    ],
  },
  {
    title: "Non-Returnable Conditions",
    paragraphs: [
      "The following circumstances may not qualify for a return, refund or exchange:",
    ],
    bullets: [
      "Products that have been worn, washed, used, altered or damaged after delivery.",
      "Damage caused by improper handling, washing, ironing, storage or accidental use.",
      "Minor printing or colour variations that are inherent to the printing process and do not constitute a product defect.",
      "Apparel measurement differences within the standard manufacturing tolerance of ±0.5 inches.",
      "Products returned without prior approval or contrary to the return instructions provided by RIVIX.",
      "Requests submitted outside the applicable return window, except where otherwise required by applicable law.",
    ],
    note: "These conditions do not exclude legitimate claims for products that are defective, incorrectly supplied or otherwise covered by applicable consumer protection laws.",
  },
  {
    title: "Damaged, Defective or Misprinted Products",
    paragraphs: [
      "If your product arrives damaged, defective, misprinted or materially different from what you ordered, submit a return request through My Orders within the applicable five-day return window.",
      "To help us investigate and verify the issue, please provide:",
    ],
    bullets: [
      "Clear photographs showing the affected area of the product.",
      "A complete unboxing video, preferably showing the unopened package and the product being removed.",
      "Photographs of the original courier packaging and shipping label.",
      "Your order number and a clear description of the issue.",
    ],
    note: "Please retain the original product and packaging until your request has been reviewed. Evidence helps us establish whether the issue occurred during production, printing, packing or transit. Each claim is assessed individually.",
  },
  {
    title: "Wrong Size, Fit and Measurement Differences",
    paragraphs: [
      "Please review the product size chart before placing an order. Since apparel is manufactured and printed through a production process, minor measurement variations may occur.",
      "A measurement variation of up to ±0.5 inches is considered a standard manufacturing tolerance and does not, by itself, qualify as a manufacturing defect.",
      "If you receive a product with a size different from the size ordered, submit a return request and provide photographs of the product label and relevant measurements.",
      "If you selected the wrong size while placing your order or the product does not fit according to your personal preference, the request will be reviewed separately. Any approved exchange or replacement may involve additional costs, including production and shipping charges.",
    ],
  },
  {
    title: "Printing and Colour Variations",
    paragraphs: [
      "RIVIX products may use digital printing and other print-on-demand production methods. Actual print colours may vary slightly from the colours displayed on your screen due to differences in display settings, lighting, fabric and printing processes.",
      "Minor variations in colour, shade or print appearance that fall within normal production tolerances are not automatically considered defects.",
      "Significant misprints, incorrect artwork, missing design elements or substantial printing defects may qualify for a return or replacement after review.",
    ],
  },
  {
    title: "How to Submit a Return Request",
    paragraphs: [
      "Return requests must be initiated through your RIVIX account. Follow these steps:",
    ],
    bullets: [
      "Sign in to your RIVIX account.",
      "Open the My Orders section.",
      "Locate the fulfilled order and select the eligible product.",
      "Choose the appropriate return reason and provide a clear explanation.",
      "Submit the return request.",
      "Monitor the request status in My Orders for updates from RIVIX.",
    ],
    note: "Each product in an order is reviewed separately. If your order contains multiple products, submitting a request for one product does not automatically create a return request for the remaining products.",
  },
  {
    title: "Return Review and Approval",
    paragraphs: [
      "After receiving your request, RIVIX will review the selected reason, description and any supporting evidence. We may contact you for additional photographs, measurements or information before making a decision.",
      "Your request may be approved or rejected based on the available information, product condition and applicable return conditions.",
      "If approved, RIVIX will provide the applicable return instructions. Do not ship or hand over a product before receiving confirmation and instructions from our team.",
      "If a request is rejected, the reason recorded by our team will be displayed in your order's return updates.",
    ],
  },
  {
    title: "Return Pickup and Shipping",
    paragraphs: [
      "After a return is approved, RIVIX will determine the appropriate return-shipping arrangement. Depending on the reason for the return, product condition and service availability, we may arrange a reverse pickup or provide other return instructions.",
      "Pickup details, where applicable, may include the courier service, tracking reference and scheduled pickup date. These details will be displayed in your order's return updates when recorded by RIVIX.",
      "Return shipping costs may depend on the circumstances of the return. Where the issue is verified as an incorrect, defective, damaged or misprinted product attributable to our production or fulfilment process, RIVIX will review and communicate the appropriate shipping arrangement.",
      "For customer-selected wrong sizes, fit preferences or other non-defective returns, additional shipping, production or replacement costs may apply. These costs will be communicated before proceeding.",
      "Please pack the product securely and retain the courier receipt or tracking information until the return process is completed.",
    ],
  },
  {
    title: "Inspection of Returned Products",
    paragraphs: [
      "All returned products are subject to inspection after they are received. Our team will assess the product's condition and compare it with the reason and evidence submitted in the return request.",
      "If the product meets the applicable return conditions, the request will proceed to refund or exchange processing, depending on the resolution approved by RIVIX.",
      "If the returned product does not meet the applicable conditions, RIVIX may reject the return after inspection and communicate the decision to the customer.",
      "A return being marked as received means the physical product has reached us. It does not mean that the refund or exchange has already been completed.",
    ],
  },
  {
    title: "Refunds",
    paragraphs: [
      "Refunds are available only when a refund has been approved as the resolution for an eligible return.",
      "After the returned product has been received and passed inspection, RIVIX will process the approved refund manually. Depending on the original payment method and the circumstances of the transaction, the refund may be issued through an appropriate payment channel.",
      "The refund amount and transaction reference, where applicable, will be recorded in your order's return updates after processing.",
      "The time taken for the refunded amount to appear in your account may depend on the payment method, bank or payment provider.",
      "For Cash on Delivery orders, additional payment details may be required to arrange the refund. Please provide such details only through an official and secure RIVIX support channel.",
      "A return request being submitted, approved or marked as received does not mean that a refund has already been issued.",
    ],
  },
  {
    title: "Exchanges and Replacements",
    paragraphs: [
      "RIVIX may approve an exchange instead of a refund, depending on the return reason, product condition and availability.",
      "After the return has been approved and the original product has been received and inspected, our team will arrange the approved replacement process.",
      "Exchanges are subject to product availability, production requirements, shipping serviceability and any applicable additional charges.",
      "Once the replacement has been arranged or dispatched, the relevant replacement order or shipment reference may be displayed in your My Orders return updates.",
      "An exchange is considered complete only after RIVIX has recorded the completion of the approved replacement process.",
    ],
  },
  {
    title: "Delivery Issues and Return to Origin",
    paragraphs: [
      "An order may be marked as undelivered or returned to origin (RTO) if the courier cannot complete delivery.",
      "Common reasons include an incomplete or incorrect address, an unserviceable PIN code, the recipient being unavailable, failure to accept a Cash on Delivery order, refusal of delivery or other courier-related circumstances.",
      "Please ensure that your shipping address, contact number and PIN code are accurate and that someone is available to receive the package.",
      "An undelivered or RTO order is different from a customer-initiated return after successful delivery. Such orders are reviewed separately, and refunds or reshipment are subject to the circumstances of the failed delivery and applicable policies.",
    ],
  },
  {
    title: "Policy Limitations and Customer Support",
    paragraphs: [
      "RIVIX reserves the right to review each return request, request supporting evidence and verify the product's condition before approving a refund or exchange.",
      "We do not guarantee that every return request will be approved. All decisions will be based on the available evidence, the condition of the returned product, the circumstances of the order and applicable consumer protection laws.",
      "Nothing in this policy is intended to limit any rights or remedies available to customers under applicable Indian consumer protection laws.",
      "For assistance with a return, refund, exchange or delivery issue, contact RIVIX through our official customer support channel and include your order number.",
    ],
  },
];

const policyHighlights = [
  "5-day return request window",
  "Admin-reviewed returns",
  "Refund or exchange resolution",
];

export default function ReturnPolicyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,0..40,300&display=swap');

        .return-policy {
          box-sizing: border-box;
        }

        .return-policy *,
        .return-policy *::before,
        .return-policy *::after {
          box-sizing: border-box;
        }

        .return-policy .return-section {
          scroll-margin-top: 32px;
        }

        .return-policy .return-nav-link:hover {
          color: #0d0d0d !important;
        }

        .return-policy .return-nav-link:hover .return-nav-number {
          color: #0d0d0d !important;
        }

        @media (max-width: 900px) {
          .return-policy .return-grid {
            grid-template-columns: 1fr !important;
          }

          .return-policy .return-sidebar {
            position: relative !important;
            top: 0 !important;
          }

          .return-policy .return-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .return-policy .return-footer-copy {
            text-align: left !important;
          }
        }

        @media (max-width: 640px) {
          .return-policy .return-padding {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .return-policy .delivery-strip {
            flex-direction: column !important;
            gap: 8px !important;
            text-align: center;
          }

          .return-policy .return-hero {
            padding-top: 64px !important;
            padding-bottom: 56px !important;
          }

          .return-policy .return-content {
            padding-top: 40px !important;
            padding-bottom: 64px !important;
          }
        }
      `}</style>

      <main
        className="return-policy"
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
          {policyHighlights.map((text) => (
            <span key={text} style={{ opacity: 0.8 }}>
              {text}
            </span>
          ))}
        </div>

        {/* HERO */}
        <section
          className="return-padding return-hero"
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
            RIVIX Legal
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
              maxWidth: 600,
              fontSize: 14,
              lineHeight: 1.75,
              color: "#6b6560",
              fontWeight: 300,
            }}
          >
            At RIVIX, every order is made with care. This policy explains
            how eligible returns are requested, reviewed, collected,
            inspected and resolved through refunds or exchanges.
          </p>

          <p
            style={{
              marginTop: 18,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#99918a",
            }}
          >
            Please review this policy before placing an order.
          </p>
        </section>

        {/* CONTENT GRID */}
        <section
          className="return-grid return-padding return-content"
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
                  className="return-nav-link"
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
                    className="return-nav-number"
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

          {/* POLICY SECTIONS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            {sections.map((section, index) => (
              <section
                key={section.title}
                id={`section-${index}`}
                className="return-section"
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
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      color: "#b8965a",
                      flexShrink: 0,
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

                <div
                  style={{
                    maxWidth: 760,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {section.paragraphs?.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      style={{
                        fontSize: 14,
                        lineHeight: 1.85,
                        color: "#6b6560",
                        fontWeight: 300,
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul
                      style={{
                        paddingLeft: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        listStyleType: "disc",
                      }}
                    >
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          style={{
                            paddingLeft: 4,
                            fontSize: 13,
                            lineHeight: 1.8,
                            color: "#6b6560",
                            fontWeight: 300,
                          }}
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.note && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: "16px 18px",
                        borderLeft: "2px solid #b8965a",
                        background: "#f8f7f5",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          lineHeight: 1.8,
                          color: "#6b6560",
                          fontWeight: 300,
                        }}
                      >
                        {section.note}
                      </p>
                    </div>
                  )}
                </div>
              </section>
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
              className="return-footer-copy"
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                maxWidth: 420,
                textAlign: "right",
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              We want every RIVIX order to reach you exactly as intended.
              Eligible returns are reviewed individually and handled
              with care.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
