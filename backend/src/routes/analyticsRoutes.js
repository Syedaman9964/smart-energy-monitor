import express from 'express';
import db from '../models/db.js';
import config from '../config/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication across all analytics endpoints
router.use(requireAuth);

// Appliance Breakdown & Disaggregation
router.get('/appliances', (req, res) => {
  try {
    const appliances = db.getAppliances();
    const totalPower = appliances.reduce((sum, a) => sum + (a.state === 'ON' ? a.currentPowerW : 0), 0);

    res.json({
      success: true,
      totalActivePowerW: totalPower,
      data: appliances
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Carbon Footprint Analytics (CEA India Baseline)
router.get('/carbon', (req, res) => {
  try {
    const telemetry = db.getLatestTelemetry();
    const todayUnits = telemetry.energyToday;
    const factor = config.carbonEmissionFactorKgPerKwh; // 0.82 kg CO2 / kWh

    const todayKgCo2 = Number((todayUnits * factor).toFixed(2));
    const monthlyKgCo2 = Number((todayUnits * 30 * factor).toFixed(2));
    const yearlyKgCo2 = Number((todayUnits * 365 * factor).toFixed(2));
    const treesNeeded = Number((yearlyKgCo2 / config.treeAbsorptionKgPerYear).toFixed(1));

    res.json({
      success: true,
      data: {
        todayKgCo2,
        monthlyKgCo2,
        yearlyKgCo2,
        treesNeeded,
        baselineEmissionFactor: factor,
        standard: 'Central Electricity Authority (CEA) India CO2 Baseline Database v19'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
