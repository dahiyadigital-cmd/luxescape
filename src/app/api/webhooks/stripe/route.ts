import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendCustomerConfirmation, sendAdminNotification } from "@/lib/email";
import { fetchDealById } from "@/lib/api";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret || webhookSecret.includes("placeholder")) {
    return NextResponse.json({ received: true, demo: true });
  }

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    await handlePaymentSuccess(pi.id, pi.metadata);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(
  paymentIntentId: string,
  metadata: Record<string, string>
) {
  // Update booking status
  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .update({ status: "paid" })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select()
    .single();

  if (!booking) return;

  // Fetch deal details for email
  const deal = await fetchDealById(booking.hotel_id);

  const emailData = {
    bookingRef: booking.booking_ref,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    hotelName: deal?.hotelName ?? metadata.hotelName ?? "Hotel",
    dealTitle: deal?.title ?? booking.booking_ref,
    packageName: booking.package_name ?? booking.package_slug,
    checkIn: booking.check_in,
    checkOut: booking.check_out,
    adults: booking.adults,
    children: booking.children,
    totalAmount: booking.total_amount,
    currency: booking.currency,
    nights: booking.nights,
  };

  await Promise.all([
    sendCustomerConfirmation(emailData),
    sendAdminNotification(emailData),
  ]);
}
