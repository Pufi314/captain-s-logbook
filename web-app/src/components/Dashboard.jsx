import React from 'react';
import { aggregateStats } from '../utils/logProcessor';
import { Anchor, LifeBuoy, Clock, MapPin, Compass, Ship } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

const Dashboard = ({ trips, onTripSelect, captainName }) => {
  const { t, translateTitle } = useTranslation();
  const aggregated = aggregateStats(trips);
  const totalTrips = trips.length;
  const captainTrips = trips.filter(t => t.metadata.captain === captainName).length;

  const topCities = Object.entries(aggregated.cities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => `${city} (${count})`)
    .join(', ');
  
  const StatCard = ({ title, value, icon: Icon, subtitle, onClick }) => {
    return (
      <div onClick={onClick} className={`bg-white/60 p-3 h-[100px] rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow text-left w-full' : ''}`} {...(onClick ? { role: 'button', tabIndex: 0, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } } : {})}>
        {Icon && <div className="p-2 bg-blue-50 text-blue-700 rounded-full"><Icon className="w-5 h-5" /></div>}
        <div>
          <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{title}</h3>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">{t('General Statistics')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title={t('Total Miles')} value={aggregated.totalMiles.toFixed(1) + ' NM'} icon={Compass} />
          <StatCard title={t('Total Hours')} value={(aggregated.totalMinutes / 60).toFixed(1) + ' h'} icon={Clock} />
          <div className="bg-white/60 p-3 h-[100px] rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-full"><Ship className="w-5 h-5" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{t('Sails Miles')}</h3>
              <p className="text-base font-bold">{((aggregated.sailsMiles / (aggregated.totalMiles || 1)) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{aggregated.sailsMiles.toFixed(1)} NM / {aggregated.totalMiles.toFixed(1)} NM</p>
            </div>
          </div>
          <div className="bg-white/60 p-3 h-[100px] rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-full"><Clock className="w-5 h-5" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{t('Sails Hours')}</h3>
              <p className="text-base font-bold">{((aggregated.sailsMinutes / (aggregated.totalMinutes || 1)) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{(aggregated.sailsMinutes / 60).toFixed(1)} h / {(aggregated.totalMinutes / 60).toFixed(1)} h</p>
            </div>
          </div>
          <div className="bg-white/60 p-3 h-[100px] rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-full"><Anchor className="w-5 h-5" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{t('Anchor/Buoy %')}</h3>
              <p className="text-sm font-bold">{t('Anchor:')} {((aggregated.kotvaCount / (aggregated.totalOvernights || 1)) * 100).toFixed(1) + '%'}</p>
              <p className="text-sm font-bold">{t('Buoy:')} {((aggregated.bojaCount / (aggregated.totalOvernights || 1)) * 100).toFixed(1) + '%'}</p>
            </div>
          </div>
          <div className="bg-white/60 p-3 h-[100px] rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-full"><LifeBuoy className="w-5 h-5" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{t('Trips')}</h3>
              <p className="text-xl font-bold text-gray-800">{totalTrips}</p>
              <p className="text-sm text-gray-500">{t('as captain:')} {captainTrips}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">{t('Records')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title={t('Most Miles / Trip')} value={`${aggregated.maxTripTotalMiles.toFixed(1)} NM`} icon={Ship} subtitle={`${translateTitle(aggregated.maxTripTotalMilesTitle)}, ${t('started ')}${aggregated.maxTripTotalMilesStartDate}`} onClick={() => onTripSelect?.(aggregated.maxTripTotalMilesTrip)} />
          <StatCard title={t('Most Sails Miles / Trip')} value={`${aggregated.maxTripSailsMiles.toFixed(1)} NM`} icon={Ship} subtitle={`${translateTitle(aggregated.maxTripSailsMilesTitle)}, ${t('started ')}${aggregated.maxTripSailsMilesStartDate}`} onClick={() => onTripSelect?.(aggregated.maxTripSailsMilesTrip)} />
          <StatCard title={t('Most Miles / Day')} value={`${aggregated.maxDayTotalMiles.toFixed(1)} NM`} icon={MapPin} subtitle={`${translateTitle(aggregated.maxDayTotalMilesTitle)}, ${aggregated.maxDayTotalMilesDate}`} onClick={() => onTripSelect?.(aggregated.maxDayTotalMilesTrip)} />
          <StatCard title={t('Most Sails Miles / Day')} value={`${aggregated.maxDaySailsMiles.toFixed(1)} NM`} icon={MapPin} subtitle={`${translateTitle(aggregated.maxDaySailsMilesTitle)}, ${aggregated.maxDaySailsMilesDate}`} onClick={() => onTripSelect?.(aggregated.maxDaySailsMilesTrip)} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
