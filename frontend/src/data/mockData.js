// ==========================================
// URBAN PULSE - MOCK DATA
// ==========================================

// --- Traffic Data ---
export const trafficOverview = {
  totalVehicles: 284750,
  avgSpeed: 42,
  congestionIndex: 6.8,
  incidents: 12,
  trend: '+3.2%',
};

export const trafficHourly = [
  { hour: '00:00', vehicles: 1200, speed: 58 },
  { hour: '01:00', vehicles: 800, speed: 62 },
  { hour: '02:00', vehicles: 500, speed: 65 },
  { hour: '03:00', vehicles: 350, speed: 68 },
  { hour: '04:00', vehicles: 420, speed: 66 },
  { hour: '05:00', vehicles: 1800, speed: 55 },
  { hour: '06:00', vehicles: 5200, speed: 40 },
  { hour: '07:00', vehicles: 12500, speed: 28 },
  { hour: '08:00', vehicles: 18200, speed: 22 },
  { hour: '09:00', vehicles: 15800, speed: 30 },
  { hour: '10:00', vehicles: 11200, speed: 38 },
  { hour: '11:00', vehicles: 10800, speed: 40 },
  { hour: '12:00', vehicles: 13500, speed: 34 },
  { hour: '13:00', vehicles: 14200, speed: 32 },
  { hour: '14:00', vehicles: 12800, speed: 36 },
  { hour: '15:00', vehicles: 13100, speed: 35 },
  { hour: '16:00', vehicles: 16500, speed: 25 },
  { hour: '17:00', vehicles: 19800, speed: 18 },
  { hour: '18:00', vehicles: 17200, speed: 24 },
  { hour: '19:00', vehicles: 12500, speed: 38 },
  { hour: '20:00', vehicles: 8200, speed: 45 },
  { hour: '21:00', vehicles: 5500, speed: 50 },
  { hour: '22:00', vehicles: 3200, speed: 55 },
  { hour: '23:00', vehicles: 2100, speed: 58 },
];

export const trafficByZone = [
  { zone: 'Downtown', congestion: 85, vehicles: 45000, avgSpeed: 18 },
  { zone: 'Midtown', congestion: 72, vehicles: 38000, avgSpeed: 25 },
  { zone: 'Uptown', congestion: 45, vehicles: 22000, avgSpeed: 42 },
  { zone: 'Industrial', congestion: 58, vehicles: 28000, avgSpeed: 35 },
  { zone: 'Suburbs East', congestion: 30, vehicles: 15000, avgSpeed: 52 },
  { zone: 'Suburbs West', congestion: 25, vehicles: 12000, avgSpeed: 55 },
  { zone: 'Harbor District', congestion: 62, vehicles: 31000, avgSpeed: 30 },
  { zone: 'Tech Park', congestion: 55, vehicles: 26000, avgSpeed: 38 },
];

export const trafficIncidents = [
  { id: 1, type: 'Accident', location: 'Main St & 5th Ave', severity: 'High', time: '08:42 AM', status: 'Active' },
  { id: 2, type: 'Construction', location: 'Highway 101 - Exit 14', severity: 'Medium', time: '06:00 AM', status: 'Ongoing' },
  { id: 3, type: 'Road Closure', location: 'Park Boulevard', severity: 'Low', time: '07:15 AM', status: 'Scheduled' },
  { id: 4, type: 'Signal Failure', location: 'Oak St & 12th Ave', severity: 'High', time: '09:30 AM', status: 'Active' },
  { id: 5, type: 'Accident', location: 'Interstate 280 - Mile 42', severity: 'Medium', time: '10:15 AM', status: 'Clearing' },
];

// --- Environment Data ---
export const airQualityData = {
  aqi: 72,
  pm25: 18.5,
  pm10: 42.3,
  no2: 28.4,
  o3: 45.2,
  co: 0.8,
  so2: 5.2,
  status: 'Moderate',
};

export const airQualityHistory = [
  { date: 'Mon', aqi: 45, pm25: 12, pm10: 28 },
  { date: 'Tue', aqi: 52, pm25: 15, pm10: 32 },
  { date: 'Wed', aqi: 68, pm25: 20, pm10: 38 },
  { date: 'Thu', aqi: 72, pm25: 18, pm10: 42 },
  { date: 'Fri', aqi: 58, pm25: 14, pm10: 35 },
  { date: 'Sat', aqi: 40, pm25: 10, pm10: 25 },
  { date: 'Sun', aqi: 35, pm25: 8, pm10: 22 },
];

