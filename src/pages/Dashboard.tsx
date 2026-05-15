import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CUSTOM LEAFLET ANIMATION ---
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
// ----------------FINISHED ANIMATION--------------------

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State for the Export UI
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showIndividualModal, setShowIndividualModal] = useState(false);

  const theme = {
    surface: '#141414', textPrimary: '#F5F5F5', textSecondary: '#A3A3A3',
    border: '#262626', accent: '#3B82F6', success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  };

  const metrics = [
    { title: 'Active Bids in Pipeline', value: '14', change: '+2 this week', color: theme.accent },
    { title: 'Total Pipeline Value', value: '£42.5M', change: '+£12M FCDO added', color: theme.success },
    { title: 'Donor Partners Tracked', value: '50', change: '3 pending review, 1 approved', color: theme.warning },
  ];

  // Donors with mock tender counts
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

  const handleExport = (type: string) => {
    setShowExportMenu(false);
    if (type === 'all') {
      alert("Triggering API: Generating Universal PDF with Desert Clay palette...");
    } else {
      setShowIndividualModal(true);
    }
  };

  const handleDownloadRfps = (donorName: string) => {
    // file download.
    alert(`Downloading active RFP batch from ${donorName} API... \n\nPlease note: Proceed to the RFP Parser to extract the data.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif", paddingBottom: '40px' }}>
      
      {/* Header with Export Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Command Center Overview</h1>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
          >
            📥 EXPORT ANALYTICS <span style={{ fontSize: '0.6rem' }}>▼</span>
          </button>

          {showExportMenu && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '200px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', zIndex: 1000, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              <div 
                onClick={() => handleExport('all')} 
                style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.85rem', color: theme.textPrimary, borderBottom: `1px solid ${theme.border}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F1F1F'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Export All (Unified Annex)
              </div>
              <div 
                onClick={() => handleExport('individual')} 
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

      {/* Individual Export */}
      {showIndividualModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', width: '400px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Select Analytic to Export</h2>
              <button onClick={() => setShowIndividualModal(false)} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {['Climate Predictor', 'Systems Strengthening Modeler', 'Monte Carlo Risk Forecast', 'Consortium Strategy Matrix', 'RFP Parsing Report'].map(item => (
                <button 
                  key={item}
                  onClick={() => { alert(`Triggering API: Exporting ${item} PDF...`); setShowIndividualModal(false); }}
                  style={{ textAlign: 'left', padding: '12px 16px', backgroundColor: '#0A0A0A', border: `1px solid ${theme.border}`, color: theme.textPrimary, borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: '0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.accent}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
                >
                  📄 {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>{metric.title}</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: theme.textPrimary }}>{metric.value}</span>
            <span style={{ color: metric.color, fontWeight: 700, fontSize: '0.9rem' }}>{metric.change}</span>
          </div>
        ))}
      </div>

      {/* GIS MAP CONTAINER */}
      <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0D0D0D' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Live GIS Funding Tracker</h2>
            <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: theme.success, borderRadius: '50%', boxShadow: `0 0 8px ${theme.success}` }}></span>
              Real-Time FCDO, Canada, & Hilton Foundation Feeds
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
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
            
            {/* RENDER THE DONOR NODES (WITH DOWNLOAD BUTTON) */}
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

            {/* RENDER THE PARTNER NODES AND CONNECTION LINES */}
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
                          onClick={() => navigate('/consortium-matrix')}
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