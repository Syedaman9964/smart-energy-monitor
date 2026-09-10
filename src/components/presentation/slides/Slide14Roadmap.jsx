import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Cpu,
  Sun,
  GitPullRequest,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function Slide14Roadmap() {
  const milestones = [
    {
      quarter: 'PHASE 01 — COMPLETED',
      title: 'Edge Sensing & Telemetry Gateway',
      status: 'SHIPPED & TESTED',
      color: '#10b981',
      items: [
        'ESP32 FreeRTOS Modbus-RTU UART driver',
        'PZEM-004T optical galvanic isolation',
        'Node.js Express & WebSocket telemetry pipe',
        'Indian DISCOM multi-slab tiered billing'
      ]
    },
    {
      quarter: 'PHASE 02 — NEXT STAGE',
      title: 'Smart Relays & Automated Tripping',
      status: 'ARCHITECTURE READY',
      color: '#38bdf8',
      items: [
        'Solid-state relay (SSR) control channel',
        'Automated load shedding on voltage surges',
        'Scheduled off-peak appliance switching',
        'Overcurrent magnetic latching safety cutoff'
      ]
    },
    {
      quarter: 'PHASE 03 — DISTRIBUTED GEN',
      title: 'Rooftop Solar & Net Metering',
      status: 'IN DESIGN',
      color: '#f59e0b',
      items: [
        'Bidirectional energy import/export metering',
        'PM Surya Ghar net-metering synchronization',
        'Battery Energy Storage (BESS) state-of-charge',
        'Dynamic solar curtailment logic'
      ]
    },
    {
      quarter: 'PHASE 04 — ENERGY 4.0',
      title: 'Peer-to-Peer (P2P) Microgrid Trading',
      status: 'FUTURE VISION',
      color: '#a855f7',
      items: [
        'Local community microgrid peer energy trade',
        'MQTT edge clustering between households',
        'Time-of-Day dynamic demand pricing',
        'OpenADR 2.0 automated demand response'
      ]
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(168, 85, 247, 0.35)', color: '#c084fc', background: 'rgba(168, 85, 247, 0.1)' }}>
        <Compass size={14} />
        <span>Future Engineering Roadmap</span>
      </div>

      <h2 className="pres-slide-title">
        The Evolution Toward Autonomous Energy Systems
      </h2>

      <p className="pres-slide-subtitle">
        Scaling from real-time monitoring to closed-loop automated load shedding, distributed rooftop generation, and smart microgrids.
      </p>

      {/* Roadmap Phase Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.25rem'
      }}>
        {milestones.map((m, i) => (
          <motion.div
            key={m.quarter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.12 }}
            className="pres-glass-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `3px solid ${m.color}`
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: m.color, letterSpacing: '0.05em' }}>
                  {m.quarter}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: m.color,
                  background: `${m.color}15`,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {m.status}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                {m.title}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {m.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--pres-text-secondary)', lineHeight: 1.4 }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: m.color, marginTop: '6px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
