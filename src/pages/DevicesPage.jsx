import React from 'react';
import {
  Cpu,
  Wifi,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  Terminal,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import StatusBadge from '../components/common/StatusBadge';

export default function DevicesPage() {
  const { hardware, isLive } = useEnergy();

  const uptimeHours = (hardware.uptimeSeconds / 3600).toFixed(1);
  const freeKb = Math.round(hardware.freeHeap / 1024);

  return (
    <div className="dashboard-content-grid">
      {/* Top Hero */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">IoT Device Fleet & Telemetry Node</h1>
            <StatusBadge status="simulation" text="Simulation / Demo Mode" />
          </div>
          <p className="page-subtitle">
            Hardware diagnostic console for ESP32 microcontrollers and PZEM-004T TTL optical sensor modules.
          </p>
        </div>
        <div className="page-header-actions">
          <div className="flow-total-badge font-mono">
            <span>Sampling:</span>
            <strong className="text-gold">{hardware.sampleRateMs} ms</strong>
          </div>
        </div>
      </section>

      {/* Main Telemetry & Hardware Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Device Health Summary */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={22} />
              </div>
              <div>
                <h3 className="card-title">{hardware.deviceId}</h3>
                <span className="metric-subtext">{hardware.deviceModel}</span>
              </div>
            </div>
            <StatusBadge status={isLive ? 'live' : 'standby'} text={isLive ? 'ONLINE' : 'IDLE'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="telemetry-item">
              <span className="telemetry-label">Virtual IP / Port</span>
              <span className="telemetry-value font-mono">{hardware.ipAddress}</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">MAC Address</span>
              <span className="telemetry-value font-mono">{hardware.macAddress}</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">Wi-Fi Signal (RSSI)</span>
              <span className="telemetry-value font-mono" style={{ color: 'var(--color-success)' }}>
                {hardware.wifiRssi} dBm ({hardware.wifiQuality})
              </span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">System Uptime</span>
              <span className="telemetry-value font-mono">{uptimeHours} hours</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">Free Heap Memory</span>
              <span className="telemetry-value font-mono">{freeKb} KB SRAM</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">Internal Core Temp</span>
              <span className="telemetry-value font-mono" style={{ color: hardware.cpuTemp > 50 ? 'var(--color-warning)' : 'var(--color-gold)' }}>
                {hardware.cpuTemp}°C
              </span>
            </div>
          </div>
        </div>

        {/* PZEM-004T Sensor Link Quality */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>PZEM-004T Sensor Link</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optoisolated TTL UART</span>
              </div>
            </div>
            <span className="metric-range-badge font-mono">9600 Baud</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="telemetry-item">
              <span className="telemetry-label">CRC Error Rate</span>
              <span className="telemetry-value font-mono" style={{ color: 'var(--color-success)' }}>0.00% (0 errors)</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">Sampling Period</span>
              <span className="telemetry-value font-mono">{hardware.sampleRateMs} ms</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">Current Transformer</span>
              <span className="telemetry-value">100A Solid CT Coil</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">Firmware Build</span>
              <span className="telemetry-value font-mono">{hardware.firmwareVersion}</span>
            </div>
          </div>

          <div className="esp32-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-gold)', marginBottom: '3px' }}>
              <ShieldCheck size={15} />
              <span>Decoupled Service Layer</span>
            </div>
            <p>
              When your physical ESP32 is powered on, point your firmware WebSocket or HTTP endpoint to this frontend without changing UI components.
            </p>
          </div>
        </div>
      </section>

      {/* Hardware Wiring & Integration Blueprint */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
        <h3 className="card-title">
          <Terminal size={18} style={{ color: 'var(--color-gold)' }} />
          ESP32 + PZEM-004T Hardware Wiring Roadmap (Phase 2 Blueprint)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--color-gold)', fontWeight: 600, marginBottom: '6px' }}>1. UART Pin Connections</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>ESP32 GPIO 16 (RX2) → PZEM-004T TX</li>
              <li>ESP32 GPIO 17 (TX2) → PZEM-004T RX</li>
              <li>ESP32 5V & GND → PZEM Logic Power</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--color-warning)', fontWeight: 600, marginBottom: '6px' }}>2. High Voltage AC Terminals</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>PZEM Live & Neutral → 230V AC Mains</li>
              <li>CT Current Clamp → Passed around Live Line</li>
              <li>Proper enclosure and fuse protection</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--color-success)', fontWeight: 600, marginBottom: '6px' }}>3. Network Protocols</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>Wi-Fi Station mode with auto-reconnect</li>
              <li>AsyncWebSocket server broadcast at 1-2 Hz</li>
              <li>Optional MQTT JSON payload to broker</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
