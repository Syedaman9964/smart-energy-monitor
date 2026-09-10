import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Radio,
  BarChart3,
  Flame,
  Zap,
  Globe
} from 'lucide-react';

export default function Slide4Solution() {
  const pillars = [
    {
      num: '01',
      title: 'Precision Edge Sensing',
      subtitle: 'PZEM-004T v3.0 + 100A CT',
      desc: 'Dedicated SD3004 energy metering ASIC with dual optocouplers (PC817) for 3.75 kV galvanic high-voltage safety isolation. True-RMS AC sampling with 0.5% accuracy.',
      icon: Zap,
      color: '#f59e0b'
    },
    {
      num: '02',
      title: 'Dual-Core RTOS Processing',
      subtitle: 'ESP32-WROOM-32 @ 240 MHz',
      desc: 'Core 0 handles 9600-baud Modbus-RTU queries & 16-bit CRC packet verification. Core 1 manages Wi-Fi auto-reconnect, HTTP telemetry dispatch, and 16x2 I2C LCD refresh.',
      icon: Cpu,
      color: '#06b6d4'
    },
    {
      num: '03',
      title: 'Sub-Second Telemetry Gateway',
      subtitle: 'Node.js Express + WebSocket',
      desc: 'Full-duplex WebSocket server broadcasting sub-second JSON telemetry packets to connected web clients with continuous automated anomaly detection.',
      icon: Radio,
      color: '#38bdf8'
    },
    {
      num: '04',
      title: 'DISCOM Tariff & ESG Analytics',
      subtitle: 'React 19 + Indian Slabs',
      desc: 'Real-time billing engine modeling tiered energy slabs (BESCOM, TANGEDCO, MSEDCL, BSES, UPPCL), fuel adjustment charges (FAC), and CEA India CO₂ emission factors.',
      icon: BarChart3,
      color: '#10b981'
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.35)', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)' }}>
        <Sparkles size={14} />
        <span>The WattVision Architecture</span>
      </div>

      <h2 className="pres-slide-title">
        An End-to-End Edge-to-Cloud Ecosystem
      </h2>

      <p className="pres-slide-subtitle">
        Seamlessly bridging physical 230V AC conductors with distributed edge microcontrollers and high-frequency cloud analytics.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="pres-glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '70px',
                height: '70px',
                background: `radial-gradient(circle, ${pillar.color}22 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: `${pillar.color}18`,
                    color: pillar.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.2)' }}>
                    {pillar.num}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  {pillar.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: pillar.color, fontWeight: 600, marginBottom: '0.75rem' }}>
                  {pillar.subtitle}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--pres-text-secondary)', lineHeight: 1.5 }}>
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
