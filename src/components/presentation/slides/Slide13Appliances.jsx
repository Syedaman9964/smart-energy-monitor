import React from 'react';
import { motion } from 'framer-motion';
import {
  Tv,
  Wind,
  Flame,
  Refrigerator,
  Zap,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function Slide13Appliances() {
  const appliances = [
    { name: 'Inverter Air Conditioner', icon: Wind, power: '1,250 W', share: 42, color: '#38bdf8', type: 'BLDC Inverter Compressor' },
    { name: 'Storage Water Geyser', icon: Flame, power: '850 W', share: 28, color: '#f59e0b', type: 'Pure Resistive Thermal Coil' },
    { name: 'Induction Cooktop', icon: Zap, power: '520 W', share: 17, color: '#10b981', type: 'High-Frequency Magnetic Flux' },
    { name: 'Smart Inverter Refrigerator', icon: Refrigerator, power: '180 W', share: 6, color: '#06b6d4', type: 'Cyclic Thermostat Load' },
    { name: 'Phantom Standby & Lighting', icon: Tv, power: '210 W', share: 7, color: '#a855f7', type: 'Continuous Parasitic Drain' }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}>
        <Layers size={14} />
        <span>Load Disaggregation (NILM)</span>
      </div>

      <h2 className="pres-slide-title">
        Non-Intrusive Load Monitoring (NILM)
      </h2>

      <p className="pres-slide-subtitle">
        Decomposing aggregate mains wattage into distinctive appliance signatures without needing expensive sub-meter hardware on every wall socket.
      </p>

      {/* Visual Stacked Power Bar */}
      <div className="pres-glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
            Instantaneous Aggregate Load Breakdown: 3,010 W
          </span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#10b981' }}>
            100% Accounted
          </span>
        </div>

        {/* Stacked bar */}
        <div style={{
          width: '100%',
          height: '24px',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          {appliances.map((app) => (
            <div
              key={app.name}
              style={{
                width: `${app.share}%`,
                height: '100%',
                background: app.color,
                transition: 'width 0.5s ease',
                boxShadow: `inset 0 0 10px rgba(0,0,0,0.3)`
              }}
              title={`${app.name}: ${app.share}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.74rem' }}>
          {appliances.map((app) => (
            <div key={app.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: app.color }} />
              <span style={{ color: 'var(--pres-text-secondary)' }}>{app.name} ({app.share}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appliance Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem'
      }}>
        {appliances.map((app, i) => {
          const Icon = app.icon;
          return (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="pres-glass-card"
              style={{ padding: '1rem', borderTop: `3px solid ${app.color}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `${app.color}18`,
                  color: app.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} />
                </div>
                <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: app.color }}>
                  {app.share}%
                </span>
              </div>

              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                {app.name}
              </h4>
              <div className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9', margin: '0.25rem 0' }}>
                {app.power}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pres-text-muted)' }}>
                {app.type}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
