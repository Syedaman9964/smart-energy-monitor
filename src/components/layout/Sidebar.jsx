import React from 'react';
import {
  LayoutDashboard,
  Activity,
  GitBranch,
  BarChart3,
  Tv,
  Cpu,
  Bell,
  History,
  FileText,
  DollarSign,
  Leaf,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Radio,
  Sparkles
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { WattVisionLogo } from '../../assets/logo';

export default function Sidebar() {
  const {
    activePage,
    setActivePage,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    hardware,
    isLive,
    alerts,
    userProfile
  } = useEnergy();

  const navItems = [
    { id: 'presentation', label: 'Keynote Launch', icon: Sparkles, badge: 'KEYNOTE', isFeatured: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Monitoring', icon: Activity, badge: isLive ? 'LIVE' : null },
    { id: 'flow', label: 'Energy Flow', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'prediction', label: 'AI Prediction', icon: Radio, badge: 'AI' },
    { id: 'appliances', label: 'Appliances', icon: Tv },
    { id: 'devices', label: 'IoT Devices', icon: Cpu, badge: 'ESP32' },
    { id: 'alerts', label: 'Alerts', icon: Bell, unreadCount: alerts.filter(a => !a.read).length },
    { id: 'history', label: 'Energy History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'tariff', label: 'Tariff & Cost', icon: DollarSign },
    { id: 'carbon', label: 'Carbon Footprint', icon: Leaf },
    { id: 'docs', label: 'Documentation', icon: BookOpen, badge: 'DOCS' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`app-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header & Brand */}
      <div className="sidebar-header">
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setActivePage('dashboard')}
          title="WattVision Energy Management"
        >
          <WattVisionLogo size={34} showText={!isSidebarCollapsed} />
        </div>

        <button
          className="collapse-toggle-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''} ${item.isFeatured ? 'featured' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrap">
                <Icon size={18} />
              </div>

              {!isSidebarCollapsed && (
                <span className="nav-label">{item.label}</span>
              )}

              {!isSidebarCollapsed && item.badge && (
                <span className={`nav-badge-pill ${item.badge === 'LIVE' ? 'live' : item.badge === 'KEYNOTE' ? 'keynote' : ''}`}>
                  {item.badge}
                </span>
              )}

              {!isSidebarCollapsed && item.unreadCount > 0 && (
                <span className="nav-badge-count">{item.unreadCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Hardware Status & User Profile */}
      <div className="sidebar-footer">
        {/* Hardware Status Pill */}
        {!isSidebarCollapsed ? (
          <div className="sidebar-hardware-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <Cpu size={14} className="text-gold" />
                <span>{hardware.deviceId}</span>
              </div>
              <span className={`hardware-live-dot ${isLive ? 'active' : 'paused'}`} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wifi size={11} style={{ color: 'var(--color-success)' }} />
                <span>{hardware.wifiQuality}</span>
              </div>
              <span>Simulated Node</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }} title={`ESP32 Simulator: ${isLive ? 'Active' : 'Paused'}`}>
            <span className={`hardware-live-dot ${isLive ? 'active' : 'paused'}`} />
          </div>
        )}

        {/* User profile summary */}
        {!isSidebarCollapsed && (
          <div
            className="sidebar-user-pill"
            onClick={() => setActivePage('settings')}
            title="Account Settings"
          >
            <div className="user-avatar-circle">
              {userProfile.avatarInitials}
            </div>
            <div className="user-info-text">
              <span className="user-name">{userProfile.name}</span>
              <span className="user-role">{userProfile.role}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
