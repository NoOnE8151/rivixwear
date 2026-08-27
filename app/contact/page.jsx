"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitStatus("");

    try {
      // Replace this URL with your backend endpoint later
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    border: "none",
    borderBottom: "1px solid rgba(13,13,13,0.16)",
    outline: "none",
    padding: "14px 0",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    color: "#0d0d0d",
    background: "transparent",
  };

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

        .contact-input::placeholder {
          color: #aaa39c;
        }

        .contact-input:focus {
          border-bottom-color: #b8965a !important;
        }

        .contact-textarea {
          resize: vertical;
          min-height: 150px;
        }

        .contact-submit:hover {
          background: #b8965a !important;
          border-color: #b8965a !important;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }

          .contact-info {
            padding-right: 0 !important;
            padding-bottom: 56px;
            border-right: none !important;
            border-bottom: 1px solid rgba(13,13,13,0.12);
          }
        }

        @media (max-width: 640px) {
          .contact-padding {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .contact-hero {
            padding-top: 64px !important;
            padding-bottom: 56px !important;
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
          className="contact-padding"
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
          ].map((text, index) => (
            <span key={index} style={{ opacity: 0.8 }}>
              {text}
            </span>
          ))}
        </div>

        {/* HERO */}
        <section
          className="contact-hero contact-padding"
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
            Get In Touch
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
            Contact
            <br />
            RIVIX.
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
            Have a question about an order, product, return, or anything else?
            Send us a message and we'll get back to you.
          </p>
        </section>

        {/* CONTACT CONTENT */}
        <section
          className="contact-grid contact-padding"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "80px 48px 120px",
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "0 100px",
            alignItems: "start",
          }}
        >
          {/* CONTACT INFO */}
          <div
            className="contact-info"
            style={{
              paddingRight: 60,
              borderRight: "1px solid rgba(13,13,13,0.12)",
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8965a",
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              Contact
            </p>

            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 42,
                letterSpacing: "0.04em",
                lineHeight: 1,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Let's Talk.
            </h2>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.8,
                color: "#6b6560",
                fontWeight: 300,
                marginBottom: 40,
              }}
            >
              Whether you need help with your order or simply want to reach
              out, we're here to help.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#b8965a",
                    marginBottom: 7,
                  }}
                >
                  Email
                </p>

                <p
                  style={{
                    fontSize: 13,
                    color: "#0d0d0d",
                  }}
                >
                  support@rivix.in
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#b8965a",
                    marginBottom: 7,
                  }}
                >
                  Response Time
                </p>

                <p
                  style={{
                    fontSize: 13,
                    color: "#6b6560",
                  }}
                >
                  Usually within 24–48 hours
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
              maxWidth: 720,
            }}
          >
            {/* NAME */}
            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0d0d0d",
                  marginBottom: 4,
                }}
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="contact-input"
                style={inputStyle}
                {...register("name", {
                  required: "Please enter your name.",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters.",
                  },
                })}
              />

              {errors.name && (
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "#a34a3b",
                  }}
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0d0d0d",
                  marginBottom: 4,
                }}
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="contact-input"
                style={inputStyle}
                {...register("email", {
                  required: "Please enter your email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
              />

              {errors.email && (
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "#a34a3b",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* SUBJECT */}
            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="subject"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0d0d0d",
                  marginBottom: 4,
                }}
              >
                Subject
              </label>

              <input
                id="subject"
                type="text"
                placeholder="What can we help you with?"
                className="contact-input"
                style={inputStyle}
                {...register("subject", {
                  required: "Please enter a subject.",
                  minLength: {
                    value: 3,
                    message: "Subject must be at least 3 characters.",
                  },
                })}
              />

              {errors.subject && (
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "#a34a3b",
                  }}
                >
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* MESSAGE */}
            <div style={{ marginBottom: 40 }}>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0d0d0d",
                  marginBottom: 4,
                }}
              >
                Message
              </label>

              <textarea
                id="message"
                placeholder="Write your message..."
                className="contact-input contact-textarea"
                style={inputStyle}
                {...register("message", {
                  required: "Please enter your message.",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters.",
                  },
                })}
              />

              {errors.message && (
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "#a34a3b",
                  }}
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* STATUS */}
            {submitStatus === "success" && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "14px 16px",
                  background: "rgba(184,150,90,0.08)",
                  border: "1px solid rgba(184,150,90,0.2)",
                  fontSize: 12,
                  color: "#6b6560",
                  lineHeight: 1.6,
                }}
              >
                Your message has been sent successfully. We'll get back to
                you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "14px 16px",
                  background: "rgba(163,74,59,0.06)",
                  border: "1px solid rgba(163,74,59,0.15)",
                  fontSize: 12,
                  color: "#a34a3b",
                  lineHeight: 1.6,
                }}
              >
                Something went wrong while sending your message. Please try
                again.
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="contact-submit"
              style={{
                width: "100%",
                padding: "17px 24px",
                border: "1px solid #0d0d0d",
                background: "#0d0d0d",
                color: "#ffffff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: isSubmitting ? "wait" : "pointer",
                transition: "all 0.2s ease",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid rgba(13,13,13,0.12)",
            background: "#0d0d0d",
          }}
        >
          <div
            className="contact-padding"
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
              Questions, feedback, or just want to talk? We're always listening.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}