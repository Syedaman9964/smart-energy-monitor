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

/**
 * Deterministic electrical telemetry calculation synchronized across devices by epoch time.
 * Devices visiting at the same 2-second time window receive identical, stable readings.
 */
function calculateSynchronizedTelemetry(timestampMs = Date.now()) {
  const cycle = Math.floor(timestampMs / 2000);

  // Smooth harmonic oscillation for realistic live readings
  const vHarmonic = Math.sin(cycle * 0.12);
  const pHarmonic = Math.sin(cycle * 0.15) * 60 + Math.cos(cycle * 0.05) * 35;
  const fHarmonic = Math.sin(cycle * 0.25) * 0.02;

  // Voltage: 230.1 V ±0.5 V
  const voltage = +(230.1 + vHarmonic * 0.5).toFixed(1);

  // Active Power: 1895 W baseline (1.895 kW) with subtle ±95W natural load fluctuation
  const power = +(1895.0 + pHarmonic).toFixed(1);
  const powerKw = +(power / 1000).toFixed(3);

  // Power Factor: High-efficiency domestic standard (0.95)
  const powerFactor = 0.95;

  // Current: I = P / (V * PF)
  const current = +(power / (voltage * powerFactor)).toFixed(2);

  // Grid Frequency: 50.00 Hz nominal (Indian DISCOM standard)
  const frequency = +(50.00 + fHarmonic).toFixed(2);

  const apparentPower = +(voltage * current).toFixed(1);
  const reactivePower = +Math.sqrt(Math.max(0, apparentPower ** 2 - power ** 2)).toFixed(1);

  // Consistent fixed energy accumulation
  const energy = 148.53;
  const energyToday = 12.84;

  const dateObj = new Date(timestampMs);

  return {
    voltage,
    voltageMin: 224.5,
    voltageMax: 236.2,
    current,
    currentMin: 1.20,
    currentMax: 14.80,
    power,
    powerKw,
    powerMin: 320.0,
    powerMax: 3250.0,
    energy,
    energyToday,
    frequency,
    frequencyMin: 49.88,
    frequencyMax: 50.15,
    powerFactor,
    apparentPower,
    reactivePower,
    timestamp: dateObj.toISOString(),
    isSimulated: true,
    simulationMode: 'Deterministic Synchronized Demo'
  };
}

class TelemetryService {
  constructor() {
    this.current = calculateSynchronizedTelemetry();
    this.hardware = { ...MOCK_HARDWARE_STATUS };
    this.appliances = [...MOCK_APPLIANCES];
    this.alerts = [...MOCK_ALERTS];
    this.tariff = { ...DEFAULT_TARIFF_CONFIG };
    this.carbonFactors = { ...CARBON_FACTORS };
    this.historyLogs = generateTelemetryLogs(60);
    this.reports = [...MOCK_REPORTS];

    // Live rolling queue (25 ticks) synchronized deterministically
    this.liveQueue = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const tMs = now - i * 2000;
      const t = new Date(tMs);
      const snapshot = calculateSynchronizedTelemetry(tMs);
      this.liveQueue.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: snapshot.timestamp,
        power: Math.round(snapshot.power),
        powerKw: snapshot.powerKw,
        voltage: snapshot.voltage,
        current: snapshot.current,
        frequency: snapshot.frequency,
        powerFactor: snapshot.powerFactor
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
   * Real-time subscription loop with deterministic synchronized values
   */
  subscribe(onTickCallback, intervalMs = 2000) {
    const timer = setInterval(() => {
      const now = new Date();
      const nowMs = now.getTime();
      const nextTelem = calculateSynchronizedTelemetry(nowMs);
      this.current = nextTelem;

      const livePoint = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: nextTelem.timestamp,
        power: Math.round(nextTelem.power),
        powerKw: nextTelem.powerKw,
        voltage: nextTelem.voltage,
        current: nextTelem.current,
        frequency: nextTelem.frequency,
        powerFactor: nextTelem.powerFactor
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

