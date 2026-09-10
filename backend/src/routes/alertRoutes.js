import express from 'express';
import {
  getAlerts,
  acknowledgeAlert,
  clearAlerts
} from '../controllers/alertController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication across all alert endpoints
router.use(requireAuth);

// Active & Historical Alerts
router.get('/', getAlerts);

// Acknowledge Alert by ID
router.post('/:id/acknowledge', acknowledgeAlert);

// Clear Acknowledged Alerts
router.post('/clear', clearAlerts);

export default router;
