import express from 'express';
import {
  getLiveTelemetry,
  postLiveTelemetry,
  getHistoricalTelemetry,
  getTelemetryLogs
} from '../controllers/telemetryController.js';

const router = express.Router();

// Live Telemetry (Current RMS snapshot)
router.get('/live', getLiveTelemetry);

// ESP32 Telemetry Batch Ingestion
router.post('/live', postLiveTelemetry);

// Time-series Chart Data (live, 24h, 7d, 30d, 12m)
router.get('/history', getHistoricalTelemetry);

// Raw Telemetry Event Logs
router.get('/logs', getTelemetryLogs);

export default router;
