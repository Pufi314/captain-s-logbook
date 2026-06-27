import Papa from 'papaparse';

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
};

const splitCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const parseLogFile = (csvText) => {
  const lines = csvText.split('\n');
  let section = null;
  const metadata = {};
  const dailyLogs = [];
  
  let headers = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) {
      if (line === '# METADATA') section = 'METADATA';
      else if (line === '# DAILY LOGS') section = 'DAILY_LOGS';
      continue;
    }

    if (section === 'METADATA') {
      const [key, value] = splitCSVLine(line);
      if (key !== 'Key') {
        if (key === 'crew' || key === 'captains') {
          metadata[key] = value.split(';').map(s => s.trim());
        } else {
          metadata[key] = value;
        }
      }
    } else if (section === 'DAILY_LOGS') {
      if (headers.length === 0) {
        headers = splitCSVLine(line);
      } else {
        const values = splitCSVLine(line);
        const log = {};
        headers.forEach((h, i) => {
          log[h] = values[i];
        });
        
        // Add processed numeric fields
        log.totalDistanceNm = parseFloat(log.totalDistanceNm) || 0;
        log.sailsDistanceNm = parseFloat(log.sailsDistanceNm) || 0;
        log.totalTimeMinutes = parseTimeToMinutes(log.totalTime);
        log.sailsTimeMinutes = parseTimeToMinutes(log.sailsTime);
        
        dailyLogs.push(log);
      }
    }
  }

  return { metadata, dailyLogs };
};

export const aggregateStats = (trips) => {
  return trips.reduce((acc, trip) => {
    let tripTotalMiles = 0;
    let tripSailsMiles = 0;
    
    trip.dailyLogs.forEach(log => {
      acc.totalMiles += log.totalDistanceNm;
      acc.totalMinutes += log.totalTimeMinutes;
      acc.sailsMiles += log.sailsDistanceNm;
      acc.sailsMinutes += log.sailsTimeMinutes;
      
      if (log.totalDistanceNm > acc.maxDayTotalMiles) {
        acc.maxDayTotalMiles = log.totalDistanceNm;
        acc.maxDayTotalMilesDate = log.date;
        acc.maxDayTotalMilesTitle = trip.metadata.title;
        acc.maxDayTotalMilesTrip = trip;
      }
      if (log.sailsDistanceNm > acc.maxDaySailsMiles) {
        acc.maxDaySailsMiles = log.sailsDistanceNm;
        acc.maxDaySailsMilesDate = log.date;
        acc.maxDaySailsMilesTitle = trip.metadata.title;
        acc.maxDaySailsMilesTrip = trip;
      }
      
      tripTotalMiles += log.totalDistanceNm;
      tripSailsMiles += log.sailsDistanceNm;
      
      if (log.overnightCity) {
        acc.cities[log.overnightCity] = (acc.cities[log.overnightCity] || 0) + 1;
      }
      if (log.mooringType === 'kotva') acc.kotvaCount++;
      if (log.mooringType === 'boja') acc.bojaCount++;
      
      if (log.mooringType) {
        acc.totalOvernights++;
      }
    });
    
    if (tripTotalMiles > acc.maxTripTotalMiles) {
      acc.maxTripTotalMiles = tripTotalMiles;
      acc.maxTripTotalMilesTitle = trip.metadata.title;
      acc.maxTripTotalMilesStartDate = trip.metadata.startDate;
      acc.maxTripTotalMilesTrip = trip;
    }
    if (tripSailsMiles > acc.maxTripSailsMiles) {
      acc.maxTripSailsMiles = tripSailsMiles;
      acc.maxTripSailsMilesTitle = trip.metadata.title;
      acc.maxTripSailsMilesStartDate = trip.metadata.startDate;
      acc.maxTripSailsMilesTrip = trip;
    }
    
    return acc;
  }, { 
    totalMiles: 0, totalMinutes: 0, sailsMiles: 0, sailsMinutes: 0,
    cities: {}, kotvaCount: 0, bojaCount: 0, totalOvernights: 0,
    maxTripTotalMiles: 0, maxTripTotalMilesTitle: '', maxTripTotalMilesStartDate: '', maxTripTotalMilesTrip: null,
    maxTripSailsMiles: 0, maxTripSailsMilesTitle: '', maxTripSailsMilesStartDate: '', maxTripSailsMilesTrip: null,
    maxDayTotalMiles: 0, maxDayTotalMilesDate: '', maxDayTotalMilesTitle: '', maxDayTotalMilesTrip: null,
    maxDaySailsMiles: 0, maxDaySailsMilesDate: '', maxDaySailsMilesTitle: '', maxDaySailsMilesTrip: null
  });
};

export const buildPlaceIndex = (trips, key) => {
  const map = new Map();

  for (const trip of trips) {
    const crew = trip.metadata.crew || [];
    for (const log of trip.dailyLogs) {
      const place = log[key];
      if (!place) continue;

      if (!map.has(place)) {
        map.set(place, { entries: [], crew: new Set() });
      }
      const entry = map.get(place);
      entry.entries.push({ date: log.date, tripTitle: trip.metadata.title, trip });
      crew.forEach(name => entry.crew.add(name));
    }
  }

  for (const data of map.values()) {
    data.entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  return map;
};

export const buildCrewIndex = (trips) => {
  const crewMap = new Map();

  for (const trip of trips) {
    const crew = trip.metadata.crew || [];
    const cities = new Set();
    const bays = new Set();
    const islands = new Set();
    for (const log of trip.dailyLogs) {
      if (log.overnightCity) cities.add(log.overnightCity);
      if (log.overnightBay) bays.add(log.overnightBay);
      if (log.overnightIsland) islands.add(log.overnightIsland);
    }

    for (const name of crew) {
      if (!crewMap.has(name)) {
        crewMap.set(name, { trips: [], cities: new Set(), bays: new Set(), islands: new Set() });
      }
      const entry = crewMap.get(name);
      entry.trips.push({ startDate: trip.metadata.startDate, title: trip.metadata.title, trip });
      cities.forEach(c => entry.cities.add(c));
      bays.forEach(b => entry.bays.add(b));
      islands.forEach(i => entry.islands.add(i));
    }
  }

  for (const data of crewMap.values()) {
    data.trips.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }

  return crewMap;
};
