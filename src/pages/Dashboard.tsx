import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const pulseCss = `
  @keyframes radarPulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(3.5); opacity: 0; }
  }
  .animated-leaflet-node { position: relative; width: 16px; height: 16px; }
  .animated-leaflet-node .center-dot { 
    width: 100%; height: 100%; background-color: #3B82F6; 
    border-radius: 50%; position: relative; z-index: 2; box-shadow: 0 0 10px #3B82F6; 
  }
  .animated-leaflet-node .radar-ring { 
    position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; 
    border-radius: 50%; border: 2px solid #3B82F6; 
    animation: radarPulse 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1); 
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = pulseCss;
  document.head.appendChild(style);
}

const animatedPulseIcon = new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `<div class="animated-leaflet-node"><div class="radar-ring"></div><div class="center-dot"></div></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  
  // NEW STATE: GeoJSON Data
  const [geoData, setGeoData] = useState<any | null>(null);
  const [mapKey, setMapKey] = useState(0);

  const theme = {
    surface: '#141414', textPrimary: '#F5F5F5', textSecondary: '#A3A3A3',
    border: '#262626', accent: '#3B82F6', success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  };

  const metrics = [
    { title: 'Active Bids in Pipeline', value: '14', change: '+2 this week', color: theme.accent },
    { title: 'Total Pipeline Value', value: '£42.5M', change: '+£12M FCDO added', color: theme.success },
    { title: 'Donor Partners Tracked', value: '50', change: '3 pending review, 1 approved', color: theme.warning },
  ];

  const donors = [
    { id: 'd1', name: 'FCDO (UK)', tenders: 15, coords: [51.5074, -0.1278] as [number, number], color: theme.success },
    { id: 'd2', name: 'Global Affairs Canada', tenders: 8, coords: [45.4215, -75.6972] as [number, number], color: theme.success },
    { id: 'd3', name: 'Conrad N. Hilton Foundation', tenders: 4, coords: [34.0522, -118.2437] as [number, number], color: theme.success },
  ];

  const partners = [
    { id: 'p1', region: 'Mali', coords: [12.6392, -8.0029] as [number, number], org: 'Sahel Water Alliance', capacity: '$1.2M', from: 'd2', grant: '$8.5M (Canada)' },
    { id: 'p2', region: 'Kenya', coords: [-1.2921, 36.8219] as [number, number], org: 'Maji Safi Initiative', capacity: '$2.5M', from: 'd1', grant: '£12M (FCDO)' },
    { id: 'p3', region: 'Uganda', coords: [0.3476, 32.5825] as [number, number], org: 'Rural Hygiene Trust', capacity: '$800k', from: 'd3', grant: '$4M (Hilton)' },
  ];

  const handleDownloadRfps = (donorName: string) => {
    const donorData = donors.find(d => d.name === donorName);
    const mockBatchData = JSON.stringify({
      donor: donorName,
      status: "Active Tracking",
      tendersAvailable: donorData?.tenders || 0,
      timestamp: new Date().toISOString(),
      note: "Proceed to the RFP Parser to extract metadata from the actual tender documents."
    }, null, 2);

    const blob = new Blob([mockBatchData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${donorName.replace(/\s+/g, '_')}_Active_RFPs.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // NEW HANDLER: Parse uploaded GeoJSON file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setGeoData(json);
        setMapKey(prev => prev + 1);
      } catch (error) {
        console.error("Invalid GeoJSON file", error);
        alert("Could not parse file. Please ensure it is a valid .geojson format.");
      }
    };
    reader.readAsText(file);
  };

  const geoJsonStyle = {
    color: theme.accent, 
    weight: 2,
    opacity: 0.8,
    fillColor: theme.accent,
    fillOpacity: 0.2,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif", paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: theme.textPrimary }}>Command Centre Overview</h1>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
          >
            📥 EXPORT ANALYTICS <span style={{ fontSize: '0.6rem' }}>▼</span>
          </button>

          {showExportMenu && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '240px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', zIndex: 1000, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              
              <div 
                onClick={() => navigate('/master-report')} 
                style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.85rem', color: theme.accent, fontWeight: 800, borderBottom: `1px solid ${theme.border}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F1F1F'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                📥 Generate Master Batch PDF
              </div>
              
              <div 
                onClick={() => setShowIndividualModal(true)} 
                style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.85rem', color: theme.textPrimary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F1F1F'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Export Individual Module...
              </div>
            </div>
          )}
        </div>
      </div>

      {showIndividualModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', width: '400px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: theme.textPrimary }}>Navigate & Export</h2>
              <button onClick={() => setShowIndividualModal(false)} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {[
                { name: 'Climate Predictor', route: '/climate' }, 
                { name: 'Systems Strengthening Modeler', route: '/systems' }, 
                { name: 'Monte Carlo Risk Forecast', route: '/monte-carlo' }, 
                { name: 'Consortium Strategy Matrix', route: '/consortium' }, 
                { name: 'RFP Parsing Report', route: '/rfp-parser' }
              ].map(item => (
                <button 
                  key={item.name}
                  onClick={() => {
                    setShowIndividualModal(false);
                    navigate(item.route);
                    alert(`Mapsd to ${item.name}. Use your browser's Print function (Ctrl+P / Cmd+P) to save this interactive module as a PDF.`);
                  }}
                  style={{ textAlign: 'left', padding: '12px 16px', backgroundColor: '#0A0A0A', border: `1px solid ${theme.border}`, color: theme.textPrimary, borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: '0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.accent}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
                >
                  📄 Go to {item.name} &rarr;
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>{metric.title}</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: theme.textPrimary }}>{metric.value}</span>
            <span style={{ color: metric.color, fontWeight: 700, fontSize: '0.9rem' }}>{metric.change}</span>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* NEW OVERLAY: GeoJSON Upload Panel */}
        <div style={{
          position: 'absolute', top: '90px', right: '20px', zIndex: 1000,
          backgroundColor: 'rgba(20, 20, 20, 0.9)', padding: '12px 16px', borderRadius: '8px',
          border: `1px solid ${theme.border}`, backdropFilter: 'blur(4px)'
        }}>
          <label style={{
            display: 'inline-block', backgroundColor: theme.accent, color: '#FFF',
            padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem',
            fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
          }}>
            + UPLOAD .GEOJSON
            <input 
              type="file" 
              accept=".geojson,application/geo+json" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
          {geoData && (
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: theme.success, fontWeight: 700 }}>
              ✓ Layer Active
            </div>
          )}
        </div>

        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0D0D0D', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: theme.textPrimary }}>Live GIS Funding Tracker</h2>
            <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: theme.success, borderRadius: '50%', boxShadow: `0 0 8px ${theme.success}` }}></span>
              Real-Time FCDO, Canada, & Hilton Foundation Feeds
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600, color: theme.textPrimary }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.success, fontSize: '1.2rem' }}>●</span> Donor Origin</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accent, fontSize: '1.2rem' }}>●</span> Implementation Partner</div>
          </div>
        </div>
        
        <div style={{ height: '600px', width: '100%', backgroundColor: '#1A1F26' }}>
          <MapContainer center={[20, 10]} zoom={3} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* NEW RENDER: GeoJSON Layer renders on top of the base map tiles */}
            {geoData && (
              <GeoJSON 
                key={mapKey} 
                data={geoData} 
                style={geoJsonStyle} 
              />
            )}
            
            {donors.map(donor => (
              <CircleMarker key={donor.id} center={donor.coords} pathOptions={{ color: donor.color, fillColor: donor.color, fillOpacity: 0.8 }} radius={6}>
                <Popup className="custom-popup">
                  <div style={{ padding: '4px', minWidth: '160px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Capital Origin</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#000', margin: '4px 0' }}>{donor.name}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.success }}>{donor.tenders} Tenders Tracked</div>
                    <button 
                      onClick={() => handleDownloadRfps(donor.name)}
                      style={{ display: 'block', width: '100%', marginTop: '12px', padding: '8px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      DOWNLOAD RFP BATCH &darr;
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {partners.map(partner => {
              const donorCoords = donors.find(d => d.id === partner.from)?.coords;
              return (
                <React.Fragment key={partner.id}>
                  {donorCoords && (
                    <Polyline positions={[donorCoords, partner.coords]} pathOptions={{ color: theme.success, weight: 2, dashArray: '5, 10', opacity: 0.6 }} />
                  )}
                  <Marker position={partner.coords} icon={animatedPulseIcon}>
                    <Popup>
                      <div style={{ padding: '4px', minWidth: '150px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>{partner.region} Pipeline</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#000', margin: '4px 0' }}>{partner.org}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.success }}>Target Sub-Award: {partner.grant}</div>
                        <button 
                          onClick={() => navigate('/consortium')}
                          style={{ display: 'block', width: '100%', marginTop: '12px', padding: '8px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ANALYZE IN MATRIX &rarr;
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>
      
      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 8px; }
        .leaflet-popup-content { margin: 12px; font-family: 'Instrument Sans', sans-serif; }
        .leaflet-container { background: #0A0A0A; }
      `}</style>
    </div>
  );
};

export default Dashboard;