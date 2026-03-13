import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Car, Gauge, AlertTriangle, Clock, MapPin } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { useCityData } from '../hooks/useCityData';

const TrafficPage = () => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const { cityName, areaName, data } = useCityData();
  const { trafficOverview, trafficHourly, trafficByZone, trafficIncidents } = data;

  return (
    <div className="page-content">
      <div className="hero-banner">
        <div className="hero-banner-bg" style={{ backgroundImage: 'url(/traffic_hero.png)' }}></div>
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <div className="hero-badge"><Car size={14} /> Traffic Management</div>
          <h1>Traffic Flow Analytics</h1>
          <p>Real-time traffic monitoring, congestion analysis, and incident management across {cityName} — {areaName}.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Car} label="Total Vehicles Today" value={trafficOverview.totalVehicles} color="#3b82f6" trend="up" trendValue={3.2} delay={1} />
        <StatCard icon={Gauge} label="Average Speed" value={trafficOverview.avgSpeed} unit="km/h" color="#10b981" trend="down" trendValue={2.1} delay={2} />
        <StatCard icon={AlertTriangle} label="Congestion Index" value={trafficOverview.congestionIndex} unit="/10" color="#f59e0b" trend="up" trendValue={1.5} delay={3} />
        <StatCard icon={AlertTriangle} label="Active Incidents" value={trafficOverview.incidents} color="#f43f5e" trend="up" trendValue={8.3} delay={4} />
      </div>

      <div className="chart-grid">
        <ChartCard
          title="Hourly Traffic Volume"
          subtitle="Vehicle count throughout the day"
          headerRight={
            <div className="filter-tabs">
              {['24h', '7d', '30d'].map(f => (
                <button key={f} className={`filter-tab ${timeFilter === f ? 'active' : ''}`} onClick={() => setTimeFilter(f)}>{f}</button>
              ))}
            </div>
          }
        >
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficHourly}>
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke="#3b82f6" fill="url(#trafficGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Average Speed by Hour" subtitle="km/h across major corridors">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficHourly}>
                <defs>
                  <linearGradient id="speedGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#10b981" fill="url(#speedGrad2)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Zone Congestion */}
      <ChartCard title="Congestion by Zone" subtitle="Current traffic congestion levels across city zones" className="mb-28">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficByZone} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="zone" tick={{ fontSize: 11 }} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="congestion" name="Congestion %" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Incidents Table */}
      <ChartCard title="Active Incidents" subtitle="Real-time traffic incidents and road events">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trafficIncidents.map(inc => (
                <tr key={inc.id}>
                  <td style={{ fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={14} style={{ color: inc.severity === 'High' ? '#f43f5e' : inc.severity === 'Medium' ? '#f59e0b' : '#10b981' }} />
                      {inc.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: '#64748b' }} />
                      {inc.location}
                    </span>
                  </td>
                  <td>
                    <span className="severity-dot" style={{ marginRight: '6px', background: inc.severity === 'High' ? '#f43f5e' : inc.severity === 'Medium' ? '#f59e0b' : '#10b981' }}></span>
                    {inc.severity}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                      <Clock size={14} />
                      {inc.time}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${inc.status.toLowerCase().replace(' ', '-')}`}>{inc.status}</span>
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

export default TrafficPage;
