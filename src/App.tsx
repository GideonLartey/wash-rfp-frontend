import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EvidenceEngine from './pages/EvidenceEngine';
import ConsortiumMatrix from './pages/ConsortiumMatrix';
import SystemsModeler from './pages/SystemsModeler';
import ClimatePredictor from './pages/ClimatePredictor';
import MonteCarloSimulator from './pages/MonteCarloSimulator';
import RfpParser from './pages/RfpParser';
import Login from './pages/Login';

const App: React.FC = () => {
  // Global Pipeline State
  const [sharedVolatility, setSharedVolatility] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  
  // Master tracking key to reset the ingestion components dynamically from the outside
  const [parserResetKey, setParserResetKey] = useState(0);

  // Global Evidence Engine Memory
  const [evidenceQuery, setEvidenceQuery] = useState("");
  const [evidenceResults, setEvidenceResults] = useState<any[] | null>(null);

  // Clear system helper function - increments key to dismantle and rebuild the parser dropzone fresh
  const handleWipeRfpEngine = () => {
    setUploadedDocument(null);
    setParserResetKey(prev => prev + 1);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* RFP Parser Layout Injection */}
          <Route 
            path="rfp-parser" 
            element={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {uploadedDocument && (
                  <button
                    onClick={handleWipeRfpEngine}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '8px 16px',
                      backgroundColor: '#262626',
                      color: '#F5F5F5',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#262626'; e.currentTarget.style.borderColor = '#333'; }}
                  >
                    🗑️ RESET SYSTEM & UPLOAD NEW
                  </button>
                )}
                
                <RfpParser 
                  key={parserResetKey}
                  setUploadedDocument={setUploadedDocument} 
                />
              </div>
            } 
          />
          
          {/* Pass the global memory down into the Evidence Engine */}
          <Route 
            path="evidence" 
            element={
              <EvidenceEngine 
                queuedDocument={uploadedDocument}
                globalQuery={evidenceQuery}
                setGlobalQuery={setEvidenceQuery}
                globalResults={evidenceResults}
                setGlobalResults={setEvidenceResults}
              />
            } 
          />
          
          <Route path="climate" element={<ClimatePredictor setSharedVolatility={setSharedVolatility} />} />
          <Route path="consortium" element={<ConsortiumMatrix />} />
          <Route path="systems" element={<SystemsModeler />} />
          <Route 
            path="monte-carlo" 
            element={
              <MonteCarloSimulator 
                initialVolatility={sharedVolatility} 
                clearVolatility={() => setSharedVolatility(null)} 
              />
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;