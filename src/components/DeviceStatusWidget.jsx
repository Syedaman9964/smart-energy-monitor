import React from 'react';
import { Cpu, Wifi, HardDrive, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * DeviceStatusWidget - Hardware telemetry and connection diagnostic panel
 * 
 * @param {Object} status - Telemetry object from energyService
 * @param {boolean} isLive - Simulation active status
 */
export default function DeviceStatusWidget({ status, isLive = true }) {
  const {
    deviceModel = 'ESP32-WROOM-32',
    sensorModel = 'PZEM-004T v3.0',
    connectionState = 'SIMULATION_MODE',
    ipAddress = '192.168.1.145 (Virtual)',
    wifiRssi = -62,
    sampleRateMs = 2000,
    firmwareVersion = 'v1.0.0-mock'
  } = status || {};

  return (
    <div className="dashboard-card device-card">
      <div className="card-heading">
        <h3 className="card-title">
          <Cpu size={18} style={{ color: '#38bdf8' }} />
          Hardware Telemetry
        </h3>
        <span className="device-status-badge status-simulation">
          <span className="live-dot" style={{ backgroundColor: '#fbbf24', boxShadow: '0 0 6px #fbbf24' }}></span>
          {isLive ? 'Mock Simulation' : 'Paused'}
        </span>
      </div>

      {/* Grid of hardware parameters */}
      <div className="device-telemetry-grid">
        <div className="telemetry-item">
          <span className="telemetry-label">MCU Device</span>
          <span className="telemetry-value">{deviceModel}</span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">AC Sensor</span>
          <span className="telemetry-value">{sensorModel}</span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Virtual IP / Port</span>
          <span className="telemetry-value font-mono">{ipAddress}</span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Sampling Rate</span>
          <span className="telemetry-value font-mono">{sampleRateMs / 1000}s ({1000 / sampleRateMs} Hz)</span>
        </div>
      </div>

      {/* Notice Banner explaining Mock Mode and future ESP32 link */}
      <div className="esp32-banner">
        <strong>Hardware Ready Architecture:</strong>
        <p style={{ marginTop: '3px' }}>
          This frontend is operating on an isolated data layer. When physical hardware is connected, replace the mock service with the ESP32 WebSocket / HTTP endpoint.
        </p>
      </div>
    </div>
  );
}
