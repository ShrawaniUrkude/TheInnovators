import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Zap, Battery, Sun, TrendingDown, Factory, Leaf } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { useCityData } from '../hooks/useCityData';

const EnergyPage = () => {
  const { cityName, areaName, data } = useCityData();
  const { energyOverview, energyBySource, energyConsumptionDaily, energyMonthly } = data;

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>⚡ Energy Grid Management</h1>
            <p>Monitor power generation, consumption patterns, and renewable energy integration in {cityName} — {areaName}.</p>
          </div>
          <button className="btn btn-primary">
            <Zap size={16} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Zap} label="Total Consumption" value={energyOverview.totalConsumption} unit="MWh" color="#f59e0b" trend="down" trendValue={2.1} delay={1} />
        <StatCard icon={Sun} label="Renewable Share" value={energyOverview.renewablePercent} unit="%" color="#10b981" trend="up" trendValue={4.5} delay={2} />
        <StatCard icon={Battery} label="Peak Demand" value={energyOverview.peakDemand} unit="MW" color="#3b82f6" trend="up" trendValue={1.8} delay={3} />
        <StatCard icon={Factory} label="Grid Efficiency" value={energyOverview.gridEfficiency} unit="%" color="#8b5cf6" trend="up" trendValue={0.3} delay={4} />
        <StatCard icon={Leaf} label="Carbon Saved" value={`${(energyOverview.carbonSaved / 1000).toFixed(1)}k`} unit="tons" color="#22c55e" trend="up" trendValue={8.3} delay={5} />
      </div>

      <div className="chart-grid">
        <ChartCard title="Energy Source Distribution" subtitle="Power generation by fuel type">
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="source"
                >
                  {energyBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Daily Consumption by Sector" subtitle="Residential, commercial, and industrial usage">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyConsumptionDaily}>
                <defs>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="indGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
                <Area type="monotone" dataKey="industrial" name="Industrial" stroke="#8b5cf6" fill="url(#indGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="commercial" name="Commercial" stroke="#f59e0b" fill="url(#comGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="residential" name="Residential" stroke="#3b82f6" fill="url(#resGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Monthly Trend */}
      <ChartCard title="Monthly Energy Trends" subtitle="Total consumption vs. renewable generation (MWh)">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              <Bar dataKey="consumption" name="Total Consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Bar dataKey="renewable" name="Renewable" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default EnergyPage;
