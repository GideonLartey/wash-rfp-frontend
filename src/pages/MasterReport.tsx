import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MasterReport: React.FC = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState<any>({});
  const [cmFilter, setCmFilter] = useState<string>('All Partners');

  // The Dark theme for the UI wrapper (so it matches the rest of the site)
  const appTheme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6'
  };

  // The Light Theme specifically for the PDF document
  const printTheme = {
    surface: '#FFFFFF',
    bgLight: '#F9FAFB',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    accent: '#2563EB',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626'
  };

  // Pull all data from session storage on load
  useEffect(() => {
    const rfp = JSON.parse(sessionStorage.getItem('rfpParsedData') || 'null');
    const cp = JSON.parse(sessionStorage.getItem('cp_state') || 'null');
    const sm = JSON.parse(sessionStorage.getItem('sm_state') || 'null');
    const mc = JSON.parse(sessionStorage.getItem('mc_state') || 'null');
    const filter = sessionStorage.getItem('cm_filter') || 'All Partners';
    
    setReportData({ rfp, cp, sm, mc });
    setCmFilter(filter);
  }, []);

  // --- RECREATE LOGIC FOR FULL DETAIL RENDERING --- //

  // 1. Climate Logic
  let cpModel = ""; let cpSpecs: string[] = []; let cpRisk = "";
  if (reportData.cp && reportData.cp.environment && reportData.cp.climateRisk) {
    if (reportData.cp.environment === 'Rural') {
      if (reportData.cp.climateRisk === 'Drought') {
        cpModel = "Deep-Aquifer Solar Pumping Network";
        cpSpecs = ["150m+ deep boreholes to bypass seasonal surface water depletion.", "Decentralized solar micro-grids with battery redundancy.", "Community-managed tariff structure via mobile money."];
      } else {
        cpModel = "Elevated Rainwater Harvesting Hubs";
        cpSpecs = ["Flood-resistant elevated storage tanks.", "Bio-sand filtration systems.", "Point-of-use chlorination distribution."];
      }
    } else {
      if (reportData.cp.climateRisk === 'Flood') {
        cpModel = "Containerized Decentralized Sanitation (FSM)";
        cpSpecs = ["Raised, sealed bio-digesters to prevent overflow during heavy rains.", "Vacuum truck access routes mapped for sludge removal.", "Integration with municipal waste treatment grids."];
      } else {
        cpModel = "Utility-Managed Smart Kiosk Grid";
        cpSpecs = ["Pre-paid smart water ATMs.", "Pressure-managed pipe networks to reduce non-revenue water.", "Public-private utility partnerships."];
      }
    }
    if (reportData.cp.targetPopulation > 500000) {
      cpSpecs.push("National-level SCADA IoT monitoring.");
      cpRisk = "HIGH CAPEX - Requires blended finance (Grants + Sovereign Loans)";
    } else if (reportData.cp.targetPopulation > 100000) {
      cpSpecs.push("District-level IoT sensor dashboard for predictive maintenance.");
      cpRisk = "MEDIUM CAPEX - Suitable for large bilateral donor grants";
    } else {
      cpSpecs.push("Local hand-pump mechanic network with SMS reporting.");
      cpRisk = "LOW CAPEX - Suitable for foundation/trust pilot funding";
    }
  }

  // 2. Systems Modeler Logic
  let smScore = 0;
  if (reportData.sm) {
    const govAvg = (reportData.sm.policy + reportData.sm.institutions + reportData.sm.finance + reportData.sm.monitoring) / 4;
    const gap = Math.abs(reportData.sm.infrastructure - govAvg);
    const base = (reportData.sm.policy + reportData.sm.institutions + reportData.sm.finance + reportData.sm.infrastructure + reportData.sm.monitoring) / 5;
    const penalty = gap > 30 ? (gap * 0.5) : 0; 
    smScore = Math.max(0, Math.min(100, Math.round(base - penalty)));
  }

  // 3. Consortium Logic
  const allPartners = [
    { name: 'Maji Safi Initiative', country: 'Kenya', specialty: 'Urban Sanitation', capacity: 2500000, risk: 'Low', score: 92 },
    { name: 'Sahel Water Alliance', country: 'Mali', specialty: 'Solar Boreholes', capacity: 800000, risk: 'Medium', score: 78 },
    { name: 'AquaDev Local', country: 'Bangladesh', specialty: 'Flood Resilience', capacity: 1200000, risk: 'Low', score: 88 },
    { name: 'Rural Hygiene Trust', country: 'Uganda', specialty: 'Behavior Change', capacity: 400000, risk: 'High', score: 61 },
  ];
  const filteredPartners = allPartners.filter(p => {
    if (cmFilter === 'Low Risk') return p.risk === 'Low';
    if (cmFilter === 'High Capacity (>$1M)') return p.capacity >= 1000000;
    return true;
  });

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
        filename:     'OpenWSH_Enterprise_Batch_Annex.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' }, 
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
      
      {/* EXPORT HEADER (Dark mode UI, excluded from PDF capture) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: `1px solid ${appTheme.accent}`, padding: '20px', borderRadius: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: appTheme.textPrimary }}>Enterprise Batch Export</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: appTheme.textSecondary, marginTop: '4px' }}>This page aggregates full session data into a professional white-background PDF.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${appTheme.border}`, color: appTheme.textPrimary, borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Back to Dashboard</button>
          <button onClick={handleExport} disabled={isExporting} style={{ padding: '10px 20px', backgroundColor: appTheme.accent, color: '#fff', border: 'none', borderRadius: '6px', cursor: isExporting ? 'wait' : 'pointer', fontWeight: 800 }}>
            {isExporting ? 'GENERATING PDF...' : 'DOWNLOAD FULL ANNEX 📥'}
          </button>
        </div>
      </div>

      {/* THE ACTUAL DOCUMENT CAPTURED BY HTML2PDF */}
      <div id="master-report-pdf" style={{ backgroundColor: printTheme.surface, padding: '40px', display: 'flex', flexDirection: 'column', gap: '48px', color: printTheme.textPrimary }}>
        
        {/* Cover Section */}
        <div style={{ borderBottom: `4px solid ${printTheme.border}`, paddingBottom: '24px' }}>
          <div style={{ color: printTheme.accent, fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px' }}>OpenWSH Analytics</div>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 900, color: '#000' }}>Consolidated Strategy Annex</h1>
          <div style={{ marginTop: '16px', color: printTheme.textSecondary, fontSize: '1rem', fontWeight: 600 }}>Generated on: {new Date().toLocaleDateString()} | Master Batch Profile</div>
        </div>

        {/* 1. RFP Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', color: printTheme.accent, borderBottom: `2px solid ${printTheme.border}`, paddingBottom: '8px', margin: 0, fontWeight: 800 }}>1. Extracted Tender Profile</h2>
          {reportData.rfp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ border: `1px solid ${printTheme.border}`, borderRadius: '8px', padding: '16px', backgroundColor: printTheme.bgLight }}>
                  <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Project Number</div>
                  <div style={{ fontSize: '1rem', color: printTheme.textPrimary, fontWeight: 700 }}>{reportData.rfp.projectNumber}</div>
                </div>
                <div style={{ border: `1px solid ${printTheme.border}`, borderRadius: '8px', padding: '16px', backgroundColor: printTheme.bgLight }}>
                  <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Donor Source</div>
                  <div style={{ fontSize: '1rem', color: printTheme.textPrimary, fontWeight: 700 }}>{reportData.rfp.budget}</div>
                </div>
                <div style={{ border: `1px solid ${printTheme.border}`, borderRadius: '8px', padding: '16px', backgroundColor: printTheme.bgLight }}>
                  <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Closing Date</div>
                  <div style={{ fontSize: '1rem', color: printTheme.warning, fontWeight: 700 }}>{reportData.rfp.closingDate}</div>
                </div>
                <div style={{ border: `1px solid ${printTheme.border}`, borderRadius: '8px', padding: '16px', backgroundColor: printTheme.bgLight }}>
                  <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Contract Value</div>
                  <div style={{ fontSize: '1rem', color: printTheme.success, fontWeight: 700 }}>{reportData.rfp.contractValue || 'N/A'}</div>
                </div>
              </div>

              {/* Full Text Extractions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Extracted Outcomes</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {reportData.rfp.outcomes?.map((outcome: string, idx: number) => (
                      <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${printTheme.accent}`, backgroundColor: printTheme.bgLight, fontSize: '0.9rem', color: printTheme.textPrimary }}>{outcome}</div>
                    ))}
                  </div>
                </div>
                
                {reportData.rfp.eligibility && (
                  <div>
                    <div style={{ fontSize: '0.85rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Eligibility Criteria</div>
                    <div style={{ padding: '12px', border: `1px solid ${printTheme.border}`, borderRadius: '8px', fontSize: '0.9rem' }}>{reportData.rfp.eligibility}</div>
                  </div>
                )}

                {reportData.rfp.demographics && (
                  <div>
                    <div style={{ fontSize: '0.85rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Target Demographics</div>
                    <div style={{ padding: '12px', border: `1px solid ${printTheme.border}`, borderRadius: '8px', fontSize: '0.9rem' }}>{reportData.rfp.demographics}</div>
                  </div>
                )}

                {reportData.rfp.deliverables && (
                  <div>
                    <div style={{ fontSize: '0.85rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Key Deliverables</div>
                    <div style={{ padding: '12px', border: `1px solid ${printTheme.border}`, borderRadius: '8px', fontSize: '0.9rem' }}>{reportData.rfp.deliverables}</div>
                  </div>
                )}
              </div>
            </div>
          ) : <div style={{ color: printTheme.textSecondary, fontStyle: 'italic' }}>No RFP Data parsed in current session.</div>}
        </div>

        {/* 2. Climate & Tech */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', color: printTheme.accent, borderBottom: `2px solid ${printTheme.border}`, paddingBottom: '8px', margin: 0, fontWeight: 800 }}>2. Context-Adaptive Technical Framework</h2>
          {reportData.cp && reportData.cp.environment ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, padding: '16px', border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: printTheme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Environment</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{reportData.cp.environment}</div>
                </div>
                <div style={{ flex: 1, padding: '16px', border: `1px solid ${printTheme.danger}`, backgroundColor: 'rgba(220, 38, 38, 0.05)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: printTheme.danger, fontWeight: 700, textTransform: 'uppercase' }}>Climate Risk</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: printTheme.danger }}>{reportData.cp.climateRisk}</div>
                </div>
                <div style={{ flex: 1, padding: '16px', border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: printTheme.textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Target Population</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{reportData.cp.targetPopulation.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ padding: '24px', backgroundColor: printTheme.bgLight, border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: printTheme.textSecondary, textTransform: 'uppercase' }}>Recommended Technical Model</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: printTheme.textPrimary, marginBottom: '16px' }}>{cpModel}</div>
                
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: printTheme.accent }}>Framework Architecture</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: printTheme.textPrimary }}>
                  {cpSpecs.map((spec, i) => (<li key={i}>{spec}</li>))}
                </ul>

                <div style={{ marginTop: '24px', padding: '16px', border: `1px solid ${printTheme.warning}`, backgroundColor: '#FFFBEB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: printTheme.warning, textTransform: 'uppercase' }}>Financial Feasibility Profile</div>
                  <div style={{ fontSize: '0.9rem', color: printTheme.textPrimary, fontWeight: 700, marginTop: '4px' }}>{cpRisk}</div>
                </div>
              </div>
            </div>
          ) : <div style={{ color: printTheme.textSecondary, fontStyle: 'italic' }}>No Climate data defined in current session.</div>}
        </div>

        {/* 3. Systems Strengthening */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', color: printTheme.accent, borderBottom: `2px solid ${printTheme.border}`, paddingBottom: '8px', margin: 0, fontWeight: 800 }}>3. Systems Strengthening Projection</h2>
          {reportData.sm ? (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(reportData.sm).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '120px', textTransform: 'capitalize', fontWeight: 700, fontSize: '0.9rem' }}>
                      {key === 'institutions' ? 'Inst. Capacity' : key}
                    </div>
                    <div style={{ flex: 1, height: '12px', backgroundColor: printTheme.border, borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${value}%`, height: '100%', backgroundColor: printTheme.accent }}></div>
                    </div>
                    <div style={{ width: '40px', fontWeight: 800, fontSize: '0.9rem', textAlign: 'right' }}>{value as number}%</div>
                  </div>
                ))}
              </div>

              <div style={{ flex: 1, padding: '24px', border: `2px solid ${printTheme.border}`, borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: printTheme.textSecondary, fontWeight: 800, textTransform: 'uppercase' }}>10-Year Transformation Score</div>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: smScore >= 75 ? printTheme.success : smScore >= 50 ? printTheme.warning : printTheme.danger }}>{smScore}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 700 }}>Risk of Failure</div>
                    <div style={{ fontWeight: 800, color: smScore < 50 ? printTheme.danger : printTheme.textPrimary }}>{smScore < 50 ? 'HIGH' : smScore < 75 ? 'MEDIUM' : 'LOW'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary, textTransform: 'uppercase', fontWeight: 700 }}>Scale Potential</div>
                    <div style={{ fontWeight: 800, color: smScore >= 75 ? printTheme.success : printTheme.textPrimary }}>{smScore >= 75 ? 'NATIONAL' : 'LOCALIZED'}</div>
                  </div>
                </div>
              </div>

            </div>
          ) : <div style={{ color: printTheme.textSecondary, fontStyle: 'italic' }}>No Systems Modeler data in session.</div>}
        </div>

        {/* 4. Monte Carlo Forecast */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', color: printTheme.accent, borderBottom: `2px solid ${printTheme.border}`, paddingBottom: '8px', margin: 0, fontWeight: 800 }}>4. Stochastic Risk Modeling (Monte Carlo)</h2>
          {reportData.mc && reportData.mc.hasRun ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, padding: '16px', backgroundColor: printTheme.bgLight, border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ color: printTheme.textSecondary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Funding Reliability</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{reportData.mc.funding}%</div>
                </div>
                <div style={{ flex: 1, padding: '16px', backgroundColor: printTheme.bgLight, border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ color: printTheme.textSecondary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Governance Strength</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{reportData.mc.governance}%</div>
                </div>
                <div style={{ flex: 1, padding: '16px', backgroundColor: printTheme.bgLight, border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ color: printTheme.textSecondary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Climate Risk Setup</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{reportData.mc.volatility}</div>
                </div>
              </div>

              {/* Exact Visual Replication Based on View Choice - BULLETPROOF SVG FIX */}
              <div style={{ border: `1px solid ${printTheme.border}`, borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: printTheme.textPrimary, margin: 0 }}>Probability Density Forecast</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: printTheme.accent }}>VIEW: {reportData.mc.activeView.toUpperCase()}</span>
                </div>

                <div style={{ height: '120px', width: '100%', position: 'relative' }}>
                  {reportData.mc.activeView === 'path' ? (
                    <svg width="100%" height="100%" viewBox="0 0 280 100" preserveAspectRatio="none" style={{ backgroundColor: 'transparent' }}>
                      <line x1="0" y1="25" x2="280" y2="25" stroke={printTheme.border} strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="0" y1="75" x2="280" y2="75" stroke={printTheme.border} strokeWidth="2" strokeDasharray="4 4" />
                      <path 
                        d={reportData.mc.curvePath} 
                        fill="none" 
                        stroke={Number(reportData.mc.meanScore) > 60 ? printTheme.accent : (Number(reportData.mc.meanScore) > 40 ? printTheme.warning : printTheme.danger)} 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        style={{ fill: 'none' }}
                      />
                    </svg>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end', gap: '4px', borderBottom: `2px solid ${printTheme.border}`, position: 'relative' }}>
                       <div style={{ position: 'absolute', bottom: 0, left: '75%', top: 0, borderLeft: `2px dashed ${printTheme.success}` }} />
                       {[8, 15, 30, 45, 65, 90, 100, 70, 35, 12].map((height, i) => (
                         <div key={i} style={{ flex: 1, height: `${height}%`, backgroundColor: i >= 7 ? printTheme.success : printTheme.accent, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                       ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px', border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ color: printTheme.textSecondary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Expected Mean Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{reportData.mc.meanScore}</div>
                </div>
                <div style={{ padding: '16px', border: `2px solid ${Number(reportData.mc.probSuccess) < 60 ? printTheme.danger : (Number(reportData.mc.probSuccess) < 80 ? printTheme.warning : printTheme.success)}`, borderRadius: '8px' }}>
                  <div style={{ color: printTheme.textSecondary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Success Probability</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{reportData.mc.probSuccess}%</div>
                </div>
                <div style={{ padding: '16px', border: `1px solid ${printTheme.border}`, borderRadius: '8px' }}>
                  <div style={{ color: printTheme.textSecondary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Worst Case Forecast</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: printTheme.danger }}>{reportData.mc.worstCase}</div>
                </div>
              </div>
            </div>
          ) : <div style={{ color: printTheme.textSecondary, fontStyle: 'italic' }}>Simulation not yet run in current session.</div>}
        </div>

        {/* 5. Consortium Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', color: printTheme.accent, borderBottom: `2px solid ${printTheme.border}`, paddingBottom: '8px', margin: 0, fontWeight: 800 }}>5. Consortium Strategy Matrix</h2>
          <div style={{ fontSize: '0.9rem', color: printTheme.textSecondary, fontWeight: 700 }}>Applied Filter: <span style={{ color: printTheme.accent }}>{cmFilter}</span></div>
          
          <div style={{ border: `1px solid ${printTheme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: printTheme.bgLight, color: printTheme.textSecondary }}>
                  <th style={{ padding: '12px 16px', borderBottom: `2px solid ${printTheme.border}` }}>Organization</th>
                  <th style={{ padding: '12px 16px', borderBottom: `2px solid ${printTheme.border}` }}>Country</th>
                  <th style={{ padding: '12px 16px', borderBottom: `2px solid ${printTheme.border}` }}>Specialty</th>
                  <th style={{ padding: '12px 16px', borderBottom: `2px solid ${printTheme.border}` }}>Capacity</th>
                  <th style={{ padding: '12px 16px', borderBottom: `2px solid ${printTheme.border}` }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${printTheme.border}` }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: printTheme.textPrimary }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: printTheme.textSecondary }}>Score: {p.score}%</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: printTheme.textSecondary }}>{p.country}</td>
                    <td style={{ padding: '12px 16px', color: printTheme.textSecondary }}>{p.specialty}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>${(p.capacity / 1000000).toFixed(1)}M</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        backgroundColor: p.risk === 'Low' ? '#D1FAE5' : p.risk === 'Medium' ? '#FEF3C7' : '#FEE2E2', 
                        color: p.risk === 'Low' ? printTheme.success : p.risk === 'Medium' ? printTheme.warning : printTheme.danger, 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 
                      }}>{p.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MasterReport;