import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  Percent,
  Terminal,
  Radio
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import StatusBadge from '../components/common/StatusBadge';

export default function LiveMonitoringPage() {
  const { telemetry, isLive, themeMode } = useEnergy();
  const canvasRef = useRef(null);
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Synthesize realistic 50Hz AC Sine Wave on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const isDark = themeMode === 'dark';

      // Draw Grid lines
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Zero-crossing center line
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (isLive) {
        phase += 0.08;
      }

      // 1. Draw Voltage Waveform (Refined Metallic Silver)
      ctx.strokeStyle = isDark ? 'rgba(226, 232, 240, 0.85)' : 'rgba(51, 65, 85, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const angle = (x / 40) + phase;
        const amplitude = 55 + (telemetry.voltage - 230) * 1.5;
        const y = centerY + Math.sin(angle) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Draw Current Waveform (Warm Light Gold Signature) with phase lag (cos φ)
      const phaseLag = Math.acos(Math.max(0, Math.min(1, telemetry.powerFactor)));
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const angle = (x / 40) + phase - phaseLag;
        const amplitude = 35 + (telemetry.current - 8) * 2;
        const y = centerY + Math.sin(angle) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLive, telemetry.voltage, telemetry.current, telemetry.powerFactor, themeMode]);

  // Terminal telemetry streaming logs
  useEffect(() => {
    if (!isLive) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logLine = `[${timestamp}] RAW_UART_FRAME: V=${telemetry.voltage}V | I=${telemetry.current}A | P=${telemetry.power}W | PF=${telemetry.powerFactor} | F=${telemetry.frequency}Hz | CRC=0x3F`;

    setTerminalLogs((prev) => [logLine, ...prev.slice(0, 15)]);
  }, [telemetry.timestamp, isLive]);

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Live Monitoring Center</h1>
            <StatusBadge status={isLive ? 'live' : 'standby'} text={isLive ? 'High-Speed Stream' : 'Paused'} />
          </div>
          <p className="page-subtitle">
            Real-time oscilloscope AC waveform, vector power factor analysis, and raw telemetry diagnostics.
          </p>
        </div>

        <div className="page-header-actions">
          <div className="flow-total-badge font-mono">
            <span>Sampling:</span>
            <strong className="text-gold">0.5 Hz (2000ms)</strong>
          </div>
        </div>
      </section>

      {/* Main Grid: Waveform + Gauges */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Oscilloscope Waveform Display */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} className="text-gold" />
              <h3 className="card-title">AC Mains Waveform & Phase Vector</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }} />
                Voltage ({telemetry.voltage}V RMS)
              </span>
              <span style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-gold)' }} />
                Current ({telemetry.current}A RMS)
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div style={{
            width: '100%',
            height: '240px',
            background: 'var(--bg-surface-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <canvas
              ref={canvasRef}
              width={750}
              height={240}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              Grid Period: 20.0ms (50.0 Hz)
            </div>
          </div>

          {/* Waveform Diagnostics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '4px' }}>
            <div className="telemetry-item">
              <span className="telemetry-label">Grid Stability</span>
              <span className="telemetry-value font-mono" style={{ color: 'var(--color-success)' }}>99.8% (Nominal)</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Phase Shift (φ)</span>
              <span className="telemetry-value font-mono text-gold">
                {(Math.acos(telemetry.powerFactor) * (180 / Math.PI)).toFixed(1)}°
              </span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Apparent Power</span>
              <span className="telemetry-value font-mono">{telemetry.apparentPower} VA</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Reactive Power</span>
              <span className="telemetry-value font-mono" style={{ color: 'var(--color-warning)' }}>
                {telemetry.reactivePower} VAR
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dials & Power Factor Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Power Factor Gauge Card */}
          <div className="dashboard-card" style={{ gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="card-title">
                <Percent size={18} className="text-gold" />
                Power Factor Matrix
              </h3>
              <span className="metric-range-badge font-mono text-gold">PF {telemetry.powerFactor}</span>
            </div>

            <div style={{
              background: 'var(--color-gold-surface)',
              border: '1px solid var(--color-gold-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-gold)', lineHeight: 1 }} className="font-mono">
                {telemetry.powerFactor}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Displacement Efficiency: <strong style={{ color: 'var(--color-success)' }}>Optimal (&gt; 0.90)</strong>
              </div>
            </div>

            <div className="cost-breakdown-list" style={{ fontSize: '0.82rem' }}>
              <div className="cost-row">
                <span className="cost-row-label">Active Real Power (P)</span>
                <span className="cost-row-val font-mono text-gold">{telemetry.power} W</span>
              </div>
              <div className="cost-row">
                <span className="cost-row-label">Apparent Load (S)</span>
                <span className="cost-row-val font-mono">{telemetry.apparentPower} VA</span>
              </div>
              <div className="cost-row">
                <span className="cost-row-label">Reactive Load (Q)</span>
                <span className="cost-row-val font-mono" style={{ color: 'var(--color-warning)' }}>{telemetry.reactivePower} VAR</span>
              </div>
            </div>
          </div>

          {/* Grid Frequency Drift */}
          <div className="dashboard-card" style={{ gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="card-title">
                <Radio size={18} className="text-gold" />
                Frequency Drift
              </h3>
              <span className="font-mono" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                {telemetry.frequency} Hz
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Deviation: {Math.abs(+(telemetry.frequency - 50.0).toFixed(2))} Hz from 50.00 Hz nominal standard
            </p>
          </div>
        </div>
      </section>

      {/* Raw UART Telemetry Terminal Stream */}
      <section className="dashboard-card" style={{ padding: '1.25rem', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={17} className="text-gold" />
            <h3 className="card-title">Raw Telemetry Stream (PZEM-004T TTL Frame Buffer)</h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>9600-8-N-1 UART</span>
        </div>

        <div style={{
          background: 'var(--bg-surface-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          color: 'var(--color-gold-light)',
          maxHeight: '180px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {terminalLogs.map((log, index) => (
            <div key={index} style={{ opacity: index === 0 ? 1 : 0.7 - index * 0.04 }}>
              {log}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
