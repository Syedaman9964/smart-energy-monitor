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
import { Activity, Clock } from 'lucide-react';

/**
 * Custom Tooltip for the Dark Mode Chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '8px',
        padding: '0.65rem 0.9rem',
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        color: '#f3f4f6',
        fontSize: '0.85rem'
      }}>
        <div style={{ color: '#9ca3af', marginBottom: '4px', fontSize: '0.75rem' }}>
          Time: <strong style={{ color: '#fff' }}>{label || data.time || data.label}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
          <span>● Power:</span>
          <strong>{payload[0].value} W</strong>
        </div>
        {data.voltage && (
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '3px' }}>
            Voltage: {data.voltage} V | Current: {data.current} A
          </div>
        )}
      </div>
    );
  }
  return null;
};

/**
 * LivePowerChart - Responsive power consumption graph with time range switcher
 * 
 * @param {Array} data - Array of chart data points [{ time/label, power, voltage, current }]
 * @param {string} activeRange - Current selected time filter ('live' | '1h' | '24h' | '7d')
 * @param {Function} onRangeChange - Callback when switching time range
 * @param {boolean} isLive - Whether live streaming is active
 */
export default function LivePowerChart({
  data = [],
  activeRange = 'live',
  onRangeChange,
  isLive = true
}) {
  const [hoveredValue, setHoveredValue] = useState(null);

  // Compute summary stats from current visible data
  const powers = data.map(d => Number(d.power) || 0).filter(p => p > 0);
  const maxPower = powers.length ? Math.max(...powers) : 0;
  const minPower = powers.length ? Math.min(...powers) : 0;
  const avgPower = powers.length ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : 0;
  const currentPower = powers.length ? powers[powers.length - 1] : 0;

  const timeRanges = [
    { id: 'live', label: 'Real-Time' },
    { id: '1h', label: '1 Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' }
  ];

  return (
    <div className="dashboard-card chart-card">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title-area">
          <h2 className="chart-title">Power Consumption (Active Load)</h2>
          {activeRange === 'live' && isLive && (
            <span className="live-indicator">
              <span className="live-dot"></span>
              Live Feed
            </span>
          )}
        </div>

        {/* Time Filter Tabs */}
        <div className="chart-actions">
          <div className="tab-button-group">
            {timeRanges.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeRange === tab.id ? 'active' : ''}`}
                onClick={() => onRangeChange && onRangeChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG / Canvas Responsive Chart */}
      <div className="chart-canvas-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activePayload && state.activePayload.length) {
                setHoveredValue(state.activePayload[0].value);
              }
            }}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <defs>
              {/* Amber / Gold Glow Gradient for Power */}
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />

            <XAxis
              dataKey={activeRange === 'live' ? 'time' : 'label'}
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />

            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}W`}
              domain={['auto', 'auto']}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="power"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#powerGradient)"
              isAnimationActive={false} // Smooth live rendering without constant restart animation
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats Summary */}
      <div className="chart-summary-bar">
        <div className="chart-stat-item">
          <span className="chart-stat-label">Current Load</span>
          <span className="chart-stat-value font-mono" style={{ color: '#f59e0b' }}>
            {hoveredValue ? `${hoveredValue} W` : `${currentPower} W`}
          </span>
        </div>

        <div className="chart-stat-item">
          <span className="chart-stat-label">Average Load</span>
          <span className="chart-stat-value font-mono">{avgPower} W</span>
        </div>

        <div className="chart-stat-item">
          <span className="chart-stat-label">Peak Power</span>
          <span className="chart-stat-value font-mono" style={{ color: '#ef4444' }}>
            {maxPower} W
          </span>
        </div>

        <div className="chart-stat-item">
          <span className="chart-stat-label">Minimum Load</span>
          <span className="chart-stat-value font-mono" style={{ color: '#10b981' }}>
            {minPower} W
          </span>
        </div>
      </div>
    </div>
  );
}
