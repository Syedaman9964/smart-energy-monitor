import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Radio,
  Clock,
  Sliders,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function Slide7LiveData() {
  const [metrics, setMetrics] = useState({
    voltage: 230.4,
    current: 7.82,
    power: 1792.5,
    frequency: 50.01,
    pf: 0.96,
    energy: 12.482
  });

  const [unitMode, setUnitMode] = useState('kW'); // 'W' | 'kW'
  const [history, setHistory] = useState([1650, 1720, 1690, 1840, 1780, 1810, 1792]);

  // Live dynamic telemetry simulation update
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const vDelta = (Math.random() - 0.5) * 1.2;
        const pDelta = (Math.random() - 0.48) * 45;
        const newVoltage = Number((prev.voltage + vDelta).toFixed(1));
        const newPower = Number(Math.max(800, prev.power + pDelta).toFixed(1));
        const newPf = Number(Math.min(0.99, Math.max(0.92, prev.pf + (Math.random() - 0.5) * 0.01)).toFixed(2));
        const newCurrent = Number((newPower / (newVoltage * newPf)).toFixed(2));
        const newFreq = Number((50.0 + (Math.random() - 0.5) * 0.04).toFixed(2));
        const newEnergy = Number((prev.energy + (newPower * 1.5) / (3600 * 1000)).toFixed(4));

        setHistory((h) => [...h.slice(1), Math.round(newPower)]);

        return {
          voltage: newVoltage,
          current: newCurrent,
          power: newPower,
          frequency: newFreq,
          pf: newPf,
          energy: newEnergy
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: 'Grid RMS Voltage',
      val: `${metrics.voltage} V`,
      status: 'Nominal 230V ± 6%',
      color: '#38bdf8',
      range: '228.4 – 232.1 V'
    },
    {
      title: 'Phase Current Load',
      val: `${metrics.current} A`,
      status: 'CT Sensor Secondary',
      color: '#06b6d4',
      range: '1.5 – 18.2 A'
    },
    {
      title: 'Active Real Power',
      val: unitMode === 'kW' ? `${(metrics.power / 1000).toFixed(2)} kW` : `${metrics.power} W`,
      status: 'P = V × I × cos φ',
      color: '#10b981',
      range: '350 – 3400 W'
    },
    {
      title: 'Grid Frequency',
      val: `${metrics.frequency} Hz`,
      status: 'National Grid 50Hz',
      color: '#f59e0b',
      range: '49.96 – 50.04 Hz'
    },
    {
      title: 'Power Factor',
      val: `${metrics.pf} PF`,
      status: 'Displacement cos φ',
      color: metrics.pf >= 0.95 ? '#10b981' : '#f59e0b',
      range: '0.92 – 0.98'
    },
    {
      title: 'Cumulative Energy',
      val: `${metrics.energy.toFixed(3)} kWh`,
      status: 'PZEM ASIC Register',
      color: '#a855f7',
      range: 'Accumulated'
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <div>
          <div className="pres-slide-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)' }}>
            <Activity size={14} />
            <span>High-Frequency Telemetry</span>
          </div>
          <h2 className="pres-slide-title">
            Live Edge Telemetry Stream
          </h2>
        </div>

        {/* Live Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span>1.0 Hz STREAMING</span>
          </div>

          <button
            onClick={() => setUnitMode(unitMode === 'kW' ? 'W' : 'kW')}
            className="pres-btn-nav"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            Unit: {unitMode}
          </button>
        </div>
      </div>

      <p className="pres-slide-subtitle" style={{ marginBottom: '1.5rem' }}>
        Continuous 6-channel sub-second electrical parameters captured by the PZEM-004T and broadcast over WebSockets.
      </p>

      {/* 6 KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="pres-glass-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `3px solid ${card.color}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--pres-text-muted)', fontWeight: 600 }}>
                {card.title}
              </span>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {card.range}
              </span>
            </div>

            <div className="font-mono" style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: card.color,
              margin: '0.4rem 0',
              textShadow: `0 0 20px ${card.color}44`
            }}>
              {card.val}
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '0.5rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: card.color }} />
              <span>{card.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini SVG Live Waveform Banner */}
      <div className="pres-glass-card" style={{
        marginTop: '1.25rem',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
            Active Load Trend (Past 10s Window):
          </span>
        </div>

        <div style={{ flex: 1, height: '36px', display: 'flex', alignItems: 'center' }}>
          <svg viewBox="0 0 300 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <path
              d={`M 0 20 ${history.map((pt, idx) => `L ${idx * 50} ${40 - ((pt - 1500) / 500) * 35}`).join(' ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div className="font-mono" style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
          {metrics.power} W
        </div>
      </div>
    </div>
  );
}
