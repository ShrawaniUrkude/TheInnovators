import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Moon, RefreshCw } from 'lucide-react';
import { useCity } from '../context/CityContext';

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
  const { selectedCity, setSelectedCityByName, cityOptions, selectedArea, setSelectedArea, areaOptions } = useCity();

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
        <div className="topbar-city-select-wrap">
          <label htmlFor="city-select" className="topbar-city-label">City</label>
          <select
            id="city-select"
            className="topbar-city-select"
            value={selectedCity.name}
            onChange={(event) => setSelectedCityByName(event.target.value)}
          >
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="topbar-city-select-wrap">
          <label htmlFor="area-select" className="topbar-city-label">Area</label>
          <select
            id="area-select"
            className="topbar-city-select"
            value={selectedArea}
            onChange={(event) => setSelectedArea(event.target.value)}
          >
            {areaOptions.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

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
