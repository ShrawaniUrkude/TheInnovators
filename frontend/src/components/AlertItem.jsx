import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const iconMap = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const AlertItem = ({ alert }) => {
  const Icon = iconMap[alert.type] || Info;

  return (
    <div className="alert-item">
      <div className={`alert-icon ${alert.type}`}>
        <Icon size={20} />
      </div>
      <div className="alert-content">
        <div className="alert-title">
          {alert.title}
        </div>
        <div className="alert-message">{alert.message}</div>
        <div className="alert-meta">
          <span className="alert-category">{alert.category}</span>
          <span>{alert.time}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
