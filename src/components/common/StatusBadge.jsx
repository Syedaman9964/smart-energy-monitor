import React from 'react';

/**
 * StatusBadge - Standardized status pill with live pulsating dots
 * Refined Graphite + Soft Silver + Light Gold aesthetic
 */
export default function StatusBadge({ status = 'live', text, pulse = true, size = 'sm' }) {
  const configs = {
    live: {
      bg: 'var(--color-gold-surface, rgba(212, 175, 55, 0.08))',
      border: 'var(--color-gold-border, rgba(212, 175, 55, 0.3))',
      color: 'var(--color-gold, #d4af37)',
      dotColor: 'var(--color-gold, #d4af37)',
      defaultText: 'LIVE STREAM'
    },
    simulation: {
      bg: 'var(--bg-surface-secondary, rgba(255, 255, 255, 0.05))',
      border: 'var(--color-gold-border, rgba(212, 175, 55, 0.25))',
      color: 'var(--color-gold, #d4af37)',
      dotColor: 'var(--color-gold-light, #e5c875)',
      defaultText: 'SIMULATION MODE'
    },
    critical: {
      bg: 'var(--color-danger-bg, rgba(239, 68, 68, 0.12))',
      border: 'rgba(239, 68, 68, 0.32)',
      color: 'var(--color-danger, #ef4444)',
      dotColor: '#ef4444',
      defaultText: 'CRITICAL'
    },
    warning: {
      bg: 'var(--color-warning-bg, rgba(245, 158, 11, 0.12))',
      border: 'rgba(245, 158, 11, 0.32)',
      color: 'var(--color-warning, #f59e0b)',
      dotColor: '#f59e0b',
      defaultText: 'WARNING'
    },
    info: {
      bg: 'var(--color-info-bg, rgba(56, 189, 248, 0.12))',
      border: 'rgba(56, 189, 248, 0.3)',
      color: 'var(--color-info, #38bdf8)',
      dotColor: '#38bdf8',
      defaultText: 'INFO'
    },
    standby: {
      bg: 'var(--bg-surface-secondary, rgba(107, 114, 128, 0.12))',
      border: 'var(--border-subtle, rgba(255, 255, 255, 0.1))',
      color: 'var(--text-muted, #64748b)',
      dotColor: 'var(--text-muted, #64748b)',
      defaultText: 'STANDBY'
    }
  };

  const current = configs[status] || configs.info;
  const displayText = text || current.defaultText;
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: isSmall ? '0.7rem' : '0.78rem',
        fontWeight: 600,
        padding: isSmall ? '3px 9px' : '4px 11px',
        borderRadius: '999px',
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        userSelect: 'none'
      }}
    >
      <span
        style={{
          width: isSmall ? '6px' : '8px',
          height: isSmall ? '6px' : '8px',
          borderRadius: '50%',
          backgroundColor: current.dotColor,
          boxShadow: `0 0 6px ${current.dotColor}`,
          animation: pulse ? 'pulseGlow 2s infinite' : 'none',
          flexShrink: 0
        }}
      />
      {displayText}
    </span>
  );
}
