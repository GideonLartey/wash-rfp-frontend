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
import MasterReport from './pages/MasterReport'; 
import LogFrameMatrix from './pages/LogFrameMatrix'; 

const App: React.FC = () => {
  // Global Analytics State
  const [sharedVolatility, setSharedVolatility] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [liveContext, setLiveContext] = useState<any>(null);
  
  // Global Evidence Engine Memory
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const [evidenceQuery, setEvidenceQuery] = useState("");
  const [evidenceResults, setEvidenceResults] = useState<any[] | null>(null);

  // Global Pipeline for Extracted Document Data
  const [extractedRfp, setExtractedRfp] = useState<any>(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Parser pushes data into global pipeline */}
          <Route 
            path="rfp-parser" 
            element={
              <RfpParser 
                setUploadedDocument={setUploadedDocument} 
                setExtractedRfp={setExtractedRfp} 
              />
            } 
          />
          
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
          
          {/* Predictor reads data */}
          <Route 
            path="climate" 
            element={
              <ClimatePredictor 
                setSharedVolatility={setSharedVolatility} 
                setLiveContext={setLiveContext} 
                extractedRfp={extractedRfp}
              />
            } 
          />
          
          <Route path="consortium" element={<ConsortiumMatrix />} />
          <Route path="systems" element={<SystemsModeler liveContext={liveContext} />} />
          <Route 
            path="monte-carlo" 
            element={
              <MonteCarloSimulator 
                initialVolatility={sharedVolatility} 
                clearVolatility={() => setSharedVolatility(null)} 
              />
            } 
          />
          <Route path="master-report" element={<MasterReport />} />
          
          {/* Automated LogFrame Matrix */}
          <Route path="logframe" element={<LogFrameMatrix />} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;