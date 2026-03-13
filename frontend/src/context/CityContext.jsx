/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CITY_COORDS = {
  Delhi: { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  Mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  Bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  Hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  Chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  Kolkata: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  Pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  Jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  Lucknow: { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
};

export const AREA_BY_CITY = {
  Delhi: ['Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'Dwarka', 'Rohini', 'Shahdara'],
  Mumbai: ['Colaba / Fort', 'Bandra', 'Andheri', 'Borivali', 'Dharavi', 'Kurla', 'Worli'],
  Bengaluru: ['Koramangala', 'Whitefield', 'Jayanagar', 'Indiranagar', 'Electronic City', 'Rajajinagar', 'Yelahanka'],
  Hyderabad: ['Hitech City', 'Secunderabad', 'Kukatpally', 'Banjara Hills', 'Mehdipatnam', 'Ameerpet', 'LB Nagar'],
  Chennai: ['Anna Nagar', 'T. Nagar', 'Velachery', 'Ambattur Industrial', 'OMR', 'Adyar', 'Perambur'],
  Kolkata: ['Park Street', 'Salt Lake', 'Howrah', 'Behala', 'Dum Dum', 'Jadavpur', 'Burrabazar'],
  Pune: ['Kothrud', 'Viman Nagar', 'Pimpri-Chinchwad', 'Hadapsar', 'Shivajinagar', 'Koregaon Park', 'Hinjewadi'],
  Ahmedabad: ['Navrangpura', 'Bopal', 'Thaltej', 'Maninagar', 'Vastrapur', 'Chandkheda', 'Gota'],
  Jaipur: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Sanganer', 'Jagatpura', 'Bani Park'],
  Lucknow: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Alambagh', 'Indiranagar', 'Rajajipuram', 'Vibhuti Khand'],
};

const buildAreaOptions = (cityName) => {
  if (AREA_BY_CITY[cityName]) return AREA_BY_CITY[cityName];
  return ['Central Zone', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Industrial Zone'];
};

const DEFAULT_CITY = {
  name: 'Delhi',
  state: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
};

const CityContext = createContext(null);

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [selectedArea, setSelectedArea] = useState(buildAreaOptions('Delhi')[0]);

  // Selecting a city also resets area to the first option for that city
  const selectCity = useCallback((nextCity) => {
    if (!nextCity?.name) return;
    setSelectedCity(nextCity);
    setSelectedArea(buildAreaOptions(nextCity.name)[0]);
  }, []);

  const setSelectedCityByName = useCallback((name) => {
    if (!name) return;
    const info = CITY_COORDS[name] || {};
    selectCity({
      name,
      state: info.state || 'India',
      lat: info.lat ?? DEFAULT_CITY.lat,
      lng: info.lng ?? DEFAULT_CITY.lng,
    });
  }, [selectCity]);

  const areaOptions = useMemo(() => buildAreaOptions(selectedCity.name), [selectedCity.name]);

  const value = {
    selectedCity,
    setSelectedCity,
    selectCity,
    setSelectedCityByName,
    cityOptions: Object.keys(CITY_COORDS),
    selectedArea,
    setSelectedArea,
    areaOptions,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within CityProvider');
  }
  return context;
};
