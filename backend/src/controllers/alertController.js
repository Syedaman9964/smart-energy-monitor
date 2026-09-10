/**
 * ============================================================================
 * ALERT CONTROLLER
 * ============================================================================
 * Handles alarm states, electrical threshold warnings, and user acknowledgments.
 */

import db from '../models/db.js';

export const getAlerts = (req, res) => {
  try {
    res.json({
      success: true,
      data: db.getAlerts()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const acknowledgeAlert = (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.acknowledgeAlert(id);
    res.json({
      success: true,
      message: `Alert ${id} acknowledged`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const clearAlerts = (req, res) => {
  try {
    const updated = db.clearAlerts();
    res.json({
      success: true,
      message: 'Acknowledged alerts cleared',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
