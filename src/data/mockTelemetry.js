/**
 * ============================================================================
 * WATTVISION - MOCK TELEMETRY & DATA ARCHITECTURE
 * ============================================================================
 * Contains comprehensive simulated datasets for the commercial energy management platform.
 * Fully isolated from the UI components to enable direct replacement by ESP32 / MQTT / REST API.
 */

// 1. Initial Real-Time Electrical Telemetry (Simulated Single-Phase 230V Grid)
export const INITIAL_TELEMETRY = {
  voltage: 229.9,        // Volts (V) RMS
  voltageMin: 224.5,
  voltageMax: 236.2,
  current: 8.42,         // Amperes (A) RMS
  currentMin: 1.20,
  currentMax: 14.80,
  power: 1895.4,         // Active Real Power in Watts (W)
  powerKw: 1.895,        // Active Power in Kilowatts (kW)
  powerMin: 320.0,
  powerMax: 3250.0,
  energy: 148.53,        // Cumulative Energy Meter in Kilowatt-Hours (kWh)
  energyToday: 12.84,    // Units consumed today (kWh)
  frequency: 50.04,      // Grid Frequency in Hertz (Hz)
  frequencyMin: 49.88,
  frequencyMax: 50.15,
  powerFactor: 0.95,     // cos φ (0.00 to 1.00)
  apparentPower: 1995.1, // Volt-Amps (VA = V * I)
  reactivePower: 622.4,  // Volt-Amps Reactive (VAR)
  timestamp: new Date().toISOString()
};

// 2. Hardware / ESP32 Diagnostic Telemetry
export const MOCK_HARDWARE_STATUS = {
  deviceId: "ESP32-NODE-01",
  deviceModel: "ESP32-WROOM-32D (Dual Core 240MHz)",
  sensorModel: "PZEM-004T v3.0 (TTL UART @ 9600 baud)",
  connectionState: "SIMULATION_MODE", // 'SIMULATION_MODE' | 'ONLINE' | 'OFFLINE'
  ipAddress: "192.168.1.145 (Virtual)",
  macAddress: "30:AE:A4:07:9B:F4",
  wifiSsid: "WattVision_Mesh_2.4G",
  wifiRssi: -58, // dBm (Strong)
  wifiQuality: "92%",
  firmwareVersion: "v2.4.1-sim",
  uptimeSeconds: 84210,
  cpuTemp: 41.5, // °C
  freeHeap: 184520, // Bytes
  flashSize: "4MB (SPI Flash)",
  sampleRateMs: 2000,
  crcErrorCount: 0,
  lastHeartbeat: new Date().toISOString()
};

