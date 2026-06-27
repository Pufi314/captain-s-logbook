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
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Select a Place
        <select
          className="ml-1 p-1 border rounded text-sm align-middle"
          value={filterKey}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </h2>
      <select
        className="w-full p-1 border rounded"
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