import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Activity,
  Code2,
  HelpCircle,
  HardDrive,
  Shield,
  Zap,
  Server,
  Wifi,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  FileCode
} from 'lucide-react';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-content-grid">
      {/* Top Hero Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Developer & Engineering Documentation</h1>
          </div>
          <p className="page-subtitle">
            Complete technical specification, IoT system architecture, hardware schematics, and Viva defense guide.
          </p>
        </div>

        <div className="page-header-actions">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('overview')}
            >
              <Layers size={15} />
              <span>Overview</span>
            </button>
            <button
              className={activeTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('architecture')}
            >
              <Cpu size={15} />
              <span>Architecture</span>
            </button>
            <button
              className={activeTab === 'hardware' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('hardware')}
            >
              <HardDrive size={15} />
              <span>Hardware</span>
            </button>
            <button
              className={activeTab === 'dataflow' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('dataflow')}
            >
              <Activity size={15} />
              <span>Data Flow</span>
            </button>
            <button
              className={activeTab === 'api' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('api')}
            >
              <Code2 size={15} />
              <span>API Specs</span>
            </button>
            <button
              className={activeTab === 'viva' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('viva')}
            >
              <HelpCircle size={15} />
              <span>Viva Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content 1: Overview & Stack */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.15rem', color: 'var(--color-gold)' }}>
              <Layers size={20} />
              Project Summary & Problem Statement
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              <strong>WattVision</strong> is an intelligent, edge-connected IoT Smart Energy Monitoring and Analytics
              platform designed to measure, disaggregate, and optimize electrical energy consumption in real-time.
              Traditional utility electromechanical or electronic meters are passive and offer only monthly cumulative totals.
              WattVision bridges this gap by streaming high-resolution telemetry (Voltage, Current, Active Power, Energy,
              Frequency, and Power Factor) to a responsive cloud web dashboard.
            </p>

            <div className="telemetry-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '0.5rem' }}>
              <div className="telemetry-item" style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
                <span className="telemetry-label" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>IoT Hardware Layer</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  ESP32 Dual-Core SoC + PZEM-004T v3.0 Multi-Parameter AC Sensor + 16x2 I2C LCD Local Display.
                </span>
              </div>
              <div className="telemetry-item" style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
                <span className="telemetry-label" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>Communication Layer</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  TTL Hardware UART (Modbus-RTU) @ 9600 baud, 802.11 b/g/n Wi-Fi, HTTP REST endpoints & WebSockets.
                </span>
              </div>
              <div className="telemetry-item" style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
                <span className="telemetry-label" style={{ color: '#f59e0b', fontWeight: '600' }}>Frontend Web Dashboard</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  React 19, Vite, Recharts, Lucide Icons, Glassmorphism CSS design system, Indian DISCOM tariff calculator.
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.15rem', color: '#10b981' }}>
              <FileCode size={20} />
              Software Architecture & Folder Hierarchy
            </h3>
            <pre style={{
              background: '#070b12',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              color: '#34d399',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              overflowX: 'auto'
            }}>
{`smart-energy-monitor/
├── firmware/
│   └── esp32/
│       ├── energy_monitor.ino    # Arduino entry-point (setup/loop/state machine)
│       ├── config.h              # Pinouts, Wi-Fi SSID, API endpoints, calibration
│       ├── pzem_handler.h        # PZEM-004T Modbus UART read/parse logic
│       ├── lcd_handler.h         # 16x2 LiquidCrystal_I2C screen display manager
│       ├── wifi_manager.h        # Auto-reconnecting Wi-Fi & HTTP POST client
│       └── README.md             # Hardware flashing instructions & circuit pinout
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md   # Detailed end-to-end hardware-to-cloud block diagram
│   ├── DATA_FLOW.md             # Precise byte-level pipeline of 6 electrical metrics
│   ├── HARDWARE_SETUP.md        # PZEM-004T wiring, safety CT clamp isolation, pinouts
│   ├── API_DOCUMENTATION.md     # REST and WebSocket JSON payload schemas
│   ├── PROJECT_DOCUMENTATION.md # Full project report & implementation summary
│   ├── VIVA_QUESTIONS.md        # 40+ In-depth Viva Voce defense questions & answers
│   ├── CIRCUIT_DIAGRAM.md       # ASCII & schematic circuit diagram
│   └── ENERGY_CALCULATIONS.md   # Mathematical equations for P, Q, S, PF, CO2
├── src/
│   ├── components/              # Modular Reusable React UI Blocks
│   │   ├── Dashboard/           # Overview widgets & real-time cards
│   │   ├── Charts/              # Recharts SVG streaming Area/Bar/Line visualizations
│   │   ├── EnergyCards/         # Metric cards (V, I, P, kWh, Hz, PF)
│   │   ├── Sidebar/             # Navigation sidebar & responsive drawer
│   │   ├── Header/              # TopBar with search, live clock & status
│   │   └── Common/              # AnimatedNumber, Modal, Search, Badges
│   ├── data/                    # Mock data & Indian DISCOM tariff configuration
│   ├── services/                # Telemetry service & REST/WebSocket ApiService
│   ├── utils/                   # Electrical math, INR currency & IST formatters
│   ├── pages/                   # 13 Dedicated feature views
│   └── styles/                  # Modular CSS design system tokens
└── package.json`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content 2: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem', color: '#38bdf8' }}>
            <Cpu size={20} />
            End-to-End System Architecture
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The physical flow of high-voltage AC measurements through sensor isolation, embedded microcontroller processing,
            local network transport, and cloud-rendered React UI:
          </p>

          <pre style={{
            background: '#070b12',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            overflowX: 'auto'
          }}>
{`+-----------------------------------------------------------------------------------+
|                           AC MAINS 230V 50Hz ELECTRICAL LOAD                      |
+-----------------------------------------------------------------------------------+
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
              (Voltage Leads)                        (Non-invasive CT Clamp)
                    │                                         │
                    ▼                                         ▼
+-----------------------------------------------------------------------------------+
|                        PZEM-004T v3.0 ENERGY METER SENSOR                         |
|   - Dedicated SD3004 / V9881D Energy Metering IC                                  |
|   - Optical Isolator (PC817) for High-Voltage Electrical Isolation                |
|   - Measures: Voltage (V), Current (A), Active Power (W), Energy (kWh), Hz, PF   |
+-----------------------------------------------------------------------------------+
                                         │
                                (TTL UART @ 9600 Baud)
                                (GPIO16 RX2 / GPIO17 TX2)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                          ESP32 DUAL-CORE MICROCONTROLLER                          |
|   - Core 0: Modbus-RTU UART Request/Response Polling (2-second interval)         |
|   - Core 1: 16x2 I2C LCD Display Rendering + 802.11b/g/n Wi-Fi Network Transport  |
|   - Local Fail-Safe Flash (NVS) logging in case Wi-Fi drops                       |
+-----------------------------------------------------------------------------------+
                                         │
                         (Wi-Fi 2.4 GHz TCP/IP Connection)
                         (HTTP POST / JSON / WebSocket)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                          BACKEND API / CLOUD GATEWAY                              |
|   - Node.js / Express or Python FastAPI Server                                    |
|   - TimescaleDB / InfluxDB / PostgreSQL for Time-Series Historical Logging        |
|   - Real-time WebSocket Broadcaster                                               |
+-----------------------------------------------------------------------------------+
                                         │
                                (JSON Stream / HTTPS)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       REACT 19 + VITE CLIENT DASHBOARD                            |
|   - Context API state synchronization & Live 1-second auto-refresh                |
|   - Recharts Real-Time SVG Power Glow Area Chart                                  |
|   - Multi-tier Indian DISCOM Tariff & Carbon Footprint Calculators                |
+-----------------------------------------------------------------------------------+`}
          </pre>
        </div>
      )}

      {/* Tab Content 3: Hardware & PZEM */}
      {activeTab === 'hardware' && (
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem', color: '#f59e0b' }}>
            <HardDrive size={20} />
            Hardware Bill of Materials (BOM) & Pinout
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="recent-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Model / Specification</th>
                  <th>Operating Voltage</th>
                  <th>Key Role / Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '600', color: '#38bdf8' }}>Microcontroller</td>
                  <td className="font-mono">ESP32-WROOM-32 (38 Pins)</td>
                  <td className="font-mono">3.3V DC (5V USB)</td>
                  <td>Dual-core 240MHz MCU, handles UART sensor acquisition and Wi-Fi transmission.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>Energy Meter IC</td>
                  <td className="font-mono">PZEM-004T v3.0</td>
                  <td className="font-mono">5V DC (TTL side)</td>
                  <td>Measures 80-260V AC, 0-100A RMS with built-in optocoupler isolation.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600', color: '#f59e0b' }}>Current Sensor</td>
                  <td className="font-mono">Split-Core CT Clamp (100A)</td>
                  <td className="font-mono">Induced Secondary</td>
                  <td>Non-invasive magnetic flux measurement clamped around Live AC wire.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600', color: '#a855f7' }}>Local Display</td>
                  <td className="font-mono">16x2 Character LCD (I2C)</td>
                  <td className="font-mono">5V DC (PCF8574T)</td>
                  <td>Displays Live Voltage, Power, and IP address without requiring internet.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600', color: '#ec4899' }}>Power Supply</td>
                  <td className="font-mono">Hi-Link HLK-PM01 (AC-DC)</td>
                  <td className="font-mono">230V AC → 5V DC 3W</td>
                  <td>Steps down mains 230V AC to stable 5V DC to power ESP32, LCD, and PZEM TTL.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 4: Data Flow */}
      {activeTab === 'dataflow' && (
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem', color: '#10b981' }}>
            <Activity size={20} />
            6-Parameter Electrical Data Pipeline
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            How each raw electrical parameter is acquired, verified with CRC checksums, and displayed:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>1. RMS Voltage (V)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                PZEM measures voltage across AC input terminals with 0.1V precision. Expected single-phase grid range: 220V - 240V.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>2. Current in Amperes (A)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Measured through split-core CT with 0.001A (1mA) resolution. Senses total active load draw.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>3. Active Real Power (W)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                True power consumed by appliances: <code style={{ color: 'var(--color-gold)' }}>P = V × I × cos φ</code>. Range: 0 - 23,000W.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>4. Cumulative Energy (kWh)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Time integral of active power over hours. Preserved inside PZEM internal non-volatile EEPROM even through power outages.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>5. Grid Frequency (Hz)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                AC line zero-crossing frequency. Nominal Indian grid standard is 50.00 Hz (operating band: 49.50 - 50.50 Hz).
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>6. Power Factor (cos φ)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Ratio of Real Power (W) to Apparent Power (VA): <code style={{ color: 'var(--color-gold)' }}>PF = P / S</code>. Scale: 0.00 to 1.00.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: API Specs */}
      {activeTab === 'api' && (
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem', color: 'var(--color-gold)' }}>
            <Code2 size={20} />
            REST & WebSocket API Endpoints Specification
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ background: 'var(--color-success)', color: '#000', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>GET</span>
                <span className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>/api/telemetry/live</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Returns real-time electrical parameters snapshot from sensor memory.</p>
              <pre style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>
{`{
  "voltage": 230.4,
  "current": 5.82,
  "power": 1341.0,
  "energy": 148.42,
  "frequency": 50.01,
  "powerFactor": 0.96,
  "timestamp": "2026-08-17T22:30:00.000Z"
}`}
              </pre>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ background: 'var(--color-gold)', color: '#000', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>POST</span>
                <span className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>/api/tariff/config</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Updates local billing rate per kWh and peak hour rules.</p>
              <pre style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>
{`{
  "currency": "₹",
  "baseRatePerKwh": 8.00,
  "peakRatePerKwh": 12.00,
  "taxRatePercent": 18.0
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 6: Viva Cheat Sheet */}
      {activeTab === 'viva' && (
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem', color: 'var(--color-gold)' }}>
            <HelpCircle size={20} />
            Viva Voce & Faculty Examination Cheat Sheet
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '4px' }}>
                Q1. Why did you use PZEM-004T instead of ACS712 current sensor?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong>Answer:</strong> The ACS712 is an analog Hall-effect sensor that only measures current; calculating real power with it requires sampling AC voltage waveforms simultaneously with fast ADC, which is noisy on ESP32. PZEM-004T contains a dedicated high-precision energy metering IC (SD3004) that computes true RMS voltage, current, active power, frequency, and power factor in hardware with optical galvanic isolation.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '4px' }}>
                Q2. What is the difference between Real Power, Apparent Power, and Power Factor?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong>Answer:</strong> Real / Active Power (Watts) is the actual energy converted to work (heat, light, motion). Apparent Power (Volt-Amps) is the product of RMS voltage and current. Power Factor (cos φ) is the ratio of Real to Apparent Power (P / S). A low PF means higher current is drawn from the grid without producing useful work, leading to transmission losses and utility penalties.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '4px' }}>
                Q3. How does the ESP32 communicate with the PZEM-004T?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong>Answer:</strong> Over asynchronous TTL UART serial at 9600 baud using Modbus-RTU protocol. The ESP32 sends a query frame requesting input registers, and the PZEM responds with a payload containing all 6 electrical readings verified with a 16-bit CRC checksum.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '4px' }}>
                Q4. What is the Indian Grid Baseline Carbon Emission Factor?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong>Answer:</strong> According to the Central Electricity Authority (CEA) of India CO2 Baseline Database, India's grid emission factor is approximately 0.82 kg CO2 / kWh due to the thermal (coal-dominated) generation mix.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
