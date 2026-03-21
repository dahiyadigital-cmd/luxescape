/**
 * Email helpers powered by Resend.
 * Add RESEND_API_KEY to .env.local to activate real email sending.
 * In demo mode, emails are logged to the console.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "dahiyadigital@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxescape.vercel.app";
const isEmailEnabled = process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("placeholder");

interface BookingEmailData {
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  dealTitle: string;
  packageName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  nights: number;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount);
}

// ── Customer confirmation email ──────────────────────────────────────────────
function customerEmailHtml(data: BookingEmailData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080811;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;margin:0 0 8px;">LuxEscape</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;color:#e8e4d8;font-weight:300;margin:0;">Booking Confirmed ✓</h1>
    </div>

    <!-- Booking ref banner -->
    <div style="background:#0f0f1a;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:20px;text-align:center;margin-bottom:28px;">
      <p style="font-size:11px;letter-spacing:2px;color:#9a9080;text-transform:uppercase;margin:0 0 6px;">Booking Reference</p>
      <p style="font-family:Georgia,serif;font-size:26px;color:#c9a84c;margin:0;letter-spacing:4px;">${data.bookingRef}</p>
    </div>

    <!-- Deal summary -->
    <div style="background:#0f0f1a;border:1px solid #1e1e2e;border-radius:8px;padding:24px;margin-bottom:28px;">
      <h2 style="font-family:Georgia,serif;font-size:20px;color:#e8e4d8;font-weight:400;margin:0 0 6px;">${data.dealTitle}</h2>
      <p style="color:#9a9080;font-size:14px;margin:0 0 20px;">${data.hotelName}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Package", data.packageName)}
        ${row("Check-In", data.checkIn)}
        ${row("Check-Out", data.checkOut)}
        ${row("Guests", `${data.adults} adult${data.adults > 1 ? "s" : ""}${data.children > 0 ? `, ${data.children} children` : ""}`)}
        ${row("Nights", String(data.nights))}
        ${row("Total Paid", `<strong style="color:#c9a84c;">${formatCurrency(data.totalAmount, data.currency)}</strong>`)}
      </table>
    </div>

    <!-- Next steps -->
    <div style="background:#0f0f1a;border:1px solid #1e1e2e;border-radius:8px;padding:24px;margin-bottom:28px;">
      <h3 style="font-family:Georgia,serif;color:#e8e4d8;font-size:16px;font-weight:400;margin:0 0 14px;">What happens next?</h3>
      <p style="color:#9a9080;font-size:14px;line-height:1.7;margin:0 0 8px;">📧 <strong style="color:#e8e4d8;">Confirmation email</strong> — you're reading it!</p>
      <p style="color:#9a9080;font-size:14px;line-height:1.7;margin:0 0 8px;">📞 <strong style="color:#e8e4d8;">Travel specialist call</strong> — our team will reach out within 24 hours to confirm your booking details.</p>
      <p style="color:#9a9080;font-size:14px;line-height:1.7;margin:0;">📄 <strong style="color:#e8e4d8;">Travel documents</strong> — sent 7 days before departure.</p>
    </div>

    <!-- View booking CTA -->
    <div style="text-align:center;margin-bottom:36px;">
      <a href="${SITE_URL}/booking/${data.bookingRef}" style="display:inline-block;background:#c9a84c;color:#080811;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:14px 32px;border-radius:4px;text-decoration:none;">View My Booking</a>
    </div>

    <!-- Footer -->
    <p style="color:#4a4a5a;font-size:12px;text-align:center;line-height:1.6;">
      LuxEscape · Training & Education Platform<br>
      This is a demo site. No real travel bookings are made.
    </p>
  </div>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#9a9080;border-bottom:1px solid #1e1e2e;">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:#e8e4d8;text-align:right;border-bottom:1px solid #1e1e2e;">${value}</td>
  </tr>`;
}

// ── Admin notification email ──────────────────────────────────────────────────
function adminEmailHtml(data: BookingEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family:monospace;background:#111;color:#eee;padding:24px;">
  <h2 style="color:#c9a84c;">🎉 New Booking — ${data.bookingRef}</h2>
  <p><strong>Deal:</strong> ${data.dealTitle}</p>
  <p><strong>Hotel:</strong> ${data.hotelName}</p>
  <p><strong>Package:</strong> ${data.packageName}</p>
  <p><strong>Guest:</strong> ${data.guestName} &lt;${data.guestEmail}&gt;</p>
  <p><strong>Check-In:</strong> ${data.checkIn}</p>
  <p><strong>Check-Out:</strong> ${data.checkOut}</p>
  <p><strong>Guests:</strong> ${data.adults} adults, ${data.children} children</p>
  <p><strong>Total:</strong> ${formatCurrency(data.totalAmount, data.currency)}</p>
  <hr style="border-color:#333;">
  <a href="${SITE_URL}/admin" style="color:#c9a84c;">Open Admin Dashboard →</a>
</body>
</html>`;
}

// ── Send functions ────────────────────────────────────────────────────────────
export async function sendCustomerConfirmation(data: BookingEmailData) {
  if (!isEmailEnabled) {
    console.log("\n[EMAIL — Customer Confirmation]");
    console.log("To:", data.guestEmail);
    console.log("Subject: Your LuxEscape Booking is Confirmed —", data.bookingRef);
    console.log("Booking Ref:", data.bookingRef);
    console.log("→ Add RESEND_API_KEY to .env.local to send real emails\n");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "LuxEscape <bookings@luxescape.com>",
    to: data.guestEmail,
    subject: `Your LuxEscape Booking is Confirmed — ${data.bookingRef}`,
    html: customerEmailHtml(data),
  });
}

export async function sendAdminNotification(data: BookingEmailData) {
  if (!isEmailEnabled) {
    console.log("\n[EMAIL — Admin Notification]");
    console.log("To:", ADMIN_EMAIL);
    console.log("New booking:", data.bookingRef, "from", data.guestName);
    console.log("→ Add RESEND_API_KEY to .env.local to send real emails\n");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "LuxEscape <bookings@luxescape.com>",
    to: ADMIN_EMAIL,
    subject: `New Booking ${data.bookingRef} — ${data.guestName} — ${formatCurrency(data.totalAmount, data.currency)}`,
    html: adminEmailHtml(data),
  });
}
