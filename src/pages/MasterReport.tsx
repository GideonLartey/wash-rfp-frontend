import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MasterReport: React.FC = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState<any>({});

  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981', warning: '#F59E0B'
  };

  // Pull all data from session storage on load
  useEffect(() => {
    const rfp = JSON.parse(sessionStorage.getItem('rfpParsedData') || 'null');
    const cp = JSON.parse(sessionStorage.getItem('cp_state') || 'null');
    const sm = JSON.parse(sessionStorage.getItem('sm_state') || 'null');
    const mc = JSON.parse(sessionStorage.getItem('mc_state') || 'null');
    
    setReportData({ rfp, cp, sm, mc });
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (!(window as any).html2pdf) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const element = document.getElementById('master-report-pdf');
      const opt = {
        margin:       0.5,
        filename:     'OpenWSH_Enterprise_Annex.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0A0A0A' }, 
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await (window as any).html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      {/* EXPORT HEADER - Excluded from PDF capture */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: `1px solid ${theme.accent}`, padding: '20px', borderRadius: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: theme.textPrimary }}>Enterprise Report Generator</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: theme.textSecondary, marginTop: '4px' }}>This page aggregates session data from all modules for a clean batch export.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textPrimary, borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Back to Dashboard</button>
          <button onClick={handleExport} disabled={isExporting} style={{ padding: '10px 20px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '6px', cursor: isExporting ? 'wait' : 'pointer', fontWeight: 800 }}>
            {isExporting ? 'GENERATING PDF...' : 'DOWNLOAD FULL ANNEX 📥'}
          </button>
        </div>
      </div>

      {/* THE ACTUAL DOCUMENT CAPTURED BY HTML2PDF */}
      <div id="master-report-pdf" style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, padding: '40px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '32px', color: theme.textPrimary }}>
        
        {/* Cover Section */}
        <div style={{ borderBottom: `2px solid ${theme.border}`, paddingBottom: '24px' }}>
          <div style={{ color: theme.accent, fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px' }}>OpenWSH Analytics</div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>Consolidated Strategy Annex</h1>
          <div style={{ marginTop: '16px', color: theme.textSecondary, fontSize: '0.9rem' }}>Generated on: {new Date().toLocaleDateString()}</div>
        </div>

        {/* 1. RFP Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', color: theme.success, borderBottom: `1px dashed ${theme.border}`, paddingBottom: '8px', margin: 0 }}>1. Extracted Tender Profile</h2>
          {reportData.rfp ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><strong style={{ color: theme.textSecondary }}>Project Number:</strong> {reportData.rfp.projectNumber}</div>
              <div><strong style={{ color: theme.textSecondary }}>Donor:</strong> {reportData.rfp.budget}</div>
              <div><strong style={{ color: theme.textSecondary }}>Contract Value:</strong> {reportData.rfp.contractValue || 'N/A'}</div>
              <div><strong style={{ color: theme.textSecondary }}>Duration:</strong> {reportData.rfp.duration || 'N/A'}</div>
            </div>
          ) : <div style={{ color: theme.textSecondary, fontStyle: 'italic' }}>No RFP Data in session.</div>}
        </div>

        {/* 2. Climate & Tech */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', color: theme.success, borderBottom: `1px dashed ${theme.border}`, paddingBottom: '8px', margin: 0 }}>2. Climate & Context Model</h2>
          {reportData.cp ? (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><strong style={{ color: theme.textSecondary }}>Environment:</strong> {reportData.cp.environment}</div>
              <div><strong style={{ color: theme.textSecondary }}>Climate Risk:</strong> {reportData.cp.climateRisk}</div>
              <div><strong style={{ color: theme.textSecondary }}>Target Population:</strong> {reportData.cp.targetPopulation.toLocaleString()}</div>
            </div>
          ) : <div style={{ color: theme.textSecondary, fontStyle: 'italic' }}>No Climate data in session.</div>}
        </div>

        {/* 3. Systems Strengthening */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', color: theme.success, borderBottom: `1px dashed ${theme.border}`, paddingBottom: '8px', margin: 0 }}>3. Systems Strengthening Projection</h2>
          {reportData.sm ? (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div><strong style={{ color: theme.textSecondary }}>Policy:</strong> {reportData.sm.policy}%</div>
              <div><strong style={{ color: theme.textSecondary }}>Finance:</strong> {reportData.sm.finance}%</div>
              <div><strong style={{ color: theme.textSecondary }}>Infrastructure:</strong> {reportData.sm.infrastructure}%</div>
            </div>
          ) : <div style={{ color: theme.textSecondary, fontStyle: 'italic' }}>No Systems Modeler data in session.</div>}
        </div>

        {/* 4. Monte Carlo Forecast */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', color: theme.success, borderBottom: `1px dashed ${theme.border}`, paddingBottom: '8px', margin: 0 }}>4. Monte Carlo Risk Viability</h2>
          {reportData.mc && reportData.mc.hasRun ? (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px' }}>
                <div style={{ color: theme.textSecondary, fontSize: '0.8rem', textTransform: 'uppercase' }}>Expected Mean Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{reportData.mc.meanScore}</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px' }}>
                <div style={{ color: theme.textSecondary, fontSize: '0.8rem', textTransform: 'uppercase' }}>Success Probability</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{reportData.mc.probSuccess}%</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#0A0A0A', borderRadius: '8px' }}>
                <div style={{ color: theme.textSecondary, fontSize: '0.8rem', textTransform: 'uppercase' }}>Worst Case Forecast</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{reportData.mc.worstCase}</div>
              </div>
            </div>
          ) : <div style={{ color: theme.textSecondary, fontStyle: 'italic' }}>Simulation not yet run.</div>}
        </div>

      </div>
    </div>
  );
};

export default MasterReport;