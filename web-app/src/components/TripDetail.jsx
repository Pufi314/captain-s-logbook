import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship, Calendar, Anchor, User, MapPin, DollarSign, X, ChevronDown, ChevronUp } from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const TripDetail = ({ trip, onClose }) => {
  if (!trip) return null;

  const { metadata, dailyLogs } = trip;
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);

  const MapResizer = () => {
    const map = useMap();
    React.useEffect(() => {
      setTimeout(() => map.invalidateSize(), 100);
    }, []);
    return null;
  };

  const toggleRow = (index) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  const MapRow = ({ log }) => {
    const parts = log.location?.split(',');
    const lat = parseFloat(parts?.[0]);
    const lng = parseFloat(parts?.[1]);
    if (isNaN(lat) || isNaN(lng)) return null;

    return (
      <tr>
        <td colSpan="12" className="p-0">
          <div className="h-[300px] w-full rounded-b-lg overflow-hidden border-t">
            <MapContainer center={[lat, lng]} zoom={14} className="h-full w-full" scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapResizer />
              <Marker position={[lat, lng]}>
                <Popup>{log.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </td>
      </tr>
    );
  };

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
    <div>
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
            {dailyLogs.map((log, index) => {
              const hasLocation = log.location && log.location !== 'N/A';
              return (
                <React.Fragment key={index}>
                  <tr
                    className={`${hasLocation ? 'cursor-pointer hover:bg-gray-50' : ''} ${expandedRowIndex === index ? 'bg-blue-50' : ''}`}
                    onClick={() => hasLocation && toggleRow(index)}
                  >
                    <td className="p-3 text-gray-600">{log.day}
                      {expandedRowIndex === index && <ChevronUp className="inline w-3 h-3 ml-1 text-blue-500" />}
                      {hasLocation && expandedRowIndex !== index && <ChevronDown className="inline w-3 h-3 ml-1 text-gray-400" />}
                    </td>
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
                  {expandedRowIndex === index && <MapRow log={log} />}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripDetail;
