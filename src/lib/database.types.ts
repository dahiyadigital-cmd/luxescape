// Auto-generated types matching supabase/schema.sql
// Update this file whenever the schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: string;
          slug: string;
          title: string;
          hotel_name: string;
          description: string | null;
          location: string;
          country: string;
          region: string | null;
          category: "beach" | "city" | "adventure" | "wellness";
          original_price: number;
          sale_price: number;
          discount: number | null;
          nights: number;
          star_rating: number | null;
          rating: number | null;
          review_count: number | null;
          images: string[];
          highlights: string[];
          includes: string[];
          amenities: string[];
          fine_print: string[];
          valid_from: string | null;
          valid_to: string | null;
          book_by: string | null;
          getting_there: string | null;
          cancellation_policy: string | null;
          flexible_cancellation: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["hotels"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["hotels"]["Insert"]>;
      };
      room_packages: {
        Row: {
          id: string;
          hotel_id: string;
          package_slug: string;
          name: string;
          nights: number;
          original_price: number;
          sale_price: number;
          per_night: number | null;
          beds: string | null;
          max_guests: number | null;
          features: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["room_packages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["room_packages"]["Insert"]>;
      };
    };
  };
}

// Convenience types
export type HotelRow = Database["public"]["Tables"]["hotels"]["Row"];
export type RoomPackageRow = Database["public"]["Tables"]["room_packages"]["Row"];
export type HotelWithRooms = HotelRow & { room_packages: RoomPackageRow[] };
