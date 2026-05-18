import React, { useState, useEffect, useRef } from 'react';

const SystemsModeler: React.FC = () => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981',
    warning: '#F59E0B', danger: '#EF4444'
  };

  const savedState = JSON.parse(sessionStorage.getItem('sm_state') || 'null');

  const [blocks, setBlocks] = useState(savedState || {
    policy: 40,
    institutions: 30,
    finance: 20,
    infrastructure: 70,
    monitoring: 25,
  });

  const [transformationScore, setTransformationScore] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting...' | 'Live Collaboration Active' | 'Disconnected'>('Connecting...');
  
  // Create a persistent reference to the WebSocket connection
  const ws = useRef<WebSocket | null>(null);

  // --- NEW: WEBSOCKET MULTIPLAYER CONNECTION ---
  useEffect(() => {
    // Connect to the Render backend using the secure WebSocket protocol (wss://)
    // We are putting everyone in a shared room called 'global-bid-room'
    ws.current = new WebSocket('wss://wash-ai.onrender.com/ws/collaborate/global-bid-room');

    ws.current.onopen = () => setConnectionStatus('Live Collaboration Active');
    ws.current.onclose = () => setConnectionStatus('Disconnected');

    // Listen for slider movements from other users
    ws.current.onmessage = (event) => {
      try {
        const incomingState = JSON.parse(event.data);
        setBlocks(incomingState);
      } catch (e) {
        console.error("Failed to parse incoming multiplayer data");
      }
    };

    // Cleanup the connection when the user leaves the page
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Sync state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('sm_state', JSON.stringify(blocks));
  }, [blocks]);

  // Algorithm to calculate "Transformational Scale"
  useEffect(() => {
    const governanceAverage = (blocks.policy + blocks.institutions + blocks.finance + blocks.monitoring) / 4;
    const gap = Math.abs(blocks.infrastructure - governanceAverage);
    const baseScore = (blocks.policy + blocks.institutions + blocks.finance + blocks.infrastructure + blocks.monitoring) / 5;
    const penalty = gap > 30 ? (gap * 0.5) : 0; 
    const finalScore = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
    setTransformationScore(finalScore);
  }, [blocks]);

  const handleSlider = (block: keyof typeof blocks, value: number) => {
    const newBlocks = { ...blocks, [block]: value };
    setBlocks(newBlocks);
    
    // Broadcast the new slider positions to anyone else looking at this page!
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newBlocks));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return theme.success;
    if (score >= 50) return theme.warning;
    return theme.danger;
  };

  const resetModeler = () => {
    const resetState = { policy: 40, institutions: 30, finance: 20, infrastructure: 70, monitoring: 25 };
    setBlocks(resetState);
    sessionStorage.removeItem('sm_state');
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(resetState));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Systems Strengthening Modeler</h1>
          <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '800px' }}>
            Simulate transformational WASH programme delivery. Adjust system building blocks to project long-term outcomes.
          </p>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: connectionStatus === 'Live Collaboration Active' ? theme.success : theme.warning }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: connectionStatus === 'Live Collaboration Active' ? theme.success : theme.warning, borderRadius: '50%', boxShadow: `0 0 8px ${connectionStatus === 'Live Collaboration Active' ? theme.success : theme.warning}` }}></span>
            {connectionStatus}
          </div>
        </div>
        <button 
          onClick={resetModeler}
          style={{ padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.danger; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.danger; }}
        >
          RESET MODELER
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* SLIDER CONTROLS */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px' }}>WASH Building Blocks</h2>
          
          {Object.entries(blocks).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'capitalize', fontWeight: 600, fontSize: '0.875rem' }}>
                <span>{key === 'institutions' ? 'Institutional Capacity' : key}</span>
                <span style={{ color: theme.accent }}>{value as number}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={value as number} 
                onChange={(e) => handleSlider(key as keyof typeof blocks, parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: theme.accent }}
              />
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderLeft: `3px solid ${theme.accent}`, fontSize: '0.8rem', color: theme.textSecondary, lineHeight: '1.5' }}>
            <strong>System Logic:</strong> High infrastructure investment without matching governance triggers a sustainability penalty.
          </div>
        </div>

        {/* REAL-TIME PROJECTION OUTPUT */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, width: '100%', textAlign: 'left' }}>10-Year Transformation Score</h2>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `8px solid #1F1F1F`, borderTopColor: getScoreColor(transformationScore), transform: 'rotate(-45deg)', transition: 'border-color 0.5s ease' }}>
            <div style={{ transform: 'rotate(45deg)', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: getScoreColor(transformationScore) }}>{transformationScore}</div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, fontWeight: 700, letterSpacing: '1px' }}>OUTCOME PROJECTION</div>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '24px', gap: '12px' }}>
            <div style={{ flex: '1 1 120px', padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
               <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase' }}>Risk of Failure</div>
               <div style={{ fontWeight: 800, color: transformationScore < 50 ? theme.danger : theme.textPrimary }}>{transformationScore < 50 ? 'HIGH' : transformationScore < 75 ? 'MEDIUM' : 'LOW'}</div>
            </div>
            <div style={{ flex: '1 1 120px', padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
               <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase' }}>Scale Potential</div>
               <div style={{ fontWeight: 800, color: transformationScore >= 75 ? theme.success : theme.textPrimary }}>{transformationScore >= 75 ? 'NATIONAL' : 'LOCALIZED'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsModeler;