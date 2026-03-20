-- =============================================================
-- LuxEscape – Supabase Schema + Mock Data
-- Run this in Supabase SQL Editor (Settings → SQL Editor → New query)
-- =============================================================


-- ── 1. TABLES ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS hotels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  hotel_name      TEXT NOT NULL,
  description     TEXT,
  location        TEXT NOT NULL,
  country         TEXT NOT NULL,
  region          TEXT,
  category        TEXT CHECK (category IN ('beach','city','adventure','wellness')) NOT NULL,
  original_price  NUMERIC(10,2) NOT NULL,
  sale_price      NUMERIC(10,2) NOT NULL,
  discount        INTEGER,
  nights          INTEGER NOT NULL DEFAULT 5,
  star_rating     INTEGER CHECK (star_rating BETWEEN 1 AND 5) DEFAULT 5,
  rating          NUMERIC(3,1),
  review_count    INTEGER DEFAULT 0,
  images          TEXT[]  DEFAULT '{}',
  highlights      TEXT[]  DEFAULT '{}',
  includes        TEXT[]  DEFAULT '{}',
  amenities       TEXT[]  DEFAULT '{}',
  fine_print      TEXT[]  DEFAULT '{}',
  valid_from      TEXT,
  valid_to        TEXT,
  book_by         TEXT,
  getting_there         TEXT,
  cancellation_policy   TEXT,
  flexible_cancellation TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_packages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id        UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  package_slug    TEXT NOT NULL,
  name            TEXT NOT NULL,
  nights          INTEGER NOT NULL,
  original_price  NUMERIC(10,2) NOT NULL,
  sale_price      NUMERIC(10,2) NOT NULL,
  per_night       NUMERIC(10,2),
  beds            TEXT,
  max_guests      INTEGER DEFAULT 2,
  features        TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ── 2. INDEXES ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_hotels_category     ON hotels(category);
CREATE INDEX IF NOT EXISTS idx_hotels_slug         ON hotels(slug);
CREATE INDEX IF NOT EXISTS idx_hotels_is_active    ON hotels(is_active);
CREATE INDEX IF NOT EXISTS idx_room_packages_hotel ON room_packages(hotel_id);


-- ── 3. AUTO-UPDATE updated_at ─────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS hotels_updated_at ON hotels;
CREATE TRIGGER hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── 4. ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE hotels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hotels"        ON hotels;
DROP POLICY IF EXISTS "Public read room_packages" ON room_packages;

CREATE POLICY "Public read hotels"
  ON hotels FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public read room_packages"
  ON room_packages FOR SELECT
  USING (TRUE);


-- ── 5. MOCK DATA: HOTELS ──────────────────────────────────────

INSERT INTO hotels (
  slug, title, hotel_name, description,
  location, country, region, category,
  original_price, sale_price, discount, nights,
  star_rating, rating, review_count,
  images, highlights, includes, amenities, fine_print,
  valid_from, valid_to, book_by,
  getting_there, cancellation_policy, flexible_cancellation
) VALUES

-- Deal 1: Maldives
(
  '1',
  'Maldives Overwater Bungalow Retreat',
  'Velaa Private Island Resort',
  'Float above the turquoise Indian Ocean in a stunning overwater villa at Velaa Private Island Resort. Enjoy private plunge pools, world-class dining, and unparalleled marine life right below your glass floor panel.',
  'Malé Atoll, Maldives', 'Maldives', 'Asia Pacific', 'beach',
  4200.00, 2799.00, 33, 7,
  5, 4.9, 128,
  ARRAY[
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=85',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=85',
    'https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=1200&q=85'
  ],
  ARRAY[
    'Overwater villa with glass floor panel & direct lagoon access',
    'Private plunge pool & sun deck',
    'Complimentary snorkelling equipment & guided reef tour',
    'Sunset dolphin cruise for two',
    'Daily à la carte breakfast included',
    'Welcome bottle of champagne on arrival'
  ],
  ARRAY[
    'Return flights from Sydney (economy)',
    '7 nights overwater villa accommodation',
    'Daily breakfast & dinner (half-board)',
    'Return seaplane transfers from Malé',
    'Snorkelling equipment hire'
  ],
  ARRAY['Overwater Spa','Infinity Pool','ARAGU Fine Dining','Fitness Centre','Water Sports Centre','Wi-Fi','Dive Centre','Kids'' Club'],
  ARRAY[
    'Daily half-board dining includes breakfast and dinner at a selected restaurant. Beverages are not included unless stated.',
    'Dolphin cruise subject to weather conditions. Alternative activity offered if unavailable.',
    'Seaplane transfers operate during daylight hours only. Guests arriving after sunset will be transferred by speedboat.'
  ],
  '15 April 2026', '28 February 2027', '31 January 2027',
  'Velaa Private Island is located in Noonu Atoll, approximately 167 km north of Malé International Airport (MLE). Transfers are by seaplane (approx. 45 minutes) and are included in your package.',
  '7-Day Change of Mind Guarantee: Bookings may be cancelled with a full refund within 7 days of purchase, provided the check-in date is at least 14 days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months. Self-service available via your My Escapes account.'
),

-- Deal 2: Amalfi Coast
(
  '2',
  'Amalfi Coast Cliffside Luxury',
  'Le Sirenuse Hotel',
  'Perched on the sun-drenched cliffs of the Amalfi Coast, Le Sirenuse is one of Italy''s most celebrated hotels. Breathtaking sea views, limoncello welcome drinks, and a private beach club combine to deliver an unforgettable Mediterranean experience.',
  'Positano, Amalfi Coast', 'Italy', 'Europe', 'city',
  3800.00, 2399.00, 37, 5,
  5, 4.8, 95,
  ARRAY[
    'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=1200&q=85',
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1200&q=85',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85'
  ],
  ARRAY[
    'Infinity pool with panoramic Tyrrhenian Sea views',
    'Private beach club access with sun loungers',
    'Limoncello welcome ceremony on arrival',
    'Cooking class with award-winning local chef',
    'Vintage Riva speedboat excursion along the coast',
    'Daily breakfast at La Sponda restaurant'
  ],
  ARRAY[
    'Return flights from London (economy)',
    '5 nights deluxe sea-view room',
    'Daily breakfast at La Sponda',
    'Return private airport transfers',
    'Beach club access & towel service'
  ],
  ARRAY['Infinity Pool','Private Beach Club','La Sponda Restaurant','Rooftop Bar','Spa & Wellness','Concierge','Wi-Fi','Fitness Room'],
  ARRAY[
    'Breakfast is served daily at La Sponda restaurant, 7am – 11am.',
    'Beach club access subject to availability during peak season (July–August).',
    'Blackout surcharges apply to select peak summer dates.'
  ],
  '1 May 2026', '31 October 2026', '30 September 2026',
  'Le Sirenuse is located in Positano on the Amalfi Coast. The nearest airports are Naples (NAP, approx. 60 km) and Rome Fiumicino (FCO, approx. 280 km). Private transfers from Naples Airport are included.',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months from cancellation date.'
),

-- Deal 3: Bali Wellness
(
  '3',
  'Bali Wellness & Jungle Spa',
  'COMO Shambhala Estate',
  'Nestled in the lush jungle of Ubud, COMO Shambhala Estate is Bali''s premier wellness retreat. Set on forested hillside above the sacred Ayung River, the estate offers a holistic approach to well-being.',
  'Ubud, Bali', 'Indonesia', 'Asia Pacific', 'wellness',
  2100.00, 1299.00, 38, 6,
  5, 4.7, 213,
  ARRAY[
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=85',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85'
  ],
  ARRAY[
    'Daily sunrise yoga & guided meditation sessions',
    '3 x traditional Balinese massages (60 min each)',
    'Rice terrace sunrise trekking guided tour',
    'Balinese cooking class & temple blessing ceremony',
    'All-organic, farm-to-table meals throughout your stay',
    'Personalised wellness consultation on arrival'
  ],
  ARRAY[
    'Return flights from Melbourne (economy)',
    '6 nights luxury villa on the estate',
    'All meals included (full-board)',
    'Spa credit IDR 2,000,000 (~AUD$200)',
    'Return airport transfers from Ngurah Rai (DPS)'
  ],
  ARRAY['Open-Air Yoga Pavilion','Jungle Spa','Ayung River Valley Views','Organic Restaurant','Meditation Decks','Library','Wi-Fi','Infinity Pool'],
  ARRAY[
    'Full-board dining covers breakfast, lunch and dinner at Glow Restaurant. Juices and specialty beverages are not included.',
    'Spa credit is non-transferable and cannot be redeemed for cash.',
    'Yoga and meditation sessions run at fixed times (6:30am & 5pm). Pre-booking recommended.'
  ],
  '1 June 2026', '31 March 2027', '28 February 2027',
  'COMO Shambhala Estate is located approximately 15 km north of central Ubud. Transfers from Ngurah Rai International Airport (DPS, Denpasar) take approximately 90 minutes and are included in your package.',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months.'
),

