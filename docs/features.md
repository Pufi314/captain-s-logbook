# Implemented Features

## App Shell & Layout
- Full-viewport water surface background photo with semi-transparent dark overlay
- Fixed (parallax-like) background attachment (with Chrome Android regression noted)
- Centered content container (`max-w-6xl mx-auto`)
- Navy-blue header bar (`#1a365d`) with shadow
- Compass icon + "Captain's Logbook Dashboard" title in header
- `color-scheme: light` declared to prevent Chrome Android auto dark mode
- Vertical spacing between main sections

## Captain Selector
- Header icon (rounded button, white text on semi-transparent bg) showing current captain's initial
- Click opens a dropdown with captain names (Michal / Ondrej)
- Currently selected captain highlighted in blue
- Clicking outside closes the dropdown
- Switching captains resets all selections (trip, place, crew) and reloads data from the captain's directory

## Data Loading
- Automatic fetch of `{captain}/data-index.json` from the currently selected captain's directory
- Dynamic loading: each CSV fetched and parsed at runtime — no rebuild needed when adding a new trip
- 18 CSV files for Michal, 10 CSV files for Ondrej
- `pageshow` event handler reloads the page when restored from bfcache (prevents grey screen on resume from background)

## Dashboard — Summary Section
- **Total Miles** in nautical miles (1 decimal)
- **Total Hours** (computed from minutes, 1 decimal)
- **Sails Miles %** — percentage of distance under sail
- **Sails Hours %** — percentage of time under sail
- **Anchor/Buoy %** — percentage of overnight moorings by type
- **Trips** — total number of trips + count where the selected captain is listed as captain
- StatCard component: icon in blue circle, uppercase label, bold value
- Responsive grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)

## Dashboard — Records Section
- Record cards show mileage value + trip/date subtitle inside the same tile
- **Most Miles / Trip** (with trip title + start date)
- **Most Sails Miles / Trip** (with trip title + start date)
- **Most Miles / Day** (with trip title + date)
- **Most Sails Miles / Day** (with trip title + date)
- Record tiles are clickable — open the corresponding voyage detail with smooth scroll
- Responsive grid: 1 col (mobile) → 2 col (desktop)

## Trip Selector
- Section heading: "Select a Voyage"
- Full-width `<select>` dropdown
- Options formatted as "Trip Title (startDate)"
- Selecting a trip renders TripDetail below; selecting the placeholder clears it
- Selecting a trip collapses other sections (place, crew)

## Trip Detail — Header
- Trip title in large bold text
- Close button (X icon) with hover state — collapses back to default dashboard view
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
- Horizontal scroll wrapper for narrow screens
- 12 columns: Day, Date, Dist, Time, Sails Dist, Sails Time, Dir, Stops, Island, City, Bay, Mooring
- Styled header, hover row highlighting, row dividers
- Clicking a row with a location expands a map below it
- Chevron indicators for expandable rows

## Trip Detail — Map
- MapContainer (Leaflet + react-leaflet) displayed below the expanded row
- Marker at the day's location with popup
- `scrollWheelZoom={true}` enabled
- `MapResizer` component uses `ResizeObserver` → `map.invalidateSize()` on resize
- Custom icon fix for Leaflet marker assets

## Trip Detail — GPX Route Overlay
- Fetches `data/{captain}/gpx/{csvFile}_day_{N}.gpx` when a row is expanded
- Parses GPX XML with native `DOMParser`
- Toggle button (top-right of map) switches between marker-only and marker + blue polyline
- Toggle button disabled/greyed when GPX file is missing (404)
- `RouteFitter` component uses `flyToBounds` (route view) / `flyTo` (point view) for smooth zoom
- Route polyline: blue (`#3b82f6`), weight 3, opacity 0.7

## Place Selector
- Card below TripSelector, same dropdown + detail layout
- Filter dropdown: Island / City / Bay (default: City)
- Main dropdown lists places filtered by the selection, sorted alphabetically
- Heading: "Select an overnight place to View Crew & Visits"

## Place Detail
- **Header:** place name with MapPin icon + close button
- **Overnight Stays:** each entry as `date — tripTitle`, sorted chronologically; clickable — opens the corresponding voyage detail with smooth scroll
- **Crew:** unique crew names in pill badges (Czech locale sort); "No crew data" fallback; pills are clickable — open the corresponding crew detail with smooth scroll
- Hypertext links collapse the source section when clicked

