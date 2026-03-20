"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { FiArrowRight, FiShield, FiAward, FiHeart } from "react-icons/fi";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/data/deals";

/* ── Category icons (emoji for ultra-light approach) ── */
const categories = [
  { label: "Beach & Islands", icon: "🏖️", cat: "beach" },
  { label: "City Breaks",     icon: "🌆", cat: "city" },
  { label: "Adventure",       icon: "🏔️", cat: "adventure" },
  { label: "Wellness & Spa",  icon: "🧘", cat: "wellness" },
];

const pillars = [
  { icon: <FiAward size={24} />, title: "Hand-Picked Properties", body: "Every property is curated by our editorial team for quality, value and experience." },
  { icon: <FiShield size={24} />, title: "Best Price Guarantee", body: "Find it cheaper elsewhere and we'll match it, no questions asked." },
  { icon: <FiHeart size={24} />, title: "5-Star Support", body: "Our travel specialists are available 24/7 to help you plan the perfect escape." },
];

/* ── Fade-in wrapper ── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function HomeClient({ featuredDeals }: { featuredDeals: Deal[] }) {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.35)",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(8,8,17,0.7) 0%, rgba(8,8,17,0.2) 60%, rgba(8,8,17,0.8) 100%)",
          }}
        />
        {/* Gold beam */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "5%",
            width: 320,
            height: 320,
            background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--clr-gold)",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ display: "inline-block", width: 36, height: 1, background: "var(--clr-gold)" }} />
              Curated Luxury Escapes
            </p>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                color: "var(--clr-cream)",
                lineHeight: 1.08,
                maxWidth: 700,
                marginBottom: 24,
                fontWeight: 300,
              }}
            >
              Your World-Class
              <br />
              <em style={{ color: "var(--clr-gold)", fontStyle: "italic" }}>Escape</em> Awaits
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "rgba(232,228,216,0.72)",
                maxWidth: 520,
                marginBottom: 40,
                lineHeight: 1.75,
              }}
            >
              Handpicked luxury hotels and resorts at insider prices — up to 60% off. Curated for the discerning traveller.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/deals" className="btn-primary">
                Explore Deals <FiArrowRight />
              </Link>
              <Link href="/about" className="btn-outline">
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              display: "flex",
              gap: 40,
              marginTop: 72,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "Luxury Properties" },
              { value: "60%", label: "Average Savings" },
              { value: "50k+", label: "Happy Travellers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2rem",
                    color: "var(--clr-gold)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--clr-text-muted)", textTransform: "uppercase" }}>
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, var(--clr-gold), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* ═══════════════ FEATURED DEALS ═══════════════ */}
      <section className="section" style={{ background: "var(--clr-bg)" }}>
        <div className="container">
          <FadeIn>
            <p className="section-label">
              <span className="gold-line" />
              Exclusive Offers
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 className="section-title">Featured Escapes</h2>
                <p className="section-subtitle">Handpicked deals with massive savings, available for a limited time.</p>
              </div>
              <Link href="/deals" className="btn-outline">
                All Deals <FiArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>

          <div className="deals-grid">
            {featuredDeals.map((deal, i) => (
              <FadeIn key={deal.id} delay={i * 0.1}>
                <DealCard deal={deal} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="section" style={{ background: "var(--clr-bg2)" }}>
        <div className="container">
          <FadeIn>
            <p className="section-label" style={{ justifyContent: "center" }}>
              <span className="gold-line" />
              Browse By Type
            </p>
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: 48 }}>
              Choose Your Escape
            </h2>
          </FadeIn>

          <div className="categories-grid">
            {categories.map((cat, i) => (
              <FadeIn key={cat.cat} delay={i * 0.08}>
                <Link href={`/deals?cat=${cat.cat}`} style={{ display: "block" }}>
                  <div
                    style={{
                      background: "var(--clr-surface)",
                      border: "1px solid var(--clr-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "32px 20px",
                      textAlign: "center",
                      transition: "var(--transition)",
                      cursor: "pointer",
                    }}
                    className="cat-card"
                  >
                    <div style={{ fontSize: "2.4rem", marginBottom: 14 }}>{cat.icon}</div>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.1rem",
                        color: "var(--clr-cream)",
                      }}
                    >
                      {cat.label}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY LUXESCAPE ═══════════════ */}
      <section className="section" style={{ background: "var(--clr-bg)" }}>
        <div className="container">
          <FadeIn>
            <p className="section-label" style={{ justifyContent: "center" }}>
              <span className="gold-line" />
              Why LuxEscape
            </p>
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: 52 }}>
              The LuxEscape Promise
            </h2>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {pillars.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div
                  style={{
                    background: "var(--clr-surface)",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "36px 28px",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "var(--clr-gold-dim)",
                      border: "1px solid var(--clr-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--clr-gold)",
                      marginBottom: 20,
                    }}
                  >
                    {p.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.3rem",
                      color: "var(--clr-cream)",
                      marginBottom: 10,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, var(--clr-bg2), var(--clr-surface))",
          borderTop: "1px solid var(--clr-border)",
          borderBottom: "1px solid var(--clr-border)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <FadeIn>
            <p className="section-label" style={{ justifyContent: "center" }}>
              <span className="gold-line" />
              Insider Access
            </p>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Never Miss a Deal
            </h2>
            <p style={{ color: "var(--clr-text-muted)", marginBottom: 36, fontSize: "0.95rem" }}>
              Get exclusive offers and flash sales delivered to your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              style={{
                display: "flex",
                gap: 12,
                maxWidth: 480,
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: "14px 18px",
                  background: "var(--clr-surface2)",
                  border: "1px solid var(--clr-border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--clr-text)",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                }}
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </FadeIn>
        </div>
      </section>

      <style>{`
        .cat-card:hover {
          border-color: rgba(201,168,76,0.4) !important;
          background: var(--clr-surface2) !important;
          transform: translateY(-4px);
        }
      `}</style>
    </>
  );
}
