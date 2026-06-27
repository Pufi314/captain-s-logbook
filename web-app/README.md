# Captain's Logbook Dashboard

Web app to visualize and manage sailing trip logs from CSV files, with per-captain data separation.

## Quick Start

```bash
cd web-app
npm install
npm run dev
```

Served at `http://localhost:5173/captain-s-logbook/`.

## Build & Deploy

```bash
npm run build     # outputs to dist/
```

Commits pushed to `main` deploy to GitHub Pages via GitHub Actions.

## Project Structure

```
public/
  data/
    michal/          ── Michal Puffler's trips (18 CSVs + GPX)
    ondrej/          ── Ondrej Puffler's trips (10 CSVs + GPX)
  csv-editor.html    ── standalone CSV editor (open from filesystem)
src/
  App.jsx            ── main app, captain selector, data fetch
  components/
    Dashboard.jsx    ── stats cards + records
    TripDetail.jsx   ── per-trip map, table, GPX overlay
    TripSelector.jsx ── voyage dropdown
    PlaceSelector.jsx
    PlaceDetail.jsx
    CrewSelector.jsx
    CrewDetail.jsx
  utils/
    logProcessor.js  ── CSV parser, aggregators, indices
```

## Features

- **Captains** — switch between Michal / Ondrej via header icon; each has own data directory
- **Dashboard** — total miles/hours, sail %, mooring stats, records
- **Trip detail** — daily log table with expandable map rows; GPX route overlay toggle
- **PDF Export** — A4 landscape summary with overview map, metadata, stats, and daily log table
- **Places** — browse overnight cities/bays/islands with crew per location
- **Crew** — browse crew members with their trips and visited places
- **CSV Editor** — standalone HTML tool; load/edit/save CSV files from filesystem
- **PWA** — add to home screen via manifest.json

## Data

Each captain directory contains:
- `data-index.json` — list of CSV filenames
- `*.csv` — trip files (metadata + daily logs)
- `gpx/*.gpx` — GPS track files per day

Adding a new trip: add the CSV to the captain's directory, update `data-index.json`, add GPX files to `gpx/`. No rebuild needed.

## CSV Format

Two sections: `# METADATA` (key-value) and `# DAILY LOGS` (comma-separated table). See any CSV in `public/data/` for reference.
