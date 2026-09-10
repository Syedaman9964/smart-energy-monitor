import express from 'express';
import {
  getTariffPresets,
  getCurrentTariff,
  updateCurrentTariff
} from '../controllers/tariffController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication across all tariff endpoints
router.use(requireAuth);

// List all 5+ State DISCOM Tariff Models
router.get('/presets', getTariffPresets);

// Get Active Tariff Profile
router.get('/current', getCurrentTariff);

// Update Active Tariff Profile / Connected Load (Admin only)
router.post('/current', requireRole('ADMIN'), updateCurrentTariff);

export default router;
