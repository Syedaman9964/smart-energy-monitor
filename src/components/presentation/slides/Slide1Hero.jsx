import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Activity,
  Cpu,
  Cloud,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';

export default function Slide1Hero({ onNext }) {
  const [stage, setStage] = useState(0);

  // Sequential reveal of stages
  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev < 5 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const flowNodes = [
    { label: '230V MAINS', sub: 'High-Voltage Grid', icon: Zap, color: '#f59e0b' },
    { label: 'PZEM-004T', sub: 'Optical Isolated Sensor', icon: Activity, color: '#06b6d4' },
    { label: 'ESP32-WROOM', sub: 'Dual-Core FreeRTOS', icon: Cpu, color: '#38bdf8' },
    { label: 'NODE.JS CLOUD', sub: 'WebSocket Gateway', icon: Cloud, color: '#a855f7' },
    { label: 'DASHBOARD', sub: 'Sub-Second React 19', icon: LayoutDashboard, color: '#10b981' }
  ];

  return (
    <div className="pres-content-wrapper" style={{ alignItems: 'center', textAlign: 'center' }}>
      {/* Top Pre-title Pill */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pres-slide-badge"
      >
        <Zap size={14} style={{ color: '#06b6d4' }} />
        <span>Next-Generation Energy Intelligence Platform</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pres-slide-title"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 70%, #10b981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.8rem'
        }}
      >
        WATTVISION
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pres-slide-subtitle"
        style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)', maxWidth: '820px', color: '#cbd5e1', marginBottom: '2.5rem' }}
      >
        Bridging Physical AC Conductors with Sub-Second Edge Telemetry & Indian DISCOM Analytics
      </motion.p>

      {/* Sequential Traveling Energy Pulse Flow */}
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        margin: '0 auto 2.5rem auto',
        padding: '1.25rem',
        background: 'rgba(13, 20, 36, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Visual Pulse Wave */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: `${(stage / 5) * 100}%`,
          width: '60px',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.35), transparent)',
          transition: 'left 0.6s ease-in-out',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          {flowNodes.map((node, i) => {
            const Icon = node.icon;
            const isLit = stage >= i + 1;
            return (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: isLit ? 1 : 0.4, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  padding: '1rem 0.5rem',
                  borderRadius: '12px',
                  background: isLit ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  border: `1px solid ${isLit ? node.color : 'rgba(255, 255, 255, 0.06)'}`,
                  boxShadow: isLit ? `0 0 16px ${node.color}33` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${node.color}1f`,
                  color: node.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isLit ? '#f8fafc' : '#94a3b8' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {node.sub}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Electrical Metrics Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '920px'
        }}
      >
        {[
          { label: 'RMS Voltage', value: '230.4 V', color: '#38bdf8' },
          { label: 'Grid Frequency', value: '50.01 Hz', color: '#06b6d4' },
          { label: 'Active Load', value: '1.82 kW', color: '#10b981' },
          { label: 'Power Factor', value: '0.96 PF', color: '#f59e0b' },
          { label: 'MTD Consumption', value: '12.48 kWh', color: '#a855f7' }
        ].map((metric) => (
          <div
            key={metric.label}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.75rem 0.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--pres-text-muted)', marginBottom: '0.2rem' }}>
              {metric.label}
            </div>
            <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: metric.color }}>
              {metric.value}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
