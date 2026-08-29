import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Star, ShieldCheck, Ambulance, Stethoscope, Users, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchNearbyHelpers } from '../api/client';

// Custom Leaflet Icons for Pastel Aesthetic
const createPastelIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const icons = {
  user: createPastelIcon('#FFCAD4', '📍'),
  Clinic: createPastelIcon('#D8F3DC', '🩺'),
  Ambulance: createPastelIcon('#FFF1C5', '🚑'),
  Volunteer: createPastelIcon('#E8DEF8', '🙋'),
  Hospital: createPastelIcon('#E0F2FE', '🏥'),
  Consultant: createPastelIcon('#FFD6A5', '💊')
};

// Component to dynamically recenter Leaflet map when location changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function HelperMapModule() {
  const [userLocation, setUserLocation] = useState({ lat: 40.758, lng: -73.9855, isDetected: false });
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [locationStatusMsg, setLocationStatusMsg] = useState('Click below to auto-fetch your live location');

  const loadHelpers = async (lat, lng, type) => {
    setLoading(true);
    try {
      const data = await fetchNearbyHelpers(lat, lng, type);
      setHelpers(data);
    } catch (err) {
      console.error('Error fetching helpers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpers(userLocation.lat, userLocation.lng, selectedType);
  }, [selectedType]);

  // Location API Trigger
  const handleFetchUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMsg('Geolocation API is not supported by your browser.');
      return;
    }

    setLocationStatusMsg('Fetching device GPS location...');
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setUserLocation({ lat: newLat, lng: newLng, isDetected: true });
        setLocationStatusMsg(`✅ Location fetched: Lat ${newLat.toFixed(4)}, Lng ${newLng.toFixed(4)}`);
        loadHelpers(newLat, newLng, selectedType);
      },
      (error) => {
        console.warn('Geolocation denied/error:', error.message);
        setLocationStatusMsg('⚠️ Geolocation access blocked. Showing default NYC rescue zone.');
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <section style={{ padding: '20px 0 40px 0' }}>
      <div className="container">
        
        {/* Module Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pastel-peach">📍 GPS Helper Finder API</span>
              <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>Interactive Rescue Map</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '6px', margin: 0 }}>Find Nearby Animal Rescue Helpers</h2>
            <p style={{ color: '#5C677D', fontSize: '0.95rem' }}>
              Locate 24/7 emergency vet clinics, volunteer rescue ambulances, and animal responders nearest to your GPS coordinates.
            </p>
          </div>

          {/* Location Fetcher Button */}
          <button className="btn-pastel-primary" onClick={handleFetchUserLocation} disabled={loading}>
            <Navigation size={18} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Locating...' : 'Fetch My Live Location'}</span>
          </button>
        </div>

        {/* Location Status Message Bar */}
        <div style={{ background: '#FFF1C5', padding: '10px 16px', borderRadius: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', color: '#5C4000' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#E07A5F" />
            <strong>Location API Status:</strong> {locationStatusMsg}
          </div>
          {userLocation.isDetected && (
            <span style={{ background: '#FFFFFF', padding: '2px 10px', borderRadius: '10px', fontWeight: 700 }}>
              GPS Active
            </span>
          )}
        </div>

        {/* Type Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['All', 'Clinic', 'Ambulance', 'Volunteer', 'Hospital'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                border: 'none',
                background: selectedType === type ? '#D8F3DC' : '#FFFFFF',
                color: selectedType === type ? '#1B4332' : '#5C677D',
                padding: '8px 18px',
                borderRadius: '25px',
                fontWeight: selectedType === type ? 700 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}
            >
              {type === 'All' ? 'All Helpers 🏥' : type}
            </button>
          ))}
        </div>

        {/* Map & Helper Cards Split View */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(300px, 1fr)', gap: '24px' }}>
          
          {/* Leaflet Map Window */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', height: '480px', border: '3px solid #FFFFFF', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', position: 'relative' }}>
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={false}
            >
              <MapRecenter center={[userLocation.lat, userLocation.lng]} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Location Marker */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.user}>
                <Popup>
                  <strong>📍 Your Location</strong><br />
                  GPS Center Point
                </Popup>
              </Marker>

              {/* Helper Markers */}
              {helpers.map(h => (
                <Marker key={h.id} position={[h.lat, h.lng]} icon={icons[h.type] || icons.Clinic}>
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong style={{ fontSize: '1rem', color: '#2B2D42' }}>{h.name}</strong>
                      <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#5C677D' }}>{h.role}</p>
                      <span style={{ fontSize: '0.8rem', background: '#D8F3DC', color: '#1B4332', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                        {h.distanceKm} km away
                      </span>
                      <div style={{ marginTop: '8px' }}>
                        <a href={`tel:${h.phone}`} style={{ color: '#E07A5F', fontWeight: 700, fontSize: '0.85rem' }}>
                          📞 {h.phone}
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Helper List Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
            {helpers.map(h => (
              <div key={h.id} className="card-pastel" style={{ background: '#FFFFFF', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{h.name}</h4>
                    <span style={{ fontSize: '0.82rem', color: '#5C677D', fontWeight: 600 }}>{h.role}</span>
                  </div>
                  <span className="badge-pastel-mint">
                    {h.distanceKm} km
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#5C677D', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <MapPin size={14} color="#E07A5F" /> {h.address}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={14} color="#FFB703" fill="#FFB703" /> Rating {h.rating} / 5.0
                  </div>
                </div>

                {/* Services Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {h.services.map((srv, idx) => (
                    <span key={idx} style={{ background: '#FAF6F0', color: '#5C677D', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '8px' }}>
                      {srv}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`tel:${h.phone}`}
                    className="btn-pastel-primary"
                    style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '0.85rem', padding: '8px 12px' }}
                  >
                    <Phone size={14} /> Call Helper
                  </a>
                  <button
                    className="btn-pastel-mint"
                    onClick={() => alert(`Emergency rescue signal dispatched to ${h.name}! Their team is on alert.`)}
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  >
                    Dispatch Signal
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
