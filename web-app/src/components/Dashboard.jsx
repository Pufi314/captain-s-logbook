import React from 'react';
import { aggregateStats } from '../utils/logProcessor';

const Dashboard = ({ trips }) => {
  const aggregated = aggregateStats(trips);

  const topCities = Object.entries(aggregated.cities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => `${city} (${count})`)
    .join(', ');
  
  const StatCard = ({ title, value }) => (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );

  return (
    <>
      <div className="text-lg font-semibold text-gray-700 mb-2">Summary</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Miles" value={aggregated.totalMiles.toFixed(1) + ' nm'} />
        <StatCard title="Total Hours" value={(aggregated.totalMinutes / 60).toFixed(1) + ' h'} />
        <StatCard title="Sails Miles %" value={((aggregated.sailsMiles / (aggregated.totalMiles || 1)) * 100).toFixed(1) + '%'} />
        <StatCard title="Sails Time %" value={((aggregated.sailsMinutes / (aggregated.totalMinutes || 1)) * 100).toFixed(1) + '%'} />
        <StatCard title="Anchor %" value={((aggregated.kotvaCount / (aggregated.totalOvernights || 1)) * 100).toFixed(1) + '%'} />
        <StatCard title="Buoy %" value={((aggregated.bojaCount / (aggregated.totalOvernights || 1)) * 100).toFixed(1) + '%'} />
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h3 className="text-gray-500 text-sm">Mostly Visited Cities</h3>
          <p className="text-lg font-bold">{topCities || 'N/A'}</p>
        </div>
      </div>

      <div className="text-lg font-semibold text-gray-700 mb-2">Records</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Most Miles / Trip" value={`${aggregated.maxTripTotalMiles.toFixed(1)} nm (${aggregated.maxTripTotalMilesTitle}, ${aggregated.maxTripTotalMilesStartDate})`} />
        <StatCard title="Most Sails Miles / Trip" value={`${aggregated.maxTripSailsMiles.toFixed(1)} nm (${aggregated.maxTripSailsMilesTitle}, ${aggregated.maxTripSailsMilesStartDate})`} />
        <StatCard title="Most Miles / Day" value={`${aggregated.maxDayTotalMiles.toFixed(1)} nm (${aggregated.maxDayTotalMilesTitle}, ${aggregated.maxDayTotalMilesDate})`} />
        <StatCard title="Most Sails Miles / Day" value={`${aggregated.maxDaySailsMiles.toFixed(1)} nm (${aggregated.maxDaySailsMilesTitle}, ${aggregated.maxDaySailsMilesDate})`} />
      </div>
    </>
  );
};

export default Dashboard;
