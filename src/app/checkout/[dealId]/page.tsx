import { notFound } from "next/navigation";
import { fetchDealById } from "@/lib/api";
import GuestDetailsForm from "./GuestDetailsForm";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";

interface Props {
  params: Promise<{ dealId: string }>;
  searchParams: Promise<{ adults?: string; children?: string; package?: string }>;
}

export const dynamic = "force-dynamic";

export default async function CheckoutDetailsPage({ params, searchParams }: Props) {
  const { dealId } = await params;
  const sp = await searchParams;
  const deal = await fetchDealById(dealId);
  if (!deal) notFound();

  const adults = parseInt(sp.adults ?? "2");
  const children = parseInt(sp.children ?? "0");
  const packageId = sp.package ?? deal.rooms[0].id;

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div className="container">
        <CheckoutStepper current={1} />
        <div style={{ marginTop: 36 }}>
          <GuestDetailsForm deal={deal} adults={adults} children={children} packageId={packageId} />
        </div>
      </div>
    </div>
  );
}
