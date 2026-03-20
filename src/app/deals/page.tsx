// Server component — fetches deals from Supabase at request time
import { Suspense } from "react";
import { fetchDeals } from "@/lib/api";
import DealsClient from "./DealsClient";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function DealsPage() {
  const deals = await fetchDeals();

  return (
    <Suspense
      fallback={
        <div
          style={{
            paddingTop: 200,
            textAlign: "center",
            color: "var(--clr-text-muted)",
          }}
        >
          Loading deals…
        </div>
      }
    >
      <DealsClient initialDeals={deals} />
    </Suspense>
  );
}
