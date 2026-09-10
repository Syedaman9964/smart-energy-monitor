import express from 'express';
import {
  getLiveTelemetry,
  postLiveTelemetry,
  getHistoricalTelemetry,
  getTelemetryLogs
} from '../controllers/telemetryController.js';
import { requireAuth, telemetryIngestionAuth } from '../middleware/auth.js';

const router = express.Router();

// Live Telemetry (Current RMS snapshot) - Protected
router.get('/live', requireAuth, getLiveTelemetry);

// ESP32 Telemetry Batch Ingestion - Allows hardware / device key or authenticated user
router.post('/live', telemetryIngestionAuth, postLiveTelemetry);

// Time-series Chart Data (live, 24h, 7d, 30d, 12m) - Protected
router.get('/history', requireAuth, getHistoricalTelemetry);

// Raw Telemetry Event Logs - Protected
router.get('/logs', requireAuth, getTelemetryLogs);

export default router;
