import React, { useState, useEffect } from 'react';

// Define the shape of the data we expect from your FastAPI backend
interface LiveContextData {
  country: string;
  water_stress_index: number;
  governance_score: number;
  primary_climate_risk: string;
  infrastructure_baseline: number;
}

const ClimatePredictor: React.FC<{ setSharedVolatility?: (v: 'Low' | 'Medium' | 'High') => void }> = ({ setSharedVolatility }) => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981',
    warning: '#F59E0B', danger: '#EF4444', bgLight: '#1A1F26'
  };

  // Check session storage for existing data on load (Crucial for the Master Report!)
  const savedState = JSON.parse(sessionStorage.getItem('cp_state') || 'null');

  const [environment, setEnvironment] = useState<'Rural' | 'Urban'>(savedState?.environment || 'Rural');
  const [climateRisk, setClimateRisk] = useState<'Drought' | 'Flood'>(savedState?.climateRisk || 'Drought');
  const [targetPopulation, setTargetPopulation] = useState<number>(savedState?.targetPopulation || 50000);
  
  // New States for the Live API
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);
  const [liveData, setLiveData] = useState<LiveContextData | null>(savedState?.liveData || null);

  // Sync state to sessionStorage whenever a user changes anything
  useEffect(() => {
    sessionStorage.setItem('cp_state', JSON.stringify({ 
      environment, 
      climateRisk, 
      targetPopulation,
      liveData 
    }));
    
    // Also push the volatility to the Monte Carlo simulator if the prop exists
    if (setSharedVolatility) {
        setSharedVolatility(climateRisk === 'Drought' ? 'High' : 'Medium');
    }
  }, [environment, climateRisk, targetPopulation, liveData, setSharedVolatility]);

  // THE ORACLE ENGINE: Fetch data from your Python Backend
  const handleFetchContext = async () => {
    if (!countrySearch.trim()) return;
    setIsFetching(true);
    
    try {
      // Connects directly to the endpoint we added to main.py on Render
      const response = await fetch(`https://wash-ai.onrender.com/api/context/${countrySearch}`);
      
      if (!response.ok) throw new Error("Failed to fetch context");
      
      const data: LiveContextData = await response.json();
      setLiveData(data);
      
      // Auto-Adjust the sliders based on the AI's return data!
      setClimateRisk(data.primary_climate_risk === 'Flood' ? 'Flood' : 'Drought');
      setEnvironment(data.infrastructure_baseline > 50 ? 'Urban' : 'Rural');
      
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to the Live Context Engine. Make sure your Render backend is awake!");
    } finally {
      setIsFetching(false);
    }
  };

  const resetPredictor = () => {
    setEnvironment('Rural');
    setClimateRisk('Drought');
    setTargetPopulation(50000);
    setLiveData(null);
    setCountrySearch('');
    sessionStorage.removeItem('cp_state');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Climate & Context Predictor</h1>
          <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '800px' }}>
            Query live macro-indicators to automatically generate context-adaptive WASH technical frameworks.
          </p>
        </div>
        <button 
          onClick={resetPredictor}
          style={{ padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.danger; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.danger; }}
        >
          RESET MODULE
        </button>
      </div>

      {/* --- NEW: LIVE DATA API SEARCH BAR --- */}
      <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.accent}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: theme.accent, borderRadius: '50%' }}></span>
          Live Context Engine
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Enter target country (e.g., Mali, Kenya, Bangladesh)..." 
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchContext()}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: '#0A0A0A', color: theme.textPrimary, fontSize: '1rem' }}
          />
          <button 
            onClick={handleFetchContext}
            disabled={isFetching}
            style={{ padding: '0 24px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: isFetching ? 'wait' : 'pointer', transition: 'opacity 0.2s', opacity: isFetching ? 0.7 : 1 }}
          >
            {isFetching ? 'PULLING DATA...' : 'FETCH LIVE METRICS'}
          </button>
        </div>

        {/* Display Fetched Data if it exists */}
        {liveData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px', padding: '16px', backgroundColor: theme.bgLight, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800 }}>Target Nation</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: theme.textPrimary }}>{liveData.country}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800 }}>Water Stress Index</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: liveData.water_stress_index > 70 ? theme.danger : theme.warning }}>{liveData.water_stress_index}/100</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800 }}>Governance Score</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: liveData.governance_score < 40 ? theme.danger : theme.success }}>{liveData.governance_score}/100</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800 }}>Existing Infra Base</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: theme.accent }}>{liveData.infrastructure_baseline}%</div>
            </div>
          </div>
        )}
      </div>

      {/* --- MANUAL OVERRIDE CONTROLS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px' }}>Context Parameters</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.textSecondary }}>Environment Setting</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Rural', 'Urban'].map((env) => (
                <button
                  key={env}
                  onClick={() => setEnvironment(env as any)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700,
                    backgroundColor: environment === env ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: `1px solid ${environment === env ? theme.accent : theme.border}`,
                    color: environment === env ? theme.textPrimary : theme.textSecondary
                  }}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.textSecondary }}>Primary Climate Risk</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Drought', 'Flood'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setClimateRisk(risk as any)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700,
                    backgroundColor: climateRisk === risk ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                    border: `1px solid ${climateRisk === risk ? theme.warning : theme.border}`,
                    color: climateRisk === risk ? theme.warning : theme.textSecondary
                  }}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600 }}>
              <span style={{ color: theme.textSecondary }}>Target Population Size</span>
              <span style={{ color: theme.accent }}>{targetPopulation.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="5000" max="1000000" step="5000"
              value={targetPopulation} 
              onChange={(e) => setTargetPopulation(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: theme.accent }}
            />
          </div>
        </div>

        {/* --- DYNAMIC OUTPUT ARCHITECTURE --- */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px' }}>Recommended Architecture</h2>
          
          <div style={{ padding: '20px', backgroundColor: theme.bgLight, borderRadius: '8px', borderLeft: `4px solid ${climateRisk === 'Drought' ? theme.warning : theme.accent}` }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: theme.textPrimary }}>
              {environment === 'Rural' && climateRisk === 'Drought' && "Deep-Aquifer Solar Pumping Network"}
              {environment === 'Rural' && climateRisk === 'Flood' && "Elevated Rainwater Harvesting Hubs"}
              {environment === 'Urban' && climateRisk === 'Drought' && "Utility-Managed Smart Kiosk Grid"}
              {environment === 'Urban' && climateRisk === 'Flood' && "Containerized Decentralized Sanitation (FSM)"}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: theme.textSecondary, fontSize: '0.9rem', lineHeight: '1.6' }}>
               {environment === 'Rural' && climateRisk === 'Drought' && (
                 <><li>150m+ deep boreholes to bypass seasonal surface water depletion.</li><li>Decentralized solar micro-grids with battery redundancy.</li></>
               )}
               {environment === 'Rural' && climateRisk === 'Flood' && (
                 <><li>Flood-resistant elevated storage tanks.</li><li>Bio-sand filtration systems with point-of-use chlorination.</li></>
               )}
               {environment === 'Urban' && climateRisk === 'Drought' && (
                 <><li>Pre-paid smart water ATMs.</li><li>Pressure-managed pipe networks to reduce non-revenue water.</li></>
               )}
               {environment === 'Urban' && climateRisk === 'Flood' && (
                 <><li>Raised, sealed bio-digesters to prevent overflow.</li><li>Vacuum truck access routes mapped for sludge removal.</li></>
               )}
               {targetPopulation > 500000 ? <li>National-level SCADA IoT monitoring integration.</li> : <li>District-level mobile mechanic reporting network.</li>}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClimatePredictor;