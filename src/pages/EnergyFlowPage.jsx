import React from 'react';
import { Sliders, Activity } from 'lucide-react';
import EnergyFlowDiagram from '../components/dashboard/EnergyFlowDiagram';
import { useEnergy } from '../context/EnergyContext';
import StatusBadge from '../components/common/StatusBadge';

export default function EnergyFlowPage() {
  const { appliances } = useEnergy();

  return (
    <div className="dashboard-content-grid">
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Energy Flow Distribution</h1>
            <StatusBadge status="live" text="Topology Active" />
          </div>
          <p className="page-subtitle">
            Real-time interactive electrical topology showing current streams from grid generation to branch circuits.
          </p>
        </div>
        <div className="page-header-actions">
          <div className="flow-total-badge font-mono">
            <span>Branch Circuits:</span>
            <strong className="text-gold">{appliances.length} Monitored</strong>
          </div>
        </div>
      </section>

      {/* Main Flow Canvas */}
      <section>
        <EnergyFlowDiagram />
      </section>

      {/* Branch Circuit Matrix */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="card-title">
            <Sliders size={18} className="text-gold" />
            Sub-Circuit Breaker Telemetry
          </h3>
          <span className="metric-subtext font-mono">Real-time branch loading</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {appliances.map((app) => (
            <div
              key={app.id}
              style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {app.name}
                </div>
                <div className="metric-subtext">
                  {app.room} · Circuit {app.priority}
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <div className="metric-value-row">
                  <span className="font-mono" style={{ fontWeight: 700, fontSize: '1.1rem', color: app.power > 0 ? 'var(--color-gold)' : 'var(--text-muted)' }}>
                    {app.power}
                  </span>
                  <span className="metric-unit">W</span>
                </div>
                <div className="metric-subtext font-mono">
                  {app.energyToday} kWh today
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
