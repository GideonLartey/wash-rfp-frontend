import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 


const RadarMarker: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const accentColor = '#3B82F6';

  return (
    <div 
      style={{ position: 'absolute', display: 'inline-block', fontFamily: "'Instrument Sans', sans-serif", zIndex: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>
        {`
          @keyframes radarPulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(3.5); opacity: 0; }
          }
        `}
      </style>
      <div style={{
        position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
        borderRadius: '50%', border: `2px solid ${accentColor}`,
        animation: 'radarPulse 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)'
      }} />
      <div style={{
        width: '12px', height: '12px', backgroundColor: accentColor,
        borderRadius: '50%', position: 'relative', zIndex: 2, cursor: 'pointer',
        boxShadow: `0 0 10px ${accentColor}`
      }} />
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px',
        padding: '12px', width: '200px', pointerEvents: 'none',
        opacity: isHovered ? 1 : 0, visibility: isHovered ? 'visible' : 'hidden',
        marginTop: isHovered ? '0px' : '10px',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Active Site</div>
        <div style={{ color: '#F5F5F5', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>Sahel Solar Borehole</div>
        <div style={{ color: '#A3A3A3', fontSize: '0.8rem' }}>Yield: 45L/min</div>
      </div>
    </div>
  );
};

// Main GIS Workspace Component
const GisMapNode: React.FC = () => {
  // State to hold the uploaded GeoJSON data
  const [geoData, setGeoData] = useState<any | null>(null);
  // A key to force the map to re-render when new data is uploaded
  const [mapKey, setMapKey] = useState(0);

  // Upload Handler: Reads the file and converts it to JSON
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setGeoData(json);
        setMapKey(prev => prev + 1); // Force GeoJSON layer update
      } catch (error) {
        console.error("Invalid GeoJSON file", error);
        alert("Could not parse file. Please ensure it is a valid .geojson format.");
      }
    };
    reader.readAsText(file);
  };

  // GeoJSON Styling: Gives the uploaded shapes a professional enterprise look
  const geoJsonStyle = {
    color: '#3B82F6', // Corporate Azure Blue borders
    weight: 2,
    opacity: 0.8,
    fillColor: '#3B82F6',
    fillOpacity: 0.2,
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #262626' }}>
      
      {/* FLOATING CONTROL PANEL */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
        backgroundColor: '#141414', padding: '16px', borderRadius: '8px',
        border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        fontFamily: "'Instrument Sans', sans-serif"
      }}>
        <h3 style={{ color: '#F5F5F5', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>Spatial Data Layers</h3>
        
        {/* Custom File Upload Button */}
        <label style={{
          display: 'inline-block', backgroundColor: '#3B82F6', color: '#FFF',
          padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem',
          fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
        }}>
          + Upload .geojson
          <input 
            type="file" 
            accept=".geojson,application/geo+json" 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
        </label>
        
        {geoData && (
          <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
            ✓ Custom Layer Active
          </div>
        )}
      </div>

      {/* THE RADAR MARKER (Centered over the map) */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
        <RadarMarker />
      </div>

      {/* THE MAP CANVAS */}
      <MapContainer 
        center={[13.5317, 2.4604]} // Centered on the Sahel region for WASH context
        zoom={5} 
        style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A' }}
        zoomControl={false}
      >
        {/* Dark Mode Base Map Tiles (CartoDB Dark Matter) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Dynamic GeoJSON Overlay Layer */}
        {geoData && (
          <GeoJSON 
            key={mapKey} 
            data={geoData} 
            style={geoJsonStyle} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default GisMapNode;