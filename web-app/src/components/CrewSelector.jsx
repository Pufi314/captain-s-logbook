import React from 'react';

const CrewSelector = ({ crewIndex, value, onSelect }) => {
  const names = Array.from(crewIndex.keys()).sort((a, b) => a.localeCompare(b, 'cs'));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Select a Crew Member to View Their Trips:</h2>
      <select
        className="w-full p-2 mb-4 border rounded"
        value={value}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="" disabled>Select a crew member</option>
        {names.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

export default CrewSelector;