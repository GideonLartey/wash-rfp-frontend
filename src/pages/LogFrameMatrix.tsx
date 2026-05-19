import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LogFrameMatrix: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Catch the data passed from the RFP Parser via React Router
  const rfpData = location.state?.rfpData || null;

  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', 
    warning: '#F59E0B', danger: '#EF4444', headerBg: '#0A0A0A'
  };

  const [isGenerating, setIsGenerating] = useState(true);
  const [matrixData, setMatrixData] = useState<any | null>(null);

  useEffect(() => {
    // Simulate the heavy backend AI generation process (Gemini processing the LogFrame)
    const timer = setTimeout(() => {
      
      // We dynamically inject the parsed country and budget if available
      const targetRegion = rfpData?.primaryCountry || rfpData?.demographics || 'the Target Region';
      const budgetSource = rfpData?.budget || 'Strategic Partners';
      
      // Mocked AI Output mapped to standard WASH LogFrame standards
      setMatrixData([
        {
          level: '1. Strategic Impact (Goal)',
          narrative: `Long-term improvement in public health, gender equality, and economic resilience for populations in ${targetRegion}.`,
          indicators: '15% reduction in waterborne disease incidence (e.g., Cholera) within 5 years.',
          verification: 'National Ministry of Health epidemiological reports; WHO Annual Data.',
          assumptions: 'Political stability allows for continued longitudinal health tracking.'
        },
        {
          level: '2. Project Outcomes',
          narrative: `Sustainable, year-round access to safe drinking water and localized sanitation management systems.`,
          indicators: '85% of target population has access to <30 minute round-trip water source by Year 3.',
          verification: 'JMP (Joint Monitoring Programme) household surveys; Local GIS telemetry.',
          assumptions: 'Community water committees maintain active fee-collection protocols.'
        },
        {
          level: '3. Tangible Outputs',
          narrative: 'Installation of solar-powered borehole networks and community WASH training programs.',
          indicators: '15 active high-yield solar boreholes; 30 certified community maintenance technicians.',
          verification: 'Site commissioning certificates; OpenWSH-CONTROL IoT active node logs.',
          assumptions: 'No critical supply chain failures for solar inverters and PVC casing.'
        },
        {
          level: '4. Key Activities & Inputs',
          narrative: `Geophysical surveying, procurement of Grundfos pumps, and allocation of ${budgetSource} capital.`,
          indicators: 'Capital deployment of extracted contract value; 100% procurement audit compliance.',
          verification: 'Financial disbursement ledgers; RFP Consortia Contracts.',
          assumptions: 'Local inflation rates remain within the 10-year Monte Carlo risk forecast thresholds.'
        }
      ]);
      setIsGenerating(false);
    }, 3500); // 3.5 second simulated delay for dramatic enterprise effect

    return () => clearTimeout(timer);
  }, [rfpData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Instrument Sans', sans-serif", paddingBottom: '40px' }}>
      
      <style>
        {`
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulseText {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}
      </style>

      {/* HEADER CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button 
            onClick={() => navigate('/rfp-parser')}
            style={{ background: 'none', border: 'none', color: theme.accent, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, padding: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            &larr; BACK TO PARSER
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: theme.textPrimary }}>Automated Logical Framework</h1>
          <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '0.9rem' }}>
            AI-Generated LogFrame Matrix derived from RFP Document: <span style={{ color: theme.success, fontWeight: 700 }}>{rfpData?.projectNumber || 'Active Document'}</span>
          </p>
        </div>
        
        {!isGenerating && (
          <button 
            onClick={() => window.print()}
            style={{ backgroundColor: theme.surface, color: theme.textPrimary, border: `1px solid ${theme.border}`, padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.textSecondary}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
          >
            🖨️ EXPORT TO PDF
          </button>
        )}
      </div>

      {/* DYNAMIC GENERATION STATE */}
      {isGenerating ? (
        <div style={{ height: '400px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: 'transparent', overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', backgroundColor: theme.accent, animation: 'scanline 2s linear infinite', boxShadow: `0 0 10px ${theme.accent}` }} />
          </div>
          
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧠</div>
          <h2 style={{ fontSize: '1.2rem', color: theme.textPrimary, margin: 0, animation: 'pulseText 1.5s infinite' }}>Synthesizing Strategic LogFrame...</h2>
          <p style={{ color: theme.textSecondary, fontSize: '0.9rem', marginTop: '12px', maxWidth: '400px', textAlign: 'center' }}>
            Gemini AI is cross-referencing extracted RFP metadata with standard USAID & FCDO structural logic frameworks.
          </p>
        </div>
      ) : (
        
        /* THE LOGFRAME MATRIX GRID */
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          
          {/* MATRIX HEADERS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr', backgroundColor: theme.headerBg, borderBottom: `2px solid ${theme.border}`, padding: '16px', gap: '16px' }}>
            <div style={{ color: theme.textSecondary, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Hierarchy</div>
            <div style={{ color: theme.textSecondary, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Narrative Summary</div>
            <div style={{ color: theme.accent, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Verifiable Indicators (OVI)</div>
            <div style={{ color: theme.success, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Means of Verification</div>
            <div style={{ color: theme.warning, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Critical Assumptions</div>
          </div>

          {/* MATRIX ROWS */}
          {matrixData && matrixData.map((row: any, index: number) => (
            <div key={index} style={{ 
              display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr', 
              padding: '20px 16px', gap: '16px', borderBottom: index === matrixData.length - 1 ? 'none' : `1px solid ${theme.border}`,
              backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
            >
              {/* Hierarchy Block */}
              <div style={{ color: theme.textPrimary, fontWeight: 800, fontSize: '0.85rem' }}>
                {row.level}
              </div>
              
              {/* Narrative Block */}
              <div style={{ color: theme.textPrimary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                {row.narrative}
              </div>
              
              {/* Indicators Block */}
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: `2px solid ${theme.accent}`, padding: '8px 12px', color: theme.textPrimary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                {row.indicators}
              </div>
              
              {/* Verification Block */}
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderLeft: `2px solid ${theme.success}`, padding: '8px 12px', color: theme.textPrimary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                {row.verification}
              </div>
              
              {/* Assumptions Block */}
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', borderLeft: `2px solid ${theme.warning}`, padding: '8px 12px', color: theme.textPrimary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                {row.assumptions}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogFrameMatrix;