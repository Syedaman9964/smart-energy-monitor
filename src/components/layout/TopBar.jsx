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
  Sparkles,
  LogOut,
  Shield,
  User,
  Key,
  ChevronDown
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';

export default function TopBar() {
  const { logout } = useAuth();
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

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
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
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
      {/* 1. LEFT SECTION: Context & Unified Utility Controls */}
      <div className="topbar-left">
        <div className="topbar-context-brand">
          <span className="brand-root">WattVision</span>
          <ChevronRight size={12} className="breadcrumb-separator" />
          <span className="brand-category">{currentMeta.category}</span>
        </div>

        {/* Clean Utility Control Group: [ kW | 🔊 | ☾ ] */}
        <div className="topbar-utility-group" role="toolbar" aria-label="Dashboard Utility Controls">
          {/* Unit Toggle: W / kW */}
          <div className="unit-segment-control" role="group" aria-label="Power Unit Toggle">
            <button
              type="button"
              className={`unit-segment-btn ${unitMode === 'W' ? 'active' : ''}`}
              onClick={() => setUnitMode('W')}
              aria-pressed={unitMode === 'W'}
            >
              W
            </button>
            <button
              type="button"
              className={`unit-segment-btn ${unitMode === 'kW' ? 'active' : ''}`}
              onClick={() => setUnitMode('kW')}
              aria-pressed={unitMode === 'kW'}
            >
              kW
            </button>
          </div>

          <div className="utility-separator" />

          {/* Sound / Anomaly Chimes Toggle */}
          <div className="header-tooltip-wrapper">
            <button
              type="button"
              className={`utility-icon-btn ${isSoundMuted ? 'muted' : 'active'}`}
              onClick={toggleSoundMute}
              aria-label={isSoundMuted ? "Audio muted: Click to enable chimes" : "Audio active: Click to mute chimes"}
            >
              {isSoundMuted ? (
                <VolumeX size={15} className="icon-muted" />
              ) : (
                <Volume2 size={15} className="icon-gold" />
              )}
            </button>
            <div className="header-tooltip" role="tooltip">
              {isSoundMuted ? "Sound: Muted (Click to enable)" : "Sound: Active (Click to mute)"}
            </div>
          </div>

          <div className="utility-separator" />

          {/* Theme Mode Toggle with Luxury Hover-Only Micro-Tooltip */}
          <div className="header-tooltip-wrapper">
            <button
              type="button"
              className="utility-icon-btn theme-mode-btn"
              onClick={toggleThemeMode}
              aria-label={themeMode === 'dark' ? "Switch to Refined Light Mode" : "Switch to Flagship Dark Mode"}
            >
              {themeMode === 'dark' ? (
                <Moon size={15} className="theme-icon-moon" />
              ) : (
                <Sun size={15} className="theme-icon-sun" />
              )}
            </button>
            <div className="header-tooltip" role="tooltip">
              {themeMode === 'dark' ? "Switch to Light Mode" : "Switch to Flagship Dark Mode"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTER SECTION: Keynote Action & Global Command Palette */}
      <div className="topbar-center">
        {/* Keynote Presentation Action Button */}
        <button
          type="button"
          className="topbar-keynote-action"
          onClick={() => setActivePage('presentation')}
          aria-label="Open Keynote Presentation"
        >
          <Sparkles size={14} className="keynote-sparkle" />
          <span className="keynote-label">Keynote</span>
          <span className="keynote-pill">14 SLIDES</span>
        </button>

        {/* Global Search Trigger */}
        <button
          type="button"
          className="topbar-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search telemetry, devices (Ctrl+K)"
        >
          <Search size={14} className="search-icon" />
          <span className="search-placeholder">Search metrics, appliances, logs...</span>
          <span className="search-kbd font-mono">⌘K</span>
        </button>
      </div>

      {/* 3. RIGHT SECTION: IoT Status, Clock, Notifications, Profile */}
      <div className="topbar-right">
        {/* IoT Hardware Link & Sampling Status Group */}
        <div className="topbar-iot-group">
          <button
            type="button"
            className={`iot-status-pill ${isBackendOnline ? 'online' : 'simulated'}`}
            onClick={toggleConnectionMode}
            aria-label={isBackendOnline ? "Hardware Link active. Click to switch to simulation." : "Simulated Node active. Click to connect hardware."}
          >
            <span className="status-pulse-dot" />
            {isBackendOnline ? (
              <>
                <Wifi size={13} />
                <span className="pill-text">Hardware Link</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span className="pill-text">Simulated Node</span>
              </>
            )}
          </button>

          <button
            type="button"
            className={`iot-stream-pill ${isLive ? 'live' : 'paused'}`}
            onClick={toggleLive}
            aria-label={isLive ? "Pause live telemetry" : "Resume live telemetry"}
          >
            {isLive ? (
              <>
                <Pause size={12} />
                <span className="pill-text">Streaming</span>
              </>
            ) : (
              <>
                <Play size={12} />
                <span className="pill-text">Paused</span>
              </>
            )}
          </button>
        </div>

        {/* Digital Clock Pill */}
        <div className="topbar-clock-group" title="System Local Time">
          <Clock size={13} className="clock-icon" />
          <span className="clock-digits font-mono">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Notifications Popover */}
        <div className="header-notif-wrapper" ref={notifRef}>
          <button
            type="button"
            className={`topbar-icon-action notif-btn ${unreadAlerts.length > 0 ? 'has-unread' : ''}`}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label={`Notifications ${unreadAlerts.length > 0 ? `(${unreadAlerts.length} unread)` : ''}`}
          >
            <Bell size={15} />
            {unreadAlerts.length > 0 && (
              <span className="notif-badge-pill">{unreadAlerts.length}</span>
            )}
          </button>

          {isNotifOpen && (
            <div className="notifications-dropdown" role="dialog" aria-label="Notifications Dropdown">
              <div className="notif-dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={15} className="text-gold" />
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Alerts & Notifications</span>
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    type="button"
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
                      <span className="notif-item-title">{alt.title}</span>
                      <span className="notif-item-time">{alt.timestamp}</span>
                    </div>
                    <p className="notif-item-desc">{alt.description}</p>
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

        {/* Authenticated User Profile Dropdown */}
        <div className="header-notif-wrapper" ref={profileRef}>
          <div
            className="topbar-user-badge"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            role="button"
            tabIndex={0}
            aria-expanded={isProfileOpen}
            aria-label="User Account Menu"
          >
            <UserAvatar
              src={userProfile?.avatarUrl}
              alt={userProfile?.name || 'Syed Aman'}
              initials={userProfile?.avatarInitials || 'SA'}
              size={42}
              className="topbar-avatar"
            />
            <div className="user-badge-text">
              <span className="user-name-short">{userProfile?.name || 'Syed Aman'}</span>
            </div>
            <ChevronDown
              size={14}
              className="user-badge-chevron"
              style={{
                color: 'var(--text-muted)',
                marginLeft: '4px',
                transition: 'transform var(--transition-fast, 0.15s ease)',
                transform: isProfileOpen ? 'rotate(180deg)' : 'none'
              }}
            />
          </div>

          {isProfileOpen && (
            <div
              className="notifications-dropdown user-profile-popover"
              style={{ width: '295px', right: 0 }}
              role="dialog"
              aria-label="User Profile Dropdown"
            >
              <div
                className="notif-dropdown-header"
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <UserAvatar
                    src={userProfile?.avatarUrl}
                    alt={userProfile?.name || 'Syed Aman'}
                    initials={userProfile?.avatarInitials || 'SA'}
                    size={48}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {userProfile.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: userProfile.roleKey === 'ADMIN' ? 'var(--color-gold-surface)' : 'rgba(56, 189, 248, 0.12)',
                          color: userProfile.roleKey === 'ADMIN' ? 'var(--color-gold)' : 'var(--color-info)',
                          border: `1px solid ${userProfile.roleKey === 'ADMIN' ? 'var(--color-gold-border)' : 'rgba(56, 189, 248, 0.3)'}`,
                          textTransform: 'uppercase'
                        }}
                      >
                        {userProfile.roleKey || 'USER'}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {userProfile.email}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    color: 'var(--color-gold)',
                    background: 'var(--color-gold-surface)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-gold)' }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userProfile.facility}
                  </span>
                </div>
              </div>

              <div style={{ padding: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActivePage('settings');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Shield size={15} style={{ color: 'var(--color-gold)' }} />
                  <span>Security & Account Settings</span>
                </button>

                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-danger)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out of Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
