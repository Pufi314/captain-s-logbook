# Captain's Logbook Project

A web application to aggregate and visualize sailing logs from CSV files, with per-captain data separation.

## Project Structure

```
web-app/
  public/
    data/
      michal/          ── Michal Puffler's trips (18 CSVs + GPX)
      ondrej/          ── Ondrej Puffler's trips (10 CSVs + GPX)
    csv-editor.html    ── standalone CSV editor (open from filesystem)
  src/
    App.jsx            ── main app, captain selector, dynamic data fetch
    components/        ── Dashboard, TripDetail, Place/Crew selectors
    utils/
      logProcessor.js  ── CSV parser, aggregators, indices
docs/                  ── documentation (features, process, status)
```

## How to run

1. `cd web-app`
2. `npm install`
3. `npm run dev`

## Captain selector

- Header icon shows current captain initial (M / O)
- Click to switch between Michal Puffler and Ondrej Puffler
- Each captain has a separate data directory: `data/michal/` or `data/ondrej/`
- Switching captains reloads trip data from the corresponding directory

## Data directories

Each captain directory contains:
- `data-index.json` — file listing all CSV filenames for that captain
- `*.csv` — trip CSV files
- `gpx/*.gpx` — GPS track files per day (named `{csvFile}_day_{N}.gpx`)

Adding a new trip: add CSV + update `data-index.json` + add GPX files in the captain's directory. No rebuild needed.

## CSV Editor

Open `public/csv-editor.html` from the filesystem. Load a CSV via file picker, edit metadata and daily logs, save/download the result.

## Active Feature

- [001-sailing-logbook](docs/001-sailing-logbook.md)
