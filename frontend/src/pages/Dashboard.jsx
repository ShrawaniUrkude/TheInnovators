import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Car, Leaf, Zap, Bus, Droplets, Recycle,
  TrendingUp, AlertTriangle, BrainCircuit, Activity,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import KPIRing from '../components/KPIRing';
import AlertItem from '../components/AlertItem';
import CustomTooltip from '../components/CustomTooltip';
import {
  dashboardKPIs, trafficHourly, airQualityHistory,
  energyBySource, transportRidership, alertsData,
  aiInsights,
} from '../data/mockData';

const kpiIcons = [Leaf, Car, Zap, Bus, Droplets, Recycle];

const Dashboard = () => {
  return (
    <div className="page-content">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-banner-bg" style={{ backgroundImage: 'url(/hero_city.png)' }}></div>
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <div className="hero-badge">
            <Activity size={14} />
            Real-time Urban Intelligence
          </div>
          <h1>City Operations Dashboard</h1>
          <p>Monitor and analyze urban infrastructure metrics across traffic, environment, energy, and public services in real-time.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        {dashboardKPIs.map((kpi, index) => (
          <StatCard
            key={kpi.label}
            icon={kpiIcons[index]}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend > 0 ? 'up' : 'down'}
            trendValue={kpi.trend}
            color={kpi.color}
            delay={index + 1}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="chart-grid">
        <ChartCard title="Traffic Flow Analysis" subtitle="24-hour vehicle count & speed">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficHourly}>
                <defs>
                  <linearGradient id="vehicleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#3b82f6"
                  fill="url(#vehicleGrad)"
                  strokeWidth={2}
                  name="Vehicles"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="speed"
                  stroke="#8b5cf6"
                  fill="url(#speedGrad)"
                  strokeWidth={2}
                  name="Avg Speed (km/h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Air Quality Trends" subtitle="Weekly AQI & particulate matter">
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
      </div>

      <div className="chart-grid">
        <ChartCard title="Energy Mix" subtitle="Power generation by source">
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="source"
                >
                  {energyBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Public Transit Ridership" subtitle="Hourly passenger volume by mode">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transportRidership}>
                <defs>
                  <linearGradient id="busGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="metroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="metro" name="Metro" stroke="#3b82f6" fill="url(#metroGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="bus" name="Bus" stroke="#10b981" fill="url(#busGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="tram" name="Tram" stroke="#f59e0b" fill="url(#tramGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Alerts & AI Insights */}
      <div className="grid-2 mb-28">
        <div>
          <div className="section-title">
            <AlertTriangle size={20} />
            Active Alerts
          </div>
          <div className="alerts-list">
            {alertsData.slice(0, 4).map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">
            <BrainCircuit size={20} />
            AI-Powered Insights
          </div>
          <div className="alerts-list">
            {aiInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="insight-card">
                <div className="insight-header">
                  <span
                    className="insight-category"
                    style={{
                      background: insight.category === 'Traffic' ? 'rgba(59,130,246,0.1)' :
                        insight.category === 'Energy' ? 'rgba(245,158,11,0.1)' :
                          insight.category === 'Water' ? 'rgba(6,182,212,0.1)' :
                            'rgba(139,92,246,0.1)',
                      color: insight.category === 'Traffic' ? '#3b82f6' :
                        insight.category === 'Energy' ? '#f59e0b' :
                          insight.category === 'Water' ? '#06b6d4' :
                            '#8b5cf6',
                    }}
                  >
                    {insight.category}
                  </span>
                  <div className="insight-confidence">
                    {insight.confidence}%
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${insight.confidence}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="insight-title">{insight.title}</div>
                <div className="insight-description">{insight.description}</div>
                <div className="insight-footer">
                  <span className={`insight-impact ${insight.impact.toLowerCase()}`}>
                    Impact: {insight.impact}
                  </span>
                  <span className="insight-time">{insight.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Rings */}
      <ChartCard title="System Health Overview" subtitle="Key performance indicators">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', padding: '16px 0' }}>
          {dashboardKPIs.slice(0, 5).map((kpi) => (
            <div key={kpi.label} style={{ textAlign: 'center' }}>
              <KPIRing
                value={typeof kpi.value === 'number' && kpi.value > 100 ? (kpi.value / (kpi.max || kpi.value)) * 100 : kpi.value}
                max={kpi.max || 100}
                color={kpi.color}
                label={kpi.label}
              />
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>{kpi.label}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{kpi.status}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Dashboard;
