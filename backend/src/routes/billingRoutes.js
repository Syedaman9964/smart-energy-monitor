import express from 'express';
import {
  getBillingSummary,
  calculateCustomBill,
  getBillingHistory
} from '../controllers/billingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication across all billing endpoints
router.use(requireAuth);

// Current MTD & Projections
router.get('/summary', getBillingSummary);

// Custom Interactive Bill Calculator Endpoint
router.post('/calculate', calculateCustomBill);

// Historical Invoices & Monthly Trends
router.get('/history', getBillingHistory);

export default router;
