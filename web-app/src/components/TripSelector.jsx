import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const TripSelector = ({ trips, value, onSelect }) => {
  const { t, translateTitle } = useTranslation();
  return (
    <select 
      className="w-full p-1 border rounded"
      value={value}
      onChange={(e) => onSelect(trips[e.target.value])}
    >
      <option value="" disabled>{t('Select a trip')}</option>
      {trips.map((trip, index) => (
        <option key={index} value={index}>{translateTitle(trip.metadata.title)} ({trip.metadata.startDate})</option>
      ))}
    </select>
  );
};

export default TripSelector;
