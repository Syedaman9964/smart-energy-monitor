/**
 * ============================================================================
 * SMART ENERGY MONITOR - ENERGY SERVICE (DATA ACCESS LAYER)
 * ============================================================================
 * This service acts as the single source of truth for energy and hardware data.
 *
 * Current State:
 *   - Serves simulated/mock data reflecting PZEM-004T AC sensor readings.
 *   - Simulates real-time fluctuating loads (Voltage, Current, Power, PF, Frequency).
 *
 * Future Integration Guide for ESP32:
 *   - To switch to a real ESP32 REST API: Replace mock return values with `fetch('http://<esp32-ip>/api/data')`.
 *   - To switch to real-time WebSockets: Replace `setInterval` in `subscribeToReadings` with `new WebSocket('ws://<esp32-ip>/ws')`.
 *   - To switch to MQTT over WebSockets: Connect to your MQTT broker topic (e.g., `home/energy/pzem004t`).
 */

import {
  INITIAL_READINGS,
  MOCK_DEVICE_STATUS,
  generate24HourHistory,
  generateInitialLivePoints,
  MOCK_RECENT_USAGE_LOGS,
  DEFAULT_TARIFF
} from '../data/mockEnergyData';

class EnergyService {
  constructor() {
    // Keep internal state so values fluctuate naturally over time
    this.currentReadings = { ...INITIAL_READINGS };
    this.todayUnits = DEFAULT_TARIFF.todayKwhBase;
    this.tariffRate = DEFAULT_TARIFF.ratePerKwh;
    this.currency = DEFAULT_TARIFF.currencySymbol;
    this.deviceStatus = { ...MOCK_DEVICE_STATUS };
    this.history24h = generate24HourHistory();
    this.livePoints = generateInitialLivePoints();
  }

  /**
   * Get the current instant readings snapshot
   * @returns {Object} Current electrical parameters (V, A, W, kWh, Hz, PF)
   */
  getLatestReadings() {
    return { ...this.currentReadings };
  }

  /**
   * Get device and sensor connection telemetry
   * @returns {Object} ESP32 & PZEM-004T status info
   */
  getDeviceStatus() {
    return { ...this.deviceStatus };
  }

  /**
   * Get historical power data based on time filter
   * @param {'live'|'1h'|'24h'|'7d'} range 
   * @returns {Array} Array of historical data points for charts
   */
  getHistoricalData(range = 'live') {
    if (range === 'live') {
      return [...this.livePoints];
    } else if (range === '24h' || range === '1h') {
      return [...this.history24h];
    } else if (range === '7d') {
      // 7-day daily summary points
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((day, idx) => ({
        label: day,
        power: Math.round(1400 + Math.sin(idx) * 500 + Math.random() * 200),
        kwh: +(12.5 + Math.sin(idx * 2) * 3 + Math.random()).toFixed(2),
        voltage: 231.2,
        current: 6.1
      }));
    }
    return [...this.livePoints];
  }

  /**
   * Get recent usage log history
   * @returns {Array} Array of interval log records
   */
  getRecentUsageLogs() {
    return [...MOCK_RECENT_USAGE_LOGS];
  }

  /**
   * Get current tariff configuration and calculated cost estimates
   * @returns {Object} Tariff and cost summary
   */
  getCostSummary() {
    const todayCost = +(this.todayUnits * this.tariffRate).toFixed(2);
    const projectedMonthlyKwh = +(this.todayUnits * 30).toFixed(1);
    const projectedMonthlyCost = +(projectedMonthlyKwh * this.tariffRate).toFixed(2);

    return {
      todayKwh: +this.todayUnits.toFixed(2),
      tariffRate: this.tariffRate,
      currency: this.currency,
      todayCost: todayCost,
      projectedMonthlyKwh: projectedMonthlyKwh,
      projectedMonthlyCost: projectedMonthlyCost
    };
  }

  /**
   * Update tariff rate per kWh
   * @param {number} newRate 
   */
  setTariffRate(newRate) {
    if (typeof newRate === 'number' && newRate > 0) {
      this.tariffRate = newRate;
    }
  }

  /**
   * Subscribes to real-time updates.
   * Simulates AC grid fluctuations and load variations (e.g. appliances switching on/off).
   *
   * @param {Function} onDataCallback - Called on each update tick with latest readings & live chart point
   * @param {number} intervalMs - Frequency of telemetry tick (default: 2000ms = 2s)
   * @returns {Function} unsubscribe function to stop interval
   */
  subscribeToReadings(onDataCallback, intervalMs = 2000) {
    const timerId = setInterval(() => {
      // 1. Simulate subtle grid voltage fluctuation (229V - 234V)
      const voltage = +(230.5 + (Math.random() - 0.5) * 3.5).toFixed(1);

      // 2. Simulate fluctuating active load (e.g. 800W - 2800W)
      const loadStep = (Math.random() - 0.48) * 120;
      let newPower = Math.max(350, Math.min(3800, this.currentReadings.power + loadStep));
      newPower = +newPower.toFixed(1);

      // 3. Power Factor (typically 0.90 to 0.98 for domestic loads)
      const powerFactor = +(0.93 + (Math.random() - 0.5) * 0.04).toFixed(2);

      // 4. Current calculated using P = V * I * PF => I = P / (V * PF)
      const current = +(newPower / (voltage * powerFactor)).toFixed(2);

      // 5. Grid frequency (standard 49.90 Hz - 50.10 Hz)
      const frequency = +(50.00 + (Math.random() - 0.5) * 0.16).toFixed(2);

      // 6. Cumulative energy increment (kWh = (W * seconds) / (1000 * 3600))
      const deltaKwh = (newPower * (intervalMs / 1000)) / (3600 * 1000);
      const energy = +(this.currentReadings.energy + deltaKwh).toFixed(4);
      this.todayUnits += deltaKwh;

      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Update internal state
      this.currentReadings = {
        voltage,
        current,
        power: newPower,
        energy,
        frequency,
        powerFactor,
        timestamp: now.toISOString()
      };

      // Add to rolling live points queue (keep last 25 points)
      const newLivePoint = {
        time: timeLabel,
        power: Math.round(newPower),
        voltage: voltage,
        current: current
      };

      this.livePoints = [...this.livePoints.slice(1), newLivePoint];

      // Invoke listener
      if (typeof onDataCallback === 'function') {
        onDataCallback({
          readings: this.getLatestReadings(),
          livePoint: newLivePoint,
          costSummary: this.getCostSummary()
        });
      }
    }, intervalMs);

    // Return cleanup unsubscribe handler
    return () => clearInterval(timerId);
  }
}

// Export singleton instance
export const energyService = new EnergyService();
export default energyService;
