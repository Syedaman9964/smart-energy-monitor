import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Zap,
  Gauge,
  Clock,
  ShieldCheck,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export default function Slide3Comparison() {
  const comparisonRows = [
    {
      feature: 'Sampling Resolution',
      traditional: 'Monthly aggregate (1 snapshot per 30 days)',
      wattvision: 'Sub-second real-time stream (1.0 Hz live sampling)',
      highlight: true
    },
    {
      feature: 'Telemetry Scope',
      traditional: 'Only cumulative active energy (kWh units)',
      wattvision: '6 True RMS parameters (V, I, P, kWh, Hz, cos φ)',
      highlight: true
    },
    {
      feature: 'Power Factor Visibility',
      traditional: 'Blind / Ignored (reactive penalties hidden)',
      wattvision: 'Continuous vector cosine tracking with penalty alarms',
      highlight: false
    },
    {
      feature: 'Grid Anomaly Alarms',
      traditional: 'None (Equipment suffers until catastrophic burnout)',
      wattvision: 'Sub-second alerts on surges (>255V) & sags (<195V)',
      highlight: true
    },
    {
      feature: 'Tariff & Cost Intelligence',
      traditional: 'Static backward-looking post-billing invoice',
      wattvision: 'Live Indian DISCOM multi-slab forecasting (₹ INR)',
      highlight: false
    },
    {
      feature: 'Local & Cloud Connectivity',
      traditional: 'Manual physical meter reader visit required',
      wattvision: 'Dual-mode: 16x2 I2C Local LCD + WebSocket cloud stream',
      highlight: false
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge">
        <Gauge size={14} />
        <span>Technological Evolution</span>
      </div>

      <h2 className="pres-slide-title">
        Why Traditional Utility Meters Fall Short
      </h2>

      <p className="pres-slide-subtitle">
        Moving from static monthly billing counters to proactive, edge-connected IoT electrical intelligence.
      </p>

      {/* Comparison Grid */}
      <div className="pres-glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--pres-text-muted)', fontWeight: 600, width: '28%' }}>
                ELECTRICAL CAPABILITY
              </th>
              <th style={{ padding: '0.75rem 1rem', color: '#f87171', fontWeight: 700, width: '36%' }}>
                TRADITIONAL STATIC METERS
              </th>
              <th style={{ padding: '0.75rem 1rem', color: '#38bdf8', fontWeight: 700, width: '36%' }}>
                ⚡ WATTVISION IOT PLATFORM
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <motion.tr
                key={row.feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: row.highlight ? 'rgba(6, 182, 212, 0.04)' : 'transparent'
                }}
              >
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {row.feature}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <span>{row.traditional}</span>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#e2e8f0', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span style={{ color: row.highlight ? '#38bdf8' : '#f8fafc' }}>{row.wattvision}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
