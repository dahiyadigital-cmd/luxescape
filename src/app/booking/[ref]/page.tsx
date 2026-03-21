import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { fetchDealById } from "@/lib/api";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import { FiCheck, FiCalendar, FiUsers, FiMail, FiArrowRight } from "react-icons/fi";

interface Props {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ demo?: string }>;
}

export const dynamic = "force-dynamic";

export default async function BookingConfirmationPage({ params, searchParams }: Props) {
  const { ref } = await params;
  const { demo } = await searchParams;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("booking_ref", ref)
    .single();

  if (!booking) notFound();

  // package_slug stores the deal slug (set in create-payment-intent)
  const dealSlug = booking.package_slug;
  const deal = dealSlug ? await fetchDealById(dealSlug) : null;

  function formatDate(d: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
  }

  return (
    <div style={{ paddingTop: 100, paddingBottom: 100, minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <CheckoutStepper current={3} />

        {/* Success tick */}
        <div style={{ textAlign: "center", padding: "48px 0 40px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(201,168,76,0.12)", border: "2px solid var(--clr-gold)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <FiCheck size={32} style={{ color: "var(--clr-gold)" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "var(--clr-cream)", fontWeight: 300, marginBottom: 10 }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "0.95rem" }}>
            Your escape is secured. A confirmation email has been sent to <strong style={{ color: "var(--clr-cream)" }}>{booking.guest_email}</strong>.
          </p>
        </div>

        {/* Booking Ref */}
        <div style={{ background: "var(--clr-surface)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "var(--radius-md)", padding: "20px 24px", textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-muted)", marginBottom: 6 }}>Booking Reference</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--clr-gold)", letterSpacing: "0.15em" }}>{booking.booking_ref}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", marginTop: 4 }}>Save this reference for your records</p>
        </div>

        {/* Details card */}
        <div style={{ background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 24 }}>
          {/* Hotel name header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--clr-border)", background: "rgba(201,168,76,0.04)" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--clr-gold)", marginBottom: 4 }}>Your Escape</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--clr-cream)", fontWeight: 400, marginBottom: 2 }}>
              {deal?.title ?? booking.package_name}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--clr-text-muted)" }}>{deal?.hotelName} · {deal?.location}</p>
          </div>

          {/* Detail rows */}
          <div style={{ padding: "20px 24px" }}>
            <Row icon={<FiUsers />} label="Guest" value={`${booking.guest_name} — ${booking.adults} adult${booking.adults > 1 ? "s" : ""}${booking.children > 0 ? `, ${booking.children} children` : ""}`} />
            <Row icon={<FiCalendar />} label="Check-In" value={formatDate(booking.check_in)} />
            <Row icon={<FiCalendar />} label="Check-Out" value={formatDate(booking.check_out)} />
            <Row icon={<FiMail />} label="Confirmation sent to" value={booking.guest_email} />
            <div style={{ borderTop: "1px solid var(--clr-border)", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--clr-text-muted)" }}>Total Paid</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--clr-gold)" }}>
                ${Number(booking.total_amount).toLocaleString()} {booking.currency?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* What next */}
        <div style={{ background: "var(--clr-surface)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-md)", padding: "22px 24px", marginBottom: 32 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--clr-cream)", fontWeight: 400, marginBottom: 14 }}>What happens next?</h3>
          {[
            { icon: "📧", text: "Confirmation email sent to your inbox" },
            { icon: "📞", text: "Our travel specialist will call within 24 hours to confirm your trip details" },
            { icon: "📄", text: "Travel documents delivered 7 days before departure" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: "0.87rem", color: "var(--clr-text-muted)", lineHeight: 1.5 }}>
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* Demo notice */}
        {demo === "true" && (
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 24, fontSize: "0.8rem", color: "var(--clr-text-muted)", textAlign: "center" }}>
            ⚠️ This is a training & education demo. No real payment was processed.
          </div>
        )}

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/deals" className="btn-primary">
            Browse More Escapes <FiArrowRight size={14} />
          </Link>
          <Link href="/" className="btn-outline">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
      <span style={{ color: "var(--clr-gold)", marginTop: 2, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: "0.88rem", color: "var(--clr-cream)" }}>{value}</p>
      </div>
    </div>
  );
}
