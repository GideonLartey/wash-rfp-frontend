import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Track screen size for the "Clean Slate" mobile layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const theme = {
    surface: '#141414', border: '#262626', textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3', accent: '#3B82F6', success: '#10B981'
  };

  const handleSSOLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      navigate('/'); 
    }, 2000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', backgroundColor: '#0A0A0A', fontFamily: "'Instrument Sans', sans-serif" }}>
      
      {/* BRANDING & VALUE PROP (Hidden entirely on mobile for the Clean Slate look) */}
      {!isMobile && (
        <div style={{ flex: 1, borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', padding: '60px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ zIndex: 10 }}>
            
            {/* Logo and Go Back Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: theme.accent, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, color: '#fff', fontSize: '1.2rem' }}>W</div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: theme.textPrimary, letterSpacing: '1px' }}>OpenWSH</h1>
              </div>
              
              {/* GO BACK BUTTON */}
              <button 
                onClick={() => navigate(-1)} 
                style={{ background: 'none', border: `1px solid ${theme.border}`, padding: '8px 16px', borderRadius: '6px', color: theme.textSecondary, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.textPrimary; e.currentTarget.style.borderColor = theme.textSecondary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.borderColor = theme.border; }}
              >
                &larr; Go Back
              </button>
            </div>

            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: theme.textPrimary, lineHeight: 1.1, maxWidth: '500px' }}>
              Strategic Intelligence for Global Operations.
            </h2>
            <p style={{ color: theme.textSecondary, fontSize: '1.2rem', marginTop: '24px', maxWidth: '450px', lineHeight: 1.5 }}>
              Securely interfacing with historical project data, real-time donor APIs, and context-adaptive technical frameworks.
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(10,10,10,0) 70%)', zIndex: 1 }} />
        </div>
      )}

      {/* AUTHENTICATION FORM */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '24px' : '40px', position: 'relative' }}>
        
        {/* Mobile-Only Header (Preserves navigation when the left branding is hidden) */}
        {isMobile && (
          <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: theme.accent, borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, color: '#fff', fontSize: '1rem' }}>W</div>
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              &larr; Back
            </button>
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: isMobile ? '40px' : '0' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>Enterprise Access</h3>
            <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.9rem' }}>Authenticate to access the WaterAid secure intranet and global Vector Database.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <button 
              onClick={handleSSOLogin}
              disabled={isAuthenticating}
              style={{ padding: '16px', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '1rem', fontWeight: 700, cursor: isAuthenticating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: '0.2s' }}
            >
              {isAuthenticating ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: `2px solid ${theme.textSecondary}`, borderTopColor: theme.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Verifying Identity Token...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0H0V10H10V0Z" fill="#F25022"/><path d="M21 0H11V10H21V0Z" fill="#7FBA00"/><path d="M10 11H0V21H10V11Z" fill="#00A4EF"/><path d="M21 11H11V21H21V11Z" fill="#FFB900"/></svg>
                  Sign in with Microsoft Azure SSO
                </>
              )}
            </button>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: theme.textSecondary, fontSize: '0.8rem', fontWeight: 600, margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }} /> OR <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }} />
            </div>

            <button disabled style={{ padding: '16px', backgroundColor: 'transparent', border: `1px dashed ${theme.border}`, borderRadius: '8px', color: theme.textSecondary, fontSize: '0.9rem', fontWeight: 600, cursor: 'not-allowed' }}>
              External Partner Login (Restricted)
            </button>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: `1px solid ${theme.success}`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.success, textTransform: 'uppercase' }}>Zero-Trust Architecture Enabled</div>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: '2px' }}>End-to-end encryption active. Session will timeout after 15 minutes of inactivity.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;