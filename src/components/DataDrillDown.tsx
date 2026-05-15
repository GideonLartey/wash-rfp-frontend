import React, { useState } from 'react';

// Define data 
interface DataDrillDownProps {
  partnerName: string;
  activePrograms: number;
  ytdDisbursement: string;
  totalBudget: string;
  riskStatus: string;
  riskColor: string;
  nextAuditDate: string;
}

// Components accepts those properties
const DataDrillDown: React.FC<DataDrillDownProps> = ({
  partnerName,
  activePrograms,
  ytdDisbursement,
  totalBudget,
  riskStatus,
  riskColor,
  nextAuditDate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', highlight: '#1F1F1F'
  };

  return (
    <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isOpen ? theme.highlight : 'transparent', transition: 'background-color 0.3s' }}
      >
        <div>
          
          <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: '1.1rem' }}>{partnerName}</h3>
          
          <p style={{ margin: '4px 0 0 0', color: theme.textSecondary, fontSize: '0.85rem' }}>Active WASH Programs: {activePrograms}</p>
        </div>
        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: theme.accent, fontSize: '1.2rem' }}>
          ▼
        </div>
      </div>

      
      <div style={{ 
        maxHeight: isOpen ? '200px' : '0px', 
        opacity: isOpen ? 1 : 0, 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
        backgroundColor: '#0A0A0A' 
      }}>
        <div style={{ padding: '20px', borderTop: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: theme.textSecondary }}>YTD Disbursement:</span>
            
            <span style={{ color: theme.textPrimary, fontWeight: 700 }}>{ytdDisbursement} / {totalBudget}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: theme.textSecondary }}>Risk Status:</span>
            
            <span style={{ color: riskColor, fontWeight: 700 }}>{riskStatus}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: theme.textSecondary }}>Next Audit Date:</span>
            
            <span style={{ color: theme.textPrimary, fontWeight: 700 }}>{nextAuditDate}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DataDrillDown;