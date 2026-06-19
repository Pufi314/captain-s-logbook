import React from 'react';

const TripSelector = ({ trips, onSelect }) => {
  return (
    <select 
      className="w-full p-2 mb-4 border rounded"
      onChange={(e) => onSelect(trips[e.target.value])}
    >
      <option value="">Select a trip</option>
      {trips.map((trip, index) => (
        <option key={index} value={index}>{trip.metadata.title} ({trip.metadata.startDate})</option>
      ))}
    </select>
  );
};

export default TripSelector;
