import express from 'express';
import {
  get24HourPrediction,
  get30DayPrediction,
  postScenarioSimulation
} from '../controllers/predictionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication across all prediction endpoints
router.use(requireAuth);

// 24-Hour Ahead AI Predictive Load Curve
router.get('/24h', get24HourPrediction);

// 30-Day Monthly Forecast & Slab Predictions
router.get('/30d', get30DayPrediction);

// What-If Interactive Scenario Simulation
router.post('/simulate', postScenarioSimulation);

export default router;
