import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import StatusBadge from '../common/StatusBadge';

const CustomChartTooltip = ({ active, payload, label, unitMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isKw = unitMode === 'kW';
    const powerDisplay = isKw
      ? `${(payload[0].value / 1000).toFixed(3)} kW`
      : `${payload[0].value} W`;

    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
        fontSize: '0.84rem'
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.74rem' }}>
          Time: <strong style={{ color: 'var(--text-primary)' }}>{label || data.time || data.date || data.label}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)', fontSize: '0.94rem' }}>
          <span>● Active Load:</span>
          <strong>{powerDisplay}</strong>
        </div>
        {data.voltage && (
          <div style={{ fontSize: '0.74rem', color: 'var(--color-voltage)', marginTop: '4px', fontWeight: 500 }}>
            Grid Voltage: {data.voltage} V · Current: {data.current} A
          </div>
        )}
        {data.kwh && (
          <div style={{ fontSize: '0.74rem', color: 'var(--color-success)', marginTop: '2px', fontWeight: 500 }}>
            Energy: {data.kwh} kWh {data.cost ? `· Cost: ₹${data.cost}` : ''}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function LivePowerChart({
  data = [],
  activeRange = 'live',
  onRangeChange,
  isLive = true,
  unitMode = 'W'
}) {
  const [hoveredValue, setHoveredValue] = useState(null);

  const ranges = [
    { id: 'live', label: 'Real-Time' },
    { id: '1h', label: '1 Hour' },
    { id: '6h', label: '6 Hours' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' }
  ];

  // Statistical calculations
  const powers = data.map(d => Number(d.power) || 0).filter(p => p > 0);
  const maxPower = powers.length ? Math.max(...powers) : 0;
  const minPower = powers.length ? Math.min(...powers) : 0;
  const avgPower = powers.length ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : 0;
  const currentPower = powers.length ? powers[powers.length - 1] : 0;

  const isKw = unitMode === 'kW';
  const formatVal = (w) => isKw ? `${(w / 1000).toFixed(3)} kW` : `${w} W`;

  return (
    <div className="dashboard-card chart-card">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title-area">
          <div>
            <h2 className="chart-title">Real-Time Power Consumption</h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              High-frequency active real power telemetry (P = V · I · cos φ)
            </p>
          </div>
          {activeRange === 'live' && (
            <StatusBadge status={isLive ? 'live' : 'standby'} text={isLive ? 'LIVE FEED' : 'PAUSED'} />
          )}
        </div>

        {/* Range Tabs */}
        <div className="chart-actions">
          <div className="tab-button-group">
            {ranges.map((r) => (
              <button
                key={r.id}
                className={`tab-btn ${activeRange === r.id ? 'active' : ''}`}
                onClick={() => onRangeChange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive SVG Area Chart */}
      <div className="chart-canvas-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activePayload && state.activePayload.length) {
                setHoveredValue(state.activePayload[0].value);
              }
            }}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <defs>
              <linearGradient id="livePowerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-gold, #d4af37)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-gold, #d4af37)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />

            <XAxis
              dataKey={activeRange === 'live' ? 'time' : activeRange === '30d' ? 'date' : activeRange === '7d' ? 'day' : 'time'}
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
            />

            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => isKw ? `${(v / 1000).toFixed(1)}k` : `${v}W`}
              domain={['auto', 'auto']}
            />

            <Tooltip content={<CustomChartTooltip unitMode={unitMode} />} />

            <Area
              type="monotone"
              dataKey="power"
              stroke="var(--color-gold, #d4af37)"
              strokeWidth={2.4}
              fillOpacity={1}
              fill="url(#livePowerGradient)"
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary Bar */}
      <div className="chart-summary-bar">
        <div className="chart-stat-item">
          <span className="chart-stat-label">Current Active Load</span>
          <span className="chart-stat-value font-mono" style={{ color: 'var(--color-gold)' }}>
            {hoveredValue ? formatVal(hoveredValue) : formatVal(currentPower)}
          </span>
        </div>

        <div className="chart-stat-item">
          <span className="chart-stat-label">Average Demand</span>
          <span className="chart-stat-value font-mono">{formatVal(avgPower)}</span>
        </div>

        <div className="chart-stat-item">
          <span className="chart-stat-label">Peak Recorded</span>
          <span className="chart-stat-value font-mono" style={{ color: 'var(--color-danger)' }}>
            {formatVal(maxPower)}
          </span>
        </div>

        <div className="chart-stat-item">
          <span className="chart-stat-label">Minimum Baseline</span>
          <span className="chart-stat-value font-mono" style={{ color: 'var(--color-success)' }}>
            {formatVal(minPower)}
          </span>
        </div>
      </div>
    </div>
  );
}
