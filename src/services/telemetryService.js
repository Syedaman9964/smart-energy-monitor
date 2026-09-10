/**
 * ============================================================================
 * WATTVISION - TELEMETRY SERVICE (DATA ACCESS & REALTIME ENGINE)
 * ============================================================================
 * Central data layer interface. Provides real-time stream simulation and historical
 * data querying.
 *
 * ESP32 / PZEM-004T FUTURE INTEGRATION:
 * ----------------------------------------------------------------------------
 * 1. REST API: Replace `getLatestTelemetry()` with `fetch('http://<esp32-ip>/api/v1/telemetry')`.
 * 2. WebSocket: Replace `setInterval` in `subscribe()` with `new WebSocket('ws://<esp32-ip>/ws')`.
 * 3. MQTT: Connect via MQTT.js over WebSocket topic `wattvision/devices/esp32-01/telemetry`.
 */

import {
  INITIAL_TELEMETRY,
  MOCK_HARDWARE_STATUS,
  MOCK_APPLIANCES,
  MOCK_ALERTS,
  DEFAULT_TARIFF_CONFIG,
  CARBON_FACTORS,
  generate24HourProfile,
  generate7DayProfile,
  generate30DayProfile,
  generate12MonthProfile,
  generateTelemetryLogs,
  MOCK_REPORTS
} from '../data/mockTelemetry';

