import { supabase } from "./supabase";
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
  const { data, error } = await supabase
    .from("hotels")
    .select(`*, room_packages(*)`)
    .eq("is_active", true)
    .order("slug");

  if (error) throw new Error(error.message);
  return (data as HotelWithRooms[]).map((hotel) =>
    mapHotel(hotel, hotel.room_packages ?? [])
  );
}

// ── Fetch deals by category ──────────────────────────────────────────────────
export async function fetchDealsByCategory(category: string): Promise<Deal[]> {
  if (category === "all") return fetchDeals();

  const { data, error } = await supabase
    .from("hotels")
    .select(`*, room_packages(*)`)
    .eq("is_active", true)
    .eq("category", category)
    .order("slug");

  if (error) throw new Error(error.message);
  return (data as HotelWithRooms[]).map((hotel) =>
    mapHotel(hotel, hotel.room_packages ?? [])
  );
}

// ── Fetch single deal by slug ────────────────────────────────────────────────
export async function fetchDealById(id: string): Promise<Deal | null> {
  const { data, error } = await supabase
    .from("hotels")
    .select(`*, room_packages(*)`)
    .eq("slug", id)
    .eq("is_active", true)
    .single();

  if (error) return null;
  const row = data as HotelWithRooms;
  return mapHotel(row, row.room_packages ?? []);
}

// ── Fetch static params (for generateStaticParams) ──────────────────────────
export async function fetchAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("slug")
    .eq("is_active", true);

  if (error || !data) return [];
  return (data as Pick<HotelRow, "slug">[]).map((h) => h.slug);
}
