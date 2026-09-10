import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Activity,
  Gauge,
  BatteryCharging,
  Radio,
  Percent,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';
import AnimatedNumber from '../common/AnimatedNumber';
import Sparkline from '../common/Sparkline';

const METRIC_CONFIGS = {
  voltage: {
    icon: Zap,
    accentVar: 'var(--color-voltage)',
    glowVar: 'var(--color-voltage-glow)',
    className: 'voltage',
    rangeText: 'Normal (220 - 240V)'
  },
  current: {
    icon: Activity,
    accentVar: 'var(--color-current)',
    glowVar: 'var(--color-current-glow)',
    className: 'current',
    rangeText: 'Load (0 - 100A)'
  },
  power: {
    icon: Gauge,
    accentVar: 'var(--color-gold)',
    glowVar: 'var(--color-gold-glow)',
    className: 'power',
    rangeText: 'Active Load'
  },
  energy: {
    icon: BatteryCharging,
    accentVar: 'var(--color-success)',
    glowVar: 'var(--color-success-bg)',
    className: 'energy',
    rangeText: 'PZEM Meter'
  },
  frequency: {
    icon: Radio,
    accentVar: 'var(--color-frequency)',
    glowVar: 'var(--color-frequency-glow)',
    className: 'frequency',
    rangeText: 'Grid Stable (50Hz)'
  },
  powerFactor: {
    icon: Percent,
    accentVar: 'var(--color-powerfactor)',
    glowVar: 'var(--color-powerfactor-glow)',
    className: 'powerfactor',
    rangeText: 'cos φ (0.0 - 1.0)'
  }
};

export default function MetricCard({
  type = 'power',
  title,
  value,
  unit,
  trend = 'stable',
  subtext,
  minVal,
  maxVal,
  sparklineData = [],
  decimals = 1,
  tooltip
}) {
  const config = METRIC_CONFIGS[type] || METRIC_CONFIGS.power;
  const Icon = config.icon;

  const renderTrend = () => {
    if (trend === 'up') return <span className="metric-trend up"><TrendingUp size={12} /> High</span>;
    if (trend === 'down') return <span className="metric-trend down"><TrendingDown size={12} /> Low</span>;
    return <span className="metric-trend stable"><Minus size={12} /> Nominal</span>;
  };

  return (
    <motion.div
      className={`dashboard-card metric-card ${config.className}`}
      whileHover={{ y: -2, transition: { duration: 0.16 } }}
    >
      {/* Header */}
      <div className="metric-card-header">
        <div className="metric-title-group">
          <div
            className="metric-icon-box"
            style={{
              background: config.glowVar,
              color: config.accentVar
            }}
          >
            <Icon size={16} />
          </div>
          <div>
            <span className="metric-label">{title}</span>
            {tooltip && (
              <span title={tooltip} style={{ cursor: 'help', marginLeft: '4px', color: 'var(--text-muted)' }}>
                <Info size={11} />
              </span>
            )}
          </div>
        </div>

        {/* Sparkline trend */}
        {sparklineData.length > 1 && (
          <Sparkline
            data={sparklineData}
            width={58}
            height={20}
            color={config.accentVar}
            strokeWidth={1.8}
          />
        )}
      </div>

      {/* Main Metric Value with Smooth Interpolation */}
      <div className="metric-body">
        <span className="metric-value font-mono">
          <AnimatedNumber value={value} decimals={decimals} />
        </span>
        <span className="metric-unit">{unit}</span>
      </div>

      {/* Footer Info */}
      <div className="metric-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {renderTrend()}
          {subtext && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>· {subtext}</span>}
        </div>

        {minVal !== undefined && maxVal !== undefined && (
          <span className="metric-range-badge font-mono">
            {minVal} - {maxVal} {unit}
          </span>
        )}
      </div>
    </motion.div>
  );
}
