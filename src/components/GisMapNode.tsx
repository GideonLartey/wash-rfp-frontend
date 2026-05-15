import React, { useState } from 'react';

const GisMapNode: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const accentColor = '#3B82F6';

  return (
    
    <div 
      style={{ position: 'relative', display: 'inline-block', fontFamily: "'Instrument Sans', sans-serif" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* KEYFRAMES FOR RADAR PULSE */}
      <style>
        {`
          @keyframes radarPulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(3.5); opacity: 0; }
          }
        `}
      </style>

      {/* THE RADAR RING (Animated) */}
      <div style={{
        position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
        borderRadius: '50%', border: `2px solid ${accentColor}`,
        animation: 'radarPulse 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)'
      }} />

      {/* THE CENTER DOT (Static) */}
      <div style={{
        width: '12px', height: '12px', backgroundColor: accentColor,
        borderRadius: '50%', position: 'relative', zIndex: 2, cursor: 'pointer',
        boxShadow: `0 0 10px ${accentColor}`
      }} />

      {/* THE HOVER TOOLTIP (Animated Slide/Fade) */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px',
        padding: '12px', width: '200px', pointerEvents: 'none',
        // Animation physics for the tooltip
        opacity: isHovered ? 1 : 0,
        visibility: isHovered ? 'visible' : 'hidden',
        marginTop: isHovered ? '0px' : '10px',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Active Site</div>
        <div style={{ color: '#F5F5F5', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>Sahel Solar Borehole</div>
        <div style={{ color: '#A3A3A3', fontSize: '0.8rem' }}>Yield: 45L/min</div>
      </div>

    </div>
  );
};

export default GisMapNode;