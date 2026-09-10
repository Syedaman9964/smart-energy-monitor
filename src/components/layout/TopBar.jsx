import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Clock,
  Bell,
  Play,
  Pause,
  ChevronRight,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export default function TopBar() {
  const {
    activePage,
    setActivePage,
    setIsSearchOpen,
    isLive,
    toggleLive,
    unitMode,
    setUnitMode,
    themeMode,
    toggleThemeMode,
    isBackendOnline,
    toggleConnectionMode,
    isSoundMuted,
    toggleSoundMute,
    alerts,
    acknowledgeAlert,
    markAllAlertsRead,
    userProfile
  } = useEnergy();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read);

  const pageTitles = {
    dashboard: { title: 'Energy Overview', category: 'Executive Dashboard' },
    live: { title: 'Live Monitoring Center', category: 'High-Frequency Telemetry' },
    flow: { title: 'Energy Flow Distribution', category: 'Particle Current Map' },
    analytics: { title: 'Energy Analytics & Insights', category: 'Historical Analysis' },
    prediction: { title: 'AI Energy Forecasting & Prediction', category: 'Machine Learning & Analytics' },
    appliances: { title: 'Appliance Inventory', category: 'Load Management' },
    devices: { title: 'IoT Device Fleet', category: 'ESP32 & PZEM-004T' },
    alerts: { title: 'Alerts & Anomalies', category: 'Grid Health' },
    history: { title: 'Energy Telemetry Logs', category: 'Data Records' },
    reports: { title: 'Automated Reports', category: 'Audits & Exports' },
    tariff: { title: 'Tariff & Cost Management', category: 'Utility Billing' },
    carbon: { title: 'Carbon & Sustainability', category: 'ESG Metrics' },
    docs: { title: 'Developer Documentation', category: 'Architecture & Reference' },
    settings: { title: 'System Configuration', category: 'Preferences' }
  };

  const currentMeta = pageTitles[activePage] || { title: 'Dashboard', category: 'Overview' };

  return (
    <header className="app-topbar">
      {/* Zone 1 (Left): Breadcrumbs & Page Title */}
      <div className="topbar-left">
        <div className="topbar-breadcrumbs">
          <span>WattVision</span>
          <ChevronRight size={12} className="breadcrumb-arrow" />
          <span className="breadcrumb-category">{currentMeta.category}</span>
        </div>
        <h1 className="topbar-title">{currentMeta.title}</h1>
      </div>

      {/* Zone 2 (Center): Global Search Trigger */}
      <div className="topbar-center">
        <button
          className="search-trigger-btn"
          onClick={() => setIsSearchOpen(true)}
          title="Search telemetry, devices... (Ctrl+K)"
        >
          <Search size={14} className="search-icon" />
          <span className="search-placeholder-text">Search metrics, appliances, logs...</span>
          <span className="search-kbd-pill">⌘K</span>
        </button>
      </div>

      {/* Zone 3 (Right): Grouped Controls */}
      <div className="topbar-right">
        {/* Cluster A: Telemetry & Gateway Mode */}
        <div className="topbar-cluster">
          <button
            className={`gateway-status-pill ${isBackendOnline ? 'online' : 'simulated'}`}
            onClick={toggleConnectionMode}
            title={isBackendOnline
              ? "REAL HARDWARE MODE: Active WebSocket link to Node.js gateway / ESP32. Click to toggle simulation."
              : "SIMULATION MODE: Physical ESP32 is offline. Benchtop simulation active. Click to test live backend link."
            }
          >
            <span className="status-pulse-dot" />
            {isBackendOnline ? (
              <>
                <Wifi size={13} />
                <span>Hardware Link</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>Simulated Node</span>
              </>
            )}
          </button>

          <button
            className={`simulation-toggle-btn ${isLive ? 'live' : 'paused'}`}
            onClick={toggleLive}
            title={isLive ? "Pause Live Sampling" : "Resume Live Sampling"}
          >
            {isLive ? (
              <>
                <Pause size={13} />
                <span>Streaming</span>
              </>
            ) : (
              <>
                <Play size={13} />
                <span>Paused</span>
              </>
            )}
          </button>
        </div>

        {/* Cluster B: Units & Display Preferences */}
        <div className="topbar-cluster">
          <div className="unit-toggle-wrap" title="Toggle Power Units (Watts vs Kilowatts)">
            <button
              className={`unit-toggle-btn ${unitMode === 'W' ? 'active' : ''}`}
              onClick={() => setUnitMode('W')}
            >
              W
            </button>
            <button
              className={`unit-toggle-btn ${unitMode === 'kW' ? 'active' : ''}`}
              onClick={() => setUnitMode('kW')}
            >
              kW
            </button>
          </div>

          <button
            className="topbar-icon-btn"
            onClick={toggleSoundMute}
            title={isSoundMuted ? "Audio Muted: Click to Enable Chimes" : "Audio Active: Click to Mute Anomaly Chimes"}
          >
            {isSoundMuted ? (
              <VolumeX size={15} className="topbar-icon-muted" />
            ) : (
              <Volume2 size={15} className="topbar-icon-gold" />
            )}
          </button>

          <button
            className="theme-mode-toggle-btn"
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? "Switch to Refined Light Mode" : "Switch to Flagship Dark Mode"}
            aria-label="Toggle Theme Mode"
          >
            <div className="theme-toggle-inner">
              <span className={`theme-mode-pill ${themeMode === 'dark' ? 'active' : ''}`}>
                <Moon size={12} />
              </span>
              <span className={`theme-mode-pill ${themeMode === 'light' ? 'active' : ''}`}>
                <Sun size={12} />
              </span>
            </div>
          </button>
        </div>

        {/* Cluster C: Actions, Clock & Account */}
        <div className="topbar-cluster">
          <button
            className="keynote-launch-btn"
            onClick={() => setActivePage('presentation')}
            title="Open Cinematic Keynote Presentation (/presentation)"
          >
            <Sparkles size={13} className="keynote-icon" />
            <span>Keynote</span>
          </button>

          <div className="topbar-clock-box" title="System Local Time">
            <Clock size={13} className="clock-icon" />
            <span className="font-mono clock-text">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Notifications Popover */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="topbar-icon-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadAlerts.length > 0 && (
                <span className="notif-badge-dot">{unreadAlerts.length}</span>
              )}
            </button>

            {isNotifOpen && (
              <div className="notifications-dropdown">
                <div className="notif-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={15} className="text-gold" />
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Alerts & Notifications</span>
                  </div>
                  {unreadAlerts.length > 0 && (
                    <button
                      onClick={markAllAlertsRead}
                      className="notif-mark-read-btn"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notif-dropdown-list">
                  {alerts.slice(0, 4).map((alt) => (
                    <div
                      key={alt.id}
                      className={`notif-item ${!alt.read ? 'unread' : ''}`}
                      onClick={() => {
                        acknowledgeAlert(alt.id);
                        setIsNotifOpen(false);
                        setActivePage('alerts');
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span className="notif-item-title">
                          {alt.title}
                        </span>
                        <span className="notif-item-time">
                          {alt.timestamp}
                        </span>
                      </div>
                      <p className="notif-item-desc">
                        {alt.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="notif-dropdown-footer"
                  onClick={() => {
                    setIsNotifOpen(false);
                    setActivePage('alerts');
                  }}
                >
                  <span>View all in Alert Center</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Pill */}
          <div
            className="topbar-user-badge"
            onClick={() => setActivePage('settings')}
            title="Account Settings"
          >
            <div className="user-avatar-circle small">{userProfile.avatarInitials}</div>
            <span className="user-name-short">{userProfile.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