-- Deal 4: Swiss Alps
(
  '4',
  'Swiss Alps Winter Chalet',
  'W Verbier',
  'Verbier is Switzerland''s most glamorous ski resort, and W Verbier places you at its heart. This iconic property combines the energy of a world-class ski resort with the edge of W Hotels'' signature style.',
  'Verbier, Valais Canton', 'Switzerland', 'Europe', 'adventure',
  5200.00, 3499.00, 33, 5,
  5, 4.9, 77,
  ARRAY[
    'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1200&q=85',
    'https://images.unsplash.com/photo-1485841890310-6a055c88698a?w=1200&q=85',
    'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=1200&q=85'
  ],
  ARRAY[
    '5-day Mont Fort ski pass for 4 Valleys ski area',
    '2 x private ski instructor sessions (2 hours each)',
    'AWAY Spa access including sauna & hot tub',
    'Traditional Swiss fondue gourmet dinner for two',
    'Ski equipment hire included for 5 days',
    'Welcome W Hotels amenity on arrival'
  ],
  ARRAY[
    'Return flights from London (economy)',
    '5 nights hotel room (ski-in/ski-out)',
    'Daily breakfast at W Kitchen',
    '5-day ski pass',
    'Ski equipment hire'
  ],
  ARRAY['Ski-In / Ski-Out Access','AWAY Spa','WET Outdoor Pool Deck','W Kitchen Restaurant','Living Room Bar','Fitness Studio','Ski Concierge','Wi-Fi'],
  ARRAY[
    'Ski pass valid for 4 Valleys ski area (Mont Fort, Verbier, La Tzoumaz, Nendaz, Veysonnaz). Saas-Fee not included.',
    'Ski instructor sessions must be pre-booked at least 72 hours in advance through the concierge.',
    'Peak surcharges apply to Christmas (24–27 Dec) and New Year (29 Dec – 2 Jan) dates.'
  ],
  '1 December 2026', '31 March 2027', '30 November 2026',
  'W Verbier is located in the centre of Verbier village. The nearest airport is Geneva (GVA), approximately 130 km away (2 hours by car or train connection to Le Châble + gondola).',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months.'
),

-- Deal 5: Japan Ryokan
(
  '5',
  'Tokyo Luxury Ryokan Experience',
  'Gora Kadan Ryokan',
  'Gora Kadan is a legendary ryokan built within the former imperial family''s Hakone summer villa. Sleep on hand-laid tatami mats, soak in private open-air onsen with views of the surrounding mountains, and feast on exquisite kaiseki cuisine.',
  'Hakone, Kanagawa', 'Japan', 'Asia Pacific', 'city',
  2800.00, 1799.00, 36, 4,
  5, 4.8, 162,
  ARRAY[
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85',
    'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=85',
    'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1200&q=85'
  ],
  ARRAY[
    'Private open-air onsen (rotenburo) with mountain views',
    'Mt Fuji viewing deck (weather permitting)',
    'Traditional kaiseki multi-course dinner & breakfast daily',
    'Authentic Japanese tea ceremony experience',
    'Yukata (kimono robe) provided for duration of stay',
    'Shinkansen (bullet train) pass for Hakone return included'
  ],
  ARRAY[
    'Return flights from Sydney (economy)',
    '4 nights in a traditional tatami suite',
    'Daily kaiseki dinner & breakfast (half-board)',
    'Hakone Shinkansen pass',
    'Airport transfer from Haneda (HND)'
  ],
  ARRAY['Private Outdoor Onsen','Communal Rotenburo Baths','Kaiseki Restaurant','Tea Ceremony Room','Garden & Forest Walks','Washi Paper Workshop','Wi-Fi','Concierge'],
  ARRAY[
    'Kaiseki dinner is a multi-course seasonal tasting menu. Vegetarian and dietary requests must be made 72 hours in advance.',
    'Mt Fuji viewing deck experience is subject to weather and visibility conditions.',
    'Tea ceremony held at 3pm daily; pre-booking required.'
  ],
  '1 April 2026', '28 February 2027', '31 January 2027',
  'Gora Kadan is located in Gora, Hakone, approximately 90 minutes from central Tokyo. Haneda Airport (HND) is approx. 90 minutes by train. Transfer from Haneda to Gora station is included.',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months.'
),

