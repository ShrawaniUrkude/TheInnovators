import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Car, Gauge, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { useCityData } from '../hooks/useCityData';
import { useCity } from '../context/CityContext';

const TrafficPage = () => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const { selectedCity } = useCity();
  const { cityName, areaName, data } = useCityData();
  const { trafficOverview, trafficHourly, trafficByZone, trafficIncidents } = data;

  const suggestedRoad = useMemo(() => {
    if (!selectedCity) return null;

    const base = [selectedCity.lat, selectedCity.lng];
    const offset = 0.015;

    const start = [base[0] + offset, base[1] - offset];
    const end = [base[0] - offset, base[1] + offset];

    return {
      name: 'Proposed connector road',
      description: `Proposed new connector road to relieve congestion in ${areaName}.`,
      positions: [start, end],
      start,
      end,
    };
  }, [selectedCity, areaName]);

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

      {suggestedRoad && (
        <ChartCard title="Suggested New Road" subtitle="Proposed connector route to relieve congestion">
          <div className="chart-container" style={{ height: '320px' }}>
            <MapContainer
              center={suggestedRoad.positions[0]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline
                positions={suggestedRoad.positions}
                pathOptions={{ color: '#f59e0b', weight: 6, opacity: 0.8 }}
              />
              <Marker position={suggestedRoad.start}>
                <Popup>
                  <strong>{suggestedRoad.name}</strong>
                  <br />Start
                </Popup>
              </Marker>
              <Marker position={suggestedRoad.end}>
                <Popup>
                  <strong>{suggestedRoad.name}</strong>
                  <br />End
                </Popup>
              </Marker>
            </MapContainer>
            <div style={{ marginTop: '12px', padding: '0 12px', color: '#475569' }}>
              {suggestedRoad.description}
            </div>
          </div>
        </ChartCard>
      )}

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
