import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import TrafficPage from './pages/TrafficPage';
import EnvironmentPage from './pages/EnvironmentPage';
import EnergyPage from './pages/EnergyPage';
import TransportPage from './pages/TransportPage';
import WaterWastePage from './pages/WaterWastePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <TopBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/traffic" element={<TrafficPage />} />
            <Route path="/environment" element={<EnvironmentPage />} />
            <Route path="/energy" element={<EnergyPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/water-waste" element={<WaterWastePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
