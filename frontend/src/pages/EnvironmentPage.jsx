import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Leaf, Wind, Thermometer, Volume2, Cloud, Droplets } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { airQualityData, airQualityHistory, noiseData, temperatureData } from '../data/mockData';

const EnvironmentPage = () => {
  const aqiColor = airQualityData.aqi <= 50 ? '#10b981' :
    airQualityData.aqi <= 100 ? '#f59e0b' :
    airQualityData.aqi <= 150 ? '#f97316' : '#f43f5e';

  return (
    <div className="page-content">
      <div className="hero-banner">
        <div className="hero-banner-bg" style={{ backgroundImage: 'url(/environment_hero.png)' }}></div>
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <div className="hero-badge"><Leaf size={14} /> Environmental Monitoring</div>
          <h1>Environmental Analytics</h1>
          <p>Comprehensive monitoring of air quality, noise levels, temperature, and environmental conditions.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Wind} label="Air Quality Index" value={airQualityData.aqi} unit="AQI" color={aqiColor} trend="down" trendValue={5} delay={1} />
        <StatCard icon={Cloud} label="PM2.5" value={airQualityData.pm25} unit="µg/m³" color="#06b6d4" trend="down" trendValue={3.2} delay={2} />
        <StatCard icon={Thermometer} label="PM10" value={airQualityData.pm10} unit="µg/m³" color="#8b5cf6" trend="up" trendValue={1.8} delay={3} />
        <StatCard icon={Droplets} label="CO Level" value={airQualityData.co} unit="ppm" color="#10b981" trend="down" trendValue={12} delay={4} />
      </div>

      {/* AQI Details */}
      <div className="chart-grid mb-28">
        <ChartCard title="Air Quality Index - Weekly Trend" subtitle="AQI and particulate matter levels">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={airQualityHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="aqi" name="AQI" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pm25" name="PM2.5" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pm10" name="PM10" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Pollutant Breakdown" subtitle="Current pollutant concentrations">
          <div style={{ padding: '10px 0' }}>
            {[
              { label: 'PM2.5', value: airQualityData.pm25, max: 75, color: '#06b6d4', unit: 'µg/m³' },
              { label: 'PM10', value: airQualityData.pm10, max: 150, color: '#8b5cf6', unit: 'µg/m³' },
              { label: 'NO₂', value: airQualityData.no2, max: 100, color: '#f59e0b', unit: 'ppb' },
              { label: 'O₃', value: airQualityData.o3, max: 120, color: '#10b981', unit: 'ppb' },
              { label: 'CO', value: airQualityData.co, max: 5, color: '#f43f5e', unit: 'ppm' },
              { label: 'SO₂', value: airQualityData.so2, max: 50, color: '#3b82f6', unit: 'ppb' },
            ].map(p => (
              <div key={p.label} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{p.label}</span>
                  <span style={{ color: '#94a3b8' }}>{p.value} {p.unit}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(p.value / p.max) * 100}%`, background: p.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Noise Levels */}
      <ChartCard title="Noise Levels by Zone" subtitle="Current vs. acceptable limits (dB)" className="mb-28">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={noiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              <Bar dataKey="level" name="Current Level" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="limit" name="Acceptable Limit" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Temperature */}
      <ChartCard title="Temperature Trends" subtitle="Monthly average, max, and min temperatures (°C)">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={temperatureData}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              <Area type="monotone" dataKey="max" name="Max" stroke="#f43f5e" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="avg" name="Average" stroke="#f59e0b" fill="url(#tempGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="min" name="Min" stroke="#3b82f6" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default EnvironmentPage;
