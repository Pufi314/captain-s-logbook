# Implemented Features

## App Shell & Layout
- Full-viewport water surface background photo with semi-transparent dark overlay for readability
- Fixed (parallax-like) background attachment
- Centered content container (`max-w-6xl mx-auto`)
- Navy-blue header bar (`#1a365d`) with shadow
- Compass icon + "Captain's Logbook Dashboard" title in header
- Vertical spacing between main sections

## Data Loading
- Automatic fetch of `data-index.json` from `/public/data/` on mount
- Dynamic loading: each CSV fetched and parsed at runtime — no rebuild needed when adding a new trip
- 18 CSV trip files spanning 2017–2026

## Dashboard — Summary Section
- **Total Miles** in nautical miles (1 decimal)
- **Total Hours** (computed from minutes, 1 decimal)
- **Sails Miles %** — percentage of distance under sail
- **Anchor/Buoy %** — percentage of overnight moorings by type
- StatCard component: icon in blue circle, uppercase label, bold value
- Responsive grid: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)

## Dashboard — Records Section
- Record cards show mileage value + trip/date subtitle inside the same tile
- **Most Miles / Trip** (with trip title + start date)
- **Most Sails Miles / Trip** (with trip title + start date)
- **Most Miles / Day** (with trip title + date)
- **Most Sails Miles / Day** (with trip title + date)
- Responsive grid: 1 col (mobile) → 2 col (desktop)

## Trip Selector
- Section heading: "Select a Voyage to View Logbook Details"
- Full-width `<select>` dropdown
- Options formatted as "Trip Title (startDate)"
- Selecting a trip renders TripDetail below; selecting the placeholder clears it

## Trip Detail — Header
- Trip title in large bold text
- Close button (X icon) with hover state and tooltip — collapses back to default dashboard view
- Bottom border separator

## Trip Detail — Metadata Display
- Boat name, model, year of manufacture
- Date range (start → end)
- Home marina
- Captain name
- Price in EUR
- Crew member list
- Other captains list (with N/A fallback)
- Gray background section with icon + label + value per item

## Trip Detail — Daily Log Table
- Horizontal scroll wrapper for narrow screens (`overflow-x-auto`)
- 12 columns: Day, Date, Dist, Time, Sails Dist, Sails Time, Dir, Stops, Island, City, Bay, Mooring
- Styled header, hover row highlighting, row dividers
- Full CSV data visible — no fields hidden

## Styling & CSS
- Tailwind CSS v4 via single `@import "tailwindcss"`
- Card-based design: white bg, shadow, rounded corners, gray border
- lucide-react icons throughout (Compass, Clock, Ship, Anchor, MapPin, Calendar, User, DollarSign, X)

## Responsive Design
- Mobile-first layout
- Multi-column grids collapse to single column on mobile
- Table horizontally scrollable on small screens
- Full-width form elements

## CSV Parsing & Data Processing
- Two-section CSV parser: `# METADATA` / `# DAILY LOGS`
- Crew/captains list parsing (quoted, semicolon-delimited)
- Time string to minutes converter (`"H:MM"` → number)
- `aggregateStats` reducer computing 14 cumulative and record metrics
- City visit frequency tracking
- Mooring type counting (anchor vs. buoy)
- Division-by-zero protection in percentage calculations

## Data
- 18 CSV files in `public/data/` listed in `data-index.json`
- Metadata: tripId, title, dates, boat details, home marina, captain, crew, other captains, price
- Daily logs: day, date, distances (total + sails), times (total + sails), direction, stops, island, city, bay, mooring type
- CSV format documented in `SOURCE_RULES.MD`

---

## Unused / Boilerplate (not implemented)
- `src/App.css` — Vite template styles, never imported
- `hero.png`, `react.svg`, `vite.svg` — present in assets, never referenced
- `public/icons.svg` — Vite sprite sheet, not used
- `LifeBuoy` icon — imported in Dashboard but not rendered
- `Anchor` icon — imported in TripDetail but not rendered
- `aggregated.topCities` — computed but not displayed in UI
