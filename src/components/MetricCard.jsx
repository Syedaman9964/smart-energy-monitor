import React from 'react';
import { 
  Zap, 
  Activity, 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BatteryCharging, 
  Radio, 
  Percent 
} from 'lucide-react';

/**
 * Maps metric type to corresponding icon and CSS color class
 */
const METRIC_CONFIG = {
  voltage: {
    icon: Zap,
    className: 'voltage',
    rangeLabel: '220V - 240V'
  },
  current: {
    icon: Activity,
    className: 'current',
    rangeLabel: '0A - 100A'
  },
  power: {
    icon: Gauge,
    className: 'power',
    rangeLabel: 'Active Load'
  },
  energy: {
    icon: BatteryCharging,
    className: 'energy',
    rangeLabel: 'Cumulative'
  },
  frequency: {
    icon: Radio,
    className: 'frequency',
    rangeLabel: '49.5 - 50.5 Hz'
  },
  powerFactor: {
    icon: Percent,
    className: 'powerfactor',
    rangeLabel: '0.0 - 1.0 (cos φ)'
  }
};

/**
 * MetricCard - Reusable component for displaying real-time electrical telemetry
 * 
 * @param {string} type - 'voltage' | 'current' | 'power' | 'energy' | 'frequency' | 'powerFactor'
 * @param {string} title - Human readable metric label
 * @param {number|string} value - Current measured value
 * @param {string} unit - Measurement unit (V, A, W, kWh, Hz, PF)
 * @param {string} trend - 'up' | 'down' | 'stable'
 * @param {string} subtext - Optional additional information or sub-label
 */
export default function MetricCard({ 
  type = 'power', 
  title, 
  value, 
  unit, 
  trend = 'stable', 
  subtext 
}) {
  const config = METRIC_CONFIG[type] || METRIC_CONFIG.power;
  const IconComponent = config.icon;

  const renderTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} className="metric-trend up" />;
    if (trend === 'down') return <TrendingDown size={14} className="metric-trend down" />;
    return <Minus size={14} className="metric-trend stable" />;
  };

  return (
    <div className={`dashboard-card metric-card ${config.className}`}>
      {/* Top Header with Icon and Label */}
      <div className="metric-card-header">
        <div className="metric-title-group">
          <div className="metric-icon-box">
            <IconComponent size={18} />
          </div>
          <span className="metric-label">{title}</span>
        </div>
        <span className="metric-range-badge">{config.rangeLabel}</span>
      </div>

      {/* Main Metric Value & Unit */}
      <div className="metric-body">
        <span className="metric-value font-mono">
          {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : value}
        </span>
        <span className="metric-unit">{unit}</span>
      </div>

      {/* Footer with trend and range status */}
      <div className="metric-footer">
        <span className="metric-trend">
          {renderTrendIcon()}
          <span>{trend === 'up' ? 'Rising' : trend === 'down' ? 'Lower' : 'Stable'}</span>
        </span>
        {subtext && <span className="metric-subtext font-mono">{subtext}</span>}
      </div>
    </div>
  );
}
