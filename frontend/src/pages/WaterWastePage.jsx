import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Droplets, Gauge, Recycle, Waves, Trash2, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { waterOverview, waterConsumptionMonthly, wasteData, wasteCollectionZones } from '../data/mockData';

const wasteColors = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const WaterWastePage = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>💧 Water & Waste Management</h1>
            <p>Monitor water consumption, quality, waste collection, and recycling metrics across all city zones.</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Droplets} label="Daily Water Usage" value={waterOverview.dailyConsumption} unit="ML" color="#06b6d4" trend="up" trendValue={1.4} delay={1} />
        <StatCard icon={AlertCircle} label="Leakage Rate" value={waterOverview.leakageRate} unit="%" color="#f43f5e" trend="down" trendValue={0.8} delay={2} />
        <StatCard icon={Gauge} label="Treatment Capacity" value={waterOverview.treatmentCapacity} unit="%" color="#3b82f6" trend="up" trendValue={0.5} delay={3} />
        <StatCard icon={Waves} label="Reservoir Level" value={waterOverview.reservoirLevel} unit="%" color="#8b5cf6" trend="down" trendValue={2.1} delay={4} />
        <StatCard icon={Recycle} label="Water Recycled" value={waterOverview.recycledPercent} unit="%" color="#10b981" trend="up" trendValue={3.5} delay={5} />
      </div>

      <div className="chart-grid">
        {/* Water Consumption */}
        <ChartCard title="Monthly Water Consumption" subtitle="By sector (Megalitres)">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterConsumptionMonthly}>
                <defs>
                  <linearGradient id="waterResGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="waterComGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="waterIndGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
                <Area type="monotone" dataKey="industrial" name="Industrial" stroke="#8b5cf6" fill="url(#waterIndGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="residential" name="Residential" stroke="#06b6d4" fill="url(#waterResGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="commercial" name="Commercial" stroke="#f59e0b" fill="url(#waterComGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Waste Breakdown Pie */}
        <ChartCard title="Waste Composition" subtitle="Breakdown by waste type">
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="type"
                >
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={wasteColors[index]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Waste Collection Zones */}
      <div className="section-title" style={{ marginTop: '28px' }}>
        <Trash2 size={20} />
        Waste Collection Zones
      </div>
      <div className="grid-3 mb-28">
        {wasteCollectionZones.map(zone => {
          const fillPercent = (zone.collected / zone.capacity) * 100;
          const fillColor = fillPercent > 80 ? '#f43f5e' : fillPercent > 60 ? '#f59e0b' : '#10b981';

          return (
            <div key={zone.zone} className="zone-card">
              <div className="zone-card-name">{zone.zone}</div>
              <div className="zone-card-stat">
                <span>Collected</span>
                <strong>{zone.collected} / {zone.capacity} tons</strong>
              </div>
              <div className="progress-bar" style={{ margin: '10px 0' }}>
                <div className="progress-fill" style={{ width: `${fillPercent}%`, background: fillColor }}></div>
              </div>
              <div className="zone-card-stat">
                <span>Fill Level</span>
                <strong style={{ color: fillColor }}>{fillPercent.toFixed(0)}%</strong>
              </div>
              <div className="zone-card-stat">
                <span>Next Pickup</span>
                <strong>{zone.nextPickup}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaterWastePage;
