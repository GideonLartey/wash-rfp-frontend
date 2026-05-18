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

const App: React.FC = () => {
  // Global Pipeline State
  const [sharedVolatility, setSharedVolatility] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  
  // Global Evidence Engine Memory
  const [evidenceQuery, setEvidenceQuery] = useState("");
  const [evidenceResults, setEvidenceResults] = useState<any[] | null>(null);

  // NEW: Global Live Context Memory
  const [liveContext, setLiveContext] = useState<any>(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rfp-parser" element={<RfpParser setUploadedDocument={setUploadedDocument} />} />
          
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
          
          {/* Give Climate Predictor the ability to SAVE the live data globally */}
          <Route 
            path="climate" 
            element={
              <ClimatePredictor 
                setSharedVolatility={setSharedVolatility} 
                setLiveContext={setLiveContext} 
              />
            } 
          />
          
          <Route path="consortium" element={<ConsortiumMatrix />} />
          
          {/* Give Systems Modeler the ability to READ the live data globally */}
          <Route 
            path="systems" 
            element={<SystemsModeler liveContext={liveContext} />} 
          />
          
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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;