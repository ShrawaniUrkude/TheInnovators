import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ZAxis,
} from 'recharts';
import { BrainCircuit, TrendingUp, Lightbulb, Target, Sparkles } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { aiInsights, predictiveData, correlationMatrix } from '../data/mockData';

const categoryColors = {
  Traffic: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
  Energy: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  Water: { bg: 'rgba(6,182,212,0.1)', text: '#06b6d4' },
  Transport: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6' },
  Environment: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
};

const AnalyticsPage = () => {
  const [filter, setFilter] = useState('All');

  const filteredInsights = filter === 'All'
    ? aiInsights
    : aiInsights.filter(i => i.category === filter);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>🧠 AI-Powered Insights</h1>
            <p>Machine learning models analyze urban data patterns to generate predictive insights and actionable recommendations.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary">
              <Sparkles size={16} />
              Run Analysis
            </button>
            <button className="btn btn-secondary">
              <Target size={16} />
              Custom Query
            </button>
          </div>
        </div>
      </div>

      {/* Predictive Model */}
      <ChartCard title="Predictive AQI Model" subtitle="Actual vs. AI-predicted air quality index (5-day forecast)" className="mb-28">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictiveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[50, 90]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>} />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="AI Predicted"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="8 4"
                dot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Correlation Chart */}
      <ChartCard title="Cross-Domain Correlation Analysis" subtitle="Relationships between urban metrics" className="mb-28">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="x"
                name="Factor X"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="y"
                name="Factor Y"
                tick={{ fontSize: 11 }}
                width={80}
              />
              <ZAxis
                type="number"
                dataKey="value"
                range={[100, 600]}
                name="Correlation"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <div className="label">{d.x} ↔ {d.y}</div>
                      <div className="item">
                        <span>Correlation:</span>
                        <span className="value" style={{ color: d.value > 0 ? '#10b981' : '#f43f5e' }}>
                          {d.value > 0 ? '+' : ''}{d.value.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={correlationMatrix}
                fill="#3b82f6"
                shape={(props) => {
                  const { cx, cy, payload } = props;
                  const color = payload.value > 0 ? '#10b981' : '#f43f5e';
                  const size = Math.abs(payload.value) * 20;
                  return (
                    <circle cx={cx} cy={cy} r={size} fill={color} opacity={0.6} stroke={color} strokeWidth={1} />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* AI Insights List */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <Lightbulb size={20} />
          Generated Insights
        </div>
        <div className="filter-tabs">
          {['All', 'Traffic', 'Energy', 'Water', 'Transport', 'Environment'].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {filteredInsights.map(insight => {
          const colors = categoryColors[insight.category] || categoryColors.Traffic;
          return (
            <div key={insight.id} className="insight-card animate-fade-in">
              <div className="insight-header">
                <span className="insight-category" style={{ background: colors.bg, color: colors.text }}>
                  {insight.category}
                </span>
                <div className="insight-confidence">
                  <BrainCircuit size={14} />
                  {insight.confidence}%
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${insight.confidence}%`, background: `linear-gradient(90deg, ${colors.text}, #8b5cf6)` }}></div>
                  </div>
                </div>
              </div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-description">{insight.description}</div>
              <div className="insight-footer">
                <span className={`insight-impact ${insight.impact.toLowerCase()}`}>
                  <Target size={12} />
                  Impact: {insight.impact}
                </span>
                <span className="insight-time">{insight.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsPage;
