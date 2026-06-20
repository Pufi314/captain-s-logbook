import React from 'react';

const TripSelector = ({ trips, value, onSelect }) => {
  return (
    <select 
      className="w-full p-2 mb-4 border rounded"
      value={value}
      onChange={(e) => onSelect(trips[e.target.value])}
    >
      <option value="" disabled>Select a trip</option>
      {trips.map((trip, index) => (
        <option key={index} value={index}>{trip.metadata.title} ({trip.metadata.startDate})</option>
      ))}
    </select>
  );
};

export default TripSelector;
