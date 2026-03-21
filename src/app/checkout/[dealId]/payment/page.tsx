import { notFound } from "next/navigation";
import { fetchDealById } from "@/lib/api";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import PaymentForm from "./PaymentForm";

interface Props {
  params: Promise<{ dealId: string }>;
  searchParams: Promise<{
    firstName?: string; lastName?: string;
    email?: string; phone?: string;
    checkIn?: string; checkOut?: string;
    adults?: string; children?: string;
    packageId?: string; specialRequests?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CheckoutPaymentPage({ params, searchParams }: Props) {
  const { dealId } = await params;
  const sp = await searchParams;
  const deal = await fetchDealById(dealId);
  if (!deal) notFound();

  const packageId = sp.packageId ?? deal.rooms[0].id;
  const room = deal.rooms.find((r) => r.id === packageId) ?? deal.rooms[0];

  const guestData = {
    firstName: sp.firstName ?? "",
    lastName: sp.lastName ?? "",
    email: sp.email ?? "",
    phone: sp.phone ?? "",
    checkIn: sp.checkIn ?? "",
    checkOut: sp.checkOut ?? "",
    adults: parseInt(sp.adults ?? "2"),
    children: parseInt(sp.children ?? "0"),
    packageId,
    specialRequests: sp.specialRequests ?? "",
  };

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div className="container">
        <CheckoutStepper current={2} />
        <div style={{ marginTop: 36 }}>
          <PaymentForm deal={deal} room={room} guestData={guestData} />
        </div>
      </div>
    </div>
  );
}
