import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const CrewSelector = ({ crewIndex, value, onSelect }) => {
  const { t } = useTranslation();
  const names = Array.from(crewIndex.keys()).sort((a, b) => a.localeCompare(b, 'cs'));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{t('Select a Crew Member')}</h2>
      <select
        className="w-full p-1 border rounded"
        value={value}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="" disabled>{t('Select a crew member')}</option>
        {names.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

export default CrewSelector;