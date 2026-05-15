import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981'
  };

  const navItems = [
    { path: '/', label: 'Command Center', icon: '📊' },
    { path: '/rfp-parser', label: 'Bid Shredder', icon: '📄' },
    { path: '/evidence', label: 'Evidence Engine', icon: '🧠' },
    { path: '/climate', label: 'Climate Predictor', icon: '🌍' },
    { path: '/consortium', label: 'Consortium Matrix', icon: '🤝' },
    { path: '/systems', label: 'Systems Modeler', icon: '⚙️' },
    { path: '/monte-carlo', label: 'Risk Simulator', icon: '🎲' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0A0A0A', color: theme.textPrimary, fontFamily: "'Instrument Sans', sans-serif", overflow: 'hidden' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <div style={{ 
        width: isCollapsed ? '88px' : '280px', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        backgroundColor: theme.surface, 
        borderRight: `1px solid ${theme.border}`, 
        display: 'flex', 
        flexDirection: 'column',
        flexShrink: 0
      }}>
        
        {/* Branding & Collapse Toggle */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{ padding: '24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <div style={{ width: '32px', height: '32px', minWidth: '32px', backgroundColor: theme.accent, borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>W</div>
          {!isCollapsed && <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>OpenWSH</span>}
        </div>
        
        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: isCollapsed ? '24px 12px' : '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {!isCollapsed && <div style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px', whiteSpace: 'nowrap' }}>Analytics Modules</div>}
          
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              title={isCollapsed ? item.label : ""} 
              style={{ 
                textDecoration: 'none', 
                padding: '12px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                color: location.pathname === item.path ? '#fff' : theme.textSecondary,
                backgroundColor: location.pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: `1px solid ${location.pathname === item.path ? theme.accent : 'transparent'}`,
                fontWeight: 600,
                transition: '0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer info & Copyright - UPDATED COMPACT DESIGN */}
        <div style={{ padding: isCollapsed ? '16px 12px' : '16px 24px', borderTop: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: isCollapsed ? 'center' : 'flex-start' }}>
          <div style={{ fontSize: '0.65rem', color: theme.textSecondary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            {isCollapsed ? 'v2.4' : 'v2.4.1 (Enterprise)'}
          </div>
          {!isCollapsed && (
            <div style={{ fontSize: '0.75rem', color: theme.textSecondary, opacity: 0.8, whiteSpace: 'nowrap' }}>
              &copy; 2026 WaterAid. All rights reserved.
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP HEADER */}
        <div style={{ height: '80px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', backgroundColor: '#0A0A0A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Operations Portal</span>
            <span style={{ padding: '4px 8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: theme.success, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>LIVE TENDER TRACKING</span>
          </div>
          
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button 
              style={{ padding: '10px 24px', backgroundColor: 'transparent', border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }} 
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accent; e.currentTarget.style.color = '#fff'; }} 
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.accent; }}
            >
              GAIN ACCESS / REGISTER
            </button>
          </Link>
        </div>

        {/* PAGE CONTENT RENDERS HERE */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;