import React, { useEffect, useState } from 'react';

/**
 * AnimatedNumber - Smooth spring/interpolation counter for numbers
 */
export default function AnimatedNumber({ value, decimals = 1, className = '', prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const targetValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const duration = 500; // ms

    if (Math.abs(startValue - targetValue) < 0.001) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value]);

  const formatted = typeof displayValue === 'number'
    ? displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    : displayValue;

  return (
    <span className={`font-mono ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
