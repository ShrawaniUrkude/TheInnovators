import { useMemo } from 'react';
import { useCity } from '../context/CityContext';
import {
  trafficOverview,
  trafficHourly,
  trafficByZone,
  trafficIncidents,
  airQualityData,
  airQualityHistory,
  noiseData,
  temperatureData,
  energyOverview,
  energyBySource,
  energyConsumptionDaily,
  energyMonthly,
  transportOverview,
  transportRidership,
  transportRoutes,
  waterOverview,
  waterConsumptionMonthly,
  wasteData,
  wasteCollectionZones,
  dashboardKPIs,
  alertsData,
  correlationMatrix,
} from '../data/mockData';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hashCode = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Per-area multipliers based on area character
const areaProfile = (areaName) => {
  const a = (areaName || '').toLowerCase();
  if (a.includes('industrial') || a.includes('pimpri') || a.includes('ambattur') || a.includes('burrabazar')) {
    return { traffic: 1.08, speed: 0.93, pollution: 1.22, energy: 1.18, transit: 0.94, water: 1.1 };
  }
  if (a.includes('central') || a.includes('fort') || a.includes('park street') || a.includes('hazratganj') || a.includes('c-scheme') || a.includes('colaba') || a.includes('t. nagar') || a.includes('shivajinagar') || a.includes('navrangpura')) {
    return { traffic: 1.16, speed: 0.88, pollution: 1.12, energy: 1.05, transit: 1.1, water: 0.97 };
  }
  if (a.includes('whitefield') || a.includes('electronic') || a.includes('hitech') || a.includes('hinjewadi') || a.includes('omr') || a.includes('viman') || a.includes('thaltej') || a.includes('gomti')) {
    return { traffic: 1.04, speed: 1.05, pollution: 0.9, energy: 1.12, transit: 1.06, water: 0.95 };
  }
  if (a.includes('dharavi') || a.includes('howrah') || a.includes('kurla') || a.includes('alambagh') || a.includes('behala') || a.includes('maninagar')) {
    return { traffic: 1.1, speed: 0.9, pollution: 1.15, energy: 0.97, transit: 0.96, water: 1.12 };
  }
  if (a.includes('salt lake') || a.includes('banjara') || a.includes('koregaon') || a.includes('adyar') || a.includes('bopal') || a.includes('vaishali') || a.includes('borivali') || a.includes('yelahanka') || a.includes('vibhuti') || a.includes('malviya')) {
    return { traffic: 0.94, speed: 1.06, pollution: 0.88, energy: 0.95, transit: 1.04, water: 0.93 };
  }
  return { traffic: 1, speed: 1, pollution: 1, energy: 1, transit: 1, water: 1 };
};

const cityFactors = (cityName, areaName) => {
  const seed = hashCode(`${cityName || 'Delhi'}|${areaName || ''}`);
  const ap = areaProfile(areaName);
  return {
    traffic: (0.85 + ((seed % 45) / 100)) * ap.traffic,
    speed: (0.85 + (((seed >> 2) % 30) / 100)) * ap.speed,
    pollution: (0.8 + (((seed >> 4) % 60) / 100)) * ap.pollution,
    energy: (0.88 + (((seed >> 6) % 42) / 100)) * ap.energy,
    transit: (0.8 + (((seed >> 8) % 65) / 100)) * ap.transit,
    water: (0.82 + (((seed >> 10) % 50) / 100)) * ap.water,
    seasonal: (((seed >> 12) % 13) - 6),
  };
};

const round = (v, digits = 1) => Number(v.toFixed(digits));
const percentDelta = (current, baseline) => {
  if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline === 0) return 0;
  return round(((current - baseline) / baseline) * 100, 1);
};

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

const getFutureMonthLabel = (step) => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + step);
  return monthFormatter.format(date);
};

