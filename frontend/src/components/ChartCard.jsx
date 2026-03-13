import React from 'react';

const ChartCard = ({ title, subtitle, children, actions, className = '', headerRight }) => {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">{title}</div>
          {subtitle && <div className="chart-card-subtitle">{subtitle}</div>}
        </div>
        <div className="chart-card-actions">
          {headerRight}
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