export const noiseData = [
  { zone: 'Downtown', level: 78, limit: 70 },
  { zone: 'Residential A', level: 52, limit: 55 },
  { zone: 'Industrial', level: 82, limit: 80 },
  { zone: 'Park District', level: 45, limit: 50 },
  { zone: 'Hospital Zone', level: 48, limit: 45 },
  { zone: 'School Zone', level: 55, limit: 50 },
];

export const temperatureData = [
  { month: 'Jan', avg: 8, max: 12, min: 4 },
  { month: 'Feb', avg: 10, max: 15, min: 6 },
  { month: 'Mar', avg: 14, max: 19, min: 9 },
  { month: 'Apr', avg: 18, max: 23, min: 13 },
  { month: 'May', avg: 22, max: 28, min: 17 },
  { month: 'Jun', avg: 27, max: 33, min: 22 },
  { month: 'Jul', avg: 30, max: 36, min: 25 },
  { month: 'Aug', avg: 29, max: 35, min: 24 },
  { month: 'Sep', avg: 25, max: 30, min: 20 },
  { month: 'Oct', avg: 19, max: 24, min: 14 },
  { month: 'Nov', avg: 13, max: 17, min: 9 },
  { month: 'Dec', avg: 9, max: 13, min: 5 },
];

// --- Energy Data ---
export const energyOverview = {
  totalConsumption: 1245.8,
  renewablePercent: 38,
  peakDemand: 892,
  gridEfficiency: 94.2,
  carbonSaved: 12450,
};

export const energyBySource = [
  { source: 'Solar', value: 285, color: '#f59e0b' },
  { source: 'Wind', value: 190, color: '#06b6d4' },
  { source: 'Natural Gas', value: 420, color: '#8b5cf6' },
  { source: 'Nuclear', value: 210, color: '#10b981' },
  { source: 'Hydro', value: 95, color: '#3b82f6' },
  { source: 'Coal', value: 45, color: '#6b7280' },
];

export const energyConsumptionDaily = [
  { time: '00:00', residential: 120, commercial: 45, industrial: 180 },
  { time: '03:00', residential: 80, commercial: 20, industrial: 170 },
  { time: '06:00', residential: 150, commercial: 60, industrial: 200 },
  { time: '09:00', residential: 180, commercial: 280, industrial: 350 },
  { time: '12:00', residential: 160, commercial: 320, industrial: 380 },
  { time: '15:00', residential: 170, commercial: 310, industrial: 360 },
  { time: '18:00', residential: 250, commercial: 200, industrial: 280 },
  { time: '21:00', residential: 220, commercial: 100, industrial: 220 },
];

export const energyMonthly = [
  { month: 'Jan', consumption: 1380, renewable: 420 },
  { month: 'Feb', consumption: 1290, renewable: 450 },
  { month: 'Mar', consumption: 1150, renewable: 520 },
  { month: 'Apr', consumption: 1020, renewable: 580 },
  { month: 'May', consumption: 980, renewable: 620 },
  { month: 'Jun', consumption: 1180, renewable: 680 },
  { month: 'Jul', consumption: 1350, renewable: 720 },
  { month: 'Aug', consumption: 1320, renewable: 700 },
  { month: 'Sep', consumption: 1100, renewable: 640 },
  { month: 'Oct', consumption: 1050, renewable: 560 },
  { month: 'Nov', consumption: 1200, renewable: 480 },
  { month: 'Dec', consumption: 1340, renewable: 440 },
];

// --- Transport Data ---
export const transportOverview = {
  dailyRidership: 542000,
  onTimeRate: 87.5,
  activeBuses: 342,
  activeTrains: 48,
  avgWaitTime: 8.2,
};

export const transportRidership = [
  { hour: '06:00', bus: 8500, metro: 12000, tram: 3200 },
  { hour: '07:00', bus: 15200, metro: 28000, tram: 6800 },
  { hour: '08:00', bus: 22000, metro: 45000, tram: 9500 },
  { hour: '09:00', bus: 18500, metro: 35000, tram: 7200 },
  { hour: '10:00', bus: 12000, metro: 22000, tram: 5500 },
  { hour: '11:00', bus: 10500, metro: 18000, tram: 4800 },
  { hour: '12:00', bus: 13000, metro: 20000, tram: 5200 },
  { hour: '13:00', bus: 12500, metro: 19000, tram: 5000 },
  { hour: '14:00', bus: 11000, metro: 17000, tram: 4500 },
  { hour: '15:00', bus: 13500, metro: 21000, tram: 5500 },
  { hour: '16:00', bus: 18000, metro: 32000, tram: 7800 },
  { hour: '17:00', bus: 24000, metro: 48000, tram: 10200 },
  { hour: '18:00', bus: 20000, metro: 38000, tram: 8500 },
  { hour: '19:00', bus: 14000, metro: 25000, tram: 6000 },
  { hour: '20:00', bus: 9000, metro: 15000, tram: 4000 },
  { hour: '21:00', bus: 6000, metro: 10000, tram: 2800 },
];

