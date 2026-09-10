import express from 'express';
import {
  getTariffPresets,
  getCurrentTariff,
  updateCurrentTariff
} from '../controllers/tariffController.js';

const router = express.Router();

// List all 5+ State DISCOM Tariff Models
router.get('/presets', getTariffPresets);

// Get Active Tariff Profile
router.get('/current', getCurrentTariff);

// Update Active Tariff Profile / Connected Load
router.post('/current', updateCurrentTariff);

export default router;
