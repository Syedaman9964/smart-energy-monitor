/**
 * ============================================================================
 * WATT VISION - API SERVICE (REST & WEBSOCKET CLIENT ABSTRACTION)
 * ============================================================================
 * Frontend demo mode: Operates locally using deterministic simulation data.
 * Does not make outbound HTTP or WebSocket network calls, ensuring a fast,
 * error-free demo on Vercel's free tier.
 */

import telemetryService from './telemetryService';

class ApiService {
  constructor() {
    this.baseUrl = '';
    this.wsUrl = '';
    this.isRealHardwareConnected = false;
    this.forcedSimulation = true;
    this.wsConnection = null;
    this.connectionListeners = new Set();
    this.connectionState = 'OFFLINE_SIMULATED';
    this.reconnectTimeout = null;

    // Notify initial simulated status immediately
    if (typeof window !== 'undefined') {
      setTimeout(() => this.notifyConnectionChange(), 50);
    }
  }

  getAuthHeaders(extra = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...extra
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('wattvision_auth_token') || sessionStorage.getItem('wattvision_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
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
   * Check if backend gateway is reachable (Demo mode: simulated node)
   */
  async checkBackendHealth() {
    this.isRealHardwareConnected = false;
    this.connectionState = 'OFFLINE_SIMULATED';
    this.notifyConnectionChange();
    return false;
  }

  /**
   * Set dynamic base URL from dashboard settings page
   */
  setBaseUrl(url) {
    this.baseUrl = url || '';
    this.checkBackendHealth();
  }

  /**
   * Manually force or toggle local simulation mode
   */
  setForceSimulation(force) {
    this.forcedSimulation = !!force;
    this.isRealHardwareConnected = false;
    this.connectionState = 'OFFLINE_SIMULATED';
    this.notifyConnectionChange();
  }

  /**
   * Fetches latest electrical parameters from simulated telemetry service
   */
  async fetchLiveTelemetry() {
    return Promise.resolve(telemetryService.getLatestTelemetry());
  }

  /**
   * Fetches device diagnostic information
   */
  async fetchDeviceHealth() {
    return Promise.resolve(telemetryService.getHardwareStatus());
  }

  /**
   * Updates tariff configuration in memory
   */
  async updateTariffConfig(config) {
    telemetryService.updateTariff(config);
    return Promise.resolve({ success: true, message: 'Tariff updated in simulated memory' });
  }

  /**
   * Subscribes to real-time telemetry stream via deterministic simulated interval
   */
  subscribeToTelemetry(callback) {
    let isSubscribed = true;

    // Use local deterministic simulation engine
    const localUnsubscribe = telemetryService.subscribe((tickData) => {
      if (isSubscribed && typeof callback === 'function') {
        callback(tickData);
      }
    });

    return () => {
      isSubscribed = false;
      if (typeof localUnsubscribe === 'function') {
        localUnsubscribe();
      }
    };
  }
}

export const apiService = new ApiService();
export default apiService;