class TelemetryService {
  constructor() {
    this.current = { ...INITIAL_TELEMETRY };
    this.hardware = { ...MOCK_HARDWARE_STATUS };
    this.appliances = [...MOCK_APPLIANCES];
    this.alerts = [...MOCK_ALERTS];
    this.tariff = { ...DEFAULT_TARIFF_CONFIG };
    this.carbonFactors = { ...CARBON_FACTORS };
    this.historyLogs = generateTelemetryLogs(60);
    this.reports = [...MOCK_REPORTS];

    // Live rolling queue (25 ticks)
    this.liveQueue = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 2000);
      const p = Math.round(1800 + Math.sin(i * 0.4) * 220 + (Math.random() - 0.5) * 80);
      this.liveQueue.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: t.toISOString(),
        power: p,
        powerKw: +(p / 1000).toFixed(3),
        voltage: +(230.1 + (Math.random() - 0.5) * 2.5).toFixed(1),
        current: +(p / (230 * 0.95)).toFixed(2),
        frequency: +(50.02 + (Math.random() - 0.5) * 0.08).toFixed(2),
        powerFactor: 0.95
      });
    }
  }

  getLatestTelemetry() {
    return { ...this.current };
  }

  getHardwareStatus() {
    return { ...this.hardware };
  }

  getAppliances() {
    return [...this.appliances];
  }

  getAlerts() {
    return [...this.alerts];
  }

  getTariffConfig() {
    return { ...this.tariff };
  }

  getReports() {
    return [...this.reports];
  }

  getHistoryLogs() {
    return [...this.historyLogs];
  }

  /**
   * Get Time-series data for chart displays
   * @param {'live'|'1h'|'6h'|'24h'|'7d'|'30d'|'12m'} range 
   */
  getHistoricalData(range = 'live') {
    switch (range) {
      case 'live':
        return [...this.liveQueue];
      case '1h':
      case '6h':
      case '24h':
        return generate24HourProfile();
      case '7d':
        return generate7DayProfile();
      case '30d':
        return generate30DayProfile();
      case '12m':
        return generate12MonthProfile();
      default:
        return [...this.liveQueue];
    }
  }

  /**
   * Calculate dynamically projected electricity costs
   */
  calculateCostSummary(customUnitsToday) {
    const units = customUnitsToday !== undefined ? customUnitsToday : this.current.energyToday;
    const { baseRatePerKwh, peakRatePerKwh, fixedMonthlyCharge, taxRatePercent } = this.tariff;

    const todayCost = +(units * baseRatePerKwh).toFixed(2);
    const weeklyCost = +(units * 7 * baseRatePerKwh).toFixed(2);
    const projectedMonthlyUnits = +(units * 30).toFixed(1);
    const baseEnergyCharge = projectedMonthlyUnits * baseRatePerKwh;
    const subtotal = baseEnergyCharge + fixedMonthlyCharge;
    const taxAmount = +(subtotal * (taxRatePercent / 100)).toFixed(2);
    const projectedMonthlyBill = +(subtotal + taxAmount).toFixed(2);
    const projectedAnnualBill = +(projectedMonthlyBill * 12).toFixed(2);

    return {
      todayUnits: units,
      todayCost,
      weeklyCost,
      projectedMonthlyUnits,
      fixedMonthlyCharge,
      taxAmount,
      projectedMonthlyBill,
      projectedAnnualBill,
      tariffRate: baseRatePerKwh,
      peakRate: peakRatePerKwh,
      currency: this.tariff.currency
    };
  }

  /**
   * Calculate Carbon sustainability metrics
   */
  calculateCarbonSummary(units = this.current.energyToday) {
    const factor = this.carbonFactors.gridEmissionFactorKgPerKwh;
    const todayCo2Kg = +(units * factor).toFixed(2);
    const monthlyCo2Kg = +(units * 30 * factor).toFixed(1);
    const yearlyCo2Kg = +(units * 365 * factor).toFixed(1);
    const treesNeeded = +(yearlyCo2Kg / this.carbonFactors.treeAnnualAbsorptionKg).toFixed(1);

    return {
      todayCo2Kg,
      monthlyCo2Kg,
      yearlyCo2Kg,
      treesNeeded,
      emissionFactor: factor,
      efficiencyGrade: todayCo2Kg < 6.0 ? "A+" : todayCo2Kg < 8.0 ? "A" : "B"
    };
  }

  /**
   * Update Tariff settings in memory
   */
  updateTariff(newConfig) {
    this.tariff = { ...this.tariff, ...newConfig };
    return this.getTariffConfig();
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId) {
    this.alerts = this.alerts.map(a => 
      a.id === alertId ? { ...a, acknowledged: true, read: true } : a
    );
    return [...this.alerts];
  }

  /**
   * Mark all alerts as read
   */
  markAllAlertsRead() {
    this.alerts = this.alerts.map(a => ({ ...a, read: true }));
    return [...this.alerts];
  }

  /**
   * Real-time subscription loop with realistic AC grid fluctuations
   */
  subscribe(onTickCallback, intervalMs = 2000) {
    const timer = setInterval(() => {
      // 1. Grid Voltage with subtle harmonic variation (228V - 232V)
      const voltage = +(229.8 + (Math.random() - 0.5) * 3.0).toFixed(1);

      // 2. Fluctuating Active Power Load (e.g. 1500W to 2400W)
      const deltaPower = (Math.random() - 0.48) * 90;
      let power = Math.max(450, Math.min(3600, this.current.power + deltaPower));
      power = +power.toFixed(1);
      const powerKw = +(power / 1000).toFixed(3);

      // 3. Power Factor (typically 0.93 - 0.98)
      const powerFactor = +(0.94 + (Math.random() - 0.5) * 0.03).toFixed(2);

      // 4. Current RMS: I = P / (V * PF)
      const current = +(power / (voltage * powerFactor)).toFixed(2);

      // 5. Grid Frequency (50 Hz grid +/- 0.08 Hz)
      const frequency = +(50.02 + (Math.random() - 0.5) * 0.12).toFixed(2);

      // 6. Cumulative energy consumption increment
      const stepKwh = (power * (intervalMs / 1000)) / (3600 * 1000);
      const energy = +(this.current.energy + stepKwh).toFixed(4);
      const energyToday = +(this.current.energyToday + stepKwh).toFixed(3);

      const apparentPower = +(voltage * current).toFixed(1);
      const reactivePower = +Math.sqrt(Math.max(0, apparentPower**2 - power**2)).toFixed(1);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Update current telemetry
      this.current = {
        voltage,
        voltageMin: Math.min(this.current.voltageMin, voltage),
        voltageMax: Math.max(this.current.voltageMax, voltage),
        current,
        currentMin: Math.min(this.current.currentMin, current),
        currentMax: Math.max(this.current.currentMax, current),
        power,
        powerKw,
        powerMin: Math.min(this.current.powerMin, power),
        powerMax: Math.max(this.current.powerMax, power),
        energy,
        energyToday,
        frequency,
        frequencyMin: Math.min(this.current.frequencyMin, frequency),
        frequencyMax: Math.max(this.current.frequencyMax, frequency),
        powerFactor,
        apparentPower,
        reactivePower,
        timestamp: now.toISOString()
      };

      // Push to live queue
      const livePoint = {
        time: timeStr,
        timestamp: now.toISOString(),
        power: Math.round(power),
        powerKw,
        voltage,
        current,
        frequency,
        powerFactor
      };

      this.liveQueue = [...this.liveQueue.slice(1), livePoint];

      // Update hardware uptime & heartbeat
      this.hardware.uptimeSeconds += (intervalMs / 1000);
      this.hardware.lastHeartbeat = now.toISOString();

      if (typeof onTickCallback === 'function') {
        onTickCallback({
          telemetry: this.getLatestTelemetry(),
          livePoint,
          hardware: this.getHardwareStatus(),
          costSummary: this.calculateCostSummary(),
          carbonSummary: this.calculateCarbonSummary()
        });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }
}

export const telemetryService = new TelemetryService();
export default telemetryService;
