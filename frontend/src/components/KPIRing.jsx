import React from 'react';

const KPIRing = ({ value, max, color, size = 100 }) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(safeValue / safeMax, 0), 1);
  const dashOffset = circumference * (1 - percent);

  const displayValue = Number.isFinite(value)
    ? (safeValue >= 1000 ? `${Math.round(safeValue / 100) / 10}k` : `${Math.round(safeValue)}`)
    : '--';

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
        {displayValue}
      </div>
    </div>
  );
};

export default KPIRing;
