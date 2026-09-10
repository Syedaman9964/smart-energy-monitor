import React from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  TrendingUp,
  Sparkles,
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function Slide9Prediction() {
  const weeklyData = [
    { day: 'Mon', val: 14.2, type: 'actual' },
    { day: 'Tue', val: 15.1, type: 'actual' },
    { day: 'Wed', val: 13.8, type: 'actual' },
    { day: 'Thu', val: 14.9, type: 'actual' },
    { day: 'Fri', val: 16.5, type: 'actual' },
    { day: 'Sat', val: 18.2, type: 'actual' },
    { day: 'Sun', val: 17.8, type: 'actual' },
    { day: 'Mon +1', val: 14.6, type: 'forecast' },
    { day: 'Tue +1', val: 15.3, type: 'forecast' },
    { day: 'Wed +1', val: 14.0, type: 'forecast' }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}>
        <Radio size={14} />
        <span>Predictive Intelligence</span>
      </div>

      <h2 className="pres-slide-title">
        Load Forecasting & Diurnal Regression
      </h2>

      <p className="pres-slide-subtitle">
        Holt-Winters double exponential smoothing combined with residential 24-hour diurnal cycle regression.
      </p>

      {/* SVG Historical vs Forecast Timeline */}
      <div className="pres-glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '18px', height: '3px', background: '#38bdf8', borderRadius: '2px' }} />
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Historical Consumption (Mon – Sun)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '18px', height: '3px', background: '#f59e0b', borderRadius: '2px', borderTop: '2px dashed #f59e0b' }} />
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Forecast Projection (Holt-Winters Diurnal)</span>
            </div>
          </div>

          <span className="metric-range-badge font-mono" style={{ fontSize: '0.72rem' }}>
            Confidence Margin: ± 8.0%
          </span>
        </div>

        {/* SVG Chart */}
        <div style={{ width: '100%', height: '140px' }}>
          <svg viewBox="0 0 700 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(255,255,255,0.05)" />
            <line x1="0" y1="70" x2="700" y2="70" stroke="rgba(255,255,255,0.05)" />
            <line x1="0" y1="110" x2="700" y2="110" stroke="rgba(255,255,255,0.05)" />

            {/* Vertical demarcation between actual and forecast */}
            <line x1="470" y1="0" x2="470" y2="120" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1.5" />
            <text x="475" y="18" fill="#f59e0b" fontSize="10" fontWeight="700">TODAY (FORECAST BOUNDARY)</text>

            {/* Actual Line (0 to 470) */}
            <path
              d="M 20 80 L 90 65 L 160 85 L 230 68 L 300 45 L 370 25 L 440 32"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* Forecast Confidence Band */}
            <path
              d="M 440 32 L 520 60 L 600 50 L 680 65 L 680 95 L 600 80 L 520 88 L 440 45 Z"
              fill="url(#forecastBand)"
            />

            {/* Forecast Line */}
            <path
              d="M 440 32 L 520 74 L 600 65 L 680 80"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />

            {/* Data Points */}
            {[
              { x: 20, y: 80, l: 'Mon' },
              { x: 90, y: 65, l: 'Tue' },
              { x: 160, y: 85, l: 'Wed' },
              { x: 230, y: 68, l: 'Thu' },
              { x: 300, y: 45, l: 'Fri' },
              { x: 370, y: 25, l: 'Sat' },
              { x: 440, y: 32, l: 'Sun' },
              { x: 520, y: 74, l: '+1d' },
              { x: 600, y: 65, l: '+2d' },
              { x: 680, y: 80, l: '+3d' }
            ].map((p, i) => (
              <g key={p.l}>
                <circle cx={p.x} cy={p.y} r={i < 7 ? 4 : 3.5} fill={i < 7 ? '#38bdf8' : '#f59e0b'} />
                <text x={p.x} y="118" textAnchor="middle" fill="#64748b" fontSize="10">
                  {p.l}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 3 Prediction Output Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="pres-glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)' }}>Predicted Monthly Consumption</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', margin: '0.35rem 0' }}>
            462.4 kWh
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Baseline 15.4 kWh / day trend
          </div>
        </div>

        <div className="pres-glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)' }}>Estimated Monthly Utility Bill</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.35rem 0' }}>
            ₹ 3,468.20
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Calculated via Indian DISCOM tiered slabs
          </div>
        </div>

        <div className="pres-glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)' }}>Peak Load Window Forecast</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', margin: '0.35rem 0' }}>
            3,250 W
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Projected evening peak between 18:30 – 21:00
          </div>
        </div>
      </div>

      {/* Engineering Transparency Notice */}
      <div style={{
        marginTop: '1.25rem',
        padding: '0.75rem 1.25rem',
        background: 'rgba(56, 189, 248, 0.06)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '8px',
        fontSize: '0.78rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <AlertCircle size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />
        <span>
          <strong>Methodology Disclosure:</strong> Predictions leverage deterministic diurnal regression and exponential smoothing calculated client-side in JavaScript without requiring cloud-trained PyTorch/TensorFlow deep neural networks.
        </span>
      </div>
    </div>
  );
}
