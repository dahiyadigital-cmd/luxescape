export interface RoomPackage {
  id: string;
  name: string;
  nights: number;
  originalPrice: number;
  salePrice: number;
  perNight: number;
  beds: string;
  maxGuests: number;
  features: string[];
}

export interface Deal {
  id: string;
  title: string;
  hotelName: string;
  location: string;
  country: string;
  region: string;
  nights: number;
  originalPrice: number;
  salePrice: number;
  discount: number;
  category: "beach" | "city" | "adventure" | "wellness";
  images: string[];
  rating: number;
  reviewCount: number;
  starRating: number;
  description: string;
  highlights: string[];
  includes: string[];
  amenities: string[];
  rooms: RoomPackage[];
  validFrom: string;
  validTo: string;
  bookBy: string;
  gettingThere: string;
  finePrint: string[];
  cancellationPolicy: string;
  flexibleCancellation: string;
}
