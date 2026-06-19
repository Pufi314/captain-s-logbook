import Papa from 'papaparse';

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
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
      const [key, value] = line.split(',');
      if (key !== 'Key') {
        if (key === 'crew' || key === 'captains') {
          metadata[key] = value.replace(/"/g, '').split(';').map(s => s.trim());
        } else {
          metadata[key] = value;
        }
      }
    } else if (section === 'DAILY_LOGS') {
      if (headers.length === 0) {
        headers = line.split(',');
      } else {
        const values = line.split(',');
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
      }
      if (log.sailsDistanceNm > acc.maxDaySailsMiles) {
        acc.maxDaySailsMiles = log.sailsDistanceNm;
        acc.maxDaySailsMilesDate = log.date;
        acc.maxDaySailsMilesTitle = trip.metadata.title;
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
    }
    if (tripSailsMiles > acc.maxTripSailsMiles) {
      acc.maxTripSailsMiles = tripSailsMiles;
      acc.maxTripSailsMilesTitle = trip.metadata.title;
      acc.maxTripSailsMilesStartDate = trip.metadata.startDate;
    }
    
    return acc;
  }, { 
    totalMiles: 0, totalMinutes: 0, sailsMiles: 0, sailsMinutes: 0,
    cities: {}, kotvaCount: 0, bojaCount: 0, totalOvernights: 0,
    maxTripTotalMiles: 0, maxTripTotalMilesTitle: '', maxTripTotalMilesStartDate: '',
    maxTripSailsMiles: 0, maxTripSailsMilesTitle: '', maxTripSailsMilesStartDate: '',
    maxDayTotalMiles: 0, maxDayTotalMilesDate: '', maxDayTotalMilesTitle: '',
    maxDaySailsMiles: 0, maxDaySailsMilesDate: '', maxDaySailsMilesTitle: ''
  });
};
