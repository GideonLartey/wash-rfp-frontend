import React, { useState, useEffect } from 'react';

interface RfpParserProps {
  setUploadedDocument: (doc: string | null) => void;
}

const RfpParser: React.FC<RfpParserProps> = ({ setUploadedDocument }) => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', 
    warning: '#F59E0B', highlight: 'rgba(59, 130, 246, 0.1)', danger: '#EF4444'
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [parsedData, setParsedData] = useState<any | null>(null);

  // Initialize state from local session storage so data survives tab switching
  useEffect(() => {
    const cachedData = sessionStorage.getItem('rfpParsedData');
    const cachedFileName = sessionStorage.getItem('rfpFileName');
    
    if (cachedData && cachedFileName) {
      setParsedData(JSON.parse(cachedData));
      setFileName(cachedFileName);
      setShowSuccessIcon(true);
      setUploadedDocument(cachedFileName);
    }
  }, [setUploadedDocument]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setParsedData(null);
      setShowSuccessIcon(false);
    }
  };

  // Wipe session cache and local view, but leave Evidence Engine global state alone
  const handleReset = () => {
    setSelectedFile(null);
    setFileName(null);
    setParsedData(null);
    setShowSuccessIcon(false);
    sessionStorage.removeItem('rfpParsedData');
    sessionStorage.removeItem('rfpFileName');
  };

  const handleParse = async () => {
    if (!selectedFile) return;
    setIsParsing(true);
    setShowSuccessIcon(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const apiUrl = import.meta.env.VITE_API_URL || 'https://wash-ai.onrender.com';
      const response = await fetch(`${apiUrl}/api/parse-rfp`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server Error`);

      const liveData = await response.json();
      
      setIsParsing(false);
      setShowSuccessIcon(true);

      if (liveData.success && liveData.data && liveData.data.project_metadata) {
        const meta = liveData.data.project_metadata;
        
        const extractedPayload = {
          projectNumber: meta.reference_number || "NOT SPECIFIED",
          budget: meta.donor || "EXTRACTED DONOR MATRIX", 
          closingDate: meta.closing_date || "NOT SPECIFIED",
          outcomes: [
            `Project Title: ${meta.title || "Unknown WASH Project"}`,
            `Submission Target Email: ${meta.submission_email || "No email detected"}`
          ],
          // New endpoints ready for updated main.py schema
          contractValue: meta.contract_value || null,
          eligibility: meta.eligibility_criteria || null,
          duration: meta.project_duration || null,
          demographics: meta.target_demographics || null,
          deliverables: meta.key_deliverables || null
        };

        setParsedData(extractedPayload);
        
        // Cache data locally 
        sessionStorage.setItem('rfpParsedData', JSON.stringify(extractedPayload));
        sessionStorage.setItem('rfpFileName', selectedFile.name);

      } else {
        setParsedData(liveData);
      }
      setUploadedDocument(selectedFile.name);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to backend.");
      setIsParsing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      <style>
        {`
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUpFade {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Live RFP Extraction Engine</h1>
        <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>
          Upload tender documents for live backend parsing and data extraction.
        </p>
      </div>

      {/* Auto-fit responsive grid for mobile compatibility */}
      <div style={{ display: 'grid', gridTemplateColumns: parsedData ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', gap: '24px', alignItems: 'start', transition: 'all 0.5s ease' }}>
        
        {/* UPLOAD SECTION */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: theme.textPrimary, textTransform: 'uppercase' }}>Document Ingestion</h2>
          
          <div style={{ border: `2px dashed ${theme.border}`, borderRadius: '8px', padding: '40px 20px', textAlign: 'center', backgroundColor: '#0A0A0A', position: 'relative' }}>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
            />
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📄</div>
            {fileName ? (
              <div style={{ color: theme.accent, fontWeight: 700, fontSize: '1.1rem' }}>{fileName}</div>
            ) : (
              <div>
                <span style={{ color: theme.textSecondary, fontSize: '0.95rem' }}>Drag and drop your RFP document here, or </span>
                <span style={{ color: theme.accent, textDecoration: 'underline', fontWeight: 700 }}>browse</span>
                <span style={{ color: theme.textSecondary, fontSize: '0.95rem' }}> to upload.</span>
              </div>
            )}
          </div>

          {/* DYNAMIC BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'center', minHeight: '48px' }}>
            {showSuccessIcon ? (
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: theme.success, 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                animation: 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                boxShadow: `0 0 20px ${theme.success}80`
              }}>
                <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>✓</span>
              </div>
            ) : (
              <button 
                onClick={handleParse}
                disabled={!fileName || isParsing}
                style={{ 
                  width: '100%', padding: '14px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '6px', 
                  fontWeight: 800, letterSpacing: '0.5px', cursor: !fileName || isParsing ? 'not-allowed' : 'pointer', 
                  opacity: !fileName || isParsing ? 0.5 : 1, transition: 'all 0.2s',
                }}
              >
                {isParsing ? 'PROCESSING...' : 'EXTRACT DATA'}
              </button>
            )}
          </div>
        </div>

        {/* LIVE RESULTS SECTION */}
        {parsedData && (
          <div style={{ 
            backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', 
            display: 'flex', flexDirection: 'column', gap: '24px', 
            animation: 'slideUpFade 0.6s ease-out forwards' 
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${theme.success}`, borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div>
                  <div style={{ color: theme.success, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Extraction Complete</div>
                  <div style={{ color: theme.textSecondary, fontSize: '0.8rem' }}>Data parsed natively via Python Backend</div>
                </div>
              </div>
              <button 
                onClick={handleReset}
                style={{ padding: '6px 12px', backgroundColor: 'transparent', border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.danger; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.danger; }}
              >
                RESET PARSER
              </button>
            </div>

            {/* RESPONSIVE METADATA GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Project Number</div>
                <div style={{ fontSize: '0.95rem', color: theme.accent, fontWeight: 600 }}>{parsedData.projectNumber}</div>
              </div>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Donor Source</div>
                <div style={{ fontSize: '1.1rem', color: theme.textPrimary, fontWeight: 800 }}>{parsedData.budget}</div>
              </div>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Closing Date</div>
                <div style={{ fontSize: '0.95rem', color: theme.warning, fontWeight: 600 }}>{parsedData.closingDate}</div>
              </div>
              
              {/* NEW SUB-CARDS (Rendered conditionally if backend provides them) */}
              {parsedData.contractValue && (
                <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                  <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Contract Value</div>
                  <div style={{ fontSize: '1.1rem', color: theme.success, fontWeight: 800 }}>{parsedData.contractValue}</div>
                </div>
              )}

              {parsedData.duration && (
                <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                  <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Duration</div>
                  <div style={{ fontSize: '0.95rem', color: theme.textPrimary, fontWeight: 600 }}>{parsedData.duration}</div>
                </div>
              )}
            </div>

            {/* EXTRACTED OUTCOMES */}
            <div>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>Raw Extracted Outcomes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parsedData.outcomes && parsedData.outcomes.map((outcome: string, idx: number) => (
                  <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${theme.accent}`, backgroundColor: '#0A0A0A', fontSize: '0.85rem', color: theme.textPrimary, lineHeight: '1.5' }}>
                    {outcome}
                  </div>
                ))}
              </div>
            </div>

            {/* ADDITIONAL WASH FIELDS (Rendered conditionally) */}
            {parsedData.eligibility && (
              <div>
                <div style={{ fontSize: '0.8rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>Eligibility Criteria</div>
                <div style={{ padding: '12px', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: '#0A0A0A', fontSize: '0.85rem', color: theme.textPrimary, lineHeight: '1.5' }}>
                  {parsedData.eligibility}
                </div>
              </div>
            )}
            
            {parsedData.demographics && (
              <div>
                <div style={{ fontSize: '0.8rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>Target Demographics</div>
                <div style={{ padding: '12px', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: '#0A0A0A', fontSize: '0.85rem', color: theme.textPrimary, lineHeight: '1.5' }}>
                  {parsedData.demographics}
                </div>
              </div>
            )}

            {parsedData.deliverables && (
              <div>
                <div style={{ fontSize: '0.8rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>Key Deliverables</div>
                <div style={{ padding: '12px', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: '#0A0A0A', fontSize: '0.85rem', color: theme.textPrimary, lineHeight: '1.5' }}>
                  {parsedData.deliverables}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default RfpParser;