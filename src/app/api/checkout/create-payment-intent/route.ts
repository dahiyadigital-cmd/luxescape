import { NextRequest, NextResponse } from "next/server";
import { stripe, isDemoMode } from "@/lib/stripe-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "LUX-";
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hotelId,        // This is the hotel SLUG (deal.id from frontend)
      packageSlug,
      packageName,
      guestName,
      guestEmail,
      guestPhone,
      adults,
      children,
      checkIn,
      checkOut,
      specialRequests,
      totalAmount,
      currency = "usd",
      nights,
    } = body;

    if (!guestName || !guestEmail || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Resolve slug → actual hotel UUID for the FK column
    const { data: hotelRow } = await supabaseAdmin
      .from("hotels")
      .select("id")
      .eq("slug", hotelId)
      .single();

    const bookingRef = generateBookingRef();
    const amountInCents = Math.round(totalAmount * 100);

    // ── Demo mode: skip real Stripe ──
    let clientSecret: string;
    let paymentIntentId: string;

    if (isDemoMode) {
      paymentIntentId = `pi_demo_${Date.now()}`;
      clientSecret = `${paymentIntentId}_secret_demo`;
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        receipt_email: guestEmail,
        metadata: { bookingRef, hotelSlug: hotelId, packageSlug, guestName, guestEmail },
      });
      paymentIntentId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret!;
    }

    // ── Save booking — store hotel UUID + package_slug stores the deal slug ──
    const { error: insertError } = await supabaseAdmin.from("bookings").insert({
      booking_ref: bookingRef,
      hotel_id: hotelRow?.id ?? null,   // actual UUID (nullable)
      package_slug: hotelId,            // reuse package_slug to store deal slug
      package_name: packageName,
      stripe_payment_intent_id: paymentIntentId,
      status: "pending",
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone ?? "",
      adults: adults ?? 2,
      children: children ?? 0,
      check_in: checkIn,
      check_out: checkOut,
      special_requests: specialRequests ?? "",
      total_amount: totalAmount,
      currency,
      nights,
    });

    if (insertError) {
      console.error("[create-payment-intent] DB error:", insertError.message);
      return NextResponse.json({ error: `DB error: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ clientSecret, bookingRef, isDemoMode });
  } catch (err) {
    console.error("[create-payment-intent]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Payment setup failed" },
      { status: 500 }
    );
  }
}