const forecastFromHistory = (history, seasonal = 0) => {
  const series = history.map((item) => Number(item.aqi)).filter((v) => Number.isFinite(v));
  if (!series.length) return [];

  const n = series.length;
  const avgX = (n - 1) / 2;
  const avgY = series.reduce((sum, v) => sum + v, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = i - avgX;
    num += dx * (series[i] - avgY);
    den += dx * dx;
  }

  const slope = den === 0 ? 0 : num / den;
  const base = avgY - slope * avgX;

  const recentDiffs = [];
  for (let i = 1; i < n; i += 1) {
    recentDiffs.push(series[i] - series[i - 1]);
  }
  const momentum = recentDiffs.length
    ? recentDiffs.slice(-3).reduce((sum, d) => sum + d, 0) / Math.min(3, recentDiffs.length)
    : 0;

  const past = history.map((item, idx) => {
    const fitted = base + slope * idx;
    return {
      day: item.date,
      actual: Math.round(clamp(item.aqi, 20, 320)),
      predicted: Math.round(clamp(fitted + momentum * 0.2 + seasonal * 0.2, 20, 330)),
    };
  });

  const last = series[n - 1];
  const future = Array.from({ length: 5 }, (_, i) => {
    const step = i + 1;
    const wave = Math.sin(step * 0.9) * 2.2;
    const forecast = last + slope * step + momentum * step * 0.6 + seasonal * 0.35 + wave;
    return {
      day: getFutureMonthLabel(step),
      actual: null,
      predicted: Math.round(clamp(forecast, 20, 330)),
    };
  });

  return [...past, ...future];
};

