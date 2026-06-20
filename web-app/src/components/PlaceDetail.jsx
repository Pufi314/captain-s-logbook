import React from 'react';
import { MapPin, Users, Calendar, X } from 'lucide-react';

const PlaceDetail = ({ place, data, onClose }) => {
  if (!data) return null;

  const sortedCrew = Array.from(data.crew).sort((a, b) => a.localeCompare(b, 'cs'));

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-700" />
          <h2 className="text-2xl font-bold text-gray-800">{place}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Close">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">Overnight Stays</h3>
        </div>
        <div className="space-y-1">
          {data.entries.map((entry, i) => (
            <p key={i} className="text-sm text-gray-600 ml-7">
              {entry.date} — {entry.tripTitle}
            </p>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">Crew</h3>
        </div>
        <div className="ml-7">
          {sortedCrew.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sortedCrew.map((name, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No crew data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;