-- Deal 6: Santorini
(
  '6',
  'Santorini Sunset Cave Suite',
  'Canaves Oia Epitome',
  'Perched atop the iconic white-washed caldera cliffs of Oia, Canaves Oia Epitome is one of the most celebrated small luxury hotels in the world. The Santorini sunset from your private terrace jacuzzi is considered among the most romantic moments in travel.',
  'Oia, Santorini', 'Greece', 'Europe', 'beach',
  4500.00, 2899.00, 36, 6,
  5, 4.9, 304,
  ARRAY[
    'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&q=85',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85',
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=85'
  ],
  ARRAY[
    'Private cave suite with direct caldera & sunset views',
    'Jacuzzi on your private terrace',
    'Sunset private catamaran cruise around the caldera',
    'Wine tasting at a centuries-old Santorini vineyard',
    'Daily à la carte breakfast (in-room or at restaurant)',
    'Dining credit €150 at Petra Restaurant'
  ],
  ARRAY[
    'Return flights from London (economy)',
    '6 nights cave suite with caldera views',
    'Daily à la carte breakfast',
    'Return transfers from Santorini (JTR) airport',
    'Catamaran sunset cruise for two'
  ],
  ARRAY['Private Caldera-View Terrace','Infinity Pool','Petra Restaurant','Wine Cellar','Yoga Deck','Concierge','Wi-Fi','Spa'],
  ARRAY[
    'Breakfast is served daily, 8am–11am. In-room breakfast available with 24-hour advance notice.',
    'Catamaran cruise departs from Ammoudi Bay. Exact departure time confirmed at check-in.',
    'Peak surcharges apply to select dates in July and August.',
    'Jacuzzi suites are located on cliff-face terraces. Guests should be comfortable with heights.'
  ],
  '1 May 2026', '31 October 2026', '30 September 2026',
  'Canaves Oia Epitome is located at the northern tip of Santorini island in Oia village. The nearest airport is Santorini (JTR), approximately 18 km south (30–40 minute drive). Return transfers from JTR Airport are included.',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months.'
),

-- Deal 7: Dubai
(
  '7',
  'Dubai Ultra-Luxury Sky Escape',
  'Burj Al Arab Jumeirah',
  'Rise above the Arabian Gulf in one of the world''s most iconic hotels. The Burj Al Arab Jumeirah is a global symbol of ultra-luxury — from its soaring sail-shaped silhouette to its two-storey suites dressed in gold and marble.',
  'Jumeirah Beach, Dubai', 'UAE', 'Middle East', 'city',
  6800.00, 4299.00, 37, 4,
  5, 4.9, 89,
  ARRAY[
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85',
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=85'
  ],
  ARRAY[
    'Duplex suite with panoramic Arabian Gulf views',
    'Rolls-Royce transfer from Dubai International Airport',
    'Private beach & six outdoor pool access',
    'Complimentary Skyview Bar cocktail experience',
    'In-suite butler service 24 hours',
    'Talise Spa access with signature 60-min treatment'
  ],
  ARRAY[
    'Return flights from London (business class)',
    '4 nights signature duplex suite',
    'Daily à la carte breakfast at Al Iwan',
    'Rolls-Royce airport return transfers',
    'Talise Spa treatment (60 min per person)'
  ],
  ARRAY['Private Beach','6 Outdoor Pools','Talise Spa','Skyview Bar','Al Muntaha Restaurant','In-Suite Butler','Wi-Fi','Fitness & Aqua Club'],
  ARRAY[
    'Business class flights are on select carriers and routes. Seat selection charges may apply.',
    'Rolls-Royce transfer is a shared schedule service and must be pre-booked 48 hours in advance.',
    'Spa treatment booking required at least 24 hours prior. Subject to availability.',
    'Skyview Bar complimentary experience valid once per stay per room. Dress code smart casual.'
  ],
  '1 September 2026', '30 June 2027', '31 May 2027',
  'The Burj Al Arab is located on a private island off Jumeirah Beach, connected to the mainland by a private bridge. Dubai International Airport (DXB) is approximately 20 km away. Rolls-Royce return transfers are included in your package.',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months.'
),

