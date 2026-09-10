import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  Cpu,
  Server,
  Bell,
  RefreshCw,
  Play
} from 'lucide-react';

export default function Slide11Anomaly() {
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [step, setStep] = useState(0); // 0 = Idle, 1 = Sensor, 2 = ESP32, 3 = Backend, 4 = Alert

  // Animate surge propagation sequence when activated
  const handleTriggerSurge = () => {
    setIsSurgeActive(true);
    setStep(1);
    setTimeout(() => setStep(2), 500);
    setTimeout(() => setStep(3), 1000);
    setTimeout(() => setStep(4), 1500);
  };

  const handleReset = () => {
    setIsSurgeActive(false);
    setStep(0);
  };

  const pipeline = [
    { id: 1, label: 'PZEM Sensor', desc: 'ADC registers 258.4V True-RMS', icon: Activity },
    { id: 2, label: 'ESP32 Firmware', desc: 'Core 0 detects >255V ceiling limit', icon: Cpu },
    { id: 3, label: 'Backend Gateway', desc: 'Express /ws evaluates safety payload', icon: Server },
    { id: 4, label: 'Alarm & Chime', desc: 'Sub-second audio chime & UI banner', icon: Bell }
  ];

  return (
    <div className="pres-content-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <div>
          <div className="pres-slide-badge" style={{
            borderColor: isSurgeActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.35)',
            color: isSurgeActive ? '#f87171' : '#34d399',
            background: isSurgeActive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.1)'
          }}>
            {isSurgeActive ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
            <span>{isSurgeActive ? '⚠ Grid Anomaly Event In Progress' : 'Grid Safety Protection Active'}</span>
          </div>
          <h2 className="pres-slide-title">
            Sub-Second Anomaly Detection & Propagation
          </h2>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isSurgeActive ? (
            <button
              onClick={handleTriggerSurge}
              className="pres-btn-nav"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#f87171'
              }}
            >
              <Zap size={16} />
              <span>Simulate Voltage Spike (258V)</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="pres-btn-nav"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgba(16, 185, 129, 0.5)',
                color: '#34d399'
              }}
            >
              <RefreshCw size={16} />
              <span>Restore Nominal Grid (230V)</span>
            </button>
          )}
        </div>
      </div>

      <p className="pres-slide-subtitle" style={{ marginBottom: '1.25rem' }}>
        Demonstrates the edge-to-cloud reactive pipeline when grid voltage crosses safe operating limits (&gt;255V surge or &lt;195V brownout).
      </p>

      {/* Grid Condition Banner */}
      <motion.div
        animate={{
          backgroundColor: isSurgeActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.08)',
          borderColor: isSurgeActive ? '#ef4444' : 'rgba(16, 185, 129, 0.3)'
        }}
        transition={{ duration: 0.3 }}
        style={{
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: isSurgeActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isSurgeActive ? '#ef4444' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isSurgeActive ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              {isSurgeActive ? 'CRITICAL OVERVOLTAGE ANOMALY' : 'GRID VOLTAGE STABLE & NOMINAL'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: isSurgeActive ? '#fca5a5' : '#94a3b8', margin: '4px 0 0 0' }}>
              {isSurgeActive
                ? 'High-voltage surge detected exceeding 255V CEA standard ceiling. Immediate alert broadcast dispatched.'
                : 'RMS voltage operates within nominal 230V single-phase tolerance limit.'}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="font-mono" style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: isSurgeActive ? '#ef4444' : '#10b981'
          }}>
            {isSurgeActive ? '258.4 V' : '230.2 V'}
          </div>
          <div style={{ fontSize: '0.72rem', color: isSurgeActive ? '#f87171' : 'var(--pres-text-muted)' }}>
            {isSurgeActive ? '+12.3% ABOVE THRESHOLD' : 'NOMINAL (± 1.2%)'}
          </div>
        </div>
      </motion.div>

      {/* 4-Step Pipeline Propagation Visualization */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {pipeline.map((p) => {
          const Icon = p.icon;
          const isTriggered = isSurgeActive && step >= p.id;
          return (
            <motion.div
              key={p.id}
              animate={{
                borderColor: isTriggered ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
                background: isTriggered ? 'rgba(239, 68, 68, 0.1)' : 'rgba(13, 20, 36, 0.6)'
              }}
              transition={{ duration: 0.3 }}
              className="pres-glass-card"
              style={{
                padding: '1.25rem',
                borderLeft: isTriggered ? '4px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: isTriggered ? '#f87171' : 'var(--pres-text-muted)' }}>
                  STAGE 0{p.id}
                </span>

                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isTriggered ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isTriggered ? '#ef4444' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} />
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                {p.label}
              </h4>
              <p style={{ fontSize: '0.78rem', color: isTriggered ? '#fca5a5' : 'var(--pres-text-secondary)', lineHeight: 1.4 }}>
                {isTriggered ? p.desc : 'Armed and monitoring for electrical threshold excursions.'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
