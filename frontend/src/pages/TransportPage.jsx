import React, { useState } from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Bus, Train, Clock, Users, Gauge, Navigation } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { useCityData } from '../hooks/useCityData';

const TransportPage = () => {
  const [filterType, setFilterType] = useState('All');
  const { cityName, areaName, data } = useCityData();
  const { transportOverview, transportRidership, transportRoutes } = data;

  const filteredRoutes = filterType === 'All'
    ? transportRoutes
    : transportRoutes.filter(r => r.type === filterType);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>🚌 Public Transit System</h1>
            <p>Monitor ridership, route performance, and transit efficiency in {cityName} — {areaName} across bus, metro, and tram networks.</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Users} label="Daily Ridership" value={transportOverview.dailyRidership} color="#3b82f6" trend="up" trendValue={5.8} delay={1} />
        <StatCard icon={Clock} label="On-Time Rate" value={transportOverview.onTimeRate} unit="%" color="#10b981" trend="up" trendValue={2.3} delay={2} />
        <StatCard icon={Bus} label="Active Buses" value={transportOverview.activeBuses} color="#f59e0b" trend="up" trendValue={1.2} delay={3} />
        <StatCard icon={Train} label="Active Trains" value={transportOverview.activeTrains} color="#8b5cf6" trend="down" trendValue={0.5} delay={4} />
        <StatCard icon={Gauge} label="Avg Wait Time" value={transportOverview.avgWaitTime} unit="min" color="#06b6d4" trend="down" trendValue={1.5} delay={5} />
      </div>

      {/* Ridership Chart */}
      <ChartCard title="Hourly Ridership by Mode" subtitle="Passenger volume throughout the day" className="mb-28">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transportRidership}>
              <defs>
                <linearGradient id="busG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="metroG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tramG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              <Area type="monotone" dataKey="metro" name="Metro" stroke="#3b82f6" fill="url(#metroG)" strokeWidth={2} />
              <Area type="monotone" dataKey="bus" name="Bus" stroke="#10b981" fill="url(#busG)" strokeWidth={2} />
              <Area type="monotone" dataKey="tram" name="Tram" stroke="#f59e0b" fill="url(#tramG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Routes Table */}
      <ChartCard
        title="Route Performance"
        subtitle="Active routes and current status"
        headerRight={
          <div className="filter-tabs">
            {['All', 'Bus', 'Metro', 'Tram'].map(f => (
              <button key={f} className={`filter-tab ${filterType === f ? 'active' : ''}`} onClick={() => setFilterType(f)}>{f}</button>
            ))}
          </div>
        }
      >
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Ridership</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map(route => (
                <tr key={route.id}>
                  <td style={{ fontWeight: 700, color: '#60a5fa' }}>{route.id}</td>
                  <td style={{ fontWeight: 500 }}>{route.name}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: route.type === 'Bus' ? '#10b981' : route.type === 'Metro' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {route.type === 'Bus' ? <Bus size={14} /> : route.type === 'Metro' ? <Train size={14} /> : <Navigation size={14} />}
                      {route.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${route.status.toLowerCase().replace(' ', '-')}`}>
                      <span className="severity-dot" style={{
                        background: route.status === 'On Time' ? '#10b981' : route.status === 'Delayed' ? '#f59e0b' : '#f43f5e',
                        width: '6px', height: '6px'
                      }}></span>
                      {route.status}
                    </span>
                  </td>
                  <td>{route.ridership.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="progress-bar" style={{ width: '80px' }}>
                        <div className="progress-fill" style={{
                          width: `${route.occupancy}%`,
                          background: route.occupancy > 85 ? '#f43f5e' : route.occupancy > 60 ? '#f59e0b' : '#10b981'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{route.occupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default TransportPage;
