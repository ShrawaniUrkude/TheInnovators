import React, { useState } from 'react';
import {
  Settings, Bell, Shield, Database, Monitor,
  Globe, Clock, Download, Upload, Palette,
} from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    realTimeUpdates: true,
    pushNotifications: true,
    emailAlerts: false,
    darkMode: true,
    autoRefresh: true,
    dataRetention: '90',
    refreshInterval: '30',
    language: 'en',
    timezone: 'UTC+5:30',
    twoFactor: true,
    apiAccess: false,
    compactView: false,
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>⚙️ Platform Settings</h1>
            <p>Configure your UrbanPulse dashboard preferences, notifications, and data management options.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary">
              <Download size={16} />
              Export Config
            </button>
            <button className="btn btn-primary">
              <Upload size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Monitor size={20} />
          Display & Interface
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Dark Mode</div>
            <div className="setting-desc">Use dark color scheme for the interface</div>
          </div>
          <div className={`toggle-switch ${settings.darkMode ? 'active' : ''}`} onClick={() => toggle('darkMode')}></div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Compact View</div>
            <div className="setting-desc">Reduce spacing and show more data on screen</div>
          </div>
          <div className={`toggle-switch ${settings.compactView ? 'active' : ''}`} onClick={() => toggle('compactView')}></div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Language</div>
            <div className="setting-desc">Set the interface language</div>
          </div>
          <select className="settings-select" value={settings.language} onChange={e => setSettings(p => ({ ...p, language: e.target.value }))}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Timezone</div>
            <div className="setting-desc">Set your local timezone for data timestamps</div>
          </div>
          <select className="settings-select" value={settings.timezone} onChange={e => setSettings(p => ({ ...p, timezone: e.target.value }))}>
            <option value="UTC+0">UTC+0 (London)</option>
            <option value="UTC+1">UTC+1 (Berlin)</option>
            <option value="UTC+5:30">UTC+5:30 (Mumbai)</option>
            <option value="UTC-5">UTC-5 (New York)</option>
            <option value="UTC-8">UTC-8 (Los Angeles)</option>
            <option value="UTC+8">UTC+8 (Singapore)</option>
            <option value="UTC+9">UTC+9 (Tokyo)</option>
          </select>
        </div>
      </div>

      {/* Data & Refresh */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Database size={20} />
          Data & Refresh
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Real-time Updates</div>
            <div className="setting-desc">Stream live data to dashboard widgets</div>
          </div>
          <div className={`toggle-switch ${settings.realTimeUpdates ? 'active' : ''}`} onClick={() => toggle('realTimeUpdates')}></div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Auto Refresh</div>
            <div className="setting-desc">Automatically refresh data at set intervals</div>
          </div>
          <div className={`toggle-switch ${settings.autoRefresh ? 'active' : ''}`} onClick={() => toggle('autoRefresh')}></div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Refresh Interval</div>
            <div className="setting-desc">How often to refresh dashboard data</div>
          </div>
          <select className="settings-select" value={settings.refreshInterval} onChange={e => setSettings(p => ({ ...p, refreshInterval: e.target.value }))}>
            <option value="10">Every 10 seconds</option>
            <option value="30">Every 30 seconds</option>
            <option value="60">Every 1 minute</option>
            <option value="300">Every 5 minutes</option>
          </select>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Data Retention Period</div>
            <div className="setting-desc">How long to keep historical data</div>
          </div>
          <select className="settings-select" value={settings.dataRetention} onChange={e => setSettings(p => ({ ...p, dataRetention: e.target.value }))}>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">1 year</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Bell size={20} />
          Notifications
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Push Notifications</div>
            <div className="setting-desc">Receive browser push notifications for alerts</div>
          </div>
          <div className={`toggle-switch ${settings.pushNotifications ? 'active' : ''}`} onClick={() => toggle('pushNotifications')}></div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Email Alerts</div>
            <div className="setting-desc">Send critical alerts to your email</div>
          </div>
          <div className={`toggle-switch ${settings.emailAlerts ? 'active' : ''}`} onClick={() => toggle('emailAlerts')}></div>
        </div>
      </div>

      {/* Security */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Shield size={20} />
          Security
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Two-Factor Authentication</div>
            <div className="setting-desc">Add an extra layer of security to your account</div>
          </div>
          <div className={`toggle-switch ${settings.twoFactor ? 'active' : ''}`} onClick={() => toggle('twoFactor')}></div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">API Access</div>
            <div className="setting-desc">Allow external applications to access data via API</div>
          </div>
          <div className={`toggle-switch ${settings.apiAccess ? 'active' : ''}`} onClick={() => toggle('apiAccess')}></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
