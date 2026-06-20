import React from 'react';

const FILTER_OPTIONS = [
  { label: 'Island', key: 'overnightIsland' },
  { label: 'City', key: 'overnightCity' },
  { label: 'Bay', key: 'overnightBay' },
];

const PlaceSelector = ({ placeIndex, filterKey, value, onFilterChange, onSelect }) => {
  const places = Array.from(placeIndex.keys()).sort();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold text-gray-700">Select an overnight place to View Crew & Visits:</h2>
        <select
          className="p-1 border rounded text-sm"
          value={filterKey}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>
      <select
        className="w-full p-2 mb-4 border rounded"
        value={value}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="" disabled>Select a {FILTER_OPTIONS.find(o => o.key === filterKey)?.label}</option>
        {places.map(place => (
          <option key={place} value={place}>{place}</option>
        ))}
      </select>
    </div>
  );
};

export default PlaceSelector;