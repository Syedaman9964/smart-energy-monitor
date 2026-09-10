import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Gauge,
  Sliders,
  Wind,
  Refrigerator,
  Monitor,
  Tv,
  Lightbulb
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export default function EnergyFlowDiagram() {
  const { telemetry, appliances, unitMode } = useEnergy();
  const [selectedNode, setSelectedNode] = useState(null);

  const isKw = unitMode === 'kW';
  const formatPower = (w) => isKw ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`;

  // Top 4 active loads for flow mapping
  const topLoads = appliances.slice(0, 4);

  return (
    <div className="dashboard-card energy-flow-card">
      <div className="flow-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} className="text-gold" />
            <h3 className="card-title">Live Energy Flow Distribution</h3>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Interactive dynamic current routing from AC Grid Mains to sub-circuits
          </p>
        </div>

        <div className="flow-total-badge font-mono">
          <span style={{ color: 'var(--text-muted)' }}>Total Load:</span>
          <strong style={{ color: 'var(--color-gold)' }}>{formatPower(telemetry.power)}</strong>
        </div>
      </div>

      {/* SVG & Particle Stream Flow Canvas */}
      <div className="energy-flow-container">
        {/* Tier 1: Utility Grid Source */}
        <div className="flow-tier source-tier">
          <div
            className={`flow-node source-node ${selectedNode === 'grid' ? 'selected' : ''}`}
            onClick={() => setSelectedNode('grid')}
          >
            <div className="node-icon-wrap grid-icon">
              <Zap size={20} />
            </div>
            <div className="node-info">
              <span className="node-tag">Grid Source</span>
              <h4 className="node-title">230V AC Mains</h4>
              <span className="node-stat font-mono">{telemetry.voltage} V · {telemetry.frequency} Hz</span>
            </div>
          </div>
        </div>

        {/* Animated Connector 1: Grid -> Meter */}
        <div className="flow-connector-vertical">
          <div className="flow-line-track">
            <div className="flow-particle-stream" />
          </div>
          <span className="flow-rate-label font-mono">{formatPower(telemetry.power)}</span>
        </div>

        {/* Tier 2: ESP32 + PZEM-004T Meter Node */}
        <div className="flow-tier meter-tier">
          <div
            className={`flow-node meter-node ${selectedNode === 'meter' ? 'selected' : ''}`}
            onClick={() => setSelectedNode('meter')}
          >
            <div className="node-icon-wrap meter-icon">
              <Gauge size={20} />
            </div>
            <div className="node-info">
              <span className="node-tag">Smart Sensor</span>
              <h4 className="node-title">PZEM-004T Meter</h4>
              <span className="node-stat font-mono">{telemetry.current} A RMS · PF {telemetry.powerFactor}</span>
            </div>
            <span className="flow-live-tag">Active</span>
          </div>
        </div>

        {/* Animated Connector 2: Meter -> Main Panel */}
        <div className="flow-connector-vertical">
          <div className="flow-line-track">
            <div className="flow-particle-stream" />
          </div>
        </div>

        {/* Tier 3: Main Distribution Panel */}
        <div className="flow-tier panel-tier">
          <div
            className={`flow-node panel-node ${selectedNode === 'panel' ? 'selected' : ''}`}
            onClick={() => setSelectedNode('panel')}
          >
            <div className="node-icon-wrap panel-icon">
              <Sliders size={20} />
            </div>
            <div className="node-info">
              <span className="node-tag">Distribution</span>
              <h4 className="node-title">Main Breaker Panel</h4>
              <span className="node-stat font-mono">4 Sub-Circuits Active</span>
            </div>
          </div>
        </div>

        {/* Tier 4: Branch Sub-circuits & Appliance Loads */}
        <div className="flow-branches-wrapper">
          <div className="appliances-load-grid">
            {topLoads.map((app) => {
              const icons = {
                Wind: Wind,
                Refrigerator: Refrigerator,
                Monitor: Monitor,
                Tv: Tv,
                Lightbulb: Lightbulb
              };
              const LoadIcon = icons[app.iconName] || Zap;
              const isSelected = selectedNode === app.id;

              return (
                <motion.div
                  key={app.id}
                  className={`appliance-load-box ${isSelected ? 'selected' : ''} ${app.power > 0 ? 'active' : 'idle'}`}
                  onClick={() => setSelectedNode(app.id)}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                >
                  <div className="app-load-top">
                    <div className="app-load-icon">
                      <LoadIcon size={16} />
                    </div>
                    <span className="app-share-pill font-mono">{app.usagePercentage}%</span>
                  </div>

                  <span className="app-load-name" title={app.name}>{app.name}</span>

                  <div className="app-load-values font-mono">
                    <strong style={{ color: app.power > 500 ? 'var(--color-gold)' : 'var(--text-primary)' }}>
                      {formatPower(app.power)}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {app.energyToday} kWh
                    </span>
                  </div>

                  {/* Micro load percentage progress bar */}
                  <div className="app-mini-progress">
                    <div
                      className="app-mini-progress-fill"
                      style={{
                        width: `${app.usagePercentage}%`,
                        backgroundColor: app.power > 800 ? 'var(--color-warning)' : 'var(--color-gold)'
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
