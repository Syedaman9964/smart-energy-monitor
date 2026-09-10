/**
 * ============================================================================
 * SMART ENERGY MONITOR - MOCK ENERGY DATA
 * ============================================================================
 * This file contains mock electrical data simulating readings from a PZEM-004T
 * energy sensor connected to an ESP32 microcontroller.
 *
 * It is kept strictly isolated from the UI components so that when the real
 * ESP32 / WebSocket / REST API backend is ready, this file or service can be
 * replaced without changing the frontend component logic.
 */

// 1. Nominal Base Readings (Single-Phase AC Grid Standard ~230V / 50Hz)
export const INITIAL_READINGS = {
  voltage: 231.4,        // Volts (V) - Normal grid range: 220V - 240V
  current: 5.62,         // Amperes (A) - Range: 0A - 100A (PZEM-004T CT clamp)
  power: 1245.8,         // Watts (W) - Active real power (P = V * I * PF)
  energy: 148.35,        // Kilowatt-hours (kWh) - Cumulative energy meter
  frequency: 50.02,      // Hertz (Hz) - Standard grid frequency
  powerFactor: 0.96,     // Power Factor (cos φ) - 0.00 to 1.00 (efficiency ratio)
  timestamp: new Date().toISOString()
};

// 2. Hardware / ESP32 Diagnostic Telemetry
export const MOCK_DEVICE_STATUS = {
  deviceModel: "ESP32-WROOM-32",
  sensorModel: "PZEM-004T v3.0 (TTL UART)",
  connectionState: "SIMULATION_MODE", // 'SIMULATION_MODE' | 'ONLINE' | 'OFFLINE'
  ipAddress: "192.168.1.145 (Virtual)",
  macAddress: "24:6F:28:B4:7E:10",
  wifiSsid: "Home_WiFi_2.4G",
  wifiRssi: -62, // dBm (Good signal)
  firmwareVersion: "v1.0.0-frontend-mock",
  uptimeMinutes: 432,
  sampleRateMs: 2000,
  sensorHealth: "Normal (CRC Valid)"
};

// 3. Helper to generate realistic 24-hour historical hourly profile
export const generate24HourHistory = () => {
  const points = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const hour = time.getHours();

    // Typical domestic load curve: lower at night, minor morning peak, major evening peak
    let baseLoad = 400; // Standby fridge/routers (W)
    if (hour >= 6 && hour <= 9) baseLoad = 1600; // Morning rush (kettle, geyser, toast)
    else if (hour >= 10 && hour <= 17) baseLoad = 900; // Daytime work (PC, fans, fridge)
    else if (hour >= 18 && hour <= 22) baseLoad = 2400; // Evening peak (cooking, TV, AC, lights)
    else if (hour >= 23 || hour <= 5) baseLoad = 380; // Night sleep baseline

    // Add random realistic fluctuation (+/- 15%)
    const randomJitter = (Math.random() - 0.5) * 0.3 * baseLoad;
    const power = Math.max(150, Math.round(baseLoad + randomJitter));
    const voltage = +(228 + Math.random() * 5).toFixed(1);
    const current = +(power / (voltage * 0.95)).toFixed(2);

    const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    points.push({
      timestamp: time.toISOString(),
      label: timeLabel,
      power: power,
      voltage: voltage,
      current: current,
      kwh: +(power / 1000).toFixed(2)
    });
  }

  return points;
};

// 4. Initial Real-time Rolling Points (Last 20 ticks)
export const generateInitialLivePoints = () => {
  const points = [];
  const now = Date.now();
  for (let i = 19; i >= 0; i--) {
    const t = new Date(now - i * 2000);
    const power = Math.round(1180 + Math.sin(i * 0.5) * 120 + (Math.random() - 0.5) * 60);
    points.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      power: power,
      voltage: +(230.5 + (Math.random() - 0.5) * 2).toFixed(1),
      current: +(power / (230 * 0.96)).toFixed(2)
    });
  }
  return points;
};

// 5. Recent Energy Usage Log Entries (Hourly or session intervals)
export const MOCK_RECENT_USAGE_LOGS = [
  {
    id: "log-1",
    timeWindow: "Today, 19:00 - 20:00",
    avgPower: "2,350 W",
    peakPower: "3,120 W",
    energyConsumed: "2.35 kWh",
    cost: "₹29.40",
    status: "Peak Hours",
    isPeak: true
  },
  {
    id: "log-2",
    timeWindow: "Today, 18:00 - 19:00",
    avgPower: "1,820 W",
    peakPower: "2,450 W",
    energyConsumed: "1.82 kWh",
    cost: "₹21.84",
    status: "Normal",
    isPeak: false
  },
  {
    id: "log-3",
    timeWindow: "Today, 17:00 - 18:00",
    avgPower: "940 W",
    peakPower: "1,250 W",
    energyConsumed: "0.94 kWh",
    cost: "₹11.28",
    status: "Normal",
    isPeak: false
  },
  {
    id: "log-4",
    timeWindow: "Today, 16:00 - 17:00",
    avgPower: "860 W",
    peakPower: "1,100 W",
    energyConsumed: "0.86 kWh",
    cost: "₹10.32",
    status: "Normal",
    isPeak: false
  },
  {
    id: "log-5",
    timeWindow: "Today, 15:00 - 16:00",
    avgPower: "1,050 W",
    peakPower: "1,480 W",
    energyConsumed: "1.05 kWh",
    cost: "₹12.60",
    status: "Normal",
    isPeak: false
  }
];

// 6. Default Tariff Settings (India DISCOM - Price per Unit/kWh)
export const DEFAULT_TARIFF = {
  currencySymbol: "₹",
  ratePerKwh: 8.00, // ₹8.00 per Unit (kWh) - Typical Indian residential slab
  todayKwhBase: 12.45 // Mock total units consumed today so far
};
