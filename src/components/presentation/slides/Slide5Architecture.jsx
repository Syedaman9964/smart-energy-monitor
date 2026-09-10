import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Activity,
  Cpu,
  Wifi,
  Server,
  Radio,
  LayoutDashboard,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Slide5Architecture() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    {
      id: 'mains',
      title: '230V AC Mains',
      category: 'Power Grid',
      icon: Zap,
      color: '#f59e0b',
      x: 70,
      y: 120,
      summary: 'Single-phase 230V 50Hz domestic / commercial electrical line.',
      techDetails: {
        'Nominal Voltage': '230V RMS (Single-Phase AC)',
        'Frequency': '50.0 Hz ± 1%',
        'Max Current Capacity': 'Up to 100A RMS via non-invasive CT',
        'Physical Safety': 'Optically isolated from measurement electronics'
      }
    },
    {
      id: 'pzem',
      title: 'PZEM-004T v3.0',
      category: 'Energy Metering ASIC',
      icon: Activity,
      color: '#06b6d4',
      x: 215,
      y: 120,
      summary: 'SD3004 dedicated metering ASIC with dual PC817 optocouplers.',
      techDetails: {
        'ASIC Engine': 'SD3004 / V9881D High-Speed Delta-Sigma ADC',
        'Galvanic Isolation': '3.75 kV Optocoupler Barrier (PC817)',
        'Output Protocol': 'Modbus-RTU over TTL UART (9600-8-N-1)',
        'Input Channels': 'Voltage sensing leads + 100A CT secondary coil'
      }
    },
    {
      id: 'esp32',
      title: 'ESP32 MCU',
      category: 'Edge Processor',
      icon: Cpu,
      color: '#38bdf8',
      x: 360,
      y: 120,
      summary: 'Xtensa Dual-Core 32-bit LX6 @ 240 MHz running FreeRTOS.',
      techDetails: {
        'Core 0 Task': 'Modbus-RTU UART querying (GPIO 16/17) + CRC16',
        'Core 1 Task': 'Wi-Fi 802.11 b/g/n transport + 16x2 I2C LCD',
        'Memory Footprint': '520 KB SRAM + 4 MB Flash',
        'Fail-Safe Mode': 'Graceful benchtop simulation fallback when offline'
      }
    },
    {
      id: 'wifi',
      title: 'Wi-Fi Network',
      category: 'Transport Layer',
      icon: Wifi,
      color: '#818cf8',
      x: 505,
      y: 120,
      summary: '2.4 GHz TCP/IP local WLAN wireless network bridge.',
      techDetails: {
        'Frequency': '2.4 GHz IEEE 802.11 b/g/n',
        'Security': 'WPA2-PSK Enterprise authentication',
        'Payload Format': 'JSON stringified telemetry packets',
        'Auto-Reconnect': 'Exponential backoff watchdog daemon'
      }
    },
    {
      id: 'backend',
      title: 'Node.js Gateway',
      category: 'REST & WS Engine',
      icon: Server,
      color: '#a855f7',
      x: 650,
      y: 120,
      summary: 'Express API, In-Memory Ring Buffer & Anomaly Detection.',
      techDetails: {
        'REST Endpoints': '/api/telemetry, /api/billing, /api/alerts',
        'Anomaly Engine': 'Instant threshold checking on V, I, P, and PF',
        'Persistence': 'In-Memory Telemetry Ring Buffer + JSON Cache',
        'Runtime': 'Node.js v18+ ES Modules'
      }
    },
    {
      id: 'websocket',
      title: 'WebSocket Feed',
      category: 'Real-Time Pipe',
      icon: Radio,
      color: '#c084fc',
      x: 795,
      y: 120,
      summary: 'Sub-second bidirectional real-time push pipe (/ws).',
      techDetails: {
        'Protocol': 'WSS / WS (RFC 6455) full-duplex stream',
        'Broadcast Rate': '1.0 Hz (1000ms sub-second interval)',
        'Client Handling': 'Multiplexed event broadcast to connected clients',
        'Heartbeat': 'Ping / Pong liveness checks every 30s'
      }
    },
    {
      id: 'dashboard',
      title: 'React 19 App',
      category: 'Executive Dashboard',
      icon: LayoutDashboard,
      color: '#10b981',
      x: 940,
      y: 120,
      summary: 'Control room UI with Recharts live area graphs and multi-slab billing.',
      techDetails: {
        'Framework': 'React 19 + Vite 6 (HMR)',
        'Visuals': 'Recharts glowing SVG paths + Framer Motion',
        'State Management': 'React Context with sub-second reactivity',
        'Aesthetics': 'Glassmorphism, custom themes, dark energy palette'
      }
    }
  ];

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge">
        <Server size={14} />
        <span>Interactive Architecture Map</span>
      </div>

      <h2 className="pres-slide-title">
        End-to-End System Telemetry Pipeline
      </h2>

      <p className="pres-slide-subtitle">
        Hover over any node to inspect its pipeline function, or click for complete electrical and software specifications.
      </p>

      {/* SVG Pipeline Canvas */}
      <div className="pres-glass-card" style={{
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <svg viewBox="0 0 1020 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="pipelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="25%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base connecting line */}
          <path
            d="M 70 120 L 940 120"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Glowing Animated Data Flow Path */}
          <path
            d="M 70 120 L 940 120"
            stroke="url(#pipelineGrad)"
            strokeWidth="3"
            strokeDasharray="18 18"
            fill="none"
            style={{ animation: 'presDataFlow 2s linear infinite' }}
          />

          {/* Nodes */}
          {nodes.map((n, i) => {
            const isHovered = hoveredNode?.id === n.id;
            const isSelected = selectedNode?.id === n.id;
            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(n)}
                onMouseEnter={() => setHoveredNode(n)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Outer Pulsing Aura */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isHovered || isSelected ? 34 : 26}
                  fill={`${n.color}15`}
                  stroke={n.color}
                  strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                  filter="url(#nodeGlow)"
                  style={{ transition: 'all 0.25s ease' }}
                />

                {/* Node Center Badge */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={18}
                  fill="#090e1a"
                  stroke={n.color}
                  strokeWidth="1.5"
                />

                {/* Text Labels */}
                <text
                  x={n.x}
                  y={n.y - 42}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="12"
                  fontWeight="700"
                >
                  {n.title}
                </text>

                <text
                  x={n.x}
                  y={n.y + 46}
                  textAnchor="middle"
                  fill={n.color}
                  fontSize="10"
                  fontWeight="600"
                >
                  {n.category}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Summary Banner */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: 'var(--pres-text-secondary)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={15} style={{ color: hoveredNode ? hoveredNode.color : '#38bdf8' }} />
            <span>
              {hoveredNode
                ? `${hoveredNode.title}: ${hoveredNode.summary}`
                : 'Click any pipeline node above to inspect its Modbus registers, hardware pinout, and protocols.'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {selectedNode ? `Inspecting: ${selectedNode.title}` : '7 Connected Pipeline Stages'}
          </span>
        </div>
      </div>

      {/* Detail Inspector Modal / Drawer */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{
              marginTop: '1rem',
              padding: '1.25rem',
              background: '#090e1a',
              border: `1px solid ${selectedNode.color}`,
              borderRadius: '12px',
              boxShadow: `0 8px 30px ${selectedNode.color}22`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `${selectedNode.color}22`,
                  color: selectedNode.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <selectedNode.icon size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {selectedNode.title} Specifications
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: selectedNode.color, fontWeight: 600 }}>
                    {selectedNode.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="pres-btn-icon"
                style={{ width: '30px', height: '30px' }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}>
              {Object.entries(selectedNode.techDetails).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--pres-text-muted)' }}>{key}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', marginTop: '2px' }}>{val}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
