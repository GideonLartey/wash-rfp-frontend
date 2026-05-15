import React, { useState, useEffect } from 'react';

const SystemsModeler: React.FC = () => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981',
    warning: '#F59E0B', danger: '#EF4444'
  };

  // The 5 Core WASH Systems Building Blocks
  const [blocks, setBlocks] = useState({
    policy: 40,
    institutions: 30,
    finance: 20,
    infrastructure: 70,
    monitoring: 25,
  });

  const [transformationScore, setTransformationScore] = useState(0);

  // Algorithm to calculate "Transformational Scale" based on balance, not just infrastructure
  useEffect(() => {
    // If infrastructure is high but finance/institutions are low, sustainability fails (penalty)
    const governanceAverage = (blocks.policy + blocks.institutions + blocks.finance + blocks.monitoring) / 4;
    const gap = Math.abs(blocks.infrastructure - governanceAverage);
    
    const baseScore = (blocks.policy + blocks.institutions + blocks.finance + blocks.infrastructure + blocks.monitoring) / 5;
    const penalty = gap > 30 ? (gap * 0.5) : 0; // Penalty for unbalanced systems
    
    const finalScore = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
    setTransformationScore(finalScore);
  }, [blocks]);

  const handleSlider = (block: keyof typeof blocks, value: number) => {
    setBlocks(prev => ({ ...prev, [block]: value }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return theme.success;
    if (score >= 50) return theme.warning;
    return theme.danger;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Systems Strengthening Modeler</h1>
        <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '800px' }}>
          Simulate transformational WASH programme delivery. Adjust system building blocks to project long-term, large-scale sustainability outcomes against capital infrastructure investments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* SLIDER CONTROLS */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px' }}>WASH Building Blocks</h2>
          
          {Object.entries(blocks).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'capitalize', fontWeight: 600, fontSize: '0.875rem' }}>
                <span>{key === 'institutions' ? 'Institutional Capacity' : key}</span>
                <span style={{ color: theme.accent }}>{value}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={value} 
                onChange={(e) => handleSlider(key as keyof typeof blocks, parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: theme.accent }}
              />
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderLeft: `3px solid ${theme.accent}`, fontSize: '0.8rem', color: theme.textSecondary, lineHeight: '1.5' }}>
            <strong>System Logic:</strong> High infrastructure investment without matching governance (Finance, Policy, Institutions) triggers a sustainability penalty, reducing the long-term transformation score.
          </div>
        </div>

        {/* REAL-TIME PROJECTION OUTPUT */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, width: '100%', textAlign: 'left' }}>10-Year Transformation Score</h2>
          
          {/* Circular Progress Simulator */}
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `8px solid #1F1F1F`, borderTopColor: getScoreColor(transformationScore), transform: 'rotate(-45deg)', transition: 'border-color 0.5s ease' }}>
            <div style={{ transform: 'rotate(45deg)', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: getScoreColor(transformationScore) }}>{transformationScore}</div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, fontWeight: 700, letterSpacing: '1px' }}>OUTCOME PROJECTION</div>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '12px' }}>
            <div style={{ flex: 1, padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
               <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'uppercase' }}>Risk of Failure</div>
               <div style={{ fontWeight: 800, color: transformationScore < 50 ? theme.danger : theme.textPrimary }}>{transformationScore < 50 ? 'HIGH' : transformationScore < 75 ? 'MEDIUM' : 'LOW'}</div>
            </div>
            <div style={{ flex: 1, padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
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