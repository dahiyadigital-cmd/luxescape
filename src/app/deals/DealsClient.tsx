"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/data/deals";

const CATEGORIES = [
  { label: "All Deals", value: "all" },
  { label: "Beach & Islands", value: "beach" },
  { label: "City Breaks", value: "city" },
  { label: "Adventure", value: "adventure" },
  { label: "Wellness & Spa", value: "wellness" },
];

export default function DealsClient({ initialDeals }: { initialDeals: Deal[] }) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const [active, setActive] = useState(initialCat);

  const filtered =
    active === "all"
      ? initialDeals
      : initialDeals.filter((d) => d.category === active);

  return (
    <>
      {/* Header */}
      <section
        style={{
          paddingTop: 140,
          paddingBottom: 60,
          background:
            "linear-gradient(180deg, var(--clr-surface) 0%, var(--clr-bg) 100%)",
          borderBottom: "1px solid var(--clr-border)",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--clr-gold)",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 36,
                height: 1,
                background: "var(--clr-gold)",
              }}
            />
            Luxury Travel Deals
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              color: "var(--clr-cream)",
              marginBottom: 16,
            }}
          >
            All Escapes
          </h1>
          <p style={{ color: "var(--clr-text-muted)", maxWidth: 480 }}>
            {initialDeals.length} curated luxury experiences available. Limited
            availability — book now to secure your escape.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div
        style={{
          position: "sticky",
          top: 72,
          zIndex: 50,
          background: "rgba(8,8,17,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--clr-border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            padding: "16px 24px",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border: "1px solid",
                borderColor:
                  active === cat.value ? "var(--clr-gold)" : "var(--clr-border)",
                background:
                  active === cat.value ? "var(--clr-gold-dim)" : "transparent",
                color:
                  active === cat.value
                    ? "var(--clr-gold)"
                    : "var(--clr-text-muted)",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                transition: "var(--transition)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <section className="section">
        <div className="container">
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--clr-text-muted)",
              marginBottom: 28,
            }}
          >
            Showing{" "}
            <strong style={{ color: "var(--clr-gold)" }}>{filtered.length}</strong>{" "}
            escapes
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="deals-grid"
            >
              {filtered.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--clr-text-muted)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  marginBottom: 8,
                  color: "var(--clr-cream)",
                }}
              >
                No escapes found
              </p>
              <p>Try a different category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
