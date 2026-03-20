import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export const metadata: Metadata = {
  title: "About – LuxEscape",
  description: "LuxEscape is a training and education project inspired by luxury travel platforms.",
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 72 }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          paddingTop: 100,
          paddingBottom: 80,
          background: "linear-gradient(180deg, var(--clr-surface) 0%, var(--clr-bg) 100%)",
          borderBottom: "1px solid var(--clr-border)",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--clr-gold)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ display: "inline-block", width: 36, height: 1, background: "var(--clr-gold)" }} />
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "var(--clr-cream)",
              maxWidth: 600,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            The World's Finest Escapes, Within Reach
          </h1>
          <p
            style={{
              color: "var(--clr-text-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: 560,
            }}
          >
            LuxEscape believes that extraordinary travel should be accessible. We partner with the world's finest hotels and resorts to bring you insider prices — without compromising on the luxury experience.
          </p>
        </div>
      </section>

      {/* Training Disclaimer */}
      <section className="section" style={{ background: "var(--clr-bg)" }}>
        <div className="container">
          <div
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "var(--radius-md)",
              padding: "28px 32px",
              marginBottom: 64,
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--clr-gold)",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              ⚠️ Important Disclaimer
            </p>
            <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem", lineHeight: 1.8 }}>
              <strong style={{ color: "var(--clr-cream)" }}>LuxEscape is a training and education project only.</strong>{" "}
              It was built to demonstrate full-stack Next.js development skills and modern web design patterns. No real bookings, payments, or services are offered. All deals and prices shown are fictional and do not represent actual products. This site is not affiliated with, endorsed by, or related to LuxuryEscapes.com.
            </p>
          </div>

          {/* Mission */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              marginBottom: 64,
            }}
            className="about-grid"
          >
            <div>
              <p className="section-label">
                <span className="gold-line" />
                Our Mission
              </p>
              <h2 className="section-title" style={{ fontSize: "1.8rem", marginBottom: 16 }}>
                Inspiring the Art of Luxury Travel
              </h2>
              <p style={{ color: "var(--clr-text-muted)", lineHeight: 1.8, fontSize: "0.9rem", marginBottom: 16 }}>
                We curate the world's most exceptional travel experiences — from overwater bungalows in the Maldives to cliff-top villas in Santorini — and make them available at prices that defy expectation.
              </p>
              <p style={{ color: "var(--clr-text-muted)", lineHeight: 1.8, fontSize: "0.9rem" }}>
                Our editorial team hand-picks each property, ensuring every detail meets our exacting standards for luxury, authenticity and value.
              </p>
            </div>
            <div>
              <p className="section-label">
                <span className="gold-line" />
                How It Works
              </p>
              <h2 className="section-title" style={{ fontSize: "1.8rem", marginBottom: 20 }}>
                Simple. Curated. Exclusive.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { step: "01", text: "We negotiate directly with luxury hotels to secure exclusive, limited-time rates." },
                  { step: "02", text: "Our editorial team curates only the properties meeting our quality threshold." },
                  { step: "03", text: "You book with confidence knowing every deal is verified and price-matched." },
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", gap: 16 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.4rem",
                        color: "var(--clr-gold)",
                        opacity: 0.5,
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      {s.step}
                    </span>
                    <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--clr-surface), var(--clr-surface2))",
              border: "1px solid var(--clr-border)",
              borderRadius: "var(--radius-lg)",
              padding: "52px 40px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2rem",
                color: "var(--clr-cream)",
                marginBottom: 12,
              }}
            >
              Ready to Explore?
            </h2>
            <p style={{ color: "var(--clr-text-muted)", marginBottom: 28 }}>
              Browse our curated collection of luxury escapes.
            </p>
            <Link href="/deals" className="btn-primary">
              View All Deals <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
