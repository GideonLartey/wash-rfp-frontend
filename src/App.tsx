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
  
  // Global Evidence Engine Memory
  const [evidenceQuery, setEvidenceQuery] = useState("");
  const [evidenceResults, setEvidenceResults] = useState<any[] | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rfp-parser" element={<RfpParser setUploadedDocument={setUploadedDocument} />} />
          
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