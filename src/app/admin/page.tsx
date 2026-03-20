import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { HotelWithRooms } from "@/lib/database.types";
import LoginForm from "./LoginForm";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("luxescape_admin")?.value === "authenticated";

  if (!isAuth) {
    return <LoginForm />;
  }

  const { data } = await supabaseAdmin
    .from("hotels")
    .select("*, room_packages(*)")
    .order("slug");

  return <AdminDashboard initialHotels={(data as HotelWithRooms[]) ?? []} />;
}
