import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Activity,
  Maximize2,
  Tv,
  ShieldAlert,
  Layers,
  Zap,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function Slide6Hardware() {
  const [isAssembled, setIsAssembled] = useState(false);

  const components = [
    {
      id: 'esp32',
      tag: 'EDGE PROCESSOR',
      name: 'ESP32-WROOM-32',
      desc: 'Xtensa Dual-Core 32-bit LX6 @ 240 MHz. FreeRTOS handles Modbus-RTU UART on Core 0 and Wi-Fi/LCD on Core 1.',
      icon: Cpu,
      color: '#38bdf8',
      wiring: 'UART: GPIO 16 (RX2), GPIO 17 (TX2)'
    },
    {
      id: 'pzem',
      tag: 'ENERGY SENSOR',
      name: 'PZEM-004T v3.0',
      desc: 'Dedicated SD3004 energy ASIC. Measures True-RMS V, I, P, E, F, and PF with 0.5% accuracy and optical isolation.',
      icon: Activity,
      color: '#06b6d4',
      wiring: 'High-Voltage Leads + TTL UART @ 9600'
    },
    {
      id: 'ct',
      tag: 'CURRENT SENSOR',
      name: '100A Split-Core CT Clamp',
      desc: 'Non-invasive current transformer clamp (100A : 50mA secondary). Safely senses phase current without cutting mains wires.',
      icon: Zap,
      color: '#f59e0b',
      wiring: 'Connects to PZEM CT Terminal block'
    },
    {
      id: 'lcd',
      tag: 'LOCAL DISPLAY',
      name: '16x2 I2C Character LCD',
      desc: 'PCF8574 I2C backpack. Displays continuous rotating real-time electrical metrics locally even when internet drops.',
      icon: Tv,
      color: '#10b981',
      wiring: 'I2C: GPIO 21 (SDA), GPIO 22 (SCL)'
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="pres-slide-badge">
            <Layers size={14} />
            <span>Hardware Engineering</span>
          </div>
          <h2 className="pres-slide-title">
            Optically-Isolated Benchtop Hardware
          </h2>
          <p className="pres-slide-subtitle" style={{ marginBottom: '1rem' }}>
            Four rugged industrial components engineered for high-voltage galvanic safety and sub-second deterministic telemetry.
          </p>
        </div>

        {/* Interactive Assembly Toggle */}
        <button
          onClick={() => setIsAssembled(!isAssembled)}
          className="pres-btn-nav"
          style={{
            background: isAssembled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.15)',
            borderColor: isAssembled ? '#10b981' : '#06b6d4',
            color: isAssembled ? '#34d399' : '#38bdf8'
          }}
        >
          <Layers size={16} />
          <span>{isAssembled ? '✓ System Assembled' : '⚡ Simulate Interconnection'}</span>
        </button>
      </div>

      {/* Hardware Component Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.75rem',
        transition: 'all 0.5s ease'
      }}>
        {components.map((comp, i) => {
          const Icon = comp.icon;
          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                borderColor: isAssembled ? comp.color : 'rgba(56, 189, 248, 0.18)'
              }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="pres-glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: comp.color,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: `${comp.color}15`,
                    border: `1px solid ${comp.color}33`
                  }}>
                    {comp.tag}
                  </span>

                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${comp.color}18`,
                    color: comp.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {comp.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--pres-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {comp.desc}
                </p>
              </div>

              {/* Interconnection details */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.75rem',
                color: isAssembled ? comp.color : 'var(--pres-text-muted)',
                fontWeight: 600
              }}>
                🔌 {comp.wiring}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Safety Mandatory Disclaimer Box */}
      <div style={{
        marginTop: '1.25rem',
        padding: '0.85rem 1.25rem',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ShieldAlert size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: '#fca5a5', lineHeight: 1.4 }}>
          <strong>Safety & Compliance Notice:</strong> Physical mains wiring involves hazardous 230V AC voltages. Live mains integration requires qualified electrical supervision and strict benchtop safety isolation protocols.
        </div>
      </div>
    </div>
  );
}
