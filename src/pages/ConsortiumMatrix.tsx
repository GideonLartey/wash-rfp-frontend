import React, { useState } from 'react';

const ConsortiumMatrix: React.FC = () => {
  const theme = {
    surface: '#141414',
    textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3',
    border: '#262626',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    accent: '#3B82F6',
  };

  const [activeFilter, setActiveFilter] = useState('All Partners');

  const allPartners = [
    { name: 'Maji Safi Initiative', country: 'Kenya', specialty: 'Urban Sanitation', capacity: 2500000, risk: 'Low', score: 92 },
    { name: 'Sahel Water Alliance', country: 'Mali', specialty: 'Solar Boreholes', capacity: 800000, risk: 'Medium', score: 78 },
    { name: 'AquaDev Local', country: 'Bangladesh', specialty: 'Flood Resilience', capacity: 1200000, risk: 'Low', score: 88 },
    { name: 'Rural Hygiene Trust', country: 'Uganda', specialty: 'Behavior Change', capacity: 400000, risk: 'High', score: 61 },
  ];

  const filtered = allPartners.filter(p => {
    if (activeFilter === 'Low Risk') return p.risk === 'Low';
    if (activeFilter === 'High Capacity (>$1M)') return p.capacity >= 1000000;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Consortium Capability Matrix</h1>
        {/* RESTORED: The description text below the title */}
        <p style={{ color: theme.textSecondary, marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', maxWidth: '800px' }}>
          Evaluate and rank local NGO partners based on technical specialty, financial absorption capacity, and historical delivery risk for multi-country bids.
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {['All Partners', 'Low Risk', 'High Capacity (>$1M)'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              backgroundColor: activeFilter === f ? 'rgba(59, 130, 246, 0.1)' : '#141414',
              color: activeFilter === f ? theme.textPrimary : theme.textSecondary,
              border: `1px solid ${activeFilter === f ? theme.accent : theme.border}`,
              padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, transition: '0.2s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1F1F1F', color: theme.textSecondary, fontSize: '0.875rem' }}>
              <th style={{ padding: '16px 24px' }}>Organization</th>
              <th style={{ padding: '16px 24px' }}>Country</th>
              <th style={{ padding: '16px 24px' }}>Specialty</th>
              <th style={{ padding: '16px 24px' }}>Capacity</th>
              <th style={{ padding: '16px 24px' }}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Score: {p.score}%</div>
                </td>
                <td style={{ padding: '16px 24px', color: theme.textSecondary }}>{p.country}</td>
                <td style={{ padding: '16px 24px', color: theme.textSecondary }}>{p.specialty}</td>
                <td style={{ padding: '16px 24px', fontWeight: 600 }}>${(p.capacity / 1000000).toFixed(1)}M</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    backgroundColor: p.risk === 'Low' ? 'rgba(16,185,129,0.1)' : p.risk === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                    color: p.risk === 'Low' ? theme.success : p.risk === 'Medium' ? theme.warning : theme.danger, 
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 
                  }}>{p.risk}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsortiumMatrix;