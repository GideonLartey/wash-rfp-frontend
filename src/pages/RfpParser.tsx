import React, { useState } from 'react';

interface RfpParserProps {
  setUploadedDocument: (doc: string | null) => void;
}

const RfpParser: React.FC<RfpParserProps> = ({ setUploadedDocument }) => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', 
    warning: '#F59E0B', highlight: 'rgba(59, 130, 246, 0.1)'
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [parsedData, setParsedData] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setParsedData(null);
      setShowSuccessIcon(false);
    }
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
      
      // Stop parsing spinner AND trigger the green success checkmark animation
      setIsParsing(false);
      setShowSuccessIcon(true);

      // Wait 1 second THEN slide in the data
      setTimeout(() => {
        setParsedData(liveData);
        setUploadedDocument(selectedFile.name);
      }, 1000);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to backend.");
      setIsParsing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      {/* ANIMATION KEYFRAMES */}
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

      <div style={{ display: 'grid', gridTemplateColumns: parsedData ? '1fr 2fr' : '1fr', gap: '24px', alignItems: 'start', transition: 'all 0.5s ease' }}>
        
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
            {selectedFile ? (
              <div style={{ color: theme.accent, fontWeight: 700, fontSize: '1.1rem' }}>{selectedFile.name}</div>
            ) : (
              <div>
                <span style={{ color: theme.textSecondary, fontSize: '0.95rem' }}>Drag and drop your RFP document here, or </span>
                <span style={{ color: theme.accent, textDecoration: 'underline', fontWeight: 700 }}>browse</span>
                <span style={{ color: theme.textSecondary, fontSize: '0.95rem' }}> to upload.</span>
              </div>
            )}
          </div>

          {/* DYNAMIC BUTTON WITH ANIMATION */}
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
                disabled={!selectedFile || isParsing}
                style={{ 
                  width: '100%', padding: '14px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '6px', 
                  fontWeight: 800, letterSpacing: '0.5px', cursor: !selectedFile || isParsing ? 'not-allowed' : 'pointer', 
                  opacity: !selectedFile || isParsing ? 0.5 : 1, transition: 'all 0.2s',
                }}
              >
                {isParsing ? 'PROCESSING...' : 'EXTRACT DATA'}
              </button>
            )}
          </div>
        </div>

        {/* LIVE RESULTS SECTION WITH SLIDE ANIMATION */}
        {parsedData && (
          <div style={{ 
            backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', 
            display: 'flex', flexDirection: 'column', gap: '24px', 
            animation: 'slideUpFade 0.6s ease-out forwards' 
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${theme.success}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <div>
                <div style={{ color: theme.success, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Extraction Complete</div>
                <div style={{ color: theme.textSecondary, fontSize: '0.8rem' }}>Data parsed natively via Python Backend</div>
              </div>
            </div>

            {/* METADATA GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Project Number</div>
                <div style={{ fontSize: '0.95rem', color: theme.accent, fontWeight: 600 }}>{parsedData.projectNumber}</div>
              </div>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Budget Extracted</div>
                <div style={{ fontSize: '1.1rem', color: theme.textPrimary, fontWeight: 800 }}>{parsedData.budget}</div>
              </div>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', backgroundColor: '#0A0A0A' }}>
                <div style={{ fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Closing Date</div>
                <div style={{ fontSize: '0.95rem', color: theme.warning, fontWeight: 600 }}>{parsedData.closingDate}</div>
              </div>
            </div>

            {/* EXTRACTED OUTCOMES */}
            <div>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>Raw Extracted Outcomes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parsedData.outcomes.map((outcome: string, idx: number) => (
                  <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${theme.accent}`, backgroundColor: '#0A0A0A', fontSize: '0.85rem', color: theme.textPrimary, lineHeight: '1.5' }}>
                    {outcome}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default RfpParser;