const buildCityData = (cityName, areaName) => {
  const f = cityFactors(cityName, areaName);
  const label = areaName ? `${cityName} — ${areaName}` : cityName;

  const cityTrafficOverview = {
    ...trafficOverview,
    totalVehicles: Math.round(trafficOverview.totalVehicles * f.traffic),
    avgSpeed: Math.round(clamp(trafficOverview.avgSpeed * f.speed, 12, 90)),
    congestionIndex: round(clamp(trafficOverview.congestionIndex * (f.traffic / f.speed), 2.5, 9.8)),
    incidents: Math.max(2, Math.round(trafficOverview.incidents * (f.traffic * 0.95))),
  };

  const cityTrafficHourly = trafficHourly.map((item, idx) => ({
    ...item,
    vehicles: Math.round(item.vehicles * f.traffic * (1 + ((idx % 3) - 1) * 0.02)),
    speed: Math.round(clamp(item.speed * f.speed * (1 - ((idx % 4) * 0.01)), 8, 75)),
  }));

  const cityTrafficByZone = trafficByZone.map((zone, idx) => ({
    ...zone,
    congestion: Math.round(clamp(zone.congestion * (f.traffic / f.speed) + (idx % 3) * 2, 10, 99)),
    vehicles: Math.round(zone.vehicles * f.traffic),
    avgSpeed: Math.round(clamp(zone.avgSpeed * f.speed, 10, 65)),
  }));

  const cityAirQualityData = {
    ...airQualityData,
    aqi: Math.round(clamp(airQualityData.aqi * f.pollution + f.seasonal, 28, 290)),
    pm25: round(clamp(airQualityData.pm25 * f.pollution, 4, 180)),
    pm10: round(clamp(airQualityData.pm10 * f.pollution, 10, 280)),
    no2: round(clamp(airQualityData.no2 * f.pollution, 5, 140)),
    o3: round(clamp(airQualityData.o3 * (0.85 + f.pollution * 0.2), 10, 180)),
    co: round(clamp(airQualityData.co * (0.9 + f.pollution * 0.15), 0.1, 7), 2),
    so2: round(clamp(airQualityData.so2 * f.pollution, 1, 80)),
  };

  const cityAirQualityHistory = airQualityHistory.map((item, idx) => ({
    ...item,
    aqi: Math.round(clamp(item.aqi * f.pollution + ((idx % 3) - 1) * 3, 20, 300)),
    pm25: Math.round(clamp(item.pm25 * f.pollution + (idx % 2), 3, 200)),
    pm10: Math.round(clamp(item.pm10 * f.pollution + ((idx + 1) % 3), 8, 280)),
  }));

  const cityNoiseData = noiseData.map((item) => ({
    ...item,
    level: Math.round(clamp(item.level * (0.85 + f.traffic * 0.2), 35, 98)),
  }));

  const cityEnergyOverview = {
    ...energyOverview,
    totalConsumption: round(energyOverview.totalConsumption * f.energy),
    renewablePercent: Math.round(clamp(energyOverview.renewablePercent * (1.08 - (f.energy - 1) * 0.35), 18, 72)),
    peakDemand: Math.round(energyOverview.peakDemand * f.energy),
    gridEfficiency: round(clamp(energyOverview.gridEfficiency * (1.01 - (f.energy - 1) * 0.08), 82, 99)),
    carbonSaved: Math.round(energyOverview.carbonSaved * (0.92 + f.energy * 0.22)),
  };

  const cityEnergyBySource = energyBySource.map((item, idx) => ({
    ...item,
    value: Math.round(item.value * f.energy * (1 + (idx % 4) * 0.015)),
  }));

  const cityEnergyConsumptionDaily = energyConsumptionDaily.map((item, idx) => ({
    ...item,
    residential: Math.round(item.residential * f.energy * (1 + (idx % 2) * 0.02)),
    commercial: Math.round(item.commercial * f.energy),
    industrial: Math.round(item.industrial * f.energy * (1 - (idx % 3) * 0.01)),
  }));

  const cityEnergyMonthly = energyMonthly.map((item, idx) => ({
    ...item,
    consumption: Math.round(item.consumption * f.energy * (1 + (idx % 5) * 0.008)),
    renewable: Math.round(item.renewable * (0.9 + f.energy * 0.18)),
  }));

  const cityTransportOverview = {
    ...transportOverview,
    dailyRidership: Math.round(transportOverview.dailyRidership * f.transit),
    onTimeRate: round(clamp(transportOverview.onTimeRate * (1.05 - (f.transit - 1) * 0.25), 62, 97)),
    activeBuses: Math.round(transportOverview.activeBuses * (0.9 + f.transit * 0.2)),
    activeTrains: Math.round(transportOverview.activeTrains * (0.88 + f.transit * 0.18)),
    avgWaitTime: round(clamp(transportOverview.avgWaitTime * (1.05 + (f.traffic - 1) * 0.35), 4.5, 18)),
  };

  const cityTransportRidership = transportRidership.map((item, idx) => ({
    ...item,
    bus: Math.round(item.bus * f.transit * (1 + (idx % 3) * 0.01)),
    metro: Math.round(item.metro * f.transit),
    tram: Math.round(item.tram * (0.9 + f.transit * 0.15)),
  }));

  const cityTransportRoutes = transportRoutes.map((item, idx) => {
    const occupancy = Math.round(clamp(item.occupancy * (0.88 + f.transit * 0.18), 10, 100));
    const status = occupancy > 92 ? 'Delayed' : item.status;
    return {
      ...item,
      ridership: Math.round(item.ridership * f.transit * (1 + (idx % 2) * 0.02)),
      occupancy,
      status,
    };
  });

  const cityWaterOverview = {
    ...waterOverview,
    dailyConsumption: round(waterOverview.dailyConsumption * f.water),
    leakageRate: round(clamp(waterOverview.leakageRate * (1.12 - (f.water - 1) * 0.3), 3, 21)),
    treatmentCapacity: Math.round(clamp(waterOverview.treatmentCapacity * (0.98 + f.water * 0.04), 60, 100)),
    reservoirLevel: Math.round(clamp(waterOverview.reservoirLevel * (1.03 - (f.water - 1) * 0.2), 28, 100)),
    recycledPercent: Math.round(clamp(waterOverview.recycledPercent * (0.95 + f.water * 0.15), 15, 80)),
  };

  const cityWaterConsumptionMonthly = waterConsumptionMonthly.map((item, idx) => ({
    ...item,
    residential: Math.round(item.residential * f.water * (1 + (idx % 4) * 0.01)),
    commercial: Math.round(item.commercial * f.water),
    industrial: Math.round(item.industrial * (0.9 + f.water * 0.15)),
  }));

  const cityWasteData = wasteData.map((item) => ({
    ...item,
    amount: Math.round(item.amount * (0.9 + f.water * 0.22)),
  }));

  const cityWasteCollectionZones = wasteCollectionZones.map((zone, idx) => ({
    ...zone,
    collected: Math.round(clamp(zone.collected * (0.9 + f.water * 0.18), 10, 180)),
    capacity: Math.round(zone.capacity * (0.95 + (idx % 3) * 0.04)),
  }));

  const airTrend = cityAirQualityHistory.length >= 2
    ? percentDelta(
      cityAirQualityHistory[cityAirQualityHistory.length - 1].aqi,
      cityAirQualityHistory[cityAirQualityHistory.length - 2].aqi,
    )
    : 0;

  const trafficTrend = percentDelta(cityTrafficOverview.totalVehicles, trafficOverview.totalVehicles);
  const energyTrend = percentDelta(cityEnergyOverview.totalConsumption, energyOverview.totalConsumption);
  const transitTrend = percentDelta(cityTransportOverview.dailyRidership, transportOverview.dailyRidership);
  const waterTrend = percentDelta(cityWaterOverview.dailyConsumption, waterOverview.dailyConsumption);
  const recycledTrend = percentDelta(cityWaterOverview.recycledPercent, waterOverview.recycledPercent);

  const cityDashboardKPIs = dashboardKPIs.map((kpi) => {
    if (kpi.label === 'Air Quality Index') {
      return {
        ...kpi,
        value: cityAirQualityData.aqi,
        max: 500,
        status: cityAirQualityData.aqi <= 50
          ? 'Good'
          : cityAirQualityData.aqi <= 100
            ? 'Moderate'
            : cityAirQualityData.aqi <= 150
              ? 'Unhealthy'
              : 'Severe',
        trend: airTrend,
      };
    }

    if (kpi.label === 'Traffic Flow') {
      return {
        ...kpi,
        value: cityTrafficOverview.totalVehicles,
        max: 500000,
        status: cityTrafficOverview.congestionIndex >= 7.5
          ? 'Congested'
          : cityTrafficOverview.congestionIndex >= 6
            ? 'Busy'
            : 'Stable',
        trend: trafficTrend,
      };
    }

    if (kpi.label === 'Energy Usage') {
      return {
        ...kpi,
        value: cityEnergyOverview.totalConsumption,
        max: 2000,
        status: cityEnergyOverview.peakDemand >= 900
          ? 'Grid Stress'
          : cityEnergyOverview.peakDemand >= 780
            ? 'Watch'
            : 'Optimal',
        trend: energyTrend,
      };
    }

    if (kpi.label === 'Public Transit') {
      return {
        ...kpi,
        value: cityTransportOverview.dailyRidership,
        max: 700000,
        status: cityTransportOverview.onTimeRate < 80
          ? 'Strained'
          : cityTransportOverview.onTimeRate < 88
            ? 'Busy'
            : 'Reliable',
        trend: transitTrend,
      };
    }

    if (kpi.label === 'Water Usage') {
      return {
        ...kpi,
        value: cityWaterOverview.dailyConsumption,
        max: 500,
        status: cityWaterOverview.leakageRate >= 10 || cityWaterOverview.reservoirLevel < 55
          ? 'Stress'
          : cityWaterOverview.leakageRate >= 7
            ? 'Watch'
            : 'Stable',
        trend: waterTrend,
      };
    }

    if (kpi.label === 'Waste Recycled') {
      return {
        ...kpi,
        value: cityWaterOverview.recycledPercent,
        max: 100,
        status: cityWaterOverview.recycledPercent >= 50
          ? 'Excellent'
          : cityWaterOverview.recycledPercent >= 35
            ? 'Good'
            : 'Needs Lift',
        trend: recycledTrend,
      };
    }

    return kpi;
  });

  const cityAlerts = alertsData.map((alert) => ({
    ...alert,
    message: `${alert.message} (${label})`,
  }));

  const cityCorrelation = correlationMatrix.map((item, idx) => ({
    ...item,
    value: Number(clamp(item.value + (((idx % 4) - 1.5) * 0.02) + (f.seasonal * 0.003), -0.98, 0.98).toFixed(2)),
  }));

  const cityPredictive = forecastFromHistory(cityAirQualityHistory, f.seasonal);

  const cityIncidents = trafficIncidents.map((inc) => ({
    ...inc,
    location: `${inc.location}, ${cityName}`,
  }));

  const topTrafficZone = [...cityTrafficByZone].sort((a, b) => b.congestion - a.congestion)[0];
  const busiestTransitRoute = [...cityTransportRoutes].sort((a, b) => b.occupancy - a.occupancy)[0];
  const dominantEnergySource = [...cityEnergyBySource].sort((a, b) => b.value - a.value)[0];

  const topWasteZone = cityWasteCollectionZones
    .map((zone) => ({ ...zone, fill: (zone.collected / zone.capacity) * 100 }))
    .sort((a, b) => b.fill - a.fill)[0];

  const cityInsights = [
    {
      id: 1,
      category: 'Traffic',
      impact: cityTrafficOverview.congestionIndex >= 7.5 ? 'High' : cityTrafficOverview.congestionIndex >= 6 ? 'Medium' : 'Low',
      confidence: Math.round(clamp(78 + cityTrafficOverview.congestionIndex * 2, 70, 96)),
      timestamp: 'Just now',
      title: `${label}: Peak-hour road congestion is increasing`,
      description: `Problem: People are losing commute time as congestion reached ${cityTrafficOverview.congestionIndex}/10 and average speed fell to ${cityTrafficOverview.avgSpeed} km/h. Solution: Activate adaptive signals on dense corridors, enforce no-parking in choke points, and push staggered office start windows with live rerouting advisories.`,
      suggestions: [
        `Construct a relief connector or bypass around ${topTrafficZone.zone} so through-traffic can avoid local streets inside ${areaName || cityName}.`,
        `Add a parallel service road and redesign turning pockets near ${topTrafficZone.zone} to separate local access traffic from main corridor traffic.`,
        `Convert the most overloaded junctions into grade-separated or one-way channelized movements and reserve curb space for buses and emergency vehicles.`,
      ],
    },
    {
      id: 2,
      category: 'Environment',
      impact: cityAirQualityData.aqi >= 150 ? 'High' : cityAirQualityData.aqi >= 100 ? 'Medium' : 'Low',
      confidence: Math.round(clamp(75 + (cityAirQualityData.aqi / 10), 72, 97)),
      timestamp: 'Just now',
      title: `${label}: Air quality is affecting outdoor activity`,
      description: `Problem: AQI is at ${cityAirQualityData.aqi}, increasing breathing discomfort for children, elderly citizens, and outdoor workers. Solution: Trigger ward-level clean-air alerts, restrict dust-heavy construction windows, and scale electric-bus frequency on polluted corridors to reduce tailpipe exposure.`,
      suggestions: [
        `Develop green buffer strips and dust barriers along the busiest traffic corridor near ${areaName || cityName} to reduce roadside pollutant exposure.`,
        `Move freight staging and high-emission loading activity to a peripheral logistics pocket instead of keeping it inside dense mixed-use neighborhoods.`,
        `Create low-emission streets near schools, hospitals, and markets with tighter construction controls, EV access priority, and continuous air sensors.`,
      ],
    },
    {
      id: 3,
      category: 'Energy',
      impact: cityEnergyOverview.peakDemand >= 900 ? 'High' : cityEnergyOverview.peakDemand >= 780 ? 'Medium' : 'Low',
      confidence: Math.round(clamp(74 + (cityEnergyOverview.peakDemand / 30), 70, 95)),
      timestamp: 'Just now',
      title: `${label}: Grid stress risk during demand peaks`,
      description: `Problem: Peak demand touched ${cityEnergyOverview.peakDemand} MW, raising outage risk in dense residential and industrial pockets. Solution: Run demand-response incentives, pre-cool public buildings before peak hours, and prioritize feeder balancing with battery-backed reserve dispatch.`,
      suggestions: [
        `Add a new distribution feeder or compact substation for the fastest-growing load pocket in ${areaName || cityName} so overload is not concentrated on the existing grid.`,
        `Pair rooftop solar and battery storage on public buildings to shave peak demand and reduce dependence on ${dominantEnergySource.source}.`,
        `Upgrade overloaded transformers and deploy smart sectional switches so local faults do not cascade into wider service outages.`,
      ],
    },
    {
      id: 4,
      category: 'Transport',
      impact: cityTransportOverview.onTimeRate < 80 ? 'High' : cityTransportOverview.onTimeRate < 88 ? 'Medium' : 'Low',
      confidence: Math.round(clamp(73 + (100 - cityTransportOverview.avgWaitTime * 5), 70, 94)),
      timestamp: 'Just now',
      title: `${label}: Public transit reliability gap`,
      description: `Problem: On-time performance is ${cityTransportOverview.onTimeRate}% with average waits near ${cityTransportOverview.avgWaitTime} minutes, reducing trust in transit for daily commuters. Solution: Introduce dynamic headway control, dedicate bus-priority lanes on delayed routes, and publish platform-level ETA confidence scores.`,
      suggestions: [
        `Build a dedicated bus-priority or transit-only lane parallel to ${busiestTransitRoute.name} so public transport can bypass mixed traffic delays.`,
        `Create a multimodal transfer hub with park-and-ride access near ${areaName || cityName} to shift more commuters from private vehicles to transit earlier in the trip.`,
        `Add feeder shuttle loops and short-turn services around overcrowded stations so the trunk route is not overloaded at every stop.`,
      ],
    },
    {
      id: 5,
      category: 'Water',
      impact: cityWaterOverview.leakageRate >= 10 || cityWaterOverview.reservoirLevel < 55 ? 'High' : cityWaterOverview.leakageRate >= 7 ? 'Medium' : 'Low',
      confidence: Math.round(clamp(76 + cityWaterOverview.treatmentCapacity / 8, 72, 95)),
      timestamp: 'Just now',
      title: `${label}: Water service stability concerns`,
      description: `Problem: Leakage is ${cityWaterOverview.leakageRate}% and reservoir level is ${cityWaterOverview.reservoirLevel}%, causing pressure drops and uneven supply in edge zones. Solution: Prioritize DMA-based leak detection, schedule night-time pressure management, and accelerate recycled-water substitution for non-potable municipal demand.`,
      suggestions: [
        `Create district-metered water zones in ${areaName || cityName} so leaks can be isolated and repaired without shutting down the whole service area.`,
        `Lay a parallel recycled-water pipeline for parks, construction, and industry to reduce pressure on potable supply lines.`,
        `Expand decentralized storage and booster stations in weak-pressure neighborhoods to stabilize service during peak demand hours.`,
      ],
    },
    {
      id: 6,
      category: 'Waste',
      impact: topWasteZone.fill >= 90 ? 'High' : topWasteZone.fill >= 75 ? 'Medium' : 'Low',
      confidence: Math.round(clamp(75 + topWasteZone.fill / 4, 70, 96)),
      timestamp: 'Just now',
      title: `${label}: Waste collection bottleneck in ${topWasteZone.zone}`,
      description: `Problem: ${topWasteZone.zone} bins are near ${topWasteZone.fill.toFixed(0)}% capacity, increasing overflow, odor, and local hygiene complaints. Solution: Trigger priority pickup routing, deploy temporary compactors in hotspots, and send citizen segregation nudges to reduce mixed-waste load.`,
      suggestions: [
        `Set up a micro transfer station or compact material recovery facility near ${topWasteZone.zone} so collection vehicles do not spend excessive time on long-haul trips.`,
        `Install underground smart bins or solar compactors in high-footfall streets to increase holding capacity without blocking sidewalks.`,
        `Create a dedicated secondary pickup loop for wet waste and bulk generators so mixed waste does not accumulate in residential streets.`,
      ],
    },
  ];

  return {
    trafficOverview: cityTrafficOverview,
    trafficHourly: cityTrafficHourly,
    trafficByZone: cityTrafficByZone,
    trafficIncidents: cityIncidents,
    airQualityData: cityAirQualityData,
    airQualityHistory: cityAirQualityHistory,
    noiseData: cityNoiseData,
    temperatureData,
    energyOverview: cityEnergyOverview,
    energyBySource: cityEnergyBySource,
    energyConsumptionDaily: cityEnergyConsumptionDaily,
    energyMonthly: cityEnergyMonthly,
    transportOverview: cityTransportOverview,
    transportRidership: cityTransportRidership,
    transportRoutes: cityTransportRoutes,
    waterOverview: cityWaterOverview,
    waterConsumptionMonthly: cityWaterConsumptionMonthly,
    wasteData: cityWasteData,
    wasteCollectionZones: cityWasteCollectionZones,
    dashboardKPIs: cityDashboardKPIs,
    alertsData: cityAlerts,
    aiInsights: cityInsights,
    correlationMatrix: cityCorrelation,
    predictiveData: cityPredictive,
  };
};

export const useCityData = () => {
  const { selectedCity, selectedArea } = useCity();
  const cityName = selectedCity?.name || 'Delhi';
  const areaName = selectedArea || '';

  const data = useMemo(() => buildCityData(cityName, areaName), [cityName, areaName]);

  return { cityName, areaName, data };
};