-- Deal 8: Seychelles
(
  '8',
  'Seychelles Private Island Hideaway',
  'North Island Lodge',
  'Only 11 villas occupy the entire 201-hectare North Island. This is one of the most exclusive private island resorts on the planet — a conservation paradise where giant tortoises roam, rare birds nest, and your only neighbours are the Indian Ocean and a sky full of stars.',
  'North Island, Seychelles', 'Seychelles', 'Africa & Indian Ocean', 'beach',
  9500.00, 6199.00, 35, 7,
  5, 5.0, 56,
  ARRAY[
    'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=85',
    'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85'
  ],
  ARRAY[
    'Exclusive island with only 11 private beach villas',
    'Dedicated villa host & private chef service',
    'Unlimited snorkelling, kayaking & diving excursions',
    'Giant tortoise conservation walks',
    'Private cinema on the beach (upon request)',
    'All meals, premium beverages & minibar included'
  ],
  ARRAY[
    'Return flights from London (business class)',
    '7 nights beachfront villa',
    'All-inclusive (meals, beverages, excursions)',
    'Return helicopter transfers from Mahé (SEZ)',
    'Conservation island walk with naturalist guide'
  ],
  ARRAY['Private Beach Villa','Plunge Pool','All-Inclusive Dining','Diving & Water Sports','Giant Tortoise Reserve','Island Spa','Wi-Fi','Dedicated Villa Host'],
  ARRAY[
    'All-inclusive includes all meals, house wines, spirits, soft drinks, and non-motorised water sports. Motorised water sports billed separately.',
    'Helicopter transfers operate weather dependent. In the event of cancellation, speedboat transfer will be arranged.',
    'Scuba diving is available at an additional charge. PADI certification required for independent diving.',
    'No children under 6 are permitted on property.'
  ],
  '1 April 2026', '31 March 2027', '28 February 2027',
  'North Island is accessible by helicopter only. Mahé International Airport (SEZ) is the arrival point — return helicopter transfers (approx. 30 minutes) from Mahé to North Island are included in your package.',
  '7-Day Change of Mind Guarantee: Full refund within 7 days of purchase if check-in is 14+ days away.',
  'Cancel for credit up to 21 days before check-in. Credit valid for 12 months.'
);


-- ── 6. MOCK DATA: ROOM PACKAGES ───────────────────────────────

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r1a', 'Romantic Escape – 7 Nights Half-Board',   7, 4200.00, 2799.00, 400.00, '1 King Bed', 2,
  ARRAY['Overwater Villa','Glass Floor Panel','Private Plunge Pool','Half-Board Dining']
FROM hotels h WHERE h.slug = '1';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r1b', 'Extended Bliss – 10 Nights Half-Board',  10, 5800.00, 3799.00, 380.00, '1 King Bed', 2,
  ARRAY['Overwater Villa','Glass Floor Panel','Private Plunge Pool','10% Spa Credit']
FROM hotels h WHERE h.slug = '1';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r2a', 'Dolce Vita – 5 Nights Breakfast',         5, 3800.00, 2399.00, 480.00, '1 King Bed', 2,
  ARRAY['Sea-View Balcony','Daily Breakfast','Beach Club Access','Welcome Limoncello']
FROM hotels h WHERE h.slug = '2';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r2b', 'La Dolce Vita Extended – 7 Nights',       7, 5100.00, 3199.00, 457.00, '1 King Bed', 2,
  ARRAY['Junior Suite','Daily Breakfast','Spa Credit €150','Boat Excursion']
