import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code
} from 'lucide-react';
import { useEnergy } from '../../../context/EnergyContext';

export default function Slide15Conclusion({ onJumpToSlide }) {
  const { setActivePage } = useEnergy();

  return (
    <div className="pres-content-wrapper" style={{ textAlign: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="pres-slide-badge"
        style={{ borderColor: 'rgba(16, 185, 129, 0.35)', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)' }}
      >
        <Sparkles size={14} />
        <span>Product Presentation Conclusion</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pres-slide-title"
        style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          maxWidth: '900px',
          background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 70%, #10b981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}
      >
        “Turning Electricity Into Intelligence”
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pres-slide-subtitle"
        style={{ maxWidth: '780px', fontSize: '1.15rem', color: '#cbd5e1', marginBottom: '2.5rem' }}
      >
        WattVision transforms passive utility billing ledgers into proactive, edge-connected IoT intelligence — safeguarding appliances, cutting phantom costs, and promoting sustainable grid efficiency.
      </motion.p>

      {/* Action CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}
      >
        <button
          onClick={() => setActivePage('dashboard')}
          className="btn-primary"
          style={{
            padding: '12px 28px',
            fontSize: '0.95rem',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
          }}
        >
          <LayoutDashboard size={18} />
          <span>Launch Live Control Room</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => setActivePage('docs')}
          className="btn-secondary"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <BookOpen size={18} style={{ color: '#38bdf8' }} />
          <span>Examiner Viva Voce Q&A</span>
        </button>

        <button
          onClick={() => onJumpToSlide(4)} // Jump back to architecture
          className="btn-secondary"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <Code size={18} style={{ color: '#f59e0b' }} />
          <span>Revisit System Architecture</span>
        </button>
      </motion.div>

      {/* Final 3 Takeaways Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '920px'
      }}>
        <div className="pres-glass-card" style={{ padding: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '0.35rem' }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>0.5% Class Metering</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--pres-text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Dedicated SD3004 ASIC with 3.75 kV dual optical isolation surpassing basic Hall sensors.
          </p>
        </div>

        <div className="pres-glass-card" style={{ padding: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '0.35rem' }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Indian DISCOM Slabs</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--pres-text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Tiered tariff calculation with fixed demand charges, FAC, and state electricity duties.
          </p>
        </div>

        <div className="pres-glass-card" style={{ padding: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '0.35rem' }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Sub-Second Telemetry</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--pres-text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Full-duplex WebSocket broadcasting with continuous automated anomaly detection.
          </p>
        </div>
      </div>
    </div>
  );
}
