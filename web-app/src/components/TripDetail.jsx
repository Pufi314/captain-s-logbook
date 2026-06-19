import React from 'react';

const TripDetail = ({ trip }) => {
  if (!trip) return null;

  const { metadata, dailyLogs } = trip;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{metadata.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
        <p><strong>Trip ID:</strong> {metadata.tripId}</p>
        <p><strong>Dates:</strong> {metadata.startDate} to {metadata.endDate}</p>
        <p><strong>Boat:</strong> {metadata.boatName} ({metadata.boatModel}, {metadata.yearOfManufacture})</p>
        <p><strong>Home Marina:</strong> {metadata.homeMarina}</p>
        <p><strong>Captain:</strong> {metadata.captain}</p>
        <p><strong>Price (EUR):</strong> {metadata.priceEur}</p>
        <p className="md:col-span-2"><strong>Crew:</strong> {metadata.crew?.join(', ')}</p>
        <p className="md:col-span-2"><strong>Other Captains:</strong> {metadata.captains?.join(', ') || 'N/A'}</p>
      </div>
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Dist</th>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Sails Dist</th>
              <th className="p-2 text-left">Sails Time</th>
              <th className="p-2 text-left">Dir</th>
              <th className="p-2 text-left">Stops</th>
              <th className="p-2 text-left">Island</th>
              <th className="p-2 text-left">City</th>
              <th className="p-2 text-left">Bay</th>
              <th className="p-2 text-left">Mooring</th>
            </tr>
          </thead>
          <tbody>
            {dailyLogs.map((log, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{log.day}</td>
                <td className="p-2">{log.date}</td>
                <td className="p-2">{log.totalDistanceNm}</td>
                <td className="p-2">{log.totalTime}</td>
                <td className="p-2">{log.sailsDistanceNm}</td>
                <td className="p-2">{log.sailsTime}</td>
                <td className="p-2">{log.sailDirection}</td>
                <td className="p-2">{log.interestingStops}</td>
                <td className="p-2">{log.overnightIsland}</td>
                <td className="p-2">{log.overnightCity}</td>
                <td className="p-2">{log.overnightBay}</td>
                <td className="p-2">{log.mooringType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripDetail;
