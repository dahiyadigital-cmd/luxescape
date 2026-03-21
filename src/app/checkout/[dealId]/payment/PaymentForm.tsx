"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FiLock, FiShield, FiCheck, FiArrowLeft } from "react-icons/fi";
import type { Deal } from "@/data/deals";

// Load Stripe outside of render (safe with demo publishable key)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_TYooMQauvdEDq54NiTphI7jx"
);

const STRIPE_ELEMENT_STYLE = {
  style: {
    base: {
      color: "#e8e4d8",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: "15px",
      "::placeholder": { color: "#4a4a5a" },
    },
    invalid: { color: "#f87171" },
  },
};

interface GuestData {
  firstName: string; lastName: string;
  email: string; phone: string;
  checkIn: string; checkOut: string;
  adults: number; children: number;
  packageId: string; specialRequests: string;
}

interface Props {
  deal: Deal;
  room: Deal["rooms"][0];
  guestData: GuestData;
}

// The inner form that uses Stripe hooks
function CardForm({ deal, room, guestData }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState({ number: false, expiry: false, cvc: false });

  const isDemoMode = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_TYooMQauvdEDq54NiTphI7jx")
    === "pk_test_TYooMQauvdEDq54NiTphI7jx";
  const savings = room.originalPrice - room.salePrice;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      // Create payment intent + save booking
      const res = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: deal.id,
          packageSlug: room.id,
          packageName: room.name,
          guestName: `${guestData.firstName} ${guestData.lastName}`.trim(),
          guestEmail: guestData.email,
          guestPhone: guestData.phone,
          adults: guestData.adults,
          children: guestData.children,
          checkIn: guestData.checkIn,
          checkOut: guestData.checkOut,
          specialRequests: guestData.specialRequests,
          totalAmount: room.salePrice,
          currency: "usd",
          nights: room.nights,
        }),
      });

      const { clientSecret, bookingRef, isDemoMode: serverDemo, error: apiError } = await res.json();
      if (apiError) { setError(apiError); setLoading(false); return; }

      // Demo mode: skip real Stripe confirmation
      if (serverDemo || isDemoMode) {
        // Mark booking paid via demo API
        await fetch("/api/checkout/confirm-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingRef }),
        });
        router.push(`/booking/${bookingRef}?demo=true`);
        return;
      }

      // Real Stripe payment confirmation
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) { setError("Card element not found"); setLoading(false); return; }

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${guestData.firstName} ${guestData.lastName}`,
            email: guestData.email,
            phone: guestData.phone,
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message ?? "Payment failed");
        setLoading(false);
        return;
      }

      router.push(`/booking/${bookingRef}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }} className="checkout-grid">
      {/* ── Left: Payment form ── */}
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clr-gold)", marginBottom: 8 }}>Step 2 of 2</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--clr-cream)", fontWeight: 300, marginBottom: 8 }}>
          Payment
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 28, color: "var(--clr-text-muted)", fontSize: "0.82rem" }}>
          <FiLock size={13} style={{ color: "var(--clr-gold)" }} />
          Secured by Stripe · 256-bit encryption
        </div>

        {isDemoMode && (
          <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 20, fontSize: "0.82rem", color: "var(--clr-gold)" }}>
            🔧 <strong>Demo Mode</strong> — Use any card details below. No real payment is processed.<br />
            <span style={{ color: "var(--clr-text-muted)" }}>Test card: <code style={{ color: "var(--clr-cream)" }}>4242 4242 4242 4242</code> · Any expiry · Any CVC</span>
          </div>
        )}

        {/* Booking summary (guest) */}
        <div style={{ background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: 24 }}>
          <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", marginBottom: 4 }}>Booking for</p>
          <p style={{ color: "var(--clr-cream)", fontSize: "0.92rem", fontWeight: 600 }}>{guestData.firstName} {guestData.lastName}</p>
          <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>{guestData.email}</p>
          {guestData.checkIn && <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", marginTop: 4 }}>
            {guestData.checkIn} → {guestData.checkOut} · {guestData.adults} adult{guestData.adults > 1 ? "s" : ""}{guestData.children > 0 ? `, ${guestData.children} children` : ""}
          </p>}
        </div>

        {/* Card fields */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Card Number</label>
          <div style={cardFieldStyle}>
            <CardNumberElement options={STRIPE_ELEMENT_STYLE} onChange={(e) => setCardReady(p => ({ ...p, number: e.complete }))} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <div style={cardFieldStyle}>
              <CardExpiryElement options={STRIPE_ELEMENT_STYLE} onChange={(e) => setCardReady(p => ({ ...p, expiry: e.complete }))} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>CVC</label>
            <div style={cardFieldStyle}>
              <CardCvcElement options={STRIPE_ELEMENT_STYLE} onChange={(e) => setCardReady(p => ({ ...p, cvc: e.complete }))} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 20, color: "#f87171", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", gap: 10, padding: "17px 24px", fontSize: "0.95rem", opacity: loading ? 0.7 : 1 }}
        >
          <FiLock size={15} />
          {loading ? "Processing…" : `Pay $${room.salePrice.toLocaleString()} USD`}
        </button>

        {/* Trust badges row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
          {["🔒 PCI Compliant", "🛡️ 7-Day Guarantee", "✓ Best Price"].map(t => (
            <span key={t} style={{ fontSize: "0.72rem", color: "var(--clr-text-muted)" }}>{t}</span>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{ background: "none", border: "none", color: "var(--clr-text-muted)", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <FiArrowLeft size={12} /> Back to details
          </button>
        </div>
      </form>

      {/* ── Right: Summary ── */}
      <div style={{ position: "sticky", top: 100 }}>
        <SummaryCard deal={deal} room={room} savings={savings} />
      </div>

      <style>{`
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function SummaryCard({ deal, room, savings }: { deal: Deal; room: Deal["rooms"][0]; savings: number }) {
  return (
    <div style={{ background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ position: "relative", height: 180 }}>
        <Image src={deal.images[0]} alt={deal.title} fill sizes="380px" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,17,0.7) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 14 }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "#fff" }}>{deal.title}</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{deal.location}</p>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <div style={{ padding: "10px 12px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
          <p style={{ fontSize: "0.78rem", color: "var(--clr-gold)", fontWeight: 600, marginBottom: 2 }}>{room.name}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{room.nights} nights · {room.beds}</p>
        </div>
        <div style={{ borderTop: "1px solid var(--clr-border)", paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>Was</span>
            <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", textDecoration: "line-through" }}>${room.originalPrice.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--clr-gold)" }}>You save</span>
            <span style={{ fontSize: "0.8rem", color: "var(--clr-gold)", fontWeight: 600 }}>-${savings.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: "1px solid var(--clr-border)" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--clr-cream)", fontWeight: 600 }}>Total due</span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--clr-gold)" }}>${room.salePrice.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)", textAlign: "right", marginTop: 2 }}>per person · USD</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>
          <FiShield size={12} style={{ color: "var(--clr-gold)" }} />7-Day Change of Mind Guarantee
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6, fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>
          <FiCheck size={12} style={{ color: "var(--clr-gold)" }} />Best price guarantee
        </div>
      </div>
    </div>
  );
}

// Wrap with Stripe Elements provider
export default function PaymentForm(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm {...props} />
    </Elements>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", letterSpacing: "0.08em",
  textTransform: "uppercase", color: "var(--clr-text-muted)", marginBottom: 6, fontWeight: 500,
};

const cardFieldStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: "var(--clr-surface)",
  border: "1px solid var(--clr-border)",
  borderRadius: "var(--radius-sm)",
};