export const transportRoutes = [
  { id: 'B1', name: 'Blue Line Express', type: 'Bus', status: 'On Time', ridership: 12500, occupancy: 78 },
  { id: 'M1', name: 'Metro Central', type: 'Metro', status: 'On Time', ridership: 45000, occupancy: 92 },
  { id: 'T1', name: 'Tram Downtown Loop', type: 'Tram', status: 'Delayed', ridership: 8200, occupancy: 65 },
  { id: 'B2', name: 'Green Park Route', type: 'Bus', status: 'On Time', ridership: 8800, occupancy: 55 },
  { id: 'M2', name: 'Metro East-West', type: 'Metro', status: 'On Time', ridership: 38000, occupancy: 85 },
  { id: 'B3', name: 'Airport Shuttle', type: 'Bus', status: 'On Time', ridership: 15200, occupancy: 82 },
  { id: 'T2', name: 'Harbor Tram', type: 'Tram', status: 'Cancelled', ridership: 0, occupancy: 0 },
  { id: 'M3', name: 'Metro North Line', type: 'Metro', status: 'Delayed', ridership: 32000, occupancy: 88 },
];

// --- Water & Waste Data ---
export const waterOverview = {
  dailyConsumption: 285.4,
  leakageRate: 8.2,
  treatmentCapacity: 92,
  reservoirLevel: 78,
  recycledPercent: 42,
};

export const waterConsumptionMonthly = [
  { month: 'Jan', residential: 82, commercial: 45, industrial: 120 },
  { month: 'Feb', residential: 78, commercial: 42, industrial: 118 },
  { month: 'Mar', residential: 85, commercial: 48, industrial: 125 },
  { month: 'Apr', residential: 92, commercial: 52, industrial: 130 },
  { month: 'May', residential: 110, commercial: 58, industrial: 128 },
  { month: 'Jun', residential: 135, commercial: 65, industrial: 132 },
  { month: 'Jul', residential: 155, commercial: 72, industrial: 135 },
  { month: 'Aug', residential: 148, commercial: 68, industrial: 130 },
  { month: 'Sep', residential: 120, commercial: 58, industrial: 128 },
  { month: 'Oct', residential: 95, commercial: 50, industrial: 125 },
  { month: 'Nov', residential: 85, commercial: 45, industrial: 122 },
  { month: 'Dec', residential: 80, commercial: 43, industrial: 120 },
];

export const wasteData = [
  { type: 'Recyclable', amount: 1250, percent: 35 },
  { type: 'Organic', amount: 890, percent: 25 },
  { type: 'General', amount: 1070, percent: 30 },
  { type: 'Hazardous', amount: 180, percent: 5 },
  { type: 'E-Waste', amount: 178, percent: 5 },
];

export const wasteCollectionZones = [
  { zone: 'Zone A - Downtown', collected: 92, capacity: 100, nextPickup: '2 hrs' },
  { zone: 'Zone B - Midtown', collected: 78, capacity: 100, nextPickup: '4 hrs' },
  { zone: 'Zone C - Uptown', collected: 45, capacity: 100, nextPickup: '8 hrs' },
  { zone: 'Zone D - Industrial', collected: 88, capacity: 120, nextPickup: '1 hr' },
  { zone: 'Zone E - Suburbs', collected: 35, capacity: 80, nextPickup: '12 hrs' },
  { zone: 'Zone F - Harbor', collected: 62, capacity: 90, nextPickup: '6 hrs' },
];

// --- Dashboard KPIs ---
export const dashboardKPIs = [
  { label: 'Air Quality Index', value: 72, max: 500, unit: 'AQI', status: 'Moderate', color: '#f59e0b', trend: -5 },
  { label: 'Traffic Flow', value: 284750, unit: 'vehicles/day', status: 'Normal', color: '#3b82f6', trend: 3.2 },
  { label: 'Energy Usage', value: 1245.8, unit: 'MWh', status: 'Optimal', color: '#10b981', trend: -2.1 },
  { label: 'Public Transit', value: 542000, unit: 'riders/day', status: 'High', color: '#8b5cf6', trend: 5.8 },
  { label: 'Water Usage', value: 285.4, unit: 'ML/day', status: 'Normal', color: '#06b6d4', trend: 1.4 },
  { label: 'Waste Recycled', value: 42, unit: '%', status: 'Good', color: '#22c55e', trend: 8.3 },
];

// --- Alerts ---
export const alertsData = [
  { id: 1, type: 'critical', title: 'High Congestion Alert', message: 'Downtown area experiencing severe traffic congestion. Average speed dropped to 12 km/h.', time: '5 min ago', category: 'Traffic' },
  { id: 2, type: 'warning', title: 'Air Quality Degradation', message: 'PM2.5 levels rising in Industrial Zone. Current reading: 85 µg/m³.', time: '12 min ago', category: 'Environment' },
  { id: 3, type: 'info', title: 'Metro Delay - Line M3', message: 'North Line experiencing 15-minute delays due to signal maintenance.', time: '25 min ago', category: 'Transport' },
  { id: 4, type: 'warning', title: 'Water Pressure Drop', message: 'Sector B-7 reporting lower than normal water pressure. Maintenance team dispatched.', time: '32 min ago', category: 'Water' },
  { id: 5, type: 'info', title: 'Solar Output Peak', message: 'Solar energy generation reached 285 MW - highest this month.', time: '1 hr ago', category: 'Energy' },
  { id: 6, type: 'critical', title: 'Waste Collection Delay', message: 'Zone D collection delayed. Industrial zone bins at 88% capacity.', time: '1.5 hrs ago', category: 'Waste' },
];

// --- Analytics Insights ---
export const aiInsights = [
  {
    id: 1,
    title: 'Traffic Pattern Anomaly Detected',
    description: 'AI model detected unusual traffic surge on Highway 101 between 2-4 PM on weekdays. This correlates with new commercial development in Tech Park zone. Recommended: Adjust signal timing on exits 12-15.',
    confidence: 94,
    category: 'Traffic',
    impact: 'High',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    title: 'Energy Demand Forecast',
    description: 'Based on weather predictions and historical patterns, energy demand is expected to spike 23% next week due to heatwave conditions. Solar output will increase by 15%, partially offsetting the rise.',
    confidence: 88,
    category: 'Energy',
    impact: 'Medium',
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    title: 'Water Leak Prediction',
    description: 'Machine learning model identifies high probability (87%) of water main failure in Sector C-12 within next 30 days based on pipe age, soil conditions, and pressure fluctuation patterns.',
    confidence: 87,
    category: 'Water',
    impact: 'High',
    timestamp: '6 hours ago',
  },
  {
    id: 4,
    title: 'Transit Route Optimization',
    description: 'Analysis of ridership data suggests Bus Route B2 can be optimized by adding 3 additional stops in the residential corridor, potentially increasing ridership by 18%.',
    confidence: 82,
    category: 'Transport',
    impact: 'Medium',
    timestamp: '8 hours ago',
  },
  {
    id: 5,
    title: 'Air Quality Improvement Trend',
    description: 'Citywide PM2.5 levels have decreased 12% over the past quarter, correlating with increased EV adoption and reduced industrial emissions during off-peak hours.',
    confidence: 91,
    category: 'Environment',
    impact: 'Low',
    timestamp: '12 hours ago',
  },
];

// --- Correlation Data for Analytics ---
export const correlationMatrix = [
  { x: 'Traffic', y: 'Air Quality', value: -0.85 },
  { x: 'Traffic', y: 'Energy', value: 0.62 },
  { x: 'Traffic', y: 'Noise', value: 0.78 },
  { x: 'Traffic', y: 'Transit', value: -0.45 },
  { x: 'Air Quality', y: 'Energy', value: -0.52 },
  { x: 'Air Quality', y: 'Noise', value: -0.68 },
  { x: 'Air Quality', y: 'Transit', value: 0.35 },
  { x: 'Energy', y: 'Noise', value: 0.42 },
  { x: 'Energy', y: 'Transit', value: 0.28 },
  { x: 'Noise', y: 'Transit', value: -0.38 },
];

export const predictiveData = [
  { day: 'Day 1', actual: 72, predicted: 70 },
  { day: 'Day 2', actual: 68, predicted: 71 },
  { day: 'Day 3', actual: 75, predicted: 73 },
  { day: 'Day 4', actual: 82, predicted: 78 },
  { day: 'Day 5', actual: 78, predicted: 80 },
  { day: 'Day 6', actual: null, predicted: 76 },
  { day: 'Day 7', actual: null, predicted: 72 },
  { day: 'Day 8', actual: null, predicted: 68 },
  { day: 'Day 9', actual: null, predicted: 65 },
  { day: 'Day 10', actual: null, predicted: 70 },
];
