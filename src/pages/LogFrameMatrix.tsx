import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LogFrameMatrix: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Catch data passed from the RFP Parser via React Router
  const rfpData = location.state?.rfpData || null;

  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', 
    warning: '#F59E0B', danger: '#EF4444', headerBg: '#0A0A0A'
  };

  const [isGenerating, setIsGenerating] = useState(true);
  const [isExporting, setIsExporting] = useState(false); 
  const [matrixData, setMatrixData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // --- BULLETPROOF CACHE IDENTIFIER ---
  // Fallback chain: Project Number -> Project Title -> Current Timestamp
  const rawRef = rfpData?.project_metadata?.reference_number || rfpData?.projectNumber;
  const rawTitle = rfpData?.project_metadata?.title || rfpData?.outcomes?.[0];
  
  const uniqueIdentifier = (rawRef && rawRef !== "NOT SPECIFIED") 
    ? rawRef 
    : (rawTitle || Date.now().toString());

  const cacheKey = `logframe_cache_${uniqueIdentifier}`;

  useEffect(() => {
    if (!rfpData) {
      setError("No RFP metadata available. Please parse a document first.");
      setIsGenerating(false);
      return;
    }

    const fetchLiveLogFrame = async () => {
      try {
        setIsGenerating(true);
        setError(null);

        // 1. CACHE CHECK
        if (cacheKey) {
          const cachedMatrix = sessionStorage.getItem(cacheKey);
          if (cachedMatrix) {
            setMatrixData(JSON.parse(cachedMatrix));
            setIsGenerating(false);
            return; 
          }
        }

        // LIVE GENERATION
        const response = await fetch(`${apiUrl}/api/logframe-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rfpData })
        });

        if (response.status === 429) {
          throw new Error("You have reached the limit of 3 LogFrame generations per hour. Please wait a bit before trying again.");
        }
        
        if (!response.ok) {
          throw new Error(`Server returned status code ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setMatrixData(result.data);
          
          // 3. SAVE TO CACHE
          if (cacheKey) {
            sessionStorage.setItem(cacheKey, JSON.stringify(result.data));
          }
          
        } else {
          throw new Error("Data returned from server did not match the expected LogFrame matrix structure.");
        }
      } catch (err: any) {
        console.error("Failed to fetch live LogFrame matrix:", err);
        setError(err.message || "Connection to AI data engine failed.");
        
        // STRICT LOCKDOWN RULE: Wipe screen and cache on rate limit
        if (err.message.includes("limit")) {
          if (cacheKey) sessionStorage.removeItem(cacheKey);
          setMatrixData(null);
        }
      } finally {
        setIsGenerating(false);
      }
    };

    fetchLiveLogFrame();
  }, [rfpData, apiUrl, cacheKey]);

  // Secure Backend PDF Export Logic
  const handleExportToPDF = async () => {
    if (!matrixData) return;
    setIsExporting(true);
    try {
      const response = await fetch(`${apiUrl}/api/generate-logframe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rfpData: rfpData || {} }) 
      });

      if (response.status === 429) {
        throw new Error("You have reached the limit of 3 LogFrame exports per hour. Please wait a bit before trying again.");
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = (rawRef && rawRef !== "NOT SPECIFIED") ? `LogFrame_${rawRef}.pdf` : `LogFrame_Export.pdf`;
        
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("PDF Export failed:", err);
      
      // STRICT LOCKDOWN RULE: Wipe screen, clear cache, and trigger full UI error block instead of just an alert
      if (err.message.includes("limit")) {
        if (cacheKey) sessionStorage.removeItem(cacheKey);
        setMatrixData(null);
        setError(err.message);
      } else {
        alert(err.message || "Failed to generate PDF. Check the backend server connection.");
      }
    } finally {
      setIsExporting(false);
    }
  };

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
            AI-Generated LogFrame Matrix derived from RFP Document: <span style={{ color: theme.success, fontWeight: 700 }}>{uniqueIdentifier.length > 25 ? uniqueIdentifier.substring(0,25) + '...' : uniqueIdentifier}</span>
          </p>
        </div>
        
        {!isGenerating && matrixData && (
          <button 
            onClick={handleExportToPDF}
            disabled={isExporting}
            style={{ 
              backgroundColor: theme.surface, 
              color: theme.textPrimary, 
              border: `1px solid ${theme.border}`, 
              padding: '10px 20px', 
              borderRadius: '6px', 
              fontWeight: 700, 
              cursor: isExporting ? 'wait' : 'pointer', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              transition: 'all 0.2s',
              opacity: isExporting ? 0.7 : 1
            }}
            onMouseEnter={(e) => !isExporting && (e.currentTarget.style.borderColor = theme.textSecondary)}
            onMouseLeave={(e) => !isExporting && (e.currentTarget.style.borderColor = theme.border)}
          >
            {isExporting ? '⏳ GENERATING...' : '🖨️ EXPORT TO PDF'}
          </button>
        )}
      </div>

      {/* DYNAMIC GENERATION STATE */}
      {isGenerating && (
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
      )}

      {/* ERROR STATE VIEW (Including Rate Limit Warning) */}
      {error && (
        <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: `1px solid ${theme.danger}`, borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
          <h3 style={{ color: theme.textPrimary, margin: 0 }}>Request Blocked</h3>
          <p style={{ color: theme.warning, fontSize: '1rem', marginTop: '12px', fontWeight: 600 }}>{error}</p>
          <button 
            onClick={() => navigate('/rfp-parser')}
            style={{ marginTop: '20px', backgroundColor: theme.surface, color: theme.textPrimary, border: `1px solid ${theme.border}`, padding: '8px 16px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
          >
            Return to Upload Screen
          </button>
        </div>
      )}

      {/* LOGFRAME MATRIX GRID */}
      {!isGenerating && matrixData && (
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
          {matrixData.map((row: any, index: number) => (
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