// 3. Appliances Breakdown Dataset
export const MOCK_APPLIANCES = [
  {
    id: "app-1",
    name: "Dual Inverter AC (Living Room)",
    category: "HVAC",
    iconName: "Wind",
    power: 1150, // Watts
    voltage: 230.1,
    current: 5.12,
    energyToday: 5.42, // kWh
    costToday: 43.36,
    status: "ON",
    isHardwareControlled: false,
    usagePercentage: 42.2,
    lastActive: "Active Now",
    priority: "High",
    room: "Living Room"
  },
  {
    id: "app-2",
    name: "Smart Refrigerator",
    category: "Kitchen",
    iconName: "Refrigerator",
    power: 165,
    voltage: 229.8,
    current: 0.74,
    energyToday: 1.95,
    costToday: 15.60,
    status: "ON",
    isHardwareControlled: false,
    usagePercentage: 15.2,
    lastActive: "Active Now (Compressor Active)",
    priority: "Critical",
    room: "Kitchen"
  },
  {
    id: "app-3",
    name: "Workstation & Server Rack",
    category: "Electronics",
    iconName: "Monitor",
    power: 280,
    voltage: 230.2,
    current: 1.25,
    energyToday: 2.15,
    costToday: 17.20,
    status: "ON",
    isHardwareControlled: false,
    usagePercentage: 16.7,
    lastActive: "Active Now",
    priority: "High",
    room: "Office"
  },
  {
    id: "app-4",
    name: "Smart 4K OLED TV & Soundbar",
    category: "Entertainment",
    iconName: "Tv",
    power: 120,
    voltage: 229.7,
    current: 0.53,
    energyToday: 0.84,
    costToday: 6.72,
    status: "ON",
    isHardwareControlled: false,
    usagePercentage: 6.5,
    lastActive: "Active Now",
    priority: "Normal",
    room: "Living Room"
  },
  {
    id: "app-5",
    name: "Washing Machine & Dryer",
    category: "Laundry",
    iconName: "WashingMachine",
    power: 0,
    voltage: 229.9,
    current: 0.0,
    energyToday: 1.10,
    costToday: 8.80,
    status: "STANDBY",
    isHardwareControlled: false,
    usagePercentage: 8.6,
    lastActive: "3 hours ago (Spin cycle)",
    priority: "Medium",
    room: "Utility"
  },
  {
    id: "app-6",
    name: "Smart LED Lighting System (Whole House)",
    category: "Lighting",
    iconName: "Lightbulb",
    power: 85,
    voltage: 230.0,
    current: 0.38,
    energyToday: 0.72,
    costToday: 5.76,
    status: "ON",
    isHardwareControlled: false,
    usagePercentage: 5.6,
    lastActive: "Active Now (14 fixtures)",
    priority: "Normal",
    room: "Multiple"
  },
  {
    id: "app-7",
    name: "Kitchen Microwave & Coffee Bar",
    category: "Kitchen",
    iconName: "Coffee",
    power: 0,
    voltage: 229.9,
    current: 0.0,
    energyToday: 0.45,
    costToday: 3.60,
    status: "STANDBY",
    isHardwareControlled: false,
    usagePercentage: 3.5,
    lastActive: "45 mins ago",
    priority: "Low",
    room: "Kitchen"
  },
  {
    id: "app-8",
    name: "Standby Devices & Routers",
    category: "General",
    iconName: "Zap",
    power: 45,
    voltage: 230.0,
    current: 0.20,
    energyToday: 0.21,
    costToday: 1.68,
    status: "ON",
    isHardwareControlled: false,
    usagePercentage: 1.7,
    lastActive: "Continuous Baseline",
    priority: "Normal",
    room: "Network Closet"
  }
];

// 4. Intelligent Alerts Dataset
export const MOCK_ALERTS = [
  {
    id: "alt-101",
    severity: "warning", // 'critical' | 'warning' | 'info'
    title: "High Peak Power Spike Detected",
    description: "Active load reached 3,120 W during evening cooking and AC cycle. Exceeds recommended 2.8 kW threshold.",
    timestamp: "10 mins ago",
    read: false,
    acknowledged: false,
    category: "Power Quality",
    metric: "Power: 3.12 kW"
  },
  {
    id: "alt-102",
    severity: "info",
    title: "ESP32 Heartbeat & Sampling Stable",
    description: "ESP32 PZEM-004T simulator telemetry stream running at 0.5 Hz with 0 dropped frames.",
    timestamp: "32 mins ago",
    read: true,
    acknowledged: true,
    category: "System Health",
    metric: "Health: 100%"
  },
  {
    id: "alt-103",
    severity: "warning",
    title: "Power Factor Dropped Below 0.90",
    description: "Inductive motor load caused power factor to dip to 0.88. High reactive power detected.",
    timestamp: "2 hours ago",
    read: true,
    acknowledged: true,
    category: "Power Factor",
    metric: "PF: 0.88"
  },
  {
    id: "alt-104",
    severity: "critical",
    title: "Voltage Sag Alert (Grid Dip)",
    description: "Mains voltage transiently dropped to 214.2V for 3.4 seconds. Protected equipment resumed normal operation.",
    timestamp: "Yesterday, 18:42",
    read: true,
    acknowledged: true,
    category: "Grid Stability",
    metric: "Voltage: 214.2 V"
  },
  {
    id: "alt-105",
    severity: "info",
    title: "Daily Energy Budget Target Achieved",
    description: "Daily consumption was maintained at 11.8 kWh, 15% below the monthly average target.",
    timestamp: "Yesterday, 23:59",
    read: true,
    acknowledged: true,
    category: "Efficiency",
    metric: "Saved ₹22.50"
  }
];

// 5. Default Multi-Tier Tariff Configuration (India DISCOM Residential)
export const DEFAULT_TARIFF_CONFIG = {
  currency: "₹",
  baseRatePerKwh: 8.00,       // ₹8.00 / Unit (kWh) - Typical Indian residential slab
  peakRatePerKwh: 12.00,      // ₹12.00 / Unit (Peak 18:00 - 22:00 IST)
  offPeakRatePerKwh: 5.00,    // ₹5.00 / Unit (Off-Peak 23:00 - 06:00 IST)
  fixedMonthlyCharge: 150.00, // ₹150/month Fixed Meter/Demand Charge
  taxRatePercent: 18.0,       // 18% GST on electricity
  billingCycleDay: 1,         // Billing cycle starts 1st of month
  peakHoursStart: "18:00",
  peakHoursEnd: "22:00"
};

// 6. Carbon & Sustainability Factors (India Grid)
export const CARBON_FACTORS = {
  gridEmissionFactorKgPerKwh: 0.82,  // 0.82 kg CO2e per kWh (India Grid Emission Factor - CEA 2024)
  treeAnnualAbsorptionKg: 21.7,      // 1 tree absorbs ~21.7 kg CO2 / year
  monthlyTargetCo2Kg: 200.0          // Monthly target budget (India avg household)
};

// 7. Generators for Historical Trends (24h, 7d, 30d, 12m)
export const generate24HourProfile = () => {
  const points = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const hour = time.getHours();

    let basePower = 450;
    if (hour >= 6 && hour <= 8) basePower = 1750;
    else if (hour >= 9 && hour <= 16) basePower = 950;
    else if (hour >= 17 && hour <= 22) basePower = 2650;
    else if (hour >= 23 || hour <= 5) basePower = 400;

    const jitter = (Math.random() - 0.5) * 0.25 * basePower;
    const power = Math.max(250, Math.round(basePower + jitter));
    const voltage = +(228.5 + (Math.random() - 0.5) * 4).toFixed(1);
    const current = +(power / (voltage * 0.95)).toFixed(2);
    const powerFactor = +(0.93 + (Math.random() - 0.5) * 0.05).toFixed(2);
    const kwh = +(power / 1000).toFixed(2);
    const cost = +(kwh * (hour >= 18 && hour <= 22 ? 12.00 : 8.00)).toFixed(2);

    const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    points.push({
      timestamp: time.toISOString(),
      time: timeLabel,
      hour: `${hour}:00`,
      power,
      powerKw: +(power / 1000).toFixed(3),
      voltage,
      current,
      powerFactor,
      kwh,
      cost,
      co2: +(kwh * 0.415).toFixed(2)
    });
  }
  return points;
};

export const generate7DayProfile = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, idx) => {
    const kwh = +(12.2 + Math.sin(idx * 0.8) * 3.5 + Math.random() * 1.5).toFixed(2);
    const peakPower = Math.round(2800 + Math.random() * 600);
    const avgPower = Math.round((kwh * 1000) / 24);
    const cost = +(kwh * 8.50).toFixed(2);
    const co2 = +(kwh * 0.82).toFixed(2);
    return {
      day,
      kwh: Number(kwh),
      cost: Number(cost),
      co2: Number(co2),
      peakPower,
      avgPower,
      efficiencyScore: Math.round(88 + Math.random() * 10)
    };
  });
};

export const generate30DayProfile = () => {
  const points = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400 * 1000);
    const dayNum = d.getDate();
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const kwh = +(isWeekend ? (14.5 + Math.random() * 3) : (11.8 + Math.random() * 2.5)).toFixed(2);
    const cost = +(kwh * 8.20).toFixed(2);
    const co2 = +(kwh * 0.82).toFixed(2);
    points.push({
      date: `${d.toLocaleString('default', { month: 'short' })} ${dayNum}`,
      day: dayNum,
      kwh: Number(kwh),
      cost: Number(cost),
      co2: Number(co2),
      powerFactor: +(0.94 + (Math.random() - 0.5) * 0.04).toFixed(2)
    });
  }
  return points;
};

export const generate12MonthProfile = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Seasonal AC summer curve & winter heating
  const baseKwh = [380, 360, 340, 420, 520, 610, 640, 620, 510, 410, 370, 390];
  return months.map((month, idx) => {
    const kwh = Math.round(baseKwh[idx] + (Math.random() - 0.5) * 40);
    const cost = +(kwh * 8.50).toFixed(2);
    const co2 = +(kwh * 0.82).toFixed(1);
    return {
      month,
      kwh,
      cost,
      co2,
      lastYearKwh: Math.round(kwh * 1.06)
    };
  });
};

// 8. Pre-computed Historical Telemetry Log Table (50+ rows for pagination/filtering)
export const generateTelemetryLogs = (count = 50) => {
  const logs = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const time = new Date(now - i * 15 * 60 * 1000); // every 15 mins
    const hour = time.getHours();
    const isPeak = hour >= 18 && hour <= 22;
    const power = Math.round((isPeak ? 2400 : 900) + (Math.random() - 0.5) * 600);
    const voltage = +(229.5 + (Math.random() - 0.5) * 5).toFixed(1);
    const current = +(power / (voltage * 0.95)).toFixed(2);
    const frequency = +(50.0 + (Math.random() - 0.5) * 0.18).toFixed(2);
    const powerFactor = +(0.94 + (Math.random() - 0.5) * 0.04).toFixed(2);
    const energy = +(148.53 - (i * 0.35)).toFixed(2);
    const cost = +( (power * 0.25 / 1000) * (isPeak ? 12.00 : 8.00) ).toFixed(3);

    logs.push({
      id: `log-${1000 + i}`,
      timestamp: time.toISOString(),
      formattedTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      formattedDate: time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      voltage,
      current,
      power,
      powerKw: +(power / 1000).toFixed(3),
      energy,
      frequency,
      powerFactor,
      cost,
      status: power > 2800 ? "Peak Surge" : power > 2000 ? "High Load" : "Normal Load",
      isPeak
    });
  }
  return logs;
};

// 9. Automated Reports Catalog (India DISCOM / INR)
export const MOCK_REPORTS = [
  {
    id: "rep-01",
    title: "Executive Daily Energy Audit",
    period: "Today (24 Hours)",
    generatedAt: "Today, 21:00",
    totalConsumption: "12.84 Units (kWh)",
    estimatedCost: "₹102.72",
    peakDemand: "3.12 kW @ 19:45",
    carbonEmissions: "10.53 kg CO₂",
    efficiencyScore: "92 / 100",
    summary: "Consumption remained within normal bounds. Brief demand peak during evening dinner preparation and AC load coincidence.",
    format: "CSV / JSON"
  },
  {
    id: "rep-02",
    title: "Weekly Power Quality & Grid Stability",
    period: "Past 7 Days",
    generatedAt: "Yesterday, 23:59",
    totalConsumption: "89.42 Units (kWh)",
    estimatedCost: "₹760.07",
    peakDemand: "3.45 kW @ Thu 20:10",
    carbonEmissions: "73.32 kg CO₂",
    efficiencyScore: "88 / 100",
    summary: "Average power factor was 0.94. Grid voltage experienced one minor transient sag on Thursday. IST load profile normal.",
    format: "CSV / JSON"
  },
  {
    id: "rep-03",
    title: "Monthly DISCOM Billing Forecast",
    period: "August 2026",
    generatedAt: "Aug 15, 2026",
    totalConsumption: "385.20 Units (kWh)",
    estimatedCost: "₹3,260.00",
    peakDemand: "3.80 kW",
    carbonEmissions: "315.86 kg CO₂",
    efficiencyScore: "90 / 100",
    summary: "Projected monthly DISCOM bill is 6.2% lower than last billing cycle due to optimised inverter AC schedule.",
    format: "CSV / JSON"
  },
  {
    id: "rep-04",
    title: "Sustainability & Carbon Footprint Report",
    period: "Year-to-Date (2026)",
    generatedAt: "Aug 01, 2026",
    totalConsumption: "3,120.40 Units (kWh)",
    estimatedCost: "₹26,522.00",
    peakDemand: "4.10 kW",
    carbonEmissions: "2,558.73 kg CO₂",
    efficiencyScore: "94 / 100",
    summary: "Equivalent to 117.9 trees required for annual carbon offset (India Grid factor: 0.82 kg/kWh). Green rating: A-.",
    format: "CSV / JSON"
  }
];
