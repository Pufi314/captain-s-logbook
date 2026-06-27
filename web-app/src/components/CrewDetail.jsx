import React from 'react';
import { User, Ship, MapPin, X } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

const CrewDetail = ({ name, data, onClose, onTripSelect, onPlaceSelect }) => {
  const { t, translateTitle } = useTranslation();
  if (!data) return null;

  const cities = Array.from(data.cities).sort((a, b) => a.localeCompare(b, 'cs'));
  const bays = Array.from(data.bays).sort((a, b) => a.localeCompare(b, 'cs'));
  const islands = Array.from(data.islands).sort((a, b) => a.localeCompare(b, 'cs'));

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-blue-700" />
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title={t('Close')}>
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Ship className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">{t('Trips')}</h3>
        </div>
        <div className="space-y-1">
          {data.trips.map((trip, i) => (
            <button key={i} onClick={() => onTripSelect?.(trip.trip)} className="block text-sm text-blue-600 hover:text-blue-800 hover:underline ml-7 text-left">
              {trip.startDate} — {translateTitle(trip.title)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">{t('Overnight Cities')}</h3>
        </div>
        <div className="ml-7">
          {cities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cities.map((city, i) => (
                <button key={i} onClick={() => onPlaceSelect?.(city, 'overnightCity')} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 cursor-pointer">
                  {city}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('No city data')}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">{t('Overnight Bays')}</h3>
        </div>
        <div className="ml-7">
          {bays.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bays.map((bay, i) => (
                <button key={i} onClick={() => onPlaceSelect?.(bay, 'overnightBay')} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 cursor-pointer">
                  {bay}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('No bay data')}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">{t('Overnight Islands')}</h3>
        </div>
        <div className="ml-7">
          {islands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {islands.map((island, i) => (
                <button key={i} onClick={() => onPlaceSelect?.(island, 'overnightIsland')} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 cursor-pointer">
                  {island}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('No island data')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrewDetail;