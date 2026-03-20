"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiStar, FiClock, FiArrowRight } from "react-icons/fi";
import type { Deal } from "@/data/deals";

export default function DealCard({ deal }: { deal: Deal }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/deals/${deal.id}`} style={{ display: "block" }}>
      <div
        className="deal-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="deal-card-image" style={{ position: "relative" }}>
          <Image
            src={deal.images[0]}
            alt={deal.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
          <span className="badge" style={{ position: "absolute", top: 14, left: 14 }}>
            -{deal.discount}% OFF
          </span>
          {/* Rating chip */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              background: "rgba(8,8,17,0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 20,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: "0.78rem",
              color: "var(--clr-gold)",
            }}
          >
            <FiStar size={11} style={{ fill: "var(--clr-gold)" }} />
            {deal.rating} · {deal.reviewCount} reviews
          </div>
        </div>

        {/* Body */}
        <div className="deal-card-body">
          <p className="deal-card-location">{deal.location}</p>
          <h3 className="deal-card-title">{deal.title}</h3>

          <div className="deal-card-footer">
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--clr-text-muted)", fontSize: "0.8rem" }}>
              <FiClock size={13} />
              <span>{deal.nights} nights</span>
            </div>

            <div className="deal-card-price">
              <p className="was">Was ${deal.originalPrice.toLocaleString()}</p>
              <p className="now">${deal.salePrice.toLocaleString()}</p>
              <p className="per">per person</p>
            </div>
          </div>

          {/* View deal link */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 14,
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: hovered ? "var(--clr-gold-light)" : "var(--clr-gold)",
              transition: "color 0.2s",
            }}
          >
            View Deal <FiArrowRight size={13} style={{ transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none" }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
