"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiUser, FiMail, FiPhone, FiCalendar, FiChevronRight, FiShield, FiCheck } from "react-icons/fi";
import type { Deal } from "@/data/deals";

interface Props {
  deal: Deal;
  adults: number;
  children: number;
  packageId: string;
}

export default function GuestDetailsForm({ deal, adults: initAdults, children: initChildren, packageId }: Props) {
  const router = useRouter();
  const room = deal.rooms.find((r) => r.id === packageId) ?? deal.rooms[0];

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    checkIn: "", checkOut: "",
    adults: initAdults, children: initChildren,
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.checkIn) e.checkIn = "Required";
    if (!form.checkOut) e.checkOut = "Required";
    if (form.checkIn && form.checkOut && form.checkIn >= form.checkOut) e.checkOut = "Must be after check-in";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const params = new URLSearchParams({
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, phone: form.phone,
      checkIn: form.checkIn, checkOut: form.checkOut,
      adults: String(form.adults), children: String(form.children),
      packageId: room.id,
      specialRequests: form.specialRequests,
    });
    router.push(`/checkout/${deal.id}/payment?${params.toString()}`);
  }

  const savings = room.originalPrice - room.salePrice;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }} className="checkout-grid">
      {/* ── Left: Form ── */}
      <form onSubmit={handleSubmit}>
        {/* Step 1 label */}
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clr-gold)", marginBottom: 8 }}>Step 1 of 2</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--clr-cream)", fontWeight: 300, marginBottom: 28 }}>Your Details</h2>

        {/* Name row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <Field label="First Name" icon={<FiUser size={14} />} error={errors.firstName}>
            <input style={inputStyle} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Jane" />
          </Field>
          <Field label="Last Name" error={errors.lastName}>
            <input style={inputStyle} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Smith" />
          </Field>
        </div>

        {/* Email + Phone */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <Field label="Email Address" icon={<FiMail size={14} />} error={errors.email}>
            <input type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" />
          </Field>
          <Field label="Phone Number" icon={<FiPhone size={14} />} error={errors.phone}>
            <input type="tel" style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 234 567 890" />
          </Field>
        </div>

        {/* Travel Dates */}
        <div style={{ marginBottom: 18 }}>
          <p style={labelStyle}>Travel Dates</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Check-In" icon={<FiCalendar size={14} />} error={errors.checkIn}>
              <input type="date" style={inputStyle} value={form.checkIn} min={new Date().toISOString().split("T")[0]} onChange={(e) => set("checkIn", e.target.value)} />
            </Field>
            <Field label="Check-Out" icon={<FiCalendar size={14} />} error={errors.checkOut}>
              <input type="date" style={inputStyle} value={form.checkOut} min={form.checkIn || new Date().toISOString().split("T")[0]} onChange={(e) => set("checkOut", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Guests */}
        <div style={{ marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Adults">
            <select style={inputStyle} value={form.adults} onChange={(e) => set("adults", parseInt(e.target.value))}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>)}
            </select>
          </Field>
          <Field label="Children">
            <select style={inputStyle} value={form.children} onChange={(e) => set("children", parseInt(e.target.value))}>
              {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 0 ? "No children" : `${n} Child${n > 1 ? "ren" : ""}`}</option>)}
            </select>
          </Field>
        </div>

        {/* Special requests */}
        <Field label="Special Requests (optional)">
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={form.specialRequests}
            onChange={(e) => set("specialRequests", e.target.value)}
            placeholder="Dietary requirements, room preferences, anniversary setup…"
          />
        </Field>

        {/* Trust bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "28px 0" }}>
          {[
            "Your data is encrypted and never shared",
            "7-Day Change of Mind Guarantee",
            "No hidden fees — pay exactly what's shown",
          ].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.82rem", color: "var(--clr-text-muted)" }}>
              <FiCheck size={13} style={{ color: "var(--clr-gold)", flexShrink: 0 }} />
              {t}
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", gap: 10, padding: "16px 24px", fontSize: "0.9rem" }}>
          Continue to Payment <FiChevronRight size={16} />
        </button>
      </form>

      {/* ── Right: Booking Summary ── */}
      <div style={{ position: "sticky", top: 100 }}>
        <BookingSummaryCard deal={deal} room={room} savings={savings} />
      </div>

      <style>{`
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Field({ label, icon, error, children }: { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>
        {icon && <span style={{ marginRight: 4, color: "var(--clr-gold)", verticalAlign: "middle" }}>{icon}</span>}
        {label}
      </label>
      {children}
      {error && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function BookingSummaryCard({ deal, room, savings }: { deal: Deal; room: Deal["rooms"][0]; savings: number }) {
  return (
    <div style={{ background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      {/* Image */}
      <div style={{ position: "relative", height: 180 }}>
        <Image src={deal.images[0]} alt={deal.title} fill sizes="380px" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,17,0.7) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "#fff", lineHeight: 1.3 }}>{deal.title}</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{deal.location}</p>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Package */}
        <div style={{ padding: "12px 14px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "var(--radius-sm)", marginBottom: 18 }}>
          <p style={{ fontSize: "0.78rem", color: "var(--clr-gold)", fontWeight: 600, marginBottom: 3 }}>{room.name}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{room.nights} nights · {room.beds} · Up to {room.maxGuests} guests</p>
        </div>

        {/* Price breakdown */}
        <div style={{ borderTop: "1px solid var(--clr-border)", paddingTop: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.82rem", color: "var(--clr-text-muted)" }}>Original price</span>
            <span style={{ fontSize: "0.82rem", color: "var(--clr-text-muted)", textDecoration: "line-through" }}>${room.originalPrice.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.82rem", color: "var(--clr-gold)" }}>You save</span>
            <span style={{ fontSize: "0.82rem", color: "var(--clr-gold)", fontWeight: 600 }}>-${savings.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--clr-border)" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--clr-cream)", fontWeight: 600 }}>Total due</span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--clr-gold)" }}>${room.salePrice.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)", textAlign: "right", marginTop: 2 }}>per person · USD</p>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.75rem", color: "var(--clr-text-muted)", marginBottom: 6 }}>
          <FiShield size={12} style={{ color: "var(--clr-gold)" }} />
          7-Day Change of Mind Guarantee
        </div>
        <p style={{ fontSize: "0.65rem", color: "var(--clr-text-muted)", lineHeight: 1.5 }}>
          ⚠️ Training & education demo only. No real bookings processed.
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", letterSpacing: "0.08em",
  textTransform: "uppercase", color: "var(--clr-text-muted)", marginBottom: 6, fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "var(--clr-surface)", border: "1px solid var(--clr-border)",
  borderRadius: "var(--radius-sm)", color: "var(--clr-text)",
  fontSize: "0.92rem", fontFamily: "var(--font-sans)", outline: "none",
  boxSizing: "border-box", display: "block",
};
