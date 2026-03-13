import React from 'react';

const KPIRing = ({ value, max, color, label, size = 100 }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - percent);

  return (
    <div className="kpi-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="kpi-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="kpi-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="kpi-ring-value" style={{ color }}>
        {typeof value === 'number' && value > 100 ? `${Math.round(value / 1000)}k` : value}
      </div>
    </div>
  );
};

export default KPIRing;
