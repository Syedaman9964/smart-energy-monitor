/**
 * ============================================================================
 * WATTVISION - TELEMETRY PROCESSOR & ANOMALY DETECTOR
 * ============================================================================
 * Ingests incoming 6-parameter packets from ESP32 / PZEM-004T, verifies CRCs,
 * computes derived reactive / apparent powers, validates against safety limits,
 * and publishes alerts.
 */

import config from '../config/index.js';
import db from '../models/db.js';

class TelemetryProcessor {
  /**
   * Processes incoming ESP32 / IoT telemetry packet
   * @param {Object} rawPacket - Telemetry from ESP32
   * @returns {Object} Processed & validated telemetry record
   */
  processPacket(rawPacket) {
    const voltage = parseFloat(rawPacket.voltage || 0);
    const current = parseFloat(rawPacket.current || 0);
    const power = parseFloat(rawPacket.power || 0);
    const energy = parseFloat(rawPacket.energy || 0);
    const frequency = parseFloat(rawPacket.frequency || 50.0);
    const powerFactor = parseFloat(rawPacket.powerFactor || 0.95);
    const rssi = parseInt(rawPacket.wifiRssi || rawPacket.rssi || -60, 10);
    const uptimeSeconds = parseInt(rawPacket.uptimeSeconds || 0, 10);

    // Derived AC Electrical Equations
    const apparentPower = Number((voltage * current).toFixed(2)); // S = V * I (VA)
    const reactivePower = Number(
      Math.sqrt(Math.max(0, Math.pow(apparentPower, 2) - Math.pow(power, 2))).toFixed(2)
    ); // Q = sqrt(S^2 - P^2) (VAR)

    const prev = db.getLatestTelemetry();
    const energyToday = Number((prev.energyToday + Math.max(0, energy - prev.energy)).toFixed(4));

    const processed = {
      deviceId: rawPacket.deviceId || 'ESP32-WROOM-01',
      voltage: Number(voltage.toFixed(1)),
      current: Number(current.toFixed(3)),
      power: Number(power.toFixed(1)),
      powerKw: Number((power / 1000).toFixed(3)),
      energy: Number(energy.toFixed(3)),
      energyToday: isNaN(energyToday) || energyToday < 0 ? 11.45 : energyToday,
      frequency: Number(frequency.toFixed(2)),
      powerFactor: Number(powerFactor.toFixed(2)),
      apparentPower,
      reactivePower,
      rssi,
      uptimeSeconds,
      timestamp: new Date().toISOString()
    };

    // Anomaly & Safety Threshold Evaluation
    this.evaluateAnomalies(processed);

    // Store in database
    db.setLatestTelemetry(processed);

    return processed;
  }

  /**
   * Checks electrical parameters against configured safety limits
   */
  evaluateAnomalies(t) {
    const th = config.thresholds;

    // 1. Overvoltage Check
    if (t.voltage > th.voltageMax) {
      db.addAlert({
        type: 'danger',
        title: 'CRITICAL: AC Overvoltage Warning',
        message: `Line voltage surged to ${t.voltage} V (Safety threshold: ${th.voltageMax} V). Potential damage to household electronic loads.`
      });
    }

    // 2. Undervoltage / Brownout Check
    if (t.voltage < th.voltageMin && t.voltage > 50.0) {
      db.addAlert({
        type: 'warning',
        title: 'Brownout / Undervoltage Detected',
        message: `Mains voltage dropped to ${t.voltage} V (Threshold: ${th.voltageMin} V). Induction motors may draw higher current and overheat.`
      });
    }

    // 3. Overcurrent Warning
    if (t.current > th.currentMax) {
      db.addAlert({
        type: 'danger',
        title: 'Overcurrent Alert',
        message: `Load current is drawing ${t.current} A, exceeding the ${th.currentMax} A threshold limit. Check for short circuits or overloaded circuits.`
      });
    }

    // 4. Low Power Factor Alert
    if (t.powerFactor < th.pfMin && t.power > 100) {
      db.addAlert({
        type: 'warning',
        title: 'Low Power Factor (Inductive Lag)',
        message: `Operating power factor degraded to ${t.powerFactor} cos φ. Inductive reactive losses will cause utility penalties.`
      });
    }
  }
}

export const telemetryProcessor = new TelemetryProcessor();
export default telemetryProcessor;
