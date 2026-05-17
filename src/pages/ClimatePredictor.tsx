import React, { useState, useEffect } from 'react';

interface ClimatePredictorProps {
  setSharedVolatility: (val: 'Low' | 'Medium' | 'High') => void;
}

const ClimatePredictor: React.FC<ClimatePredictorProps> = ({ setSharedVolatility }) => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981',
    warning: '#F59E0B', danger: '#EF4444', highlight: '#1F1F1F'
  };

  // Check session storage for existing data on load
  const savedState = JSON.parse(sessionStorage.getItem('cp_state') || '{}');
  
  const [environment, setEnvironment] = useState<'Rural' | 'Peri-Urban' | 'Urban' | null>(savedState.environment ?? null);
  const [climateRisk, setClimateRisk] = useState<'Drought' | 'Flood' | 'Cyclonic' | null>(savedState.climateRisk ?? null);
  const [targetPopulation, setTargetPopulation] = useState<number>(savedState.targetPopulation ?? 50000);

  const [modelName, setModelName] = useState("");
  const [frameworkSpecs, setFrameworkSpecs] = useState<string[]>([]);
  const [capexRisk, setCapexRisk] = useState("");

  // Sync state to sessionStorage whenever a user changes a parameter
  useEffect(() => {
    sessionStorage.setItem('cp_state', JSON.stringify({ environment, climateRisk, targetPopulation }));
  }, [environment, climateRisk, targetPopulation]);

  const handleRiskChange = (risk: 'Drought' | 'Flood' | 'Cyclonic') => {
    setClimateRisk(risk);
    if (risk === 'Drought') setSharedVolatility('High');
    if (risk === 'Cyclonic') setSharedVolatility('High');
    if (risk === 'Flood') setSharedVolatility('Medium');
  };

  const resetPredictor = () => {
    setEnvironment(null);
    setClimateRisk(null);
    setTargetPopulation(50000);
    sessionStorage.removeItem('cp_state');
  };

  useEffect(() => {
    if (!environment || !climateRisk) return;

    let generatedModel = "";
    let specs: string[] = [];
    let risk = "";

    if (environment === 'Rural') {
      if (climateRisk === 'Drought') {
        generatedModel = "Deep-Aquifer Solar Pumping Network";
        specs = ["150m+ deep boreholes to bypass seasonal surface water depletion.", "Decentralized solar micro-grids with battery redundancy.", "Community-managed tariff structure via mobile money."];
      } else {
        generatedModel = "Elevated Rainwater Harvesting Hubs";
        specs = ["Flood-resistant elevated storage tanks.", "Bio-sand filtration systems.", "Point-of-use chlorination distribution."];
      }
    } else {
      if (climateRisk === 'Flood') {
        generatedModel = "Containerized Decentralized Sanitation (FSM)";
        specs = ["Raised, sealed bio-digesters to prevent overflow during heavy rains.", "Vacuum truck access routes mapped for sludge removal.", "Integration with municipal waste treatment grids."];
      } else {
        generatedModel = "Utility-Managed Smart Kiosk Grid";
        specs = ["Pre-paid smart water ATMs.", "Pressure-managed pipe networks to reduce non-revenue water.", "Public-private utility partnerships."];
      }
    }

    if (targetPopulation > 500000) {
      specs.push("National-level SCADA IoT monitoring.");
      risk = "HIGH CAPEX - Requires blended finance (Grants + Sovereign Loans)";
    } else if (targetPopulation > 100000) {
      specs.push("District-level IoT sensor dashboard for predictive maintenance.");
      risk = "MEDIUM CAPEX - Suitable for large bilateral donor grants";
    } else {
      specs.push("Local hand-pump mechanic network with SMS reporting.");
      risk = "LOW CAPEX - Suitable for foundation/trust pilot funding";
    }

    setModelName(generatedModel);
    setFrameworkSpecs(specs);
    setCapexRisk(risk);
  }, [environment, climateRisk, targetPopulation]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Context-Adaptive Technical Frameworks</h1>
          <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '800px' }}>
            Select parameters below to dynamically generate a scalable WASH technical model. Your climate selection will automatically inform the Monte Carlo Risk Simulator.
          </p>
        </div>
        <button 
          onClick={resetPredictor}
          style={{ padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.danger; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.danger; }}
        >
          RESET PREDICTOR
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '1 1 320px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>1. Define Context</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.textSecondary }}>Environment</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Rural', 'Peri-Urban', 'Urban'].map(env => (
                <button key={env} onClick={() => setEnvironment(env as any)} style={{ flex: 1, minWidth: '80px', padding: '10px', backgroundColor: environment === env ? 'rgba(59, 130, 246, 0.15)' : theme.highlight, border: `1px solid ${environment === env ? theme.accent : theme.border}`, color: environment === env ? theme.accent : theme.textPrimary, borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>{env}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.textSecondary }}>Primary Climate Risk</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Drought', 'Flood', 'Cyclonic'].map(risk => (
                <button key={risk} onClick={() => handleRiskChange(risk as any)} style={{ flex: 1, minWidth: '80px', padding: '10px', backgroundColor: climateRisk === risk ? 'rgba(239, 68, 68, 0.15)' : theme.highlight, border: `1px solid ${climateRisk === risk ? theme.danger : theme.border}`, color: climateRisk === risk ? theme.danger : theme.textPrimary, borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>{risk}</button>
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '16px 0 0 0', color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>2. Define Scale</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.875rem' }}><span style={{ color: theme.textSecondary }}>Target Population</span><span style={{ color: theme.accent }}>{targetPopulation.toLocaleString()} people</span></div>
            <input type="range" min="5000" max="1000000" step="5000" value={targetPopulation} onChange={(e) => setTargetPopulation(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: theme.accent }} />
          </div>
        </div>

        <div style={{ flex: '1.5 1 320px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {environment && climateRisk ? (
             <>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Recommended Technical Model</h2>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: theme.textPrimary, borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px' }}>{modelName}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: theme.accent }}>Framework Architecture</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: theme.textSecondary, lineHeight: '1.6' }}>{frameworkSpecs.map((spec, i) => (<li key={i}>{spec}</li>))}</ul>
                </div>
                <div style={{ marginTop: 'auto', padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: `1px solid ${theme.warning}`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                   <div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.warning, textTransform: 'uppercase' }}>Financial Feasibility Profile</div>
                     <div style={{ fontSize: '0.9rem', color: theme.textPrimary, fontWeight: 600, marginTop: '4px' }}>{capexRisk}</div>
                   </div>
                </div>
             </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: theme.textSecondary, padding: '40px', border: `2px dashed ${theme.border}`, borderRadius: '8px' }}>
               Awaiting parameter selection. Please define the Context environment and Climate Risk to generate a technical framework.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClimatePredictor;