import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendCustomerConfirmation, sendAdminNotification } from "@/lib/email";
import { fetchDealById } from "@/lib/api";

// Demo mode: confirm booking without real Stripe
export async function POST(req: NextRequest) {
  try {
    const { bookingRef } = await req.json();

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .update({ status: "paid" })
      .eq("booking_ref", bookingRef)
      .select()
      .single();

    if (error || !booking) {
      console.error("[confirm-demo] Booking not found:", bookingRef, error?.message);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // package_slug was reused to store the deal slug in create-payment-intent
    const dealSlug = booking.package_slug;
    const deal = dealSlug ? await fetchDealById(dealSlug) : null;

    // Find the specific room package name from the deal
    const packageName = booking.package_name ?? deal?.rooms[0]?.name ?? booking.booking_ref;

    const emailData = {
      bookingRef: booking.booking_ref,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      hotelName: deal?.hotelName ?? "Hotel",
      dealTitle: deal?.title ?? booking.booking_ref,
      packageName,
      checkIn: booking.check_in ?? "",
      checkOut: booking.check_out ?? "",
      adults: booking.adults ?? 2,
      children: booking.children ?? 0,
      totalAmount: Number(booking.total_amount),
      currency: booking.currency ?? "usd",
      nights: booking.nights ?? 0,
    };

    await Promise.all([
      sendCustomerConfirmation(emailData),
      sendAdminNotification(emailData),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[confirm-demo]", err);
    return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 });
  }
}
