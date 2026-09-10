import express from 'express';
import {
  getAlerts,
  acknowledgeAlert,
  clearAlerts
} from '../controllers/alertController.js';

const router = express.Router();

// Active & Historical Alerts
router.get('/', getAlerts);

// Acknowledge Alert by ID
router.post('/:id/acknowledge', acknowledgeAlert);

// Clear Acknowledged Alerts
router.post('/clear', clearAlerts);

export default router;
