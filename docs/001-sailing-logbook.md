Status: refactoring

# 001 - Sailing Logbook Web App

## 1. Overview
A personal sailing logbook web application to consume and visualize sailing data stored in CSV files. It provides an aggregated dashboard of all sailing history and a detailed view per individual trip.

## 2. User Stories
- As a sailor, I want to see a summary of all my sailing miles and time, so I can track my overall sailing activity.
- As a sailor, I want to see statistics on my sailing habits (engine vs. sail) to improve my sailing efficiency.
- As a sailor, I want to see record-breaking metrics (most miles per trip/day) to track my best performances.
- As a sailor, I want to quickly jump between different trips to check historical details.
- As a crew member, I want to view these statistics on my mobile phone.
- As a sailor, I want to add a new trip CSV file and have the app pick it up on page refresh — no rebuild needed.

## 3. UI/UX
- **Main Page Dashboard:**
  - Summary grid (Total Miles, Total Hours, Sails Miles %, Sails Time %, Anchor %, Buoy %, Mostly Visited Cities Top 5).
  - Records grid (Most Miles per Trip, Most Sails Miles per Trip, Most Miles per Day, Most Sails Miles per Day).
  - Dropdown to select a trip.
- **Trip Detail View:**
  - Detailed metadata including: Trip ID, Dates, Boat details, Home Marina, Captain, Price, Crew, and Other Captains.
  - Comprehensive daily log table covering all fields (Day, Date, Distance, Time, Sails Dist, Sails Time, Dir, Stops, Island, City, Bay, Mooring).
- **Responsive:** Layout is mobile-first, stacking elements appropriately on small screens.

## 4. Technical Approach
- **Stack:** React + Vite + Tailwind CSS.
- **Parsing:** PapaParse for CSV parsing.
- **Client-side only:** No backend required.
- **Processing:** Utility to aggregate data and parse trip-specific CSV structures.
- **Data loading:** The app fetches `data-index.json` from `public/data/` which lists all CSV files, then fetches each CSV dynamically. Adding a new trip requires only adding the CSV file and updating the index — no rebuild needed.
- **Devices:** Responsive design, mobile-first with Tailwind CSS breakpoints.

## 5. Data Model
- **Trip:** { metadata, dailyLogs[] }

## 6. Behaviors
- `should_calculateAggregatedStats`: Dashboard reflects aggregated data (Miles, Time, %s, Top 5 Cities, Anchor/Buoy %, Records).
- `should_displayTripDropdown`: Dropdown populates with all trips.
- `should_switchTripDetail`: Detail view updates upon selection to show comprehensive metadata and full log table.
- `should_loadTripsFromIndex`: App fetches `data-index.json` and loads all listed CSV files without requiring a rebuild.

## 7. Out of Scope
- User authentication, editing logs in UI, map visualization.
