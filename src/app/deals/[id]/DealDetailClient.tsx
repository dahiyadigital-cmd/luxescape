"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiStar, FiCheck, FiClock, FiMapPin, FiUsers, FiCalendar,
  FiChevronDown, FiChevronUp, FiShield, FiInfo, FiWifi,
  FiArrowRight,
} from "react-icons/fi";
import { MdOutlinePool, MdOutlineSpa, MdFreeBreakfast } from "react-icons/md";
import type { Deal } from "@/data/deals";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <FiWifi size={16} />,
  "Infinity Pool": <MdOutlinePool size={16} />,
  "Spa & Wellness": <MdOutlineSpa size={16} />,
  "AWAY Spa": <MdOutlineSpa size={16} />,
  "Jungle Spa": <MdOutlineSpa size={16} />,
  "Overwater Spa": <MdOutlineSpa size={16} />,
};

function StarDisplay({ count }: { count: number }) {
  return (
    <span style={{ color: "var(--clr-gold)", fontSize: "0.9rem", letterSpacing: 2 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--clr-border)", paddingTop: 28, marginTop: 28 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: open ? 20 : 0,
        }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--clr-cream)" }}>
          {title}
        </h2>
        <span style={{ color: "var(--clr-gold)" }}>
          {open ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </span>
      </button>
      {open && children}
    </div>
  );
}

