/**
 * ============================================================================
 * TELEMETRY CONTROLLER
 * ============================================================================
 * Handles HTTP requests for real-time telemetry, ESP32 batch ingestion,
 * and historical graph time-series endpoints.
 */

import db from '../models/db.js';
import telemetryProcessor from '../services/telemetryProcessor.js';

export const getLiveTelemetry = (req, res) => {
  try {
    const telemetry = db.getLatestTelemetry();
    res.json({
      success: true,
      data: telemetry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const postLiveTelemetry = (req, res) => {
  try {
    const rawPacket = req.body;
    if (!rawPacket || typeof rawPacket.voltage === 'undefined') {
      return res.status(400).json({
        success: false,
        error: 'Invalid telemetry payload. Required: voltage, current, power, energy'
      });
    }

    const processed = telemetryProcessor.processPacket(rawPacket);
    res.status(201).json({
      success: true,
      message: 'Telemetry ingested successfully',
      data: processed
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHistoricalTelemetry = (req, res) => {
  try {
    const { range = 'live' } = req.query;

    if (range === 'live') {
      return res.json({
        success: true,
        range: 'live',
        data: db.getLiveHistory()
      });
    }

    // Generate synthesized timeline for extended ranges based on current load
    const currentTelemetry = db.getLatestTelemetry();
    const data = [];
    const count = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 12;
    const now = Date.now();

    for (let i = count - 1; i >= 0; i--) {
      let label = '';
      let factor = 1.0;

      if (range === '24h') {
        const d = new Date(now - i * 3600000);
        label = `${d.getHours()}:00`;
        const hour = d.getHours();
        factor = (hour >= 18 && hour <= 22) ? 1.45 : (hour >= 1 && hour <= 6) ? 0.45 : 1.0;
      } else if (range === '7d') {
        const d = new Date(now - i * 86400000);
        label = d.toLocaleDateString('en-IN', { weekday: 'short' });
        factor = 0.85 + Math.sin(i) * 0.25;
      } else if (range === '30d') {
        const d = new Date(now - i * 86400000);
        label = `Day ${d.getDate()}`;
        factor = 0.9 + Math.cos(i * 0.5) * 0.2;
      } else {
        const d = new Date(now - i * 30 * 86400000);
        label = d.toLocaleDateString('en-IN', { month: 'short' });
        factor = 0.8 + Math.sin(i * 0.8) * 0.3;
      }

      const power = Math.round(currentTelemetry.power * factor);
      const unitsKwh = Number(((power * (range === '24h' ? 1 : 24)) / 1000).toFixed(2));

      data.push({
        label,
        power,
        powerKw: Number((power / 1000).toFixed(3)),
        unitsKwh,
        costInr: Number((unitsKwh * 6.2).toFixed(2)),
        voltage: Number((230 + Math.sin(i) * 2).toFixed(1))
      });
    }

    res.json({
      success: true,
      range,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTelemetryLogs = (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    res.json({
      success: true,
      data: db.getTelemetryLogs(limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
