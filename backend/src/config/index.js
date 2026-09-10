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
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],

  // Authentication & Session Security
  jwtSecret: process.env.JWT_SECRET || 'wattvision-production-jwt-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  cookieSecret: process.env.COOKIE_SECRET || 'wattvision-cookie-signing-secret-2026',

  // Initial Seed Accounts (Environment Configurable, Defaulted for Demo)
  adminUsername: (process.env.ADMIN_USERNAME || 'Syedaman').trim(),
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@wattvision.energy').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || 'WattVision2026!Admin',
  adminName: process.env.ADMIN_NAME || 'Syed Aman',
  
  userEmail: (process.env.USER_EMAIL || 'user@wattvision.energy').toLowerCase().trim(),
  userPassword: process.env.USER_PASSWORD || 'WattVision2026!User',
  userName: process.env.USER_NAME || 'Energy Analyst',

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
