# Captain's Logbook Project

A web application to aggregate and visualize sailing logs from CSV files.

## Project Structure
- `public/data/` : Source CSV files for each sailing trip + `data-index.json` that lists them.
- `public/data/data-index.json` : Index file listing all CSV filenames — add a new filename here when adding a new trip.
- `docs/` : Documentation (PRDs, process, status).
- `web-app/` : React + Vite frontend application.

## How to run the app
1. `cd web-app`
2. `npm install`
3. `npm run dev`

## Active Feature
- [001-sailing-logbook](docs/001-sailing-logbook.md)
