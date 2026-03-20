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

export const deals: Deal[] = [
  {
    id: "1",
    title: "Maldives Overwater Bungalow Retreat",
    hotelName: "Velaa Private Island Resort",
    location: "Malé Atoll, Maldives",
    country: "Maldives",
    region: "Asia Pacific",
    nights: 7,
    originalPrice: 4200,
    salePrice: 2799,
    discount: 33,
    category: "beach",
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=85",
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=85",
      "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=1200&q=85",
    ],
    rating: 4.9,
    reviewCount: 128,
    starRating: 5,
    description:
      "Float above the turquoise Indian Ocean in a stunning overwater villa at Velaa Private Island Resort. Enjoy private plunge pools, world-class dining, and unparalleled marine life right below your glass floor panel. One of the most exclusive addresses in the Indian Ocean, Velaa offers an intimate five-star experience defined by personalised service and breathtaking natural surroundings.",
    highlights: [
      "Overwater villa with glass floor panel & direct lagoon access",
      "Private plunge pool & sun deck",
      "Complimentary snorkelling equipment & guided reef tour",
      "Sunset dolphin cruise for two",
      "Daily à la carte breakfast included",
      "Welcome bottle of champagne on arrival",
    ],
    includes: [
      "Return flights from Sydney (economy)",
      "7 nights overwater villa accommodation",
      "Daily breakfast & dinner (half-board)",
      "Return seaplane transfers from Malé",
      "Snorkelling equipment hire",
    ],
    amenities: [
      "Overwater Spa",
      "Infinity Pool",
      "ARAGU Fine Dining",
      "Fitness Centre",
      "Water Sports Centre",
      "Wi-Fi",
      "Dive Centre",
      "Kids' Club",
    ],
    rooms: [
      {
        id: "r1a",
        name: "Romantic Escape – 7 Nights Half-Board",
        nights: 7,
        originalPrice: 4200,
        salePrice: 2799,
        perNight: 400,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Overwater Villa", "Glass Floor Panel", "Private Plunge Pool", "Half-Board Dining"],
      },
      {
        id: "r1b",
        name: "Extended Bliss – 10 Nights Half-Board",
        nights: 10,
        originalPrice: 5800,
        salePrice: 3799,
        perNight: 380,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Overwater Villa", "Glass Floor Panel", "Private Plunge Pool", "10% Spa Credit"],
      },
    ],
    validFrom: "15 April 2026",
    validTo: "28 February 2027",
    bookBy: "31 January 2027",
    gettingThere:
      "Velaa Private Island is located in Noonu Atoll, approximately 167 km north of Malé International Airport (MLE). Transfers are by seaplane (approx. 45 minutes) and are included in your package. Please arrange your international flight to Malé.",
    finePrint: [
      "Daily half-board dining includes breakfast and dinner at a selected restaurant. Beverages are not included unless stated.",
      "Dolphin cruise subject to weather conditions. Alternative activity offered if unavailable.",
      "Welcome champagne is a Moët & Chandon Brut. Subject to availability and may change.",
      "Seaplane transfers operate during daylight hours only. Guests arriving after sunset will be transferred by speedboat.",
      "Valid for travel 2 adults. Child pricing available on request.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Bookings may be cancelled with a full refund within 7 days of purchase, provided the check-in date is at least 14 days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months. Self-service available via your My Escapes account.",
  },
  {
    id: "2",
    title: "Amalfi Coast Cliffside Luxury",
    hotelName: "Le Sirenuse Hotel",
    location: "Positano, Amalfi Coast",
    country: "Italy",
    region: "Europe",
    nights: 5,
    originalPrice: 3800,
    salePrice: 2399,
    discount: 37,
    category: "city",
    images: [
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=1200&q=85",
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1200&q=85",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    ],
    rating: 4.8,
    reviewCount: 95,
    starRating: 5,
    description:
      "Perched on the sun-drenched cliffs of the Amalfi Coast, Le Sirenuse is one of Italy's most celebrated hotels. Breathtaking sea views, limoncello welcome drinks, and a private beach club combine to deliver an unforgettable Mediterranean experience. Wander cobblestone streets, sip Aperol Spritzes overlooking the Tyrrhenian Sea, and discover the magic of Italy's most iconic coastline.",
    highlights: [
      "Infinity pool with panoramic Tyrrhenian Sea views",
      "Private beach club access with sun loungers",
      "Limoncello welcome ceremony on arrival",
      "Cooking class with award-winning local chef",
      "Vintage Riva speedboat excursion along the coast",
      "Daily buffer breakfast at La Sponda restaurant",
    ],
    includes: [
      "Return flights from London (economy)",
      "5 nights deluxe sea-view room",
      "Daily breakfast at La Sponda",
      "Return private airport transfers",
      "Beach club access & towel service",
    ],
    amenities: [
      "Infinity Pool",
      "Private Beach Club",
      "La Sponda Restaurant",
      "Rooftop Bar",
      "Spa & Wellness",
      "Concierge",
      "Wi-Fi",
      "Fitness Room",
    ],
    rooms: [
      {
        id: "r2a",
        name: "Dolce Vita – 5 Nights Breakfast",
        nights: 5,
        originalPrice: 3800,
        salePrice: 2399,
        perNight: 480,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Sea-View Balcony", "Daily Breakfast", "Beach Club Access", "Welcome Limoncello"],
      },
      {
        id: "r2b",
        name: "La Dolce Vita Extended – 7 Nights",
        nights: 7,
        originalPrice: 5100,
        salePrice: 3199,
        perNight: 457,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Junior Suite", "Daily Breakfast", "Spa Credit €150", "Boat Excursion"],
      },
    ],
    validFrom: "1 May 2026",
    validTo: "31 October 2026",
    bookBy: "30 September 2026",
    gettingThere:
      "Le Sirenuse is located in Positano on the Amalfi Coast. The nearest airports are Naples (NAP, approx. 60 km) and Rome Fiumicino (FCO, approx. 280 km). Private transfers from Naples Airport are included. The Amalfi Coast road is a scenic but winding drive — allow extra time.",
    finePrint: [
      "Breakfast is served daily at La Sponda restaurant, 7am – 11am.",
      "Beach club access subject to availability during peak season (July–August).",
      "Cooking class dates must be pre-booked at least 48 hours in advance.",
      "Blackout surcharges apply to select peak summer dates.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months from cancellation date.",
  },
  {
    id: "3",
    title: "Bali Wellness & Jungle Spa",
    hotelName: "COMO Shambhala Estate",
    location: "Ubud, Bali",
    country: "Indonesia",
    region: "Asia Pacific",
    nights: 6,
    originalPrice: 2100,
    salePrice: 1299,
    discount: 38,
    category: "wellness",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=85",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85",
    ],
    rating: 4.7,
    reviewCount: 213,
    starRating: 5,
    description:
      "Nestled in the lush jungle of Ubud, COMO Shambhala Estate is Bali's premier wellness retreat. Set on forested hillside above the sacred Ayung River, the estate offers a holistic approach to well-being: daily yoga and meditation, traditional Balinese healing rituals, organic cuisine, and hypnotic jungle sounds that make sleep feel effortless.",
    highlights: [
      "Daily sunrise yoga & guided meditation sessions",
      "3 x traditional Balinese massages (60 min each)",
      "Rice terrace sunrise trekking guided tour",
      "Balinese cooking class & temple blessing ceremony",
      "All-organic, farm-to-table meals throughout your stay",
      "Personalised wellness consultation on arrival",
    ],
    includes: [
      "Return flights from Melbourne (economy)",
      "6 nights luxury villa on the estate",
      "All meals included (full-board)",
      "Spa credit IDR 2,000,000 (~AUD$200)",
      "Return airport transfers from Ngurah Rai (DPS)",
    ],
    amenities: [
      "Open-Air Yoga Pavilion",
      "Jungle Spa",
      "Ayung River Valley Views",
      "Organic Restaurant",
      "Meditation Decks",
      "Library",
      "Wi-Fi",
      "Infinity Pool",
    ],
    rooms: [
      {
        id: "r3a",
        name: "Jungle Wellness – 6 Nights Full-Board",
        nights: 6,
        originalPrice: 2100,
        salePrice: 1299,
        perNight: 217,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Garden Villa", "Full-Board Dining", "3 Massages", "Yoga Classes"],
      },
      {
        id: "r3b",
        name: "Deep Immersion – 9 Nights Full-Board",
        nights: 9,
        originalPrice: 3000,
        salePrice: 1849,
        perNight: 205,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["River-View Villa", "Full-Board", "5 Massages", "Private Cooking Class"],
      },
    ],
    validFrom: "1 June 2026",
    validTo: "31 March 2027",
    bookBy: "28 February 2027",
    gettingThere:
      "COMO Shambhala Estate is located approximately 15 km north of central Ubud. Transfers from Ngurah Rai International Airport (DPS, Denpasar) take approximately 90 minutes and are included in your package.",
    finePrint: [
      "Full-board dining covers breakfast, lunch and dinner at Glow Restaurant. Juices and specialty beverages are not included.",
      "Spa credit is non-transferable and cannot be redeemed for cash.",
      "Yoga and meditation sessions run at fixed times (6:30am & 5pm). Pre-booking recommended.",
      "Temple ceremony involves modest dress code. Sarong provided.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months.",
  },
  {
    id: "4",
    title: "Swiss Alps Winter Chalet",
    hotelName: "W Verbier",
    location: "Verbier, Valais Canton",
    country: "Switzerland",
    region: "Europe",
    nights: 5,
    originalPrice: 5200,
    salePrice: 3499,
    discount: 33,
    category: "adventure",
    images: [
      "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1200&q=85",
      "https://images.unsplash.com/photo-1485841890310-6a055c88698a?w=1200&q=85",
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=1200&q=85",
    ],
    rating: 4.9,
    reviewCount: 77,
    starRating: 5,
    description:
      "Verbier is Switzerland's most glamorous ski resort, and W Verbier places you at its heart. This iconic property combines the energy of a world-class ski resort with the edge of W Hotels' signature style: WET pool deck, AWAY Spa, and a social scene that runs from first lift to last après-ski. With 410 km of pistes on your doorstep, skiers and snowboarders of all levels are spoiled for choice.",
    highlights: [
      "5-day Mont Fort ski pass for 4 Valleys ski area",
      "2 x private ski instructor sessions (2 hours each)",
      "AWAY Spa access including sauna & hot tub",
      "Traditional Swiss fondue gourmet dinner for two",
      "Ski equipment hire included for 5 days",
      "Welcome W Hotels amenity on arrival",
    ],
    includes: [
      "Return flights from London (economy)",
      "5 nights hotel room (ski-in/ski-out)",
      "Daily breakfast at W Kitchen",
      "5-day ski pass",
      "Ski equipment hire",
    ],
    amenities: [
      "Ski-In / Ski-Out Access",
      "AWAY Spa",
      "WET Outdoor Pool Deck",
      "W Kitchen Restaurant",
      "Living Room Bar",
      "Fitness Studio",
      "Ski Concierge",
      "Wi-Fi",
    ],
    rooms: [
      {
        id: "r4a",
        name: "Ski & Stay – 5 Nights Breakfast",
        nights: 5,
        originalPrice: 5200,
        salePrice: 3499,
        perNight: 700,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Mountain-View Room", "Daily Breakfast", "5-Day Ski Pass", "Ski Equipment"],
      },
      {
        id: "r4b",
        name: "Powder Week – 7 Nights Breakfast",
        nights: 7,
        originalPrice: 7000,
        salePrice: 4599,
        perNight: 657,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Suite with Terrace", "Daily Breakfast", "7-Day Ski Pass", "Spa Credit CHF 200"],
      },
    ],
    validFrom: "1 December 2026",
    validTo: "31 March 2027",
    bookBy: "30 November 2026",
    gettingThere:
      "W Verbier is located in the centre of Verbier village. The nearest airport is Geneva (GVA), approximately 130 km away (2 hours by car or train connection to Le Châble + gondola). Transfers are not included — we recommend the train to Le Châble then the gondola to Verbier.",
    finePrint: [
      "Ski pass valid for 4 Valleys ski area (Mont Fort, Verbier, La Tzoumaz, Nendaz, Veysonnaz). Saas-Fee not included.",
      "Ski instructor sessions must be pre-booked at least 72 hours in advance through the concierge.",
      "Ski equipment hire includes boots, skis or snowboard for 5 days. Helmet hire additional.",
      "Peak surcharges apply to Christmas (24–27 Dec) and New Year (29 Dec – 2 Jan) dates.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months.",
  },
  {
    id: "5",
    title: "Tokyo Luxury Ryokan Experience",
    hotelName: "Gora Kadan Ryokan",
    location: "Hakone, Kanagawa",
    country: "Japan",
    region: "Asia Pacific",
    nights: 4,
    originalPrice: 2800,
    salePrice: 1799,
    discount: 36,
    category: "city",
    images: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=85",
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1200&q=85",
    ],
    rating: 4.8,
    reviewCount: 162,
    starRating: 5,
    description:
      "Gora Kadan is a legendary ryokan built within the former imperial family's Hakone summer villa. Sleep on hand-laid tatami mats, soak in private open-air onsen with views of the surrounding mountains, and feast on exquisite kaiseki cuisine prepared by award-winning chefs. On clear days, the iconic silhouette of Mt Fuji appears on the horizon — a sight that defines Japanese beauty.",
    highlights: [
      "Private open-air onsen (rotenburo) with mountain views",
      "Mt Fuji viewing deck (weather permitting)",
      "Traditional kaiseki multi-course dinner & breakfast daily",
      "Authentic Japanese tea ceremony experience",
      "Yukata (kimono robe) provided for duration of stay",
      "Shinkansen (bullet train) pass for Hakone return included",
    ],
    includes: [
      "Return flights from Sydney (economy)",
      "4 nights in a traditional tatami suite",
      "Daily kaiseki dinner & breakfast (half-board)",
      "Hakone Shinkansen pass",
      "Airport transfer from Haneda (HND)",
    ],
    amenities: [
      "Private Outdoor Onsen",
      "Communal Rotenburo Baths",
      "Kaiseki Restaurant",
      "Tea Ceremony Room",
      "Garden & Forest Walks",
      "Washi Paper Workshop",
      "Wi-Fi",
      "Concierge",
    ],
    rooms: [
      {
        id: "r5a",
        name: "Mt Fuji Escape – 4 Nights Half-Board",
        nights: 4,
        originalPrice: 2800,
        salePrice: 1799,
        perNight: 450,
        beds: "Futon on Tatami",
        maxGuests: 2,
        features: ["Tatami Suite", "Private Onsen", "Half-Board Kaiseki", "Yukata Included"],
      },
      {
        id: "r5b",
        name: "Extended Zen – 6 Nights Half-Board",
        nights: 6,
        originalPrice: 3900,
        salePrice: 2499,
        perNight: 417,
        beds: "Futon on Tatami",
        maxGuests: 2,
        features: ["Panoramic Mountain Suite", "Private Onsen", "Half-Board", "Sake Welcome"],
      },
    ],
    validFrom: "1 April 2026",
    validTo: "28 February 2027",
    bookBy: "31 January 2027",
    gettingThere:
      "Gora Kadan is located in Gora, Hakone, approximately 90 minutes from central Tokyo by Odakyu Romancecar or Shinkansen to Odawara then local train. Haneda Airport (HND) is approx. 90 minutes by train. Transfer from Haneda to Gora station is included.",
    finePrint: [
      "Kaiseki dinner is a multi-course seasonal tasting menu. Vegetarian and dietary requests must be made 72 hours in advance.",
      "Private onsen hours are 6am–11pm. Indoor communal baths open 24 hours.",
      "Mt Fuji viewing deck experience is subject to weather and visibility conditions.",
      "Tea ceremony held at 3pm daily; pre-booking required.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months.",
  },
  {
    id: "6",
    title: "Santorini Sunset Cave Suite",
    hotelName: "Canaves Oia Epitome",
    location: "Oia, Santorini",
    country: "Greece",
    region: "Europe",
    nights: 6,
    originalPrice: 4500,
    salePrice: 2899,
    discount: 36,
    category: "beach",
    images: [
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&q=85",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=85",
    ],
    rating: 4.9,
    reviewCount: 304,
    starRating: 5,
    description:
      "Perched atop the iconic white-washed caldera cliffs of Oia, Canaves Oia Epitome is one of the most celebrated small luxury hotels in the world. The Santorini sunset from your private terrace jacuzzi is considered among the most romantic moments in travel — a memory that outlasts the journey. World-class Cycladic cuisine, private catamaran cruises around the caldera, and a dedicated butler complete this extraordinary escape.",
    highlights: [
      "Private cave suite with direct caldera & sunset views",
      "Jacuzzi on your private terrace",
      "Sunset private catamaran cruise around the caldera",
      "Wine tasting at a centuries-old Santorini vineyard",
      "Daily à la carte breakfast (in-room or at restaurant)",
      "Dining credit €150 at Petra Restaurant",
    ],
    includes: [
      "Return flights from London (economy)",
      "6 nights cave suite with caldera views",
      "Daily à la carte breakfast",
      "Return transfers from Santorini (JTR) airport",
      "Catamaran sunset cruise for two",
    ],
    amenities: [
      "Private Caldera-View Terrace",
      "Infinity Pool",
      "Petra Restaurant",
      "Wine Cellar",
      "Yoga Deck",
      "Concierge",
      "Wi-Fi",
      "Spa",
    ],
    rooms: [
      {
        id: "r6a",
        name: "Caldera Romance – 6 Nights Breakfast",
        nights: 6,
        originalPrice: 4500,
        salePrice: 2899,
        perNight: 483,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Cave Suite", "Caldera Views", "Terrace Jacuzzi", "Daily Breakfast"],
      },
      {
        id: "r6b",
        name: "Ultimate Santorini – 8 Nights",
        nights: 8,
        originalPrice: 5800,
        salePrice: 3699,
        perNight: 462,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Premium Cave Suite", "Terrace Jacuzzi", "Dinner Credit €200", "Yacht Day Charter"],
      },
    ],
    validFrom: "1 May 2026",
    validTo: "31 October 2026",
    bookBy: "30 September 2026",
    gettingThere:
      "Canaves Oia Epitome is located at the northern tip of Santorini island in Oia village. The nearest airport is Santorini (JTR), approximately 18 km south (30–40 minute drive). Return transfers from JTR Airport are included in your package.",
    finePrint: [
      "Breakfast is served daily, 8am–11am. In-room breakfast available with 24-hour advance notice.",
      "Catamaran cruise departs from Ammoudi Bay. Exact departure time confirmed at check-in.",
      "Dining credit valid at Petra Restaurant only for food and beverages. Not redeemable for cash.",
      "Peak surcharges apply to select dates in July and August.",
      "Jacuzzi suites are located on cliff-face terraces. Guests should be comfortable with heights.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months.",
  },
  {
    id: "7",
    title: "Dubai Ultra-Luxury Sky Escape",
    hotelName: "Burj Al Arab Jumeirah",
    location: "Jumeirah Beach, Dubai",
    country: "UAE",
    region: "Middle East",
    nights: 4,
    originalPrice: 6800,
    salePrice: 4299,
    discount: 37,
    category: "city",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=85",
    ],
    rating: 4.9,
    reviewCount: 89,
    starRating: 5,
    description:
      "Rise above the Arabian Gulf in one of the world's most iconic hotels. The Burj Al Arab Jumeirah is a global symbol of ultra-luxury — from its soaring sail-shaped silhouette to its two-storey suites dressed in gold and marble. Expect Rolls-Royce airport transfers, butler service around the clock, and dining experiences unlike anything else on earth.",
    highlights: [
      "Duplex suite with panoramic Arabian Gulf views",
      "Rolls-Royce transfer from Dubai International Airport",
      "Private beach & six outdoor pool access",
      "Complimentary Skyview Bar cocktail experience",
      "In-suite butler service 24 hours",
      "Talise Spa access with signature 60-min treatment",
    ],
    includes: [
      "Return flights from London (business class)",
      "4 nights signature duplex suite",
      "Daily à la carte breakfast at Al Iwan",
      "Rolls-Royce airport return transfers",
      "Talise Spa treatment (60 min per person)",
    ],
    amenities: [
      "Private Beach",
      "6 Outdoor Pools",
      "Talise Spa",
      "Skyview Bar",
      "Al Muntaha Restaurant",
      "In-Suite Butler",
      "Wi-Fi",
      "Fitness & Aqua Club",
    ],
    rooms: [
      {
        id: "r7a",
        name: "Sky Escape – 4 Nights Breakfast",
        nights: 4,
        originalPrice: 6800,
        salePrice: 4299,
        perNight: 1075,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Duplex Suite", "Gulf Views", "Butler Service", "Daily Breakfast"],
      },
      {
        id: "r7b",
        name: "Royal Sky Week – 7 Nights",
        nights: 7,
        originalPrice: 11000,
        salePrice: 6999,
        perNight: 1000,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Panoramic Suite", "Half-Board Dining", "Spa Credit AED 500", "Yacht Excursion"],
      },
    ],
    validFrom: "1 September 2026",
    validTo: "30 June 2027",
    bookBy: "31 May 2027",
    gettingThere:
      "The Burj Al Arab is located on a private island off Jumeirah Beach, connected to the mainland by a private bridge. Dubai International Airport (DXB) is approximately 20 km away. Rolls-Royce return transfers are included in your package.",
    finePrint: [
      "Business class flights are on select carriers and routes. Seat selection charges may apply.",
      "Rolls-Royce transfer is a shared schedule service and must be pre-booked 48 hours in advance.",
      "Spa treatment booking required at least 24 hours prior. Subject to availability.",
      "Skyview Bar complimentary experience valid once per stay per room. Dress code smart casual.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months.",
  },
  {
    id: "8",
    title: "Seychelles Private Island Hideaway",
    hotelName: "North Island Lodge",
    location: "North Island, Seychelles",
    country: "Seychelles",
    region: "Africa & Indian Ocean",
    nights: 7,
    originalPrice: 9500,
    salePrice: 6199,
    discount: 35,
    category: "beach",
    images: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=85",
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85",
    ],
    rating: 5.0,
    reviewCount: 56,
    starRating: 5,
    description:
      "Only 11 villas occupy the entire 201-hectare North Island. This is one of the most exclusive private island resorts on the planet — a conservation paradise where giant tortoises roam, rare birds nest, and your only neighbours are the Indian Ocean and a sky full of stars. Staff outnumber guests, the beaches are empty, and every detail is curated to perfection.",
    highlights: [
      "Exclusive island with only 11 private beach villas",
      "Dedicated villa host & private chef service",
      "Unlimited snorkelling, kayaking & diving excursions",
      "Giant tortoise conservation walks",
      "Private cinema on the beach (upon request)",
      "All meals, premium beverages & minibar included",
    ],
    includes: [
      "Return flights from London (business class)",
      "7 nights beachfront villa",
      "All-inclusive (meals, beverages, excursions)",
      "Return helicopter transfers from Mahé (SEZ)",
      "Conservation island walk with naturalist guide",
    ],
    amenities: [
      "Private Beach Villa",
      "Plunge Pool",
      "All-Inclusive Dining",
      "Diving & Water Sports",
      "Giant Tortoise Reserve",
      "Island Spa",
      "Wi-Fi",
      "Dedicated Villa Host",
    ],
    rooms: [
      {
        id: "r8a",
        name: "Paradise Escape – 7 Nights All-Inclusive",
        nights: 7,
        originalPrice: 9500,
        salePrice: 6199,
        perNight: 886,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Beachfront Villa", "Plunge Pool", "All-Inclusive", "Helicopter Transfer"],
      },
      {
        id: "r8b",
        name: "Ultimate Island – 10 Nights All-Inclusive",
        nights: 10,
        originalPrice: 12500,
        salePrice: 7999,
        perNight: 800,
        beds: "1 King Bed",
        maxGuests: 2,
        features: ["Beachfront Villa", "Plunge Pool", "Private Chef Dinner", "Sunset Cruise"],
      },
    ],
    validFrom: "1 April 2026",
    validTo: "31 March 2027",
    bookBy: "28 February 2027",
    gettingThere:
      "North Island is accessible by helicopter only. Mahé International Airport (SEZ) is the arrival point — return helicopter transfers (approx. 30 minutes) from Mahé to North Island are included in your package.",
    finePrint: [
      "All-inclusive includes all meals, house wines, spirits, soft drinks, and non-motorised water sports. Motorised water sports billed separately.",
      "Helicopter transfers operate weather dependent. In the event of cancellation, speedboat transfer will be arranged.",
      "Scuba diving is available at an additional charge. PADI certification required for independent diving.",
      "No children under 6 are permitted on property.",
    ],
    cancellationPolicy:
      "7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.",
    flexibleCancellation:
      "Cancel for credit up to 21 days before check-in. Credit valid for 12 months.",
  },
];
