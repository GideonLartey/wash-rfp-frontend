import React, { useState, useEffect } from 'react';

interface EvidenceEngineProps {
  queuedDocument?: string | null;
  globalQuery: string;
  setGlobalQuery: (query: string) => void;
  globalResults: any[] | null;
  setGlobalResults: (results: any[] | null) => void;
}

const EvidenceEngine: React.FC<EvidenceEngineProps> = ({ 
  queuedDocument, 
  globalQuery, 
  setGlobalQuery, 
  globalResults, 
  setGlobalResults 
}) => {
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', highlight: '#1F1F1F'
  };

  const [isSearching, setIsSearching] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  
  const [searchProgress, setSearchProgress] = useState(0);

  const statusMessages = [
    "Initializing NLP Pipeline & Chunking Input...",
    "Generating Vector Embeddings (text-embedding-ada-002)...",
    "Querying Vector Database (Pinecone) via gRPC...",
    "Calculating Cosine Similarity across historical bids...",
    "Re-ranking semantic matches and applying filters...",
    "Synthesizing Evidence & Generating Citations..."
  ];

  useEffect(() => {
    if (queuedDocument && !globalQuery) {
      setGlobalQuery(`[Auto-Extracted Context from: ${queuedDocument}]\nInitiating semantic match against historical enterprise data...`);
    }
  }, [queuedDocument, globalQuery, setGlobalQuery]);

  const triggerVerification = () => {
    if (!globalQuery.trim()) return;
    setIsSearching(true);
    setGlobalResults(null);
    setStatusIndex(0);
    setSearchProgress(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statusMessages.length) {
        setStatusIndex(currentStep);
        setSearchProgress((currentStep / statusMessages.length) * 100);
      } else {
        clearInterval(interval);
        setIsSearching(false);
        setGlobalResults([
          { id: 1, title: "FCDO Resilience Bid (2023)", match: "96%", date: "2023", summary: "Contains highly relevant technical framework for solar borehole implementations in arid regions." },
          { id: 2, title: "Mali End-Line Survey (2024)", match: "92%", date: "2024", summary: "Evidence on community tariff adoption rates which directly supports your proposed governance structure." }
        ]);
        setSearchProgress(100);
      }
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Evidence Engine & Context Verification</h1>
        <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>
          Verify extracted donor requirements against WaterAid's historical enterprise data.
        </p>
      </div>

      {/* TOP: SEARCH VERIFICATION BAR */}
      <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Title changed to SEARCH */}
          <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: theme.textPrimary, textTransform: 'uppercase' }}>SEARCH</h2>
          <span style={{ fontSize: '0.7rem', color: theme.textSecondary, backgroundColor: theme.highlight, padding: '4px 8px', borderRadius: '4px' }}>Unlimited Characters Allowed</span>
        </div>
        
        <textarea 
          placeholder="Type or paste context here..."
          value={globalQuery}
          onChange={(e) => setGlobalQuery(e.target.value)}
          disabled={isSearching}
          // minHeight increased to 120px
          style={{ width: '100%', minHeight: '120px', backgroundColor: '#0A0A0A', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, padding: '12px', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={triggerVerification}
            disabled={isSearching || !globalQuery.trim()}
            style={{ padding: '10px 24px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: isSearching || !globalQuery.trim() ? 'not-allowed' : 'pointer', opacity: isSearching || !globalQuery.trim() ? 0.5 : 1 }}
          >
            {isSearching ? 'PROCESSING...' : 'VERIFY CONTEXT'}
          </button>
        </div>
      </div>

      {/* BOTTOM: SPLIT VIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: PDF Viewer */}
        {/* Height reduced to 480px */}
        <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '480px' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, backgroundColor: '#0D0D0D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase' }}>Active Document</span>
            <span style={{ fontSize: '0.8rem', color: theme.accent, fontWeight: 700 }}>{queuedDocument || 'No Document Queued'}</span>
          </div>
          <div style={{ flex: 1, backgroundColor: '#1A1A1A', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px', position: 'relative' }}>
            {queuedDocument ? (
               // Simulated Front Page
               <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: '4px', padding: '30px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                 
                 <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#333', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                   Official Tender Document
                 </div>
                 
                 <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', textAlign: 'center', marginBottom: '16px', lineHeight: 1.3, wordBreak: 'break-word' }}>
                   {queuedDocument}
                 </div>
                 
                 <div style={{ width: '100%', height: '2px', backgroundColor: '#e5e7eb', marginBottom: '24px' }} />
                 
                 <div style={{ width: '80%', height: '8px', backgroundColor: '#e5e7eb', marginBottom: '12px' }} />
                 <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', marginBottom: '12px' }} />
                 <div style={{ width: '90%', height: '8px', backgroundColor: '#f3f4f6', marginBottom: '24px' }} />
                 
                 <div style={{ width: '60%', height: '8px', backgroundColor: '#e5e7eb', marginBottom: '12px' }} />
                 <div style={{ width: '95%', height: '8px', backgroundColor: '#f3f4f6', marginBottom: '12px' }} />
                 
                 <div style={{ flex: 1 }} />
                 <div style={{ fontSize: '0.6rem', color: '#9ca3af', textAlign: 'center' }}>Cover Page Extraction</div>

                 {isSearching && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'rgba(59, 130, 246, 0.5)', boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.5)', animation: 'scan 2s linear infinite' }} />
                 )}
               </div>
            ) : (
               <div style={{ color: theme.textSecondary, fontSize: '0.9rem' }}>Awaiting document ingestion from RFP Parser.</div>
            )}
            <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
          </div>
        </div>

        {/* RIGHT COLUMN: RAG Loader & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          {!isSearching && !globalResults && (
            <div style={{ flex: 1, border: `2px dashed ${theme.border}`, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.textSecondary, padding: '40px', textAlign: 'center' }}>
                Engine idle. Enter context or process an RFP to retrieve enterprise evidence.
            </div>
          )}

          {isSearching && (
            <div style={{ flex: 1, backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
              {/* Size increased from 60px to 80px */}
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ position: 'absolute', inset: 0, border: `4px solid ${theme.border}`, borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: 0, border: `4px solid transparent`, borderTopColor: theme.accent, borderRightColor: theme.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                {/* Font size inside circle increased slightly to 0.85rem */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: theme.accent }}>{Math.round(searchProgress)}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: theme.success, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '8px' }}>RAG Pipeline Active</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: theme.textPrimary, fontFamily: 'monospace' }}>&gt; {statusMessages[statusIndex]}</div>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: theme.border, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${searchProgress}%`, backgroundColor: theme.accent, transition: 'width 0.5s ease-in-out' }} />
              </div>
            </div>
          )}

          {globalResults && !isSearching && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${theme.success}`, borderRadius: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                <div>
                  <div style={{ color: theme.success, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Database Query Complete</div>
                  <div style={{ color: theme.textSecondary, fontSize: '0.8rem', marginTop: '2px' }}>Retrieved top 2 historical assets.</div>
                </div>
              </div>
              {globalResults.map((result, i) => (
                <div key={i} style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', backgroundColor: theme.highlight, padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>Past Proposal</span>
                    <span style={{ fontSize: '0.7rem', color: theme.success, fontWeight: 800 }}>{result.match} Match</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{result.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.5 }}>{result.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceEngine;