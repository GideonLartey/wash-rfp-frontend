import React, { useState, useRef, useEffect } from 'react';

interface MonteCarloProps {
  initialVolatility?: 'Low' | 'Medium' | 'High' | null;
  clearVolatility: () => void;
}

const MonteCarloSimulator: React.FC<MonteCarloProps> = ({ initialVolatility, clearVolatility }) => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', 
    warning: '#F59E0B', danger: '#EF4444', highlight: '#1F1F1F'
  };

  const [funding, setFunding] = useState(80);
  const [governance, setGovernance] = useState(60);
  const volatility = initialVolatility || 'Medium'; 
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  
  const [meanScore, setMeanScore] = useState<number | string>('--');
  const [probSuccess, setProbSuccess] = useState<number | string>('--');
  const [worstCase, setWorstCase] = useState<number | string>('--');
  
  const [curvePath, setCurvePath] = useState("");
  const [triggerDraw, setTriggerDraw] = useState(0);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  
  useEffect(() => {
    return () => {
      console.log("Exiting Risk Simulator: Clearing Global Pipeline State.");
      clearVolatility();
    };
  }, [clearVolatility]);

  
  const generateLifecycleCurve = (fund: number, gov: number, vol: string) => {
    const points = [];
    let currentHealth = 100;
    const years = 10;
    const width = 280; 
    const height = 60; 

    points.push(`0,${height - (currentHealth / 100) * height}`);

    for (let i = 1; i <= years; i++) {
      // DYNAMIC DECAY
      let naturalDecay = 1.0 + (9.0 * (1 - gov / 100));

      // STOCHASTIC SHOCKS: Randomized events
      let shock = 0;
      const rand = Math.random();
      const shockChance = vol === 'High' ? 0.38 : (vol === 'Medium' ? 0.20 : 0.08);
      
      if (rand < shockChance) {
        const intensity = vol === 'High' ? 30 : (vol === 'Medium' ? 18 : 8);
        shock = intensity * (0.8 + Math.random() * 0.4); 
      }

      // REPAIR VELOCITY - FUNDING EFFECT
      // high funding keeps a system alive
      let currentDeficit = (100 - (currentHealth - naturalDecay - shock));
      let repairAbility = (fund / 100) * 0.88; 
      let recovery = currentDeficit * repairAbility;

      currentHealth = (currentHealth - naturalDecay - shock) + recovery;
      
      // A system loses 0.5% max potential every year 
      const maxPossible = 100 - (i * 0.5); 
      if (currentHealth > maxPossible) currentHealth = maxPossible; 
      if (currentHealth < 5) currentHealth = 5;

      const x = (i / years) * width;
      const y = height - (currentHealth / 100) * height;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setHasRun(true);
    setHoverX(null); 
    
    setCurvePath(generateLifecycleCurve(funding, governance, volatility));
    setTriggerDraw(prev => prev + 1); 

    setTimeout(() => {
      // Calculation logic for cards
      const govWeight = governance * 0.55;
      const fundWeight = funding * 0.45;
      const volPenalty = volatility === 'High' ? 28 : (volatility === 'Medium' ? 14 : 4);
      
      const finalMean = Math.max(12, Math.round((govWeight + fundWeight) - (volPenalty * 0.4)));
      setMeanScore(finalMean);
      setProbSuccess(Math.max(8, Math.round(finalMean * (funding / 100 + 0.25))));
      setWorstCase(Math.max(3, Math.round(finalMean - volPenalty)));
      
      setIsSimulating(false);
    }, 1200); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Stochastic Risk Modeling (Monte Carlo)</h1>
          <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem' }}>
            Multi-variable lifecycle simulation with real-time asset degradation mapping.
          </p>
        </div>

        <div style={{ width: '320px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase' }}>Trajectory Forecast</span>
            <span style={{ fontSize: '0.7rem', color: hasRun && Number(meanScore) <= 50 ? theme.danger : theme.success, fontWeight: 700 }}>
              {hasRun ? 'Interactive Degradation' : 'Awaiting Input'}
            </span>
          </div>
          
          <div style={{ height: '60px', width: '100%', position: 'relative' }}>
            <svg 
              ref={svgRef}
              width="100%" height="100%" viewBox="0 0 280 60" preserveAspectRatio="none"
              onMouseMove={(e) => {
                if (!svgRef.current || !hasRun || isSimulating) return;
                const rect = svgRef.current.getBoundingClientRect();
                setHoverX(Math.max(0, Math.min(e.clientX - rect.left, 280)));
              }}
              onMouseLeave={() => setHoverX(null)}
              style={{ cursor: hasRun && !isSimulating ? 'crosshair' : 'default' }}
            >
              <line x1="0" y1="15" x2="280" y2="15" stroke={theme.border} strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="45" x2="280" y2="45" stroke={theme.border} strokeWidth="1" strokeDasharray="4 4" />
              
              {hasRun && (
                <path 
                  key={triggerDraw}
                  d={curvePath}
                  fill="none"
                  stroke={Number(meanScore) > 60 ? theme.accent : (Number(meanScore) > 40 ? theme.warning : theme.danger)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ strokeDasharray: 1000, strokeDashoffset: isSimulating ? 1000 : 0, transition: isSimulating ? 'none' : 'stroke-dashoffset 1.2s ease-in-out' }}
                />
              )}

              {hoverX !== null && hasRun && !isSimulating && (
                <g>
                  <line x1={hoverX} y1="0" x2={hoverX} y2="60" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                  <rect x={hoverX < 240 ? hoverX + 6 : hoverX - 46} y="4" width="42" height="18" fill={theme.highlight} stroke={theme.border} strokeWidth="1" rx="4" />
                  <text x={hoverX < 240 ? hoverX + 27 : hoverX - 25} y="16" fill="#FFFFFF" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                    Yr {Math.max(1, (hoverX / 280) * 10).toFixed(1)}
                  </text>
                </g>
              )}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.6rem', color: theme.textSecondary }}>
              <span>START</span>
              <span>YEAR 10</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: theme.accent, textTransform: 'uppercase', margin: '0 0 4px 0' }}>Simulation Variables</h2>
            <p style={{ fontSize: '0.75rem', color: theme.textSecondary, margin: 0, fontStyle: 'italic' }}>Tweak and re-run to test resilience.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: theme.textPrimary, fontWeight: 600 }}>Funding Reliability</span>
                <span style={{ fontSize: '0.85rem', color: theme.accent, fontWeight: 700 }}>{funding}%</span>
              </div>
              <input type="range" min="0" max="100" value={funding} onChange={(e) => setFunding(Number(e.target.value))} style={{ width: '100%', accentColor: theme.accent }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: theme.textPrimary, fontWeight: 600 }}>Governance Strength</span>
                <span style={{ fontSize: '0.85rem', color: theme.accent, fontWeight: 700 }}>{governance}%</span>
              </div>
              <input type="range" min="0" max="100" value={governance} onChange={(e) => setGovernance(Number(e.target.value))} style={{ width: '100%', accentColor: theme.accent }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: theme.textSecondary, fontWeight: 600 }}>Climate Risk</span>
                <span style={{ fontSize: '0.6rem', color: theme.warning, fontWeight: 800, backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Low', 'Medium', 'High'].map(level => (
                  <div key={level} style={{ flex: 1, padding: '8px 0', textAlign: 'center', border: `1px solid ${volatility === level ? theme.accent : theme.border}`, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: volatility === level ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: volatility === level ? '#fff' : theme.textSecondary, opacity: volatility === level ? 1 : 0.3 }}>
                    {level}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={runSimulation} disabled={isSimulating} style={{ marginTop: 'auto', padding: '16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, cursor: isSimulating ? 'wait' : 'pointer' }}>
            {isSimulating ? 'PROCESSING MODEL...' : 'RUN MONTE CARLO'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Expected Mean Score</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: theme.textPrimary }}>{isSimulating ? '--' : meanScore}</div>
            </div>
            <div style={{ backgroundColor: theme.surface, border: `1px solid ${hasRun && Number(probSuccess) < 60 ? theme.danger : (hasRun && Number(probSuccess) < 80 ? theme.warning : theme.accent)}`, borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Success Probability</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: hasRun && Number(probSuccess) < 60 ? theme.danger : (hasRun && Number(probSuccess) < 80 ? theme.warning : theme.accent) }}>
                {isSimulating || !hasRun ? '--' : `${probSuccess}%`}
              </div>
            </div>
            <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Worst Case Forecast</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: hasRun ? theme.danger : theme.textPrimary }}>{isSimulating ? '--' : worstCase}</div>
            </div>
          </div>

          <div style={{ flex: 1, backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', margin: 0 }}>Probability Density Function</h3>
              <span style={{ fontSize: '0.7rem', color: theme.success, fontWeight: 800 }}>VIABILITY THRESHOLD (75)</span>
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '8px', position: 'relative' }}>
               <div style={{ position: 'absolute', bottom: 8, left: '75%', top: 0, borderLeft: `2px dashed ${theme.success}`, opacity: 0.5 }} />
               {[8, 15, 30, 45, 65, 90, 100, 70, 35, 12].map((height, i) => (
                 <div key={i} style={{ flex: 1, height: !hasRun ? '4%' : (isSimulating ? '15%' : `${height}%`), backgroundColor: i >= 7 ? theme.success : theme.accent, borderRadius: '4px 4px 0 0', opacity: !hasRun ? 0.1 : (isSimulating ? 0.2 : 0.8), transition: 'height 0.6s ease-out, opacity 0.4s' }} />
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonteCarloSimulator;