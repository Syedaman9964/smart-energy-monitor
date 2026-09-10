import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  Clock, 
  Settings, 
  RefreshCw, 
  Activity 
} from 'lucide-react';

/**
 * Header - Top Navigation and System Bar
 * 
 * @param {boolean} isLive - Simulation active status
 * @param {Function} onToggleLive - Callback to play/pause live telemetry feed
 * @param {Function} onOpenTariffModal - Callback to open billing modal
 */
export default function Header({ isLive, onToggleLive, onOpenTariffModal }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="dashboard-header">
      <div className="header-inner">
        {/* Brand info */}
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <Zap size={24} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">Smart Energy Monitor</h1>
            <div className="brand-subtitle">
              <Activity size={12} style={{ color: '#10b981' }} />
              <span>ESP32 & PZEM-004T Frontend Dashboard</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Clock */}
        <div className="header-controls">
          {/* Live System Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface-secondary)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Clock size={14} style={{ color: '#38bdf8' }} />
            <span className="font-mono" style={{ color: '#f3f4f6', fontWeight: 600 }}>
              {formattedTime}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>| {formattedDate}</span>
          </div>

          {/* Pause / Resume Simulation */}
          <button
            className="btn-secondary"
            onClick={onToggleLive}
            title={isLive ? "Pause live simulation" : "Resume live simulation"}
          >
            {isLive ? (
              <>
                <Pause size={15} style={{ color: '#f59e0b' }} />
                <span>Pause Feed</span>
              </>
            ) : (
              <>
                <Play size={15} style={{ color: '#10b981' }} />
                <span>Resume Feed</span>
              </>
            )}
          </button>

          {/* Tariff Config Button */}
          <button
            className="btn-icon"
            onClick={onOpenTariffModal}
            title="Configure Tariff Rate"
            aria-label="Tariff Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
