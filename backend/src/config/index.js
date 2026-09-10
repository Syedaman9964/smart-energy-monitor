/**
 * ============================================================================
 * WATTVISION BACKEND CONFIGURATION
 * ============================================================================
 * Environment variable parsing, default port assignments, alert threshold limits,
 * and Indian DISCOM preset definitions.
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  wsPort: process.env.WS_PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN
    ? (process.env.CORS_ORIGIN.includes(',')
        ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
        : process.env.CORS_ORIGIN.trim())
    : '*',

  // Device Authentication / Secret
  deviceSecretKey: process.env.DEVICE_SECRET_KEY || 'wattvision-iot-key-2026',

  // Alert Thresholds for Grid Anomaly Detection
  thresholds: {
    voltageMax: parseFloat(process.env.ALERT_VOLTAGE_MAX || '255.0'), // Overvoltage (V)
    voltageMin: parseFloat(process.env.ALERT_VOLTAGE_MIN || '195.0'), // Undervoltage (V)
    currentMax: parseFloat(process.env.ALERT_CURRENT_MAX || '25.0'),  // Overcurrent (A)
    powerMax: parseFloat(process.env.ALERT_POWER_MAX || '5000.0'),    // Power Surge (W)
    pfMin: parseFloat(process.env.ALERT_PF_MIN || '0.80'),            // Poor Power Factor
    frequencyMax: parseFloat(process.env.ALERT_FREQ_MAX || '50.8'),   // High Frequency
    frequencyMin: parseFloat(process.env.ALERT_FREQ_MIN || '49.2'),   // Low Frequency
  },

  // Central Electricity Authority (CEA) Baseline Indian Grid Emission Factor
  carbonEmissionFactorKgPerKwh: 0.82,
  treeAbsorptionKgPerYear: 21.77
};

export default config;
