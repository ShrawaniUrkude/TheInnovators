import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, trend, trendValue, color, delay = 0 }) => {
  const isPositive = trend === 'up';

  return (
    <div
      className={`stat-card animate-fade-in stagger-${delay}`}
      style={{ '--card-accent': color ? `${color}` : undefined }}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: color ? `${color}20` : undefined, color }}>
          {Icon && <Icon />}
        </div>
        {trendValue !== undefined && (
          <div className={`stat-card-trend ${isPositive ? 'up' : 'down'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trendValue)}%
          </div>
        )}
      </div>
      <div className="stat-card-value" style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="stat-card-unit">{unit}</span>}
      </div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
};

export default StatCard;
