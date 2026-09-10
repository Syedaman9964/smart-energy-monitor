import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Flame,
  EyeOff,
  TrendingUp,
  DollarSign,
  ZapOff
} from 'lucide-react';

export default function Slide2Problem() {
  const problems = [
    {
      title: 'End-of-Month Bill Shock',
      desc: 'Consumers receive a single aggregate rupee figure 30 days after the electricity has already been consumed, with zero breakdown of what drove the cost.',
      stat: '30-Day',
      statLabel: 'Feedback Latency',
      icon: DollarSign,
      color: '#ef4444'
    },
    {
      title: 'Phantom Standby Drain',
      desc: 'Inverters, standby electronics, entertainment systems, and chargers continuously draw parasitic current 24/7 without active user benefit.',
      stat: '8% – 12%',
      statLabel: 'Wasted Load',
      icon: ZapOff,
      color: '#f59e0b'
    },
    {
      title: 'Power Factor & Reactive Losses',
      desc: 'Compressors and pumps draw heavy reactive inductive currents. Poor power factor (cos φ < 0.85) draws extra grid current, overheating wiring.',
      stat: '< 0.85 PF',
      statLabel: 'Industrial Penalty',
      icon: Flame,
      color: '#f97316'
    },
    {
      title: 'Invisible Grid Fluctuations',
      desc: 'Voltage surges (>255V) and brownout sags (<195V) silently degrade expensive appliance compressors, inverters, and electronics over time.',
      stat: '± 18%',
      statLabel: 'Voltage Instability',
      icon: AlertTriangle,
      color: '#e11d48'
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(239, 68, 68, 0.35)', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)' }}>
        <AlertTriangle size={14} />
        <span>The Problem Landscape</span>
      </div>

      <h2 className="pres-slide-title">
        The Invisible Cost of Blind Consumption
      </h2>

      <p className="pres-slide-subtitle">
        Conventional electricity infrastructure measures energy as a passive billing ledger rather than an intelligent, real-time operating telemetry stream.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {problems.map((prob, i) => {
          const Icon = prob.icon;
          return (
            <motion.div
              key={prob.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="pres-glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${prob.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: `${prob.color}1a`,
                    color: prob.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: prob.color }}>
                      {prob.stat}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--pres-text-muted)', textTransform: 'uppercase' }}>
                      {prob.statLabel}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  {prob.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--pres-text-secondary)', lineHeight: 1.5 }}>
                  {prob.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
