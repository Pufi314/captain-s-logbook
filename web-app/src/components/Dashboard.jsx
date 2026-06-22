import React from 'react';
import { aggregateStats } from '../utils/logProcessor';
import { Anchor, LifeBuoy, Clock, MapPin, Compass, Ship } from 'lucide-react';

const Dashboard = ({ trips, onTripSelect }) => {
  const aggregated = aggregateStats(trips);
  const totalTrips = trips.length;
  const captainTrips = trips.filter(t => t.metadata.captain === 'Michal Puffler').length;

  const topCities = Object.entries(aggregated.cities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => `${city} (${count})`)
    .join(', ');
  
  const StatCard = ({ title, value, icon: Icon, subtitle, onClick }) => {
    return (
      <div onClick={onClick} className={`bg-white/80 p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow text-left w-full' : ''}`} {...(onClick ? { role: 'button', tabIndex: 0, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } } : {})}>
        {Icon && <div className="p-3 bg-blue-50 text-blue-700 rounded-full"><Icon className="w-6 h-6" /></div>}
        <div>
          <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">General Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Miles" value={aggregated.totalMiles.toFixed(1) + ' NM'} icon={Compass} />
          <StatCard title="Total Hours" value={(aggregated.totalMinutes / 60).toFixed(1) + ' h'} icon={Clock} />
          <div className="bg-white/80 p-5 rounded-lg shadow-sm border border-gray-100 flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-full"><Ship className="w-6 h-6" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Sails Miles</h3>
              <p className="text-lg font-bold">{((aggregated.sailsMiles / (aggregated.totalMiles || 1)) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{aggregated.sailsMiles.toFixed(1)} NM / {aggregated.totalMiles.toFixed(1)} NM</p>
            </div>
          </div>
          <div className="bg-white/80 p-5 rounded-lg shadow-sm border border-gray-100 flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-full"><Clock className="w-6 h-6" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Sails Hours</h3>
              <p className="text-lg font-bold">{((aggregated.sailsMinutes / (aggregated.totalMinutes || 1)) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{(aggregated.sailsMinutes / 60).toFixed(1)} h / {(aggregated.totalMinutes / 60).toFixed(1)} h</p>
            </div>
          </div>
          <div className="bg-white/80 p-5 rounded-lg shadow-sm border border-gray-100 flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-full"><Anchor className="w-6 h-6" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Anchor/Buoy %</h3>
              <p className="text-lg font-bold">Anchor: {((aggregated.kotvaCount / (aggregated.totalOvernights || 1)) * 100).toFixed(1) + '%'}</p>
              <p className="text-lg font-bold">Buoy: {((aggregated.bojaCount / (aggregated.totalOvernights || 1)) * 100).toFixed(1) + '%'}</p>
            </div>
          </div>
          <div className="bg-white/80 p-5 rounded-lg shadow-sm border border-gray-100 flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-full"><LifeBuoy className="w-6 h-6" /></div>
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Trips</h3>
              <p className="text-2xl font-bold text-gray-800">{totalTrips}</p>
              <p className="text-sm text-gray-500 mt-1">as captain: {captainTrips}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Most Miles / Trip" value={`${aggregated.maxTripTotalMiles.toFixed(1)} NM`} icon={Ship} subtitle={`${aggregated.maxTripTotalMilesTitle}, started ${aggregated.maxTripTotalMilesStartDate}`} onClick={() => onTripSelect?.(aggregated.maxTripTotalMilesTrip)} />
          <StatCard title="Most Sails Miles / Trip" value={`${aggregated.maxTripSailsMiles.toFixed(1)} NM`} icon={Ship} subtitle={`${aggregated.maxTripSailsMilesTitle}, started ${aggregated.maxTripSailsMilesStartDate}`} onClick={() => onTripSelect?.(aggregated.maxTripSailsMilesTrip)} />
          <StatCard title="Most Miles / Day" value={`${aggregated.maxDayTotalMiles.toFixed(1)} NM`} icon={MapPin} subtitle={`${aggregated.maxDayTotalMilesTitle}, ${aggregated.maxDayTotalMilesDate}`} onClick={() => onTripSelect?.(aggregated.maxDayTotalMilesTrip)} />
          <StatCard title="Most Sails Miles / Day" value={`${aggregated.maxDaySailsMiles.toFixed(1)} NM`} icon={MapPin} subtitle={`${aggregated.maxDaySailsMilesTitle}, ${aggregated.maxDaySailsMilesDate}`} onClick={() => onTripSelect?.(aggregated.maxDaySailsMilesTrip)} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
