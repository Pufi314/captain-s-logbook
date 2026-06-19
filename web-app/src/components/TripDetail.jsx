import React from 'react';
import { Ship, Calendar, Anchor, User, MapPin, DollarSign, X } from 'lucide-react';

const TripDetail = ({ trip, onClose }) => {
  if (!trip) return null;

  const { metadata, dailyLogs } = trip;

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <div className="text-xs text-gray-500 uppercase">{label}</div>
        <div className="font-medium text-gray-800">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{metadata.title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Close">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-lg">
        <InfoItem icon={Ship} label="Boat" value={`${metadata.boatName} (${metadata.boatModel}, ${metadata.yearOfManufacture})`} />
        <InfoItem icon={Calendar} label="Dates" value={`${metadata.startDate} to ${metadata.endDate}`} />
        <InfoItem icon={MapPin} label="Home Marina" value={metadata.homeMarina} />
        <InfoItem icon={User} label="Captain" value={metadata.captain} />
        <InfoItem icon={DollarSign} label="Price (EUR)" value={metadata.priceEur} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
        <p><strong>Crew:</strong> {metadata.crew?.join(', ')}</p>
        <p><strong>Other Captains:</strong> {metadata.captains?.join(', ') || 'N/A'}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm whitespace-nowrap">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">Day</th>
              <th className="p-3 text-left font-semibold text-gray-700">Date</th>
              <th className="p-3 text-left font-semibold text-gray-700">Dist</th>
              <th className="p-3 text-left font-semibold text-gray-700">Time</th>
              <th className="p-3 text-left font-semibold text-gray-700">Sails Dist</th>
              <th className="p-3 text-left font-semibold text-gray-700">Sails Time</th>
              <th className="p-3 text-left font-semibold text-gray-700">Dir</th>
              <th className="p-3 text-left font-semibold text-gray-700">Stops</th>
              <th className="p-3 text-left font-semibold text-gray-700">Island</th>
              <th className="p-3 text-left font-semibold text-gray-700">City</th>
              <th className="p-3 text-left font-semibold text-gray-700">Bay</th>
              <th className="p-3 text-left font-semibold text-gray-700">Mooring</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dailyLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 text-gray-600">{log.day}</td>
                <td className="p-3 text-gray-600">{log.date}</td>
                <td className="p-3 text-gray-600">{log.totalDistanceNm}</td>
                <td className="p-3 text-gray-600">{log.totalTime}</td>
                <td className="p-3 text-gray-600">{log.sailsDistanceNm}</td>
                <td className="p-3 text-gray-600">{log.sailsTime}</td>
                <td className="p-3 text-gray-600">{log.sailDirection}</td>
                <td className="p-3 text-gray-600">{log.interestingStops}</td>
                <td className="p-3 text-gray-600">{log.overnightIsland}</td>
                <td className="p-3 text-gray-600">{log.overnightCity}</td>
                <td className="p-3 text-gray-600">{log.overnightBay}</td>
                <td className="p-3 text-gray-600">{log.mooringType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripDetail;
