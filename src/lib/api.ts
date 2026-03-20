/**
 * Data fetch helpers — tries Supabase first, falls back to local static data.
 * This lets the app work even if Supabase is unavailable or the schema hasn't
 * been run yet.
 */

import { supabase } from "./supabase";
import { deals as localDeals } from "@/data/deals";
import type { Deal, RoomPackage } from "@/data/deals";
import type { HotelRow, RoomPackageRow } from "./database.types";

// Supabase returns joined data — define the shape explicitly
type HotelWithRooms = HotelRow & { room_packages: RoomPackageRow[] };

// ── Map Supabase row → local Deal shape ──────────────────────────────────────
function mapHotel(hotel: HotelRow, rooms: RoomPackageRow[]): Deal {
  return {
    id: hotel.slug,
    title: hotel.title,
    hotelName: hotel.hotel_name,
    location: hotel.location,
    country: hotel.country,
    region: hotel.region ?? "",
    nights: hotel.nights,
    originalPrice: hotel.original_price,
    salePrice: hotel.sale_price,
    discount: hotel.discount ?? 0,
    category: hotel.category,
    images: hotel.images ?? [],
    rating: hotel.rating ?? 0,
    reviewCount: hotel.review_count ?? 0,
    starRating: hotel.star_rating ?? 5,
    description: hotel.description ?? "",
    highlights: hotel.highlights ?? [],
    includes: hotel.includes ?? [],
    amenities: hotel.amenities ?? [],
    rooms: rooms.map(mapRoom),
    validFrom: hotel.valid_from ?? "",
    validTo: hotel.valid_to ?? "",
    bookBy: hotel.book_by ?? "",
    gettingThere: hotel.getting_there ?? "",
    finePrint: hotel.fine_print ?? [],
    cancellationPolicy: hotel.cancellation_policy ?? "",
    flexibleCancellation: hotel.flexible_cancellation ?? "",
  };
}

function mapRoom(r: RoomPackageRow): RoomPackage {
  return {
    id: r.package_slug,
    name: r.name,
    nights: r.nights,
    originalPrice: r.original_price,
    salePrice: r.sale_price,
    perNight: r.per_night ?? 0,
    beds: r.beds ?? "1 King Bed",
    maxGuests: r.max_guests ?? 2,
    features: r.features ?? [],
  };
}

// ── Fetch ALL deals ───────────────────────────────────────────────────────────
export async function fetchDeals(): Promise<Deal[]> {
  try {
    const { data, error } = await supabase
      .from("hotels")
      .select(`*, room_packages(*)`)
      .eq("is_active", true)
      .order("slug");

    if (error || !data || data.length === 0) {
      console.warn("[fetchDeals] Falling back to local data:", error?.message);
      return localDeals;
    }

    return (data as HotelWithRooms[]).map((hotel) =>
      mapHotel(hotel, hotel.room_packages ?? [])
    );
  } catch (err) {
    console.warn("[fetchDeals] Exception, using local data:", err);
    return localDeals;
  }
}

// ── Fetch deals by category ──────────────────────────────────────────────────
export async function fetchDealsByCategory(
  category: string
): Promise<Deal[]> {
  if (category === "all") return fetchDeals();

  try {
    const { data, error } = await supabase
      .from("hotels")
      .select(`*, room_packages(*)`)
      .eq("is_active", true)
      .eq("category", category)
      .order("slug");

    if (error || !data || data.length === 0) {
      const all = await fetchDeals();
      return all.filter((d) => d.category === category);
    }

    return (data as HotelWithRooms[]).map((hotel) =>
      mapHotel(hotel, hotel.room_packages ?? [])
    );
  } catch {
    const all = await fetchDeals();
    return all.filter((d) => d.category === category);
  }
}

// ── Fetch single deal by slug ────────────────────────────────────────────────
export async function fetchDealById(id: string): Promise<Deal | null> {
  try {
    const { data, error } = await supabase
      .from("hotels")
      .select(`*, room_packages(*)`)
      .eq("slug", id)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      console.warn("[fetchDealById] Falling back to local data:", error?.message);
      return localDeals.find((d) => d.id === id) ?? null;
    }

    const row = data as HotelWithRooms;
    return mapHotel(row, row.room_packages ?? []);
  } catch (err) {
    console.warn("[fetchDealById] Exception, using local data:", err);
    return localDeals.find((d) => d.id === id) ?? null;
  }
}

// ── Fetch static params (for generateStaticParams) ──────────────────────────
export async function fetchAllSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("hotels")
      .select("slug")
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return localDeals.map((d) => d.id);
    }
    return (data as Pick<HotelRow, 'slug'>[]).map((h) => h.slug);
  } catch {
    return localDeals.map((d) => d.id);
  }
}
