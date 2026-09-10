import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import telemetryService from '../services/telemetryService';
import apiService from '../services/apiService';
import audioService from '../services/audioService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const EnergyContext = createContext(null);

export function EnergyProvider({ children }) {
  const { addToast } = useToast();
  const { user } = useAuth();

  // Navigation & View state synchronized with browser URL path (/presentation, /landing, /login, /dashboard)
  const [activePage, setActivePageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'presentation') return 'presentation';
      if (path === 'landing') return 'landing';
      if (path === 'login') return 'login';
      if (path && ['dashboard', 'live', 'flow', 'analytics', 'prediction', 'appliances', 'devices', 'alerts', 'history', 'reports', 'tariff', 'carbon', 'settings', 'docs'].includes(path)) {
        return path;
      }
    }
    return 'dashboard';
  });

  const setActivePage = useCallback((page) => {
    setActivePageState(page);
    if (typeof window !== 'undefined') {
      const newPath = page === 'dashboard' ? '/' : `/${page}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ page }, '', newPath);
      }
    }
  }, []);

  // Sync browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'presentation') setActivePageState('presentation');
      else if (path === 'landing') setActivePageState('landing');
      else if (path) setActivePageState(path);
      else setActivePageState('dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [unitMode, setUnitMode] = useState('W'); // 'W' | 'kW'

  // Master Dark ↔ Light Theme Mode ('dark' | 'light')
  const [themeMode, setThemeModeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wattvision_theme_mode') || 'dark';
    }
    return 'dark';
  });

  // Sync themeMode with DOM data-theme-mode attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme-mode', themeMode);
      localStorage.setItem('wattvision_theme_mode', themeMode);
    }
  }, [themeMode]);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    addToast({
      type: 'info',
      title: mode === 'dark' ? 'Flagship Dark Mode Active' : 'Refined Light Mode Active',
      message: `WattVision interface switched to ${mode.toUpperCase()} edition.`
    });
  };

  const toggleThemeMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  // Accent Glow Theme ('emerald' | 'cyan' | 'amber' | 'violet')
  const [accentTheme, setAccentThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wattvision_accent_theme') || 'emerald';
    }
    return 'emerald';
  });

  // Sound Chime preference
  const [isSoundMuted, setIsSoundMuted] = useState(() => audioService.isMuted());

  // Backend Connection Mode ('ONLINE' | 'OFFLINE_SIMULATED' | 'CHECKING')
  const [connectionState, setConnectionState] = useState('CHECKING');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isForcedSim, setIsForcedSim] = useState(false);

  // Telemetry & Hardware state
  const [telemetry, setTelemetry] = useState(() => telemetryService.getLatestTelemetry());
  const [hardware, setHardware] = useState(() => telemetryService.getHardwareStatus());
  const [livePoints, setLivePoints] = useState(() => telemetryService.getHistoricalData('live'));

  // Multi-tier cost and carbon summaries
  const [costSummary, setCostSummary] = useState(() => telemetryService.calculateCostSummary());
  const [carbonSummary, setCarbonSummary] = useState(() => telemetryService.calculateCarbonSummary());
  const [tariffConfig, setTariffConfig] = useState(() => telemetryService.getTariffConfig());

  // Collections
  const [appliances, setAppliances] = useState(() => telemetryService.getAppliances());
  const [alerts, setAlerts] = useState(() => telemetryService.getAlerts());
  const [historyLogs, setHistoryLogs] = useState(() => telemetryService.getHistoryLogs());
  const [reports, setReports] = useState(() => telemetryService.getReports());

  // Anomaly sound cooldown ref
  const lastSoundTimeRef = useRef(0);

  // User Profile derived from real authenticated session
  const userProfile = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === 'ADMIN' ? 'System Administrator' : 'Energy Analyst',
    roleKey: user.role,
    avatarInitials: user.avatarInitials || 'SA',
    avatarUrl: user.avatarUrl || (user.id === 'usr-admin-01' || user.email?.includes('admin') || user.name?.includes('Syed') ? '/assets/syed-aman-avatar.png' : null),
    facility: user.facility || 'Bengaluru Energy Terminal',
    lastLogin: user.lastLogin
  } : {
    id: 'guest',
    name: 'Guest User',
    email: 'guest@wattvision.energy',
    role: 'Viewer',
    roleKey: 'USER',
    avatarInitials: 'GU',
    avatarUrl: null,
    facility: 'Unauthenticated Terminal',
    lastLogin: null
  };

  // Sync theme with DOM data-theme attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', accentTheme);
      localStorage.setItem('wattvision_accent_theme', accentTheme);
    }
  }, [accentTheme]);

  const setAccentTheme = (theme) => {
    setAccentThemeState(theme);
    addToast({
      type: 'info',
      title: 'Theme Accent Updated',
      message: `Switched control-room theme to ${theme.toUpperCase()}.`
    });
  };

  const toggleSoundMute = () => {
    const next = audioService.toggleMute();
    setIsSoundMuted(next);
    addToast({
      type: next ? 'warning' : 'success',
      title: next ? 'Alert Audio Muted' : 'Alert Audio Enabled',
      message: next ? 'Grid anomaly chimes are silenced.' : 'Audible chimes will play on voltage/current spikes.'
    });
  };

  // Monitor connection state from ApiService
  useEffect(() => {
    const unsub = apiService.onConnectionChange((state, isOnline) => {
      setConnectionState(state);
      setIsBackendOnline(isOnline);
    });
    return unsub;
  }, []);

  // Real-time telemetry subscription (WebSocket via ApiService + fallback)
  useEffect(() => {
    if (!isLive) return;

    const unsubscribe = apiService.subscribeToTelemetry(({
      telemetry: nextTelem,
      livePoint,
      hardware: nextHw,
      costSummary: nextCost,
      carbonSummary: nextCarbon
    }) => {
      setTelemetry(nextTelem);
      if (nextHw) setHardware(nextHw);
      if (nextCost) setCostSummary(nextCost);
      if (nextCarbon) setCarbonSummary(nextCarbon);
      if (livePoint) {
        setLivePoints((prev) => [...prev.slice(1), livePoint]);
      }

      // Check for audible anomaly chime
      const now = Date.now();
      if (now - lastSoundTimeRef.current > 12000) { // Cooldown between chimes
        if (nextTelem.voltage > 255 || nextTelem.voltage < 190 || nextTelem.current > 25) {
          audioService.playCriticalChime();
          lastSoundTimeRef.current = now;
        } else if (nextTelem.powerFactor < 0.80) {
          audioService.playWarningChime();
          lastSoundTimeRef.current = now;
        }
      }
    });

    return () => unsubscribe();
  }, [isLive]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const toggleLive = () => {
    setIsLive((prev) => {
      const next = !prev;
      addToast({
        type: next ? 'success' : 'warning',
        title: next ? 'Live Stream Resumed' : 'Live Stream Paused',
        message: next ? 'Receiving real-time electrical telemetry.' : 'Telemetry sampling paused for inspection.'
      });
      return next;
    });
  };

  const toggleConnectionMode = () => {
    const nextForced = !isForcedSim;
    setIsForcedSim(nextForced);
    apiService.setForceSimulation(nextForced);
    addToast({
      type: nextForced ? 'warning' : 'info',
      title: nextForced ? 'Simulation Mode Activated' : 'Attempting Live Gateway Link',
      message: nextForced
        ? 'Running high-fidelity benchtop simulation.'
        : 'Reconnecting to live backend/ESP32 gateway.'
    });
  };

  const updateTariff = (newConfig) => {
    const updated = telemetryService.updateTariff(newConfig);
    setTariffConfig(updated);
    setCostSummary(telemetryService.calculateCostSummary());
    apiService.updateTariffConfig(newConfig);
    addToast({
      type: 'success',
      title: 'Tariff Settings Saved',
      message: `Base rate updated to ${updated.currency}${updated.baseRatePerKwh}/kWh.`
    });
  };

  const acknowledgeAlert = (id) => {
    const updated = telemetryService.acknowledgeAlert(id);
    setAlerts(updated);
    addToast({
      type: 'info',
      title: 'Alert Acknowledged',
      message: 'The alert has been marked as reviewed.'
    });
  };

  const markAllAlertsRead = () => {
    const updated = telemetryService.markAllAlertsRead();
    setAlerts(updated);
    addToast({
      type: 'info',
      title: 'Alerts Marked Read',
      message: 'All notifications have been cleared.'
    });
  };

  const toggleApplianceDemo = (applianceId) => {
    addToast({
      type: 'warning',
      title: 'Hardware Control Pending',
      message: 'Relay actuator integration with ESP32 is planned for Phase 2. Control is in view-only demo mode.'
    });
  };

  return (
    <EnergyContext.Provider
      value={{
        activePage,
        setActivePage,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
        isLive,
        toggleLive,
        unitMode,
        setUnitMode,
        themeMode,
        toggleThemeMode,
        setThemeMode,
        connectionState,
        isBackendOnline,
        isForcedSim,
        toggleConnectionMode,
        accentTheme,
        setAccentTheme,
        isSoundMuted,
        toggleSoundMute,
        telemetry,
        hardware,
        livePoints,
        costSummary,
        carbonSummary,
        tariffConfig,
        updateTariff,
        appliances,
        toggleApplianceDemo,
        alerts,
        acknowledgeAlert,
        markAllAlertsRead,
        historyLogs,
        reports,
        userProfile
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error('useEnergy must be used within EnergyProvider');
  return ctx;
}

export default EnergyContext;