## Crew Selector
- Card below Place card, same dropdown + detail layout
- Dropdown with all crew members, sorted alphabetically (Czech locale)
- "Select a Crew Member to View Their Trips" heading

## Crew Detail
- **Header:** crew member name with User icon + close button
- **Trips:** each as `startDate — title`, sorted chronologically; clickable — opens the corresponding voyage detail with smooth scroll
- **Overnight Cities / Bays / Islands:** unique place names in pill badges; pills are clickable — open the corresponding place detail with the correct filter
- Hypertext links collapse the source section when clicked

## Styling & CSS
- Tailwind CSS v4 via single `@import "tailwindcss"`
- Card-based design: `bg-white/60` (60% opacity white) tiles with shadow, rounded corners, gray border
- lucide-react icons throughout
- Background tiles use `bg-white/60` for semi-transparency

## Responsive Design
- Mobile-first layout
- Multi-column grids collapse to single column on mobile
- Table horizontally scrollable on small screens
- Map rendered outside the table (not inline) to prevent off-center marker on mobile portrait

## CSV Parsing & Data Processing
- Two-section CSV parser: `# METADATA` / `# DAILY LOGS`
- Custom `splitCSVLine` respects quoted fields
- Crew/captains list parsing (quoted, semicolon-delimited)
- Time string to minutes converter (`"H:MM"` → number)
- `aggregateStats` reducer computing 14 cumulative and record metrics
- `buildPlaceIndex` / `buildCrewIndex` — map builders for place and crew browsing
- City visit frequency tracking
- Mooring type counting (anchor vs. buoy)
- Division-by-zero protection in percentage calculations

## CSV Editor (Standalone)
- `public/csv-editor.html` — self-contained HTML file, no dependencies
- Load CSV via native file picker
- New Trip button clears all fields with sensible defaults
- Save CSV generates and downloads the file
- Editable metadata: all 12 key-value fields (crew/captains as semicolon-separated textareas)
- Editable daily logs: 13-column table with add/delete row buttons
- Dark theme matching the app
- Responsive layout

## Data Structure
- Per-captain directories under `public/data/`: `michal/` and `ondrej/`
- Each directory has its own `data-index.json`, CSV files, and `gpx/` subdirectory
- Michal: 18 trips (all original data)
- Ondrej: 10 trips (5 as crew, 5 as captain)
- GPX files named `{csvFile}_day_{N}.gpx`

## PWA
- `manifest.json` with `start_url: "."` and relative icon paths (fixes Firefox Android home-screen shortcuts)
- `display: standalone` for app-like experience
- No service worker (offline not supported)

## PDF Export
- Button in TripDetail header (FileText icon) triggers export
- Generates an A4 landscape PDF with:
  - **Overview map** — Leaflet map with numbered day markers and GPX route polylines, side-by-side with metadata (metadata left, map right, both 300px tall)
  - **Metadata** — boat, home marina, captain, crew, other captains, price
  - **Summary statistics** — total miles, hours, sail percentages
  - **Daily log table** — full 12-column table with fixed row heights
- Multi-page support: content splits at table row boundaries if it exceeds one page; leftover rows render at proportional height (no stretching)
- Side-by-side layout saves vertical space, fitting most trips (≤10 rows) on a single page
- Loading overlay (centered spinner + "Generating PDF..." text) covers the page from click through capture to prevent flash of overlapping content
- Works on mobile via `position: fixed` overlay
- Depends on `html2canvas` (DOM capture) and `jspdf` (PDF generation)

## Trip Detail Interactions
- Switching trips resets expanded map rows via `key={selectedTrip.metadata.tripId}`
- Selecting a dropdown (trip/place/crew) clears the other two selections
- Hypertext links in Place/Crew detail collapse the source section but not when clicking trip links

---

## Unused / Boilerplate (not implemented)
- `src/App.css` — Vite template styles, never imported
- `hero.png`, `react.svg`, `vite.svg` — present in assets, never referenced
- `public/icons.svg` — Vite sprite sheet, not used
- `aggregated.topCities` — computed but not displayed in UI
