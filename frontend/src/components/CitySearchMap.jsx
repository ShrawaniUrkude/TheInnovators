import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LoaderCircle, MapPin, Mic, MicOff, Search } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import ChartCard from './ChartCard';
import { useCity } from '../context/CityContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const INDIA_CENTER = [22.9734, 78.6569];

const CITY_SUGGESTIONS = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Jabalpur', 'Gwalior', 'Coimbatore', 'Vijayawada',
  'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubballi',
  'Mysuru', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar',
  'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati',
  'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar',
  'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola',
  'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu',
  'Sangli', 'Mangalore', 'Erode', 'Belagavi', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya',
  'Jalgaon', 'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Bokaro',
  'South Dumdum', 'Bellary', 'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara',
  'Panihati', 'Latur', 'Dhule', 'Rohtak', 'Korba', 'Bhilwara', 'Brahmapur', 'Muzaffarpur',
  'Ahmednagar', 'Mathura', 'Kollam', 'Avadi', 'Kadapa', 'Anantapur', 'Nizamabad', 'Tumakuru',
  'Karnal', 'Bathinda', 'Rampur', 'Shivamogga', 'Ratlam', 'Modinagar', 'Durg', 'Shillong',
  'Imphal', 'Aizawl', 'Gangtok', 'Itanagar', 'Panaji', 'Thiruvananthapuram', 'Puducherry', 'Port Blair',
];

const areaIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="38" viewBox="0 0 26 38">
    <path fill="#e85d04" stroke="#fff" stroke-width="2" d="M13 1C6.373 1 1 6.373 1 13c0 9 12 24 12 24S25 22 25 13C25 6.373 19.627 1 13 1z"/>
    <circle fill="#fff" cx="13" cy="13" r="5"/>
  </svg>`,
  iconSize: [26, 38],
  iconAnchor: [13, 38],
  popupAnchor: [0, -38],
  className: '',
});

const RecenterMap = ({ position, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, zoom, map]);

  return null;
};

const CitySearchMap = () => {
  const { selectedCity, selectCity, areaOptions, selectedArea, setSelectedArea } = useCity();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [areaPosition, setAreaPosition] = useState(null);
  const [isGeocodingArea, setIsGeocodingArea] = useState(false);
  const recognitionRef = useRef(null);

  const speechSupported = useMemo(
    () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  const searchCity = useCallback(async (searchText) => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setError('Type or speak a city name in India.');
      return;
    }

    setError('');
    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=in&q=${encodeURIComponent(trimmed)}`,
      );

      if (!response.ok) {
        throw new Error('Search request failed.');
      }

      const results = await response.json();
      if (!results.length) {
        setError('City not found in India. Try another city name.');
        return;
      }

      const city = results[0];
      const lat = Number(city.lat);
      const lng = Number(city.lon);
      const cityName = city.address?.city
        || city.address?.town
        || city.address?.municipality
        || city.address?.state_district
        || city.display_name.split(',')[0];

      selectCity({
        name: cityName,
        displayName: city.display_name,
        state: city.address?.state || 'India',
        lat,
        lng,
      });
    } catch {
      setError('Unable to fetch city location right now. Please retry.');
    } finally {
      setIsSearching(false);
    }
  }, [selectCity]);

  useEffect(() => {
    if (!speechSupported) {
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setQuery(transcript);
      searchCity(transcript);
    };

    recognition.onerror = () => {
      setError('Voice search could not process audio. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [searchCity, speechSupported]);

  const handleSubmit = (event) => {
    event.preventDefault();
    searchCity(query);
  };

  // Geocode the selected area whenever it or the city changes
  useEffect(() => {
    if (!selectedArea || !selectedCity?.name) {
      setAreaPosition(null);
      return;
    }

    let cancelled = false;
    setIsGeocodingArea(true);

    const q = encodeURIComponent(`${selectedArea}, ${selectedCity.name}, India`);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${q}`)
      .then((res) => res.json())
      .then((results) => {
        if (cancelled) return;
        if (results.length) {
          setAreaPosition([Number(results[0].lat), Number(results[0].lon)]);
        } else {
          setAreaPosition(null);
        }
      })
      .catch(() => {
        if (!cancelled) setAreaPosition(null);
      })
      .finally(() => {
        if (!cancelled) setIsGeocodingArea(false);
      });

    return () => { cancelled = true; };
  }, [selectedArea, selectedCity?.name]);

  const toggleVoiceSearch = () => {
    if (!speechSupported || !recognitionRef.current) {
      return;
    }

    setError('');

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const cityPosition = selectedCity ? [selectedCity.lat, selectedCity.lng] : INDIA_CENTER;
  const mapCenter = areaPosition ?? cityPosition;
  const mapZoom = areaPosition ? 14 : 10;

  return (
    <ChartCard
      title="India City Search"
      subtitle="Search any Indian city by text or voice command and sync all dashboard data"
      className="city-search-card"
    >
      <form className="city-search-controls" onSubmit={handleSubmit}>
        <div className="city-input-wrap">
          <Search size={16} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: Jaipur, Kochi, Imphal, Surat..."
            list="india-city-suggestions"
          />
          <datalist id="india-city-suggestions">
            {CITY_SUGGESTIONS.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>

        <button type="submit" className="btn btn-primary city-search-btn" disabled={isSearching}>
          {isSearching ? <LoaderCircle size={16} className="spin" /> : <MapPin size={16} />}
          {isSearching ? 'Searching...' : 'Search City'}
        </button>

        <button
          type="button"
          className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'} city-voice-btn`}
          onClick={toggleVoiceSearch}
          disabled={!speechSupported}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          {isListening ? 'Listening...' : 'Voice Command'}
        </button>
      </form>

      {!speechSupported && (
        <div className="city-search-note">
          Voice search is not supported in this browser. Text search still works for all cities in India.
        </div>
      )}

      {error && <div className="city-search-error">{error}</div>}

      <div className="city-map-wrapper">
        <MapContainer center={INDIA_CENTER} zoom={5} scrollWheelZoom={false} className="india-city-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedCity && (
            <Marker position={cityPosition}>
              <Popup>
                <strong>{selectedCity.name}</strong>
                <br />
                {selectedCity.state}, India
              </Popup>
            </Marker>
          )}

          {areaPosition && (
            <Marker position={areaPosition} icon={areaIcon}>
              <Popup>
                <strong>{selectedArea}</strong>
                <br />
                {selectedCity?.name}, {selectedCity?.state}
              </Popup>
            </Marker>
          )}

          <RecenterMap position={mapCenter} zoom={mapZoom} />
        </MapContainer>
      </div>

      <div className="city-search-result">
        <div>
          <span className="city-result-label">Selected City:</span>
          <strong>{selectedCity?.name || 'No city selected'}</strong>
        </div>
        <div>
          <span className="city-result-label">State:</span>
          <strong>{selectedCity?.state || 'India'}</strong>
        </div>
        <div>
          <span className="city-result-label">Area:</span>
          <strong>{selectedArea || '—'}</strong>
        </div>
        <div>
          <span className="city-result-label">Area Coords:</span>
          <strong>
            {isGeocodingArea
              ? 'Locating...'
              : areaPosition
                ? `${areaPosition[0].toFixed(4)}, ${areaPosition[1].toFixed(4)}`
                : '—'}
          </strong>
        </div>
      </div>

      {areaOptions.length > 0 && (
        <div className="city-area-select-wrap">
          <label htmlFor="map-area-select" className="city-area-label">
            <MapPin size={14} />
            Area in {selectedCity?.name || 'city'}
          </label>
          <select
            id="map-area-select"
            className="city-area-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            {areaOptions.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          {isGeocodingArea
            ? <span className="city-area-hint">Navigating to area...</span>
            : <span className="city-area-hint">Map navigates &amp; data updates for selected area</span>}
        </div>
      )}
    </ChartCard>
  );
};

export default CitySearchMap;