export default function DealDetailClient({ deal }: { deal: Deal }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [adults, setAdults] = useState(parseInt(searchParams.get("adults") || "2"));
  const [children, setChildren] = useState(parseInt(searchParams.get("children") || "0"));
  const [selectedRoom, setSelectedRoom] = useState(deal.rooms[0].id);
  const [activeImage, setActiveImage] = useState(0);

  const chosenRoom = deal.rooms.find((r) => r.id === selectedRoom) ?? deal.rooms[0];
  const savings = chosenRoom.originalPrice - chosenRoom.salePrice;

  const updateGuests = (newAdults: number, newChildren: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
    const params = new URLSearchParams(searchParams.toString());
    params.set("adults", String(newAdults));
    params.set("children", newChildren === 0 ? "none" : String(newChildren));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      {/* ── Image Gallery ── */}
      <div style={{ position: "relative", height: "60vh", minHeight: 360, overflow: "hidden" }}>
        <Image
          src={deal.images[activeImage]}
          alt={deal.title}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", transition: "opacity 0.4s" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(8,8,17,0.85) 0%, rgba(8,8,17,0.1) 50%)",
          }}
        />

        {/* Thumbnail strip */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
          }}
        >
          {deal.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              style={{
                width: 52,
                height: 36,
                borderRadius: 4,
                overflow: "hidden",
                border: i === activeImage ? "2px solid var(--clr-gold)" : "2px solid transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <Image
                src={img}
                alt={`View ${i + 1}`}
                fill
                sizes="52px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>

        {/* Hotel info overlay */}
        <div style={{ position: "absolute", bottom: 72, left: 0, right: 0 }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <StarDisplay count={deal.starRating} />
              <span style={{ color: "var(--clr-text-muted)", fontSize: "0.8rem" }}>
                {deal.starRating}-Star Hotel
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "var(--clr-cream)",
                marginBottom: 6,
              }}
            >
              {deal.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--clr-text-muted)", fontSize: "0.85rem" }}>
              <FiMapPin size={13} style={{ color: "var(--clr-gold)" }} />
              {deal.location}
              <span style={{ margin: "0 6px", color: "var(--clr-border)" }}>·</span>
              <FiStar size={12} style={{ fill: "var(--clr-gold)", color: "var(--clr-gold)" }} />
              <span style={{ color: "var(--clr-gold)" }}>{deal.rating}</span>
              <span style={{ color: "var(--clr-text-muted)" }}>({deal.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="detail-grid">

          {/* ══ LEFT COLUMN ══ */}
          <div>
            {/* About */}
            <Section title="About This Escape">
              <p style={{ color: "var(--clr-text-muted)", lineHeight: 1.85, fontSize: "0.95rem" }}>
                {deal.description}
              </p>
            </Section>

            {/* Highlights */}
            <Section title="Package Highlights">
              <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }} className="highlights-grid">
                {deal.highlights.map((h) => (
                  <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.88rem", color: "var(--clr-text-muted)" }}>
                    <FiCheck size={15} style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: 1 }} />
                    {h}
                  </li>
                ))}
              </ul>
            </Section>

            {/* What's Included */}
            <Section title="What's Included">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {deal.includes.map((inc) => (
                  <div key={inc} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", color: "var(--clr-text)" }}>
                    <MdFreeBreakfast size={15} style={{ color: "var(--clr-gold)", flexShrink: 0 }} />
                    {inc}
                  </div>
                ))}
              </div>
            </Section>

            {/* Amenities */}
            <Section title="Hotel Amenities">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {deal.amenities.map((a) => (
                  <div
                    key={a}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 14px",
                      background: "var(--clr-surface)",
                      border: "1px solid var(--clr-border)",
                      borderRadius: 20,
                      fontSize: "0.8rem",
                      color: "var(--clr-text-muted)",
                    }}
                  >
                    <span style={{ color: "var(--clr-gold)" }}>{AMENITY_ICONS[a] ?? "✦"}</span>
                    {a}
                  </div>
                ))}
              </div>
            </Section>

            {/* Getting There */}
            <Section title="Getting There" defaultOpen={false}>
              <div style={{ display: "flex", gap: 14, padding: "16px", background: "var(--clr-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--clr-border)" }}>
                <FiMapPin size={18} style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                  {deal.gettingThere}
                </p>
              </div>
            </Section>

            {/* Travel Dates */}
            <Section title="Travel Validity" defaultOpen={false}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="dates-grid">
                {[
                  { icon: <FiCalendar size={16} />, label: "Valid From", value: deal.validFrom },
                  { icon: <FiCalendar size={16} />, label: "Valid To", value: deal.validTo },
                  { icon: <FiCalendar size={16} />, label: "Book By", value: deal.bookBy },
                ].map((d) => (
                  <div key={d.label} style={{ padding: "14px 16px", background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--clr-gold)", marginBottom: 6 }}>
                      {d.icon}
                      <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{d.label}</span>
                    </div>
                    <p style={{ color: "var(--clr-cream)", fontSize: "0.88rem", fontWeight: 600 }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Cancellation */}
            <Section title="Cancellation Policy" defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "var(--radius-md)", display: "flex", gap: 12 }}>
                  <FiShield size={18} style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--clr-cream)", fontSize: "0.88rem", marginBottom: 6 }}>7-Day Change of Mind Guarantee</p>
                    <p style={{ color: "var(--clr-text-muted)", fontSize: "0.85rem", lineHeight: 1.7 }}>{deal.cancellationPolicy}</p>
                  </div>
                </div>
                <div style={{ padding: "16px", background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-md)", display: "flex", gap: 12 }}>
                  <FiInfo size={18} style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--clr-cream)", fontSize: "0.88rem", marginBottom: 6 }}>Flexible Cancellation</p>
                    <p style={{ color: "var(--clr-text-muted)", fontSize: "0.85rem", lineHeight: 1.7 }}>{deal.flexibleCancellation}</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Fine Print */}
            <Section title="Fine Print" defaultOpen={false}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {deal.finePrint.map((fp, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "var(--clr-text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: 2, fontSize: "0.7rem" }}>✦</span>
                    {fp}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* ══ RIGHT COLUMN – Booking Card ══ */}
          <div style={{ position: "sticky", top: 92 }}>
            <div style={{ background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>

              {/* Guests selector row */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--clr-border)", display: "flex", gap: 12, alignItems: "center" }}>
                <FiUsers size={15} style={{ color: "var(--clr-gold)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", fontWeight: 500 }}>Guests:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
                  <button
                    onClick={() => updateGuests(Math.max(1, adults - 1), children)}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--clr-border)", background: "var(--clr-surface2)", color: "var(--clr-gold)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >-</button>
                  <span style={{ minWidth: 20, textAlign: "center", fontSize: "0.88rem", color: "var(--clr-cream)", fontWeight: 600 }}>{adults}</span>
                  <button
                    onClick={() => updateGuests(Math.min(8, adults + 1), children)}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--clr-border)", background: "var(--clr-surface2)", color: "var(--clr-gold)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                  <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>Adults</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => updateGuests(adults, Math.max(0, children - 1))}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--clr-border)", background: "var(--clr-surface2)", color: "var(--clr-gold)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >-</button>
                  <span style={{ minWidth: 20, textAlign: "center", fontSize: "0.88rem", color: "var(--clr-cream)", fontWeight: 600 }}>{children === 0 ? "none" : children}</span>
                  <button
                    onClick={() => updateGuests(adults, Math.min(6, children + 1))}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--clr-border)", background: "var(--clr-surface2)", color: "var(--clr-gold)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                  <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>Children</span>
                </div>
              </div>

              {/* Room packages */}
              <div style={{ padding: "16px 20px 0" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-gold)", marginBottom: 12, fontWeight: 600 }}>
                  Select Your Room
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {deal.rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        background: selectedRoom === room.id ? "rgba(201,168,76,0.07)" : "var(--clr-surface2)",
                        border: `1px solid ${selectedRoom === room.id ? "var(--clr-gold)" : "var(--clr-border)"}`,
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        transition: "var(--transition)",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", color: "var(--clr-cream)", lineHeight: 1.3 }}>
                          {room.name}
                        </span>
                        {selectedRoom === room.id && (
                          <FiCheck size={14} style={{ color: "var(--clr-gold)", flexShrink: 0, marginLeft: 8 }} />
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: "0.8rem", color: "var(--clr-text-muted)"}}>
                        <span><FiClock size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />{room.nights} nights</span>
                        <span><FiUsers size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />Up to {room.maxGuests}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                        {room.features.slice(0, 3).map((f) => (
                          <span key={f} style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, color: "var(--clr-gold)" }}>{f}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price section */}
              <div style={{ padding: "0 20px 20px" }}>
                <div style={{ padding: "16px", background: "var(--clr-bg)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", textDecoration: "line-through", marginBottom: 2 }}>
                    Was ${chosenRoom.originalPrice.toLocaleString()}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--clr-gold)", lineHeight: 1 }}>
                      ${chosenRoom.salePrice.toLocaleString()}
                    </p>
                    <span className="badge">-{deal.discount}%</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>
                    per person · {chosenRoom.nights} nights · ~${chosenRoom.perNight}/night
                  </p>
                </div>

                {/* Savings row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>You save per person</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--clr-gold)" }}>${savings.toLocaleString()}</span>
                </div>

                <a
                  href={`/checkout/${deal.id}?package=${chosenRoom.id}&adults=${adults}&children=${children}`}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", gap: 8, display: "flex", textDecoration: "none" }}
                >
                  Book This Escape <FiArrowRight size={14} />
                </a>

                {/* Trust signals */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                  {[
                    { icon: <FiShield size={13} />, text: "7-Day Change of Mind Guarantee" },
                    { icon: <FiCheck size={13} />, text: "Best price guarantee" },
                    { icon: <FiUsers size={13} />, text: `${adults} adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}` },
                  ].map((t) => (
                    <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "var(--clr-text-muted)" }}>
                      <span style={{ color: "var(--clr-gold)" }}>{t.icon}</span>
                      {t.text}
                    </div>
                  ))}
                </div>

                <p style={{ textAlign: "center", fontSize: "0.68rem", color: "var(--clr-text-muted)", marginTop: 14, lineHeight: 1.5 }}>
                  ⚠️ Training website only — no real bookings or payments processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .highlights-grid { grid-template-columns: 1fr !important; }
          .dates-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
