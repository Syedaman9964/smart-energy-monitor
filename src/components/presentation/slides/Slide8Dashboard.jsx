import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Activity,
  GitBranch,
  BarChart3,
  Tv,
  Leaf,
  DollarSign,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Slide8Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      color: '#38bdf8',
      title: 'Unified Energy Control Room',
      desc: 'Glowing SVG power demand curve, instantaneous active wattage, peak demand records, and Indian DISCOM month-to-date billed cost in rupees.',
      features: ['Recharts Smooth SVG Area Chart', 'Real-Time Power Factor Vector', 'Instantaneous Watt/kW Toggle', 'Automated Daily Max Peak Demand']
    },
    {
      id: 'flow',
      label: 'Current Particle Flow',
      icon: GitBranch,
      color: '#06b6d4',
      title: 'Dynamic Circuit Particle Map',
      desc: 'Visual particle simulation illustrating electricity flowing from 230V mains through the PZEM-004T CT sensor into domestic appliance branches.',
      features: ['Velocity Proportional to Current', 'Branch Impedance Modeling', 'Interactive Node Toggles', 'Visual Bottleneck Warning']
    },
    {
      id: 'billing',
      label: 'DISCOM Multi-Slab',
      icon: DollarSign,
      color: '#10b981',
      title: 'Indian DISCOM Tariff Calculator',
      desc: 'Progressive slab calculation engine modeling BESCOM, TANGEDCO, MSEDCL, BSES, and UPPCL with fixed demand charges, FAC, and 18% GST.',
      features: ['Tiered Slab Brackets (0-50, 51-100, etc.)', 'Fixed Connection Charges', 'Fuel Adjustment Costs (FAC)', '18% Statutory GST Modeling']
    },
    {
      id: 'prediction',
      label: 'AI & Diurnal Prediction',
      icon: Radio,
      color: '#f59e0b',
      title: 'Predictive 24h & 30d Forecaster',
      desc: 'Holt-Winters double exponential smoothing with diurnal residential cycle regression predicting next-day peak demand and end-of-month utility bills.',
      features: ['24-Hour Diurnal Heuristic Curve', 'Upper/Lower Confidence Bands', 'PM Surya Ghar Solar ROI Payback', 'Appliance Upgrade Simulator']
    }
  ];

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge">
        <LayoutDashboard size={14} />
        <span>Software Architecture</span>
      </div>

      <h2 className="pres-slide-title">
        The Control-Room Experience
      </h2>

      <p className="pres-slide-subtitle">
        13 specialized real-time modules engineered with React 19, Recharts SVG glow filters, and responsive glassmorphism.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="pres-btn-nav"
              style={{
                background: isActive ? `${tab.color}22` : 'rgba(255, 255, 255, 0.04)',
                borderColor: isActive ? tab.color : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? tab.color : 'var(--pres-text-secondary)'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Showcase Box */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="pres-glass-card"
        style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          borderLeft: `4px solid ${current.color}`
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: current.color, marginBottom: '0.5rem' }}>
            <current.icon size={22} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Feature Spotlight
            </span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
            {current.title}
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--pres-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {current.desc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {current.features.map((feat) => (
              <div
                key={feat}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ChevronRight size={13} style={{ color: current.color }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mock UI Frame */}
        <div style={{
          background: 'rgba(5, 8, 15, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--pres-text-muted)', fontWeight: 600 }}>
              Live UI Simulation Preview
            </span>
            <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
              ONLINE
            </span>
          </div>

          <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)', marginBottom: '4px' }}>
              Primary System Metric
            </div>
            <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: current.color }}>
              {activeTab === 'overview' ? '1,842 W' : activeTab === 'billing' ? '₹ 1,428.50' : activeTab === 'prediction' ? '14.8 kWh/day' : '8.20 A'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
              Synchronized with ESP32 UART Modbus Register
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--pres-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Available in standard dashboard navigation</span>
            <span style={{ color: current.color, fontWeight: 600 }}>100% Client-Side React 19</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
