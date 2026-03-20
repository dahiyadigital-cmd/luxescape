import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Suspense } from "react";
import { fetchDealById, fetchAllSlugs } from "@/lib/api";
import type { Metadata } from "next";
import DealDetailClient from "./DealDetailClient";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ adults?: string; children?: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const deal = await fetchDealById(id);
  return {
    title: deal ? `${deal.title} – LuxEscape` : "Deal – LuxEscape",
    description: deal?.description,
  };
}

export default async function DealDetailPage({ params }: Props) {
  const { id } = await params;
  const deal = await fetchDealById(id);
  if (!deal) notFound();

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Back nav */}
      <div
        style={{
          position: "absolute",
          top: 82,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <div className="container">
          <Link
            href="/deals"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(8,8,17,0.55)",
              backdropFilter: "blur(6px)",
              padding: "8px 14px",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <FiArrowLeft size={13} /> All Deals
          </Link>
        </div>
      </div>

      {/* Client component handles all interactivity */}
      <Suspense fallback={<div style={{ paddingTop: 200, textAlign: "center", color: "var(--clr-text-muted)" }}>Loading…</div>}>
        <DealDetailClient deal={deal} />
      </Suspense>
    </div>
  );
}
