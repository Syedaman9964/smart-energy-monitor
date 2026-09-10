import express from 'express';
import db from '../models/db.js';

const router = express.Router();

// MCU & Hardware Health Metrics
router.get('/health', (req, res) => {
  try {
    const health = db.getDeviceHealth();
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Issue PZEM EEPROM Energy Reset Command
router.post('/pzem/reset', (req, res) => {
  try {
    const current = db.getLatestTelemetry();
    current.energy = 0.0;
    current.energyToday = 0.0;
    db.setLatestTelemetry(current);

    res.json({
      success: true,
      message: 'PZEM Cumulative Energy Register reset to 0.000 kWh'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
