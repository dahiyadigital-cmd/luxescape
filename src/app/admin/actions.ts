"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { HotelRow } from "@/lib/database.types";

const COOKIE_NAME = "luxescape_admin";

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAction(_prevState: { error?: string }, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "luxescape2024";

  if (password !== adminPassword) {
    return { error: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function lines(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return (v as string).split("\n").map((s) => s.trim()).filter(Boolean);
}

function num(v: FormDataEntryValue | null): number {
  return Number(v) || 0;
}

function str(v: FormDataEntryValue | null): string {
  return (v as string) ?? "";
}

function buildHotelPayload(formData: FormData) {
  return {
    title: str(formData.get("title")),
    hotel_name: str(formData.get("hotel_name")),
    description: str(formData.get("description")),
    location: str(formData.get("location")),
    country: str(formData.get("country")),
    region: str(formData.get("region")),
    category: str(formData.get("category")),
    original_price: num(formData.get("original_price")),
    sale_price: num(formData.get("sale_price")),
    discount: num(formData.get("discount")),
    nights: num(formData.get("nights")),
    star_rating: num(formData.get("star_rating")),
    rating: num(formData.get("rating")),
    review_count: num(formData.get("review_count")),
    images: lines(formData.get("images")),
    highlights: lines(formData.get("highlights")),
    includes: lines(formData.get("includes")),
    amenities: lines(formData.get("amenities")),
    fine_print: lines(formData.get("fine_print")),
    valid_from: str(formData.get("valid_from")),
    valid_to: str(formData.get("valid_to")),
    book_by: str(formData.get("book_by")),
    getting_there: str(formData.get("getting_there")),
    cancellation_policy: str(formData.get("cancellation_policy")),
    flexible_cancellation: str(formData.get("flexible_cancellation")),
  };
}

function buildPackages(hotelId: string, formData: FormData) {
  const pkgs = [];
  for (let i = 1; i <= 2; i++) {
    const slug = str(formData.get(`pkg${i}_slug`));
    if (!slug) continue;
    pkgs.push({
      hotel_id: hotelId,
      package_slug: slug,
      name: str(formData.get(`pkg${i}_name`)),
      nights: num(formData.get(`pkg${i}_nights`)),
      original_price: num(formData.get(`pkg${i}_original_price`)),
      sale_price: num(formData.get(`pkg${i}_sale_price`)),
      per_night: num(formData.get(`pkg${i}_per_night`)),
      beds: str(formData.get(`pkg${i}_beds`)),
      max_guests: num(formData.get(`pkg${i}_max_guests`)) || 2,
      features: lines(formData.get(`pkg${i}_features`)),
    });
  }
  return pkgs;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createDealAction(formData: FormData) {
  const { data: hotel, error } = await supabaseAdmin
    .from("hotels")
    .insert({ ...buildHotelPayload(formData), slug: str(formData.get("slug")), is_active: true })
    .select()
    .single() as { data: HotelRow | null; error: { message: string } | null };

  if (error) return { error: error.message };
  if (!hotel) return { error: "Failed to create deal" };

  const pkgs = buildPackages(hotel.id, formData);
  if (pkgs.length > 0) {
    const { error: pkgErr } = await supabaseAdmin.from("room_packages").insert(pkgs);
    if (pkgErr) return { error: pkgErr.message };
  }

  revalidatePath("/deals");
  revalidatePath("/");
  return { success: true, hotel };
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateDealAction(hotelId: string, formData: FormData) {
  const { data: hotel, error } = await supabaseAdmin
    .from("hotels")
    .update(buildHotelPayload(formData))
    .eq("id", hotelId)
    .select()
    .single() as { data: HotelRow | null; error: { message: string } | null };

  if (error) return { error: error.message };

  await supabaseAdmin.from("room_packages").delete().eq("hotel_id", hotelId);
  const pkgs = buildPackages(hotelId, formData);
  if (pkgs.length > 0) {
    await supabaseAdmin.from("room_packages").insert(pkgs);
  }

  revalidatePath("/deals");
  revalidatePath("/");
  return { success: true, hotel };
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteDealAction(hotelId: string) {
  const { error } = await supabaseAdmin.from("hotels").delete().eq("id", hotelId);
  if (error) return { error: error.message };

  revalidatePath("/deals");
  revalidatePath("/");
  return { success: true };
}

// ── Toggle active ─────────────────────────────────────────────────────────────

export async function toggleActiveAction(hotelId: string, isActive: boolean) {
  const { error } = await supabaseAdmin
    .from("hotels")
    .update({ is_active: isActive })
    .eq("id", hotelId);

  if (error) return { error: error.message };

  revalidatePath("/deals");
  revalidatePath("/");
  return { success: true };
}
