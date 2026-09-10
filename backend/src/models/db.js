/**
 * ============================================================================
 * WATTVISION - DATABASE & STORAGE ENGINE (IN-MEMORY + FILE PERSISTENCE)
 * ============================================================================
 * Self-contained, zero-setup storage engine for telemetry time-series,
 * appliance breakdowns, alerts, tariffs, and historical bills.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data_store.json');

class DatabaseStore {
  constructor() {
    this.state = {
      activeTariffId: 'bescom_karnataka',
      connectedLoadKw: 3.0,
      latestTelemetry: {
        voltage: 231.4,
        current: 7.92,
        power: 1780.5,
        energy: 142.85,
        energyToday: 11.45,
        frequency: 50.02,
        powerFactor: 0.96,
        apparentPower: 1832.7,
        reactivePower: 433.8,
        rssi: -62,
        uptimeSeconds: 86400,
        timestamp: new Date().toISOString()
      },
      liveHistory: [], // Rolling live queue (50 points)
      telemetryLogs: [], // Historical log points
      alerts: [
        {
          id: 'ALT-101',
          type: 'warning',
          title: 'High Inductive Load Detected',
          message: 'Power factor dropped below 0.88 during inductive motor startup (Air Conditioner Compressor).',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          acknowledged: true
        },
        {
          id: 'ALT-102',
          type: 'info',
          title: 'Daily Budget 80% Consumed',
          message: 'Domestic consumption reached 9.6 kWh out of daily budget limit 12.0 kWh.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: false,
          acknowledged: false
        }
      ],
      appliances: [
        { id: 'app-1', name: 'Dual Inverter 1.5T AC', location: 'Master Bedroom', nominalPowerW: 1450, currentPowerW: 1320, state: 'ON', category: 'HVAC', dutyCycleHoursDaily: 6.5, monthlyCostEstimateInr: 1240 },
        { id: 'app-2', name: 'Storage Water Geyser 25L', location: 'Bathroom 1', nominalPowerW: 2000, currentPowerW: 0, state: 'OFF', category: 'Heating', dutyCycleHoursDaily: 1.2, monthlyCostEstimateInr: 490 },
        { id: 'app-3', name: 'Frost-Free 340L Refrigerator', location: 'Kitchen', nominalPowerW: 180, currentPowerW: 165, state: 'ON', category: 'Cooling', dutyCycleHoursDaily: 14.0, monthlyCostEstimateInr: 320 },
        { id: 'app-4', name: 'Front Load Washing Machine', location: 'Utility Area', nominalPowerW: 2100, currentPowerW: 0, state: 'OFF', category: 'Laundry', dutyCycleHoursDaily: 0.8, monthlyCostEstimateInr: 210 },
        { id: 'app-5', name: 'Induction Cooktop 2000W', location: 'Kitchen', nominalPowerW: 1800, currentPowerW: 0, state: 'OFF', category: 'Cooking', dutyCycleHoursDaily: 1.5, monthlyCostEstimateInr: 380 },
        { id: 'app-6', name: 'BLDC Energy Saver Ceiling Fans (x3)', location: 'Living & Bedrooms', nominalPowerW: 84, currentPowerW: 84, state: 'ON', category: 'Ventilation', dutyCycleHoursDaily: 18.0, monthlyCostEstimateInr: 185 },
        { id: 'app-7', name: 'LED Ambient Lighting Setup', location: 'Whole House', nominalPowerW: 120, currentPowerW: 95, state: 'ON', category: 'Lighting', dutyCycleHoursDaily: 7.0, monthlyCostEstimateInr: 95 }
      ],
      deviceHealth: {
        deviceId: 'ESP32-WROOM-01',
        firmwareVersion: 'v2.1.0-college-build',
        mcuArchitecture: 'Xtensa Dual-Core 32-bit LX6 @ 240 MHz',
        flashSizeMb: 4,
        freeHeapBytes: 198420,
        wifiSsid: 'Home_Lab_IoT_2.4G',
        wifiRssi: -62,
        wifiIp: '192.168.1.145',
        pzemHardwareStatus: 'ONLINE_ACTIVE',
        pzemErrorCount: 0,
        lastHeartbeat: new Date().toISOString(),
        uptimeSeconds: 94250,
        isSimulated: false
      }
    };

    this.initializeData();
  }

  initializeData() {
    // Generate initial live queue
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const t = new Date(now - i * 2000);
      const p = Math.round(1750 + Math.sin(i * 0.3) * 200 + (Math.random() - 0.5) * 50);
      this.state.liveHistory.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: t.toISOString(),
        power: p,
        powerKw: Number((p / 1000).toFixed(3)),
        voltage: Number((230.5 + (Math.random() - 0.5) * 2).toFixed(1)),
        current: Number((p / (230 * 0.95)).toFixed(2)),
        frequency: Number((50.01 + (Math.random() - 0.5) * 0.08).toFixed(2)),
        powerFactor: 0.96
      });
    }

    // Try loading persisted file if exists
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.warn('[DB] Using default in-memory state');
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2));
    } catch (e) {
      // Ignored for environments without write permissions
    }
  }

  getLatestTelemetry() {
    return { ...this.state.latestTelemetry };
  }

  setLatestTelemetry(telemetry) {
    this.state.latestTelemetry = { ...telemetry };
    
    // Push into rolling queue
    const livePoint = {
      time: new Date(telemetry.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: telemetry.timestamp || new Date().toISOString(),
      power: Math.round(telemetry.power),
      powerKw: Number((telemetry.power / 1000).toFixed(3)),
      voltage: telemetry.voltage,
      current: telemetry.current,
      frequency: telemetry.frequency,
      powerFactor: telemetry.powerFactor
    };

    this.state.liveHistory.push(livePoint);
    if (this.state.liveHistory.length > 50) {
      this.state.liveHistory.shift();
    }

    // Add to telemetry logs
    this.state.telemetryLogs.unshift({
      id: `LOG-${Date.now()}`,
      ...telemetry
    });
    if (this.state.telemetryLogs.length > 200) {
      this.state.telemetryLogs.pop();
    }

    this.state.deviceHealth.lastHeartbeat = new Date().toISOString();
    if (telemetry.uptimeSeconds) {
      this.state.deviceHealth.uptimeSeconds = telemetry.uptimeSeconds;
    }
    if (telemetry.rssi) {
      this.state.deviceHealth.wifiRssi = telemetry.rssi;
    }
  }

  getLiveHistory() {
    return [...this.state.liveHistory];
  }

  getTelemetryLogs(limit = 50) {
    return this.state.telemetryLogs.slice(0, limit);
  }

  getAlerts() {
    return [...this.state.alerts];
  }

  addAlert(alert) {
    const newAlert = {
      id: `ALT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      acknowledged: false,
      ...alert
    };
    this.state.alerts.unshift(newAlert);
    if (this.state.alerts.length > 50) this.state.alerts.pop();
    return newAlert;
  }

  acknowledgeAlert(id) {
    this.state.alerts = this.state.alerts.map(a => a.id === id ? { ...a, acknowledged: true, read: true } : a);
    return [...this.state.alerts];
  }

  clearAlerts() {
    this.state.alerts = this.state.alerts.filter(a => !a.acknowledged);
    return [...this.state.alerts];
  }

  getAppliances() {
    return [...this.state.appliances];
  }

  getDeviceHealth() {
    return { ...this.state.deviceHealth };
  }

  updateDeviceHealth(partial) {
    this.state.deviceHealth = { ...this.state.deviceHealth, ...partial };
  }

  getActiveTariffId() {
    return this.state.activeTariffId;
  }

  setActiveTariffId(id) {
    this.state.activeTariffId = id;
    this.save();
  }

  getConnectedLoadKw() {
    return this.state.connectedLoadKw;
  }

  setConnectedLoadKw(loadKw) {
    this.state.connectedLoadKw = loadKw;
    this.save();
  }
}

export const db = new DatabaseStore();
export default db;
