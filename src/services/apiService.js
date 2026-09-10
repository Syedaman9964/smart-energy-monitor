/**
 * ============================================================================
 * WATT VISION - API SERVICE (REST & WEBSOCKET CLIENT ABSTRACTION)
 * ============================================================================
 * Handles HTTP REST requests and WebSocket connections to the backend server
 * or physical ESP32 gateway, with seamless auto-discovery and automatic fallback
 * to high-fidelity benchtop simulation when offline.
 */

import telemetryService from './telemetryService';

class ApiService {
  constructor() {
    // Resolve API and WebSocket URLs from environment or window location
    const envApi = typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL)
      : undefined;
    const envWs = typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_WS_URL
      : undefined;

    if (envApi && envApi.trim() !== '') {
      this.baseUrl = envApi.trim().replace(/\/$/, '');
    } else if (typeof window !== 'undefined') {
      // Relative base URL allows reverse proxies (Nginx, Caddy, Vercel rewrites) to work out-of-the-box
      this.baseUrl = '';
    } else {
      this.baseUrl = 'http://localhost:5000';
    }

    if (envWs && envWs.trim() !== '') {
      this.wsUrl = envWs.trim();
    } else if (typeof window !== 'undefined') {
      const isHttps = window.location.protocol === 'https:';
      this.wsUrl = `${isHttps ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
    } else {
      this.wsUrl = 'ws://localhost:5000/ws';
    }

    this.isRealHardwareConnected = false;
    this.forcedSimulation = false;
    this.wsConnection = null;
    this.connectionListeners = new Set();
    this.connectionState = 'CHECKING'; // 'CHECKING' | 'ONLINE' | 'OFFLINE_SIMULATED'
    this.reconnectTimeout = null;

    // Trigger initial health check in browser
    if (typeof window !== 'undefined') {
      setTimeout(() => this.checkBackendHealth(), 100);
    }
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(listener) {
    this.connectionListeners.add(listener);
    listener(this.connectionState, this.isRealHardwareConnected);
    return () => this.connectionListeners.delete(listener);
  }

  notifyConnectionChange() {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(this.connectionState, this.isRealHardwareConnected);
      } catch (e) {
        console.error('[ApiService] Listener error', e);
      }
    });
  }

  /**
   * Check if backend gateway is reachable
   */
  async checkBackendHealth() {
    if (this.forcedSimulation) {
      this.isRealHardwareConnected = false;
      this.connectionState = 'OFFLINE_SIMULATED';
      this.notifyConnectionChange();
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });

      if (response.ok) {
        const data = await response.json();
        this.isRealHardwareConnected = true;
        this.connectionState = 'ONLINE';
        this.notifyConnectionChange();
        return true;
      }
    } catch (err) {
      // Backend not reached, fallback to simulation
    }

    this.isRealHardwareConnected = false;
    this.connectionState = 'OFFLINE_SIMULATED';
    this.notifyConnectionChange();
    return false;
  }

  /**
   * Set dynamic base URL from dashboard settings page
   * @param {string} url - Base URL e.g. http://192.168.1.150:5000
   */
  setBaseUrl(url) {
    this.baseUrl = url || '';
    if (url && url.startsWith('http')) {
      const u = new URL(url);
      this.wsUrl = `${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}/ws`;
    }
    this.checkBackendHealth();
  }

  /**
   * Manually force or disable local simulation mode
   */
  setForceSimulation(force) {
    this.forcedSimulation = !!force;
    if (this.forcedSimulation) {
      if (this.wsConnection) {
        this.wsConnection.close();
        this.wsConnection = null;
      }
      this.isRealHardwareConnected = false;
      this.connectionState = 'OFFLINE_SIMULATED';
      this.notifyConnectionChange();
    } else {
      this.checkBackendHealth();
    }
  }

  /**
   * Fetches latest electrical parameters from ESP32 / Backend endpoint:
   * GET /api/telemetry/live
   */
  async fetchLiveTelemetry() {
    if (!this.isRealHardwareConnected || this.forcedSimulation) {
      return Promise.resolve(telemetryService.getLatestTelemetry());
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/telemetry/live`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn('[ApiService] Failed to reach backend live endpoint. Using simulation.', err.message);
      return telemetryService.getLatestTelemetry();
    }
  }

  /**
   * Fetches device diagnostic information:
   * GET /api/device/health
   */
  async fetchDeviceHealth() {
    if (!this.isRealHardwareConnected || this.forcedSimulation) {
      return Promise.resolve(telemetryService.getHardwareStatus());
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/device/health`, {
        signal: AbortSignal.timeout(3000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('[ApiService] Device health unreachable. Using local status.', err.message);
      return telemetryService.getHardwareStatus();
    }
  }

  /**
   * Posts updated tariff configurations to backend / ESP32:
   * POST /api/tariff/config
   * 
   * @param {Object} config - Tariff rates & taxes
   */
  async updateTariffConfig(config) {
    telemetryService.updateTariff(config);

    if (!this.isRealHardwareConnected || this.forcedSimulation) {
      return Promise.resolve({ success: true, message: 'Tariff updated in local simulation memory' });
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/tariff/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return await response.json();
    } catch (err) {
      return { success: true, message: 'Local simulation updated (Hardware offline)' };
    }
  }

  /**
   * Subscribes to real-time telemetry stream via WebSocket or simulated interval
   * 
   * @param {Function} callback - Telemetry update handler
   * @returns {Function} Unsubscribe cleanup function
   */
  subscribeToTelemetry(callback) {
    let localUnsubscribe = null;
    let isSubscribed = true;

    // Fallback runner to local simulation
    const startLocalSimulation = () => {
      if (localUnsubscribe) return;
      localUnsubscribe = telemetryService.subscribe((tickData) => {
        if (isSubscribed) {
          callback(tickData);
        }
      });
    };

    const stopLocalSimulation = () => {
      if (localUnsubscribe) {
        localUnsubscribe();
        localUnsubscribe = null;
      }
    };

    const connectWebSocket = () => {
      if (!isSubscribed || this.forcedSimulation || typeof window === 'undefined' || !window.WebSocket) {
        startLocalSimulation();
        return;
      }

      try {
        const ws = new WebSocket(this.wsUrl);
        this.wsConnection = ws;

        ws.onopen = () => {
          this.isRealHardwareConnected = true;
          this.connectionState = 'ONLINE';
          this.notifyConnectionChange();
          stopLocalSimulation();
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'TELEMETRY_UPDATE' || parsed.type === 'SNAPSHOT') {
              const raw = parsed.data || {};
              // Format into shape expected by UI
              const voltage = raw.voltage ?? 230.0;
              const power = raw.power ?? 1800;
              const current = raw.current ?? +(power / (voltage * 0.95)).toFixed(2);
              const frequency = raw.frequency ?? 50.0;
              const powerFactor = raw.powerFactor ?? 0.95;
              const energyToday = raw.energyToday ?? (raw.energy ? +(raw.energy % 20).toFixed(3) : 12.45);
              const energy = raw.energy ?? 148.5;

              const t = new Date();
              const livePoint = {
                time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                timestamp: t.toISOString(),
                power: Math.round(power),
                powerKw: +(power / 1000).toFixed(3),
                voltage: +voltage.toFixed(1),
                current: +current.toFixed(2),
                frequency: +frequency.toFixed(2),
                powerFactor: +powerFactor.toFixed(2)
              };

              const nextTelem = {
                ...telemetryService.getLatestTelemetry(),
                ...raw,
                voltage,
                current,
                power,
                frequency,
                powerFactor,
                energy,
                energyToday
              };

              const costSummary = telemetryService.calculateCostSummary(energyToday);
              const carbonSummary = telemetryService.calculateCarbonSummary(energyToday);

              callback({
                telemetry: nextTelem,
                livePoint,
                hardware: telemetryService.getHardwareStatus(),
                costSummary,
                carbonSummary
              });
            }
          } catch (e) {
            console.error('[ApiService WS] Parsing error', e);
          }
        };

        ws.onerror = () => {
          this.isRealHardwareConnected = false;
          this.connectionState = 'OFFLINE_SIMULATED';
          this.notifyConnectionChange();
          startLocalSimulation();
        };

        ws.onclose = () => {
          this.isRealHardwareConnected = false;
          this.connectionState = 'OFFLINE_SIMULATED';
          this.notifyConnectionChange();
          startLocalSimulation();

          // Try reconnecting after 5 seconds if still subscribed
          if (isSubscribed && !this.forcedSimulation) {
            this.reconnectTimeout = setTimeout(connectWebSocket, 5000);
          }
        };
      } catch (err) {
        this.isRealHardwareConnected = false;
        this.connectionState = 'OFFLINE_SIMULATED';
        this.notifyConnectionChange();
        startLocalSimulation();
      }
    };

    // If already online or checking, try WS, else fallback
    connectWebSocket();

    return () => {
      isSubscribed = false;
      if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      stopLocalSimulation();
      if (this.wsConnection) {
        try { this.wsConnection.close(); } catch (e) {}
        this.wsConnection = null;
      }
    };
  }
}

export const apiService = new ApiService();
export default apiService;
