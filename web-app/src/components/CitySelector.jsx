import React from 'react';

const CitySelector = ({ cityIndex, onSelect }) => {
  const cities = Array.from(cityIndex.keys()).sort();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Select a City to View Crew & Visits:</h2>
      <select
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => {
          const city = e.target.value;
          onSelect(city || null);
        }}
      >
        <option value="">Select a city</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;