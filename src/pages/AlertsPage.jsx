import React, { useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  CheckCheck,
  Filter,
  Sliders,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import StatusBadge from '../components/common/StatusBadge';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, markAllAlertsRead } = useEnergy();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = useMemo(() => {
    if (filterSeverity === 'ALL') return alerts;
    return alerts.filter(a => a.severity.toUpperCase() === filterSeverity);
  }, [alerts, filterSeverity]);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Alerts & Anomaly Center</h1>
            {unreadCount > 0 && (
              <span className="nav-badge-count" style={{ fontSize: '0.78rem' }}>
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="page-subtitle">
            Real-time grid sags, power surges, low power factor alerts, and hardware health anomalies.
          </p>
        </div>

        <div className="page-header-actions">
          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={markAllAlertsRead}>
              <CheckCheck size={16} style={{ color: 'var(--color-success)' }} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </section>

      {/* Severity Filter Tabs */}
      <section className="dashboard-card" style={{ padding: '0.85rem 1.25rem', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tab-button-group">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              className={`tab-btn ${filterSeverity === sev ? 'active' : ''}`}
              onClick={() => setFilterSeverity(sev)}
            >
              {sev} {sev !== 'ALL' ? `(${alerts.filter(a => a.severity.toUpperCase() === sev).length})` : `(${alerts.length})`}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing {filteredAlerts.length} total events
        </div>
      </section>

      {/* Alerts List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredAlerts.length === 0 ? (
          <div className="dashboard-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--color-success)', margin: '0 auto 12px auto' }} />
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '4px' }}>No Active Anomalies</h4>
            <p style={{ fontSize: '0.85rem' }}>All power parameters and hardware systems are operating within nominal limits.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isCritical = alt.severity === 'critical';
            const isWarning = alt.severity === 'warning';
            const SevIcon = isCritical ? AlertCircle : isWarning ? AlertTriangle : Info;
            const accentColor = isCritical ? 'var(--color-danger)' : isWarning ? 'var(--color-warning)' : 'var(--color-gold)';

            return (
              <div
                key={alt.id}
                className="dashboard-card"
                style={{
                  padding: '1.25rem',
                  borderLeft: `4px solid ${accentColor}`,
                  background: !alt.read ? 'rgba(212, 175, 55, 0.04)' : 'var(--bg-card)',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: isCritical ? 'rgba(239, 68, 68, 0.12)' : isWarning ? 'rgba(245, 158, 11, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                        color: accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <SevIcon size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 className="card-title">{alt.title}</h4>
                        <StatusBadge status={alt.severity} text={alt.severity} pulse={!alt.acknowledged} />
                        <span className="metric-subtext">· {alt.category}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {alt.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {alt.metric}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{alt.timestamp}</span>
                    </div>

                    {!alt.acknowledged ? (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        onClick={() => acknowledgeAlert(alt.id)}
                      >
                        <CheckCircle2 size={14} />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCheck size={15} />
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
