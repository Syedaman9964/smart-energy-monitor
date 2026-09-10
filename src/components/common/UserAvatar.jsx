import React, { useState } from 'react';

/**
 * ============================================================================
 * WATTVISION — CENTRALIZED REUSABLE USER AVATAR COMPONENT
 * ============================================================================
 * Displays Syed Aman's authentic profile photo with subtle champagne-gold border
 * and gentle hover illumination, with automatic fallback to monogram initials.
 */
export default function UserAvatar({
  src = '/assets/syed-aman-avatar.png',
  alt = 'Syed Aman',
  initials = 'SA',
  size = 42,
  className = '',
  style = {},
  showBorder = true,
  showGlow = true,
  objectPosition = 'center'
}) {
  const [hasError, setHasError] = useState(false);

  // Fallback to stylized monogram if image fails or is absent
  if (!src || hasError) {
    return (
      <div
        className={`wattvision-user-avatar-fallback ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #222935 0%, #151920 100%)',
          color: 'var(--color-gold, #d4af37)',
          border: showBorder ? '1px solid var(--color-gold-border, rgba(212, 175, 55, 0.45))' : 'none',
          fontWeight: 700,
          fontSize: `${Math.max(11, Math.round(size * 0.36))}px`,
          letterSpacing: '0.04em',
          userSelect: 'none',
          boxSizing: 'border-box',
          ...style
        }}
        aria-label={alt}
        title={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`wattvision-user-avatar-wrap ${showGlow ? 'has-glow' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        boxSizing: 'border-box',
        ...style
      }}
      title={alt}
    >
      <img
        src={src}
        alt={alt}
        className="wattvision-avatar-img"
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: objectPosition,
          border: showBorder ? '1px solid var(--color-gold-border, rgba(212, 175, 55, 0.45))' : 'none',
          display: 'block',
          boxSizing: 'border-box',
          transition: 'box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
    </div>
  );
}
