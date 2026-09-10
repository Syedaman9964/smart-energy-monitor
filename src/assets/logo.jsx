import React from 'react';

/**
 * WattVision Brand Vector Logo & Iconography
 * Graphite Grey + Light Gold Energy Emblem
 */
export function WattVisionLogo({ size = 32, showText = true, className = '' }) {
  return (
    <div
      className={`wattvision-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #222834 0%, #151921 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35), 0 0 12px rgba(212, 175, 55, 0.16)',
          flexShrink: 0
        }}
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-gold, #d4af37)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon
            points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
            fill="var(--color-gold, #d4af37)"
            fillOpacity="0.25"
          />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)'
            }}
          >
            WattVision
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-gold, #d4af37)',
              fontWeight: 600
            }}
          >
            Energy-Tech Suite
          </span>
        </div>
      )}
    </div>
  );
}
