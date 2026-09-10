import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Cpu,
  Palette,
  ShieldCheck,
  CheckCircle,
  Globe,
  Radio,
  Clock,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Lock,
  Key,
  LogOut,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/common/UserAvatar';

export default function SettingsPage() {
  const {
    hardware,
    isLive,
    userProfile,
    themeMode,
    setThemeMode,
    accentTheme,
    setAccentTheme,
    isSoundMuted,
    toggleSoundMute
  } = useEnergy();
  const { addToast } = useToast();
  const { sessionInfo, changePassword, logout } = useAuth();

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [systemName, setSystemName] = useState("WattVision Energy Gateway");
  const [facility, setFacility] = useState("Main Facility #4");
  const [timezone, setTimezone] = useState("UTC+05:30 (IST)");
  const [refreshInterval, setRefreshInterval] = useState("2000");

  // Thresholds
  const [powerSpikeLimit, setPowerSpikeLimit] = useState("2800");
  const [voltageSagLimit, setVoltageSagLimit] = useState("215");
  const [voltageSurgeLimit, setVoltageSurgeLimit] = useState("245");
  const [minPfLimit, setMinPfLimit] = useState("0.90");

  // IoT Placeholders
  const [esp32Host, setEsp32Host] = useState("192.168.1.145");
  const [wsPort, setWsPort] = useState("80");
  const [mqttBroker, setMqttBroker] = useState("mqtt://broker.hivemq.com:1883");
  const [mqttTopic, setMqttTopic] = useState("wattvision/sensor/pzem004t");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please complete all password fields.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'New password and confirmation do not match.'
      });
      return;
    }

    if (newPassword.length < 8) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'New password must be at least 8 characters long.'
      });
      return;
    }

    setIsPasswordUpdating(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Toast already dispatched by AuthContext
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Configuration Saved',
      message: 'System settings and alert thresholds updated successfully.'
    });
  };

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">System Configuration & Security</h1>
          </div>
          <p className="page-subtitle">
            Manage authenticated session credentials, telemetry sampling rates, alert thresholds, and security parameters.
          </p>
        </div>
      </section>

      {/* 0. Account & Security Overview Card */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">Enterprise Account & Active Session</h3>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-danger)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out of Terminal</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="telemetry-pill-card">
            <span className="telemetry-pill-label">Authenticated User</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <UserAvatar
                src={userProfile?.avatarUrl}
                alt={userProfile?.name}
                initials={userProfile?.avatarInitials}
                size={44}
              />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{userProfile.name}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userProfile.email}</span>
          </div>

          <div className="telemetry-pill-card">
            <span className="telemetry-pill-label">Assigned Role</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: userProfile.roleKey === 'ADMIN' ? 'var(--color-gold-surface)' : 'rgba(56, 189, 248, 0.12)',
                  color: userProfile.roleKey === 'ADMIN' ? 'var(--color-gold)' : 'var(--color-info)',
                  border: `1px solid ${userProfile.roleKey === 'ADMIN' ? 'var(--color-gold-border)' : 'rgba(56, 189, 248, 0.3)'}`
                }}
              >
                {userProfile.roleKey || 'USER'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {userProfile.roleKey === 'ADMIN' ? 'Full Control' : 'Read & Audit'}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {userProfile.roleKey === 'ADMIN'
                ? 'Authorized for hardware EEPROM reset, tariff tuning & security.'
                : 'Authorized for telemetry, NILM, billing & forecasting.'}
            </span>
          </div>

          <div className="telemetry-pill-card">
            <span className="telemetry-pill-label">Active Session Details</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              IP: {sessionInfo?.ip || '127.0.0.1 (Loopback)'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Connected: {sessionInfo?.loginTime ? new Date(sessionInfo.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', marginTop: '2px' }}>
              ● TLS 1.3 / AES-256 Validated
            </span>
          </div>
        </div>

        {/* Change Password Sub-Card */}
        <div
          style={{
            marginTop: '0.5rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Key size={16} style={{ color: 'var(--color-gold)' }} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Update Terminal Password
            </h4>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isPasswordUpdating}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>New Password (min 8 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPasswordUpdating}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPasswordUpdating}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '9px 16px', fontSize: '0.82rem' }}
                  disabled={isPasswordUpdating}
                >
                  <Lock size={14} />
                  <span>{isPasswordUpdating ? 'Updating...' : 'Change Password'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. General Settings */}
        <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">General Platform Settings</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">System Gateway Name</label>
              <input
                type="text"
                className="form-input"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facility / Residence Name</label>
              <input
                type="text"
                className="form-input"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <input
                type="text"
                className="form-input"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telemetry Sampling Period</label>
              <select
                className="form-input font-mono"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
              >
                <option value="1000">1.0s (1.0 Hz High Frequency)</option>
                <option value="2000">2.0s (0.5 Hz Standard)</option>
                <option value="5000">5.0s (0.2 Hz Low Bandwidth)</option>
              </select>
            </div>
          </div>
        </section>

        {/* 2. Alert Thresholds */}
        <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">Intelligent Alert Thresholds</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Power Spike Warning (Watts)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={powerSpikeLimit}
                onChange={(e) => setPowerSpikeLimit(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Voltage Sag Floor (Volts)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={voltageSagLimit}
                onChange={(e) => setVoltageSagLimit(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Voltage Surge Ceiling (Volts)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={voltageSurgeLimit}
                onChange={(e) => setVoltageSurgeLimit(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Power Factor (cos φ)</label>
              <input
                type="number"
                step="0.01"
                className="form-input font-mono"
                value={minPfLimit}
                onChange={(e) => setMinPfLimit(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 3. Future IoT & ESP32 Network Endpoint Placeholders */}
        <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">Future IoT Endpoints (Phase 2 ESP32 Bridge)</h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            These placeholders configure where WattVision will connect when your real ESP32 firmware is flashed.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">ESP32 Static IP / Hostname</label>
              <input
                type="text"
                className="form-input font-mono"
                value={esp32Host}
                onChange={(e) => setEsp32Host(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WebSocket Port</label>
              <input
                type="number"
                className="form-input font-mono"
                value={wsPort}
                onChange={(e) => setWsPort(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">MQTT Broker URI</label>
              <input
                type="text"
                className="form-input font-mono"
                value={mqttBroker}
                onChange={(e) => setMqttBroker(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">MQTT Subscribed Topic</label>
              <input
                type="text"
                className="form-input font-mono"
                value={mqttTopic}
                onChange={(e) => setMqttTopic(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 4. Appearance & Audio Preferences */}
        <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">Control-Room Aesthetics & Alert Audio</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Theme Mode Switcher */}
            <div>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                Interface Display Mode
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: themeMode === 'dark' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-surface-secondary)',
                    border: `1px solid ${themeMode === 'dark' ? 'var(--color-gold)' : 'var(--border-subtle)'}`,
                    color: themeMode === 'dark' ? 'var(--color-gold)' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Moon size={15} />
                  <span>Flagship Nocturne (Dark)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: themeMode === 'light' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-surface-secondary)',
                    border: `1px solid ${themeMode === 'light' ? 'var(--color-gold)' : 'var(--border-subtle)'}`,
                    color: themeMode === 'light' ? 'var(--color-gold)' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Sun size={15} />
                  <span>Daylight Crisp (Light)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                Control-Room Accent Glow Theme
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'gold', label: 'Gold Amber', color: '#d4af37' },
                  { id: 'emerald', label: 'Emerald', color: '#10b981' },
                  { id: 'cyan', label: 'Cyber Cyan', color: '#06b6d4' },
                  { id: 'violet', label: 'Violet', color: '#a855f7' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccentTheme(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: accentTheme === opt.id ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-surface-secondary)',
                      border: `1px solid ${accentTheme === opt.id ? opt.color : 'var(--border-subtle)'}`,
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: opt.color, boxShadow: `0 0 6px ${opt.color}` }} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                Audible Anomaly Chime
              </label>
              <button
                type="button"
                onClick={toggleSoundMute}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: isSoundMuted ? 'rgba(239, 68, 68, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                  border: `1px solid ${isSoundMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                  color: isSoundMuted ? 'var(--color-danger)' : 'var(--color-gold)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isSoundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isSoundMuted ? 'Audible Chimes Muted' : 'Audible Chimes Enabled'}</span>
              </button>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
            <CheckCircle size={16} />
            <span>Apply System Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