FROM hotels h WHERE h.slug = '2';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r3a', 'Jungle Wellness – 6 Nights Full-Board',   6, 2100.00, 1299.00, 217.00, '1 King Bed', 2,
  ARRAY['Garden Villa','Full-Board Dining','3 Massages','Yoga Classes']
FROM hotels h WHERE h.slug = '3';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r3b', 'Deep Immersion – 9 Nights Full-Board',    9, 3000.00, 1849.00, 205.00, '1 King Bed', 2,
  ARRAY['River-View Villa','Full-Board','5 Massages','Private Cooking Class']
FROM hotels h WHERE h.slug = '3';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r4a', 'Ski & Stay – 5 Nights Breakfast',         5, 5200.00, 3499.00, 700.00, '1 King Bed', 2,
  ARRAY['Mountain-View Room','Daily Breakfast','5-Day Ski Pass','Ski Equipment']
FROM hotels h WHERE h.slug = '4';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r4b', 'Powder Week – 7 Nights Breakfast',        7, 7000.00, 4599.00, 657.00, '1 King Bed', 2,
  ARRAY['Suite with Terrace','Daily Breakfast','7-Day Ski Pass','Spa Credit CHF 200']
FROM hotels h WHERE h.slug = '4';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r5a', 'Mt Fuji Escape – 4 Nights Half-Board',    4, 2800.00, 1799.00, 450.00, 'Futon on Tatami', 2,
  ARRAY['Tatami Suite','Private Onsen','Half-Board Kaiseki','Yukata Included']
FROM hotels h WHERE h.slug = '5';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r5b', 'Extended Zen – 6 Nights Half-Board',      6, 3900.00, 2499.00, 417.00, 'Futon on Tatami', 2,
  ARRAY['Panoramic Mountain Suite','Private Onsen','Half-Board','Sake Welcome']
FROM hotels h WHERE h.slug = '5';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r6a', 'Caldera Romance – 6 Nights Breakfast',    6, 4500.00, 2899.00, 483.00, '1 King Bed', 2,
  ARRAY['Cave Suite','Caldera Views','Terrace Jacuzzi','Daily Breakfast']
FROM hotels h WHERE h.slug = '6';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r6b', 'Ultimate Santorini – 8 Nights',           8, 5800.00, 3699.00, 462.00, '1 King Bed', 2,
  ARRAY['Premium Cave Suite','Terrace Jacuzzi','Dinner Credit €200','Yacht Day Charter']
FROM hotels h WHERE h.slug = '6';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r7a', 'Sky Escape – 4 Nights Breakfast',          4, 6800.00, 4299.00, 1075.00, '1 King Bed', 2,
  ARRAY['Duplex Suite','Gulf Views','Butler Service','Daily Breakfast']
FROM hotels h WHERE h.slug = '7';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r7b', 'Royal Sky Week – 7 Nights',                7, 11000.00, 6999.00, 1000.00, '1 King Bed', 2,
  ARRAY['Panoramic Suite','Half-Board Dining','Spa Credit AED 500','Yacht Excursion']
FROM hotels h WHERE h.slug = '7';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r8a', 'Paradise Escape – 7 Nights All-Inclusive', 7, 9500.00, 6199.00, 886.00, '1 King Bed', 2,
  ARRAY['Beachfront Villa','Plunge Pool','All-Inclusive','Helicopter Transfer']
FROM hotels h WHERE h.slug = '8';

INSERT INTO room_packages (hotel_id, package_slug, name, nights, original_price, sale_price, per_night, beds, max_guests, features)
SELECT h.id, 'r8b', 'Ultimate Island – 10 Nights All-Inclusive',10, 12500.00, 7999.00, 800.00, '1 King Bed', 2,
  ARRAY['Beachfront Villa','Plunge Pool','Private Chef Dinner','Sunset Cruise']
FROM hotels h WHERE h.slug = '8';


-- ── 7. VERIFY ─────────────────────────────────────────────────

-- Run these SELECTs to confirm data loaded correctly:
-- SELECT slug, hotel_name, category, sale_price, rating FROM hotels ORDER BY slug;
-- SELECT h.slug, r.package_slug, r.name, r.sale_price FROM room_packages r JOIN hotels h ON h.id = r.hotel_id ORDER BY h.slug, r.package_slug;
