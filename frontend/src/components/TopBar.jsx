import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Moon, RefreshCw } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/traffic': 'Traffic Flow',
  '/environment': 'Environment',
  '/energy': 'Energy Grid',
  '/transport': 'Public Transit',
  '/water-waste': 'Water & Waste',
  '/analytics': 'AI Insights',
  '/settings': 'Settings',
};

const TopBar = () => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span>UrbanPulse</span>
          <span className="separator">/</span>
          <span className="current">{currentTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-live">
          <span className="live-dot"></span>
          Live Data
        </div>

        <div className="topbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search metrics, zones..."
            id="global-search"
          />
        </div>

        <button className="topbar-icon-btn" title="Refresh Data" id="refresh-btn">
          <RefreshCw />
        </button>

        <button className="topbar-icon-btn" title="Notifications" id="notifications-btn">
          <Bell />
          <span className="notification-badge"></span>
        </button>

        <button className="topbar-icon-btn" title="Toggle Theme" id="theme-toggle-btn">
          <Moon />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
