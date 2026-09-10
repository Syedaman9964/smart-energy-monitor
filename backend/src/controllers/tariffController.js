/**
 * ============================================================================
 * TARIFF CONTROLLER
 * ============================================================================
 * Manages Indian State DISCOM tariff models and active consumer settings.
 */

import db from '../models/db.js';
import { INDIAN_DISCOM_PRESETS } from '../services/billingEngine.js';

export const getTariffPresets = (req, res) => {
  res.json({
    success: true,
    data: INDIAN_DISCOM_PRESETS
  });
};

export const getCurrentTariff = (req, res) => {
  try {
    const activeId = db.getActiveTariffId();
    const preset = INDIAN_DISCOM_PRESETS.find(p => p.id === activeId) || INDIAN_DISCOM_PRESETS[0];
    res.json({
      success: true,
      activeId,
      connectedLoadKw: db.getConnectedLoadKw(),
      tariff: preset
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCurrentTariff = (req, res) => {
  try {
    const { tariffId, connectedLoadKw } = req.body;
    if (tariffId) {
      db.setActiveTariffId(tariffId);
    }
    if (connectedLoadKw) {
      db.setConnectedLoadKw(parseFloat(connectedLoadKw));
    }

    res.json({
      success: true,
      message: 'Tariff settings updated successfully',
      activeId: db.getActiveTariffId(),
      connectedLoadKw: db.getConnectedLoadKw()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
