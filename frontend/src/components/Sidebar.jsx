import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Leaf,
  Zap,
  Bus,
  Droplets,
  BrainCircuit,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard, section: 'Main' },
  { label: 'Traffic Flow', path: '/traffic', icon: Car, section: 'Analytics' },
  { label: 'Environment', path: '/environment', icon: Leaf, section: 'Analytics' },
  { label: 'Energy Grid', path: '/energy', icon: Zap, section: 'Analytics' },
  { label: 'Public Transit', path: '/transport', icon: Bus, section: 'Analytics' },
  { label: 'Water & Waste', path: '/water-waste', icon: Droplets, section: 'Analytics' },
  { label: 'AI Insights', path: '/analytics', icon: BrainCircuit, section: 'Intelligence' },
  { label: 'Settings', path: '/settings', icon: Settings, section: 'System' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="UrbanPulse" className="sidebar-logo" />
        <div className="sidebar-brand">
          <h1>UrbanPulse</h1>
          <span>Smart City Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          const previousSection = index > 0 ? navItems[index - 1].section : null;
          const showSection = item.section !== previousSection;

          return (
            <React.Fragment key={item.path}>
              {showSection && (
                <div className="nav-section-label">{item.section}</div>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">AP</div>
          <div className="user-info">
            <div className="name">Alex Parker</div>
            <div className="role">City Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
