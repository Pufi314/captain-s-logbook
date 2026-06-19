Status: implementation

# 001 - Sailing Logbook Web App

## 1. Overview
A personal sailing logbook web application to consume and visualize sailing data stored in CSV files. It provides an aggregated dashboard of all sailing history and a detailed view per individual trip.

## 2. User Stories
- As a sailor, I want to see a summary of all my sailing miles and time, so I can track my overall sailing activity.
- As a sailor, I want to see statistics on my sailing habits (engine vs. sail) to improve my sailing efficiency.
- As a sailor, I want to quickly jump between different trips to check historical details.
- As a crew member, I want to view these statistics on my mobile phone.

## 3. UI/UX
- **Main Page:** 
  - Summary grid (Miles, Hours, Engine/Sail breakdown, Top City, Anchor/Buoy habits).
  - Dropdown to select a trip.
  - Detail section displaying the selected trip's log table.
- **Responsive:** Layout stacks cards vertically on mobile and horizontally on desktop.

## 4. Technical Approach
- **Stack:** React + Vite + Tailwind CSS.
- **Parsing:** PapaParse for CSV parsing.
- **Client-side only:** No backend required.

## 5. Data Model
- **Trip:** { metadata, dailyLogs[] }

## 6. Behaviors
- `should_calculateAggregatedStats`: Dashboard reflects aggregated data.
- `should_displayTripDropdown`: Dropdown populates with all trips.
- `should_switchTripDetail`: Detail view updates upon selection.

## 7. Out of Scope
- User authentication, editing logs in UI, map visualization (Phase 1).
