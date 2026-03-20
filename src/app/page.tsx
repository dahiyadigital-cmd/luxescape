import { fetchDeals } from "@/lib/api";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const deals = await fetchDeals();
  const featuredDeals = deals.slice(0, 3);

  return <HomeClient featuredDeals={featuredDeals} />;
}
