# Data Source Rules for Captain's Logbook

This document defines the naming convention, file structure, and parsing rules for the sailing log CSV files to ensure consistency and readability by both humans and the web application.

---

## 1. File Naming Convention

Every sailing trip must have its own CSV file. The filename must follow this strict format:

```
yyyy_mm_dd_[starting_marina].csv
```

### **Rules:**
- Use lowercase characters only.
- Replace any spaces with underscores `_`.
- Replace special/accented characters with their standard English equivalents (e.g., `Sukošan` becomes `sukosan`).
- **Example:** `2017_09_09_sukosan.csv`

---

## 2. File Structure

Each file uses a **Combined CSV** structure containing two distinct sections: **Metadata** (single-value properties of the trip) and **Daily Logs** (the tabular time-series data).

### **Template Example:**

```csv
# METADATA
Key,Value
tripId,2017-09-09-sukosan
title,Sailing trip from Sukošan
startDate,2017-09-09
endDate,2017-09-16
boatName,Nabucco
boatModel,Bavaria Cruiser 46
yearOfManufacture,2012
homeMarina,Sukoshan
captain,Michal Puffler
crew,"Michal Puffler; Dominika Pufflerová; Ondrej Kollár"
captains,"Jano Neščivera; Jano Marcinčin"
priceEur,2556

# DAILY LOGS
day,date,totalDistanceNm,totalTime,sailsDistanceNm,sailsTime,sailDirection,interestingStops,overnightIsland,overnightCity,overnightBay,mooringType,location
1,2017-09-09,0.0,0:00,0.0,0:00,,,,Sukoshan,,marina,"44.055129, 15.297856"
2,2017-09-10,0.0,0:00,0.0,0:00,,,,Sukoshan,,marina,"44.055129, 15.297856"
3,2017-09-11,13.42,2:26,0.0,0:00,,,,Sukoshan,,marina,"44.055129, 15.297856"
4,2017-09-12,37.0,6:43,15.64,3:21,JV,,Žirje,,Mala Stupica,boja,"44.055129, 15.297856"
```

---

## 3. Section and Field Specifications

### **A. Metadata Section (`# METADATA`)**
This section begins with the `# METADATA` comment and holds top-level configuration values.

| Key | Description | Type / Format | Example |
| :--- | :--- | :--- | :--- |
| **tripId** | Unique identifier for the trip | String (dash-separated) | `2017-09-09-sukosan` |
| **title** | Display title of the sailing trip | String | `Sailing trip from Sukošan` |
| **startDate** | The date the trip started | Date (`YYYY-MM-DD`) | `2017-09-09` |
| **endDate** | The date the trip ended | Date (`YYYY-MM-DD`) | `2017-09-16` |
| **boatName** | Name of the sailboat | String | `Nabucco` |
| **boatModel** | Manufacturer & Model of the boat | String | `Bavaria Cruiser 46` |
| **yearOfManufacture** | The year the boat was built | Integer | `2012` |
| **homeMarina** | Home marina of the boat | String | `Sukoshan` |
| **captain** | Captain of this boat | String | `Michal Puffler` |
| **crew** | List of crew members | Semicolon-separated string (quoted) | `"Person A; Person B"` |
| **captains** | Captains of other companion boats | Semicolon-separated string (quoted) | `"Captain A; Captain B"` |
| **priceEur** | Total price of the boat rental | Numeric / Float | `2556` |

---

### **B. Daily Logs Section (`# DAILY LOGS`)**
This section begins with the `# DAILY LOGS` comment and a header row, followed by rows representing each day of the trip.

| Field | Description | Type / Format | Example |
| :--- | :--- | :--- | :--- |
| **day** | The sequential day number of the trip | Integer | `1` |
| **date** | Calendar date of the log | Date (`YYYY-MM-DD`) | `2017-09-09` |
| **totalDistanceNm** | Total distance traveled | Float (Nautical Miles) | `37.0` |
| **totalTime** | Total sailing duration | String (`H:MM` format) | `6:43` |
| **sailsDistanceNm** | Distance covered utilizing the engine | Float (Nautical Miles) | `15.64` |
| **sailsTime** | Engine running duration | String (`H:MM` format) | `3:21` |
| **sailDirection** | Primary wind direction | String (e.g. `JV` or `SZ`) | `JV` |
| **interestingStops** | Mid-day stops or notable locations visited during the day | String | `Sali` |
| **overnightIsland** | Island where the boat stayed overnight (if applicable) | String | `Žirje` |
| **overnightCity** | City or town where the boat stayed overnight (if applicable) | String | `Sali` |
| **overnightBay** | Bay or anchorage where the boat stayed overnight (if applicable) | String | `Mala Stupica` |
| **mooringType** | How the boat was moored overnight | Enum (`marina`, `boja`, `kotva`, `molo`) | `boja` |
| **location** | GPS coordinates of the overnight stop | Quoted String ("lat, lng") | `"44.055129, 15.297856"` |

---

## 4. How to Read & Parse the File

A parser in the web application should read the file line-by-line utilizing the following state-machine logic:

1. **Initialization:**
   - Create two storage containers: `metadata = {}` and `dailyLogs = []`.
   - Set the active parsing mode state to `IDLE`.

2. **Line Processing:**
   - **Skip Comments:** If a line is empty or starts with `#` (except for section markers), skip it.
   - **Section Detection:**
     - If the line is `# METADATA`, set state to `METADATA_HEADER`.
     - If the line is `# DAILY LOGS`, set state to `DAILY_LOGS_HEADER`.
   - **State: `METADATA_HEADER`**
     - Skip the column definition line (`Key,Value`).
     - Set state to `METADATA_BODY`.
   - **State: `METADATA_BODY`**
     - Parse the line as a CSV row (`key,value`).
     - Add the key and value to the `metadata` object.
     - Note: Multi-value lists (like `crew` or `captains`) should be split by the semicolon `;` character into arrays.
   - **State: `DAILY_LOGS_HEADER`**
     - Read the CSV header row to identify column mapping.
     - Set state to `DAILY_LOGS_BODY`.
   - **State: `DAILY_LOGS_BODY`**
     - Parse each line as standard CSV values mapping to the header columns.
      - Convert numeric strings (`totalDistanceNm`, `sailsDistanceNm`) into floats.
     - Append the parsed day object to `dailyLogs`.
