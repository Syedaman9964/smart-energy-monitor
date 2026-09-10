import express from 'express';
import {
  login,
  logout,
  getMe,
  changePassword,
  getSessions
} from '../controllers/authController.js';
import {
  loginRateLimiter,
  validateAuthInputs,
  requireAuth
} from '../middleware/auth.js';

const router = express.Router();

// User Login (Rate limited + Input sanitized)
router.post('/login', loginRateLimiter, validateAuthInputs, login);

// User Logout (Destroys session + Clears cookie)
router.post('/logout', logout);

// Current User Profile & Session Verification
router.get('/me', requireAuth, getMe);

// Change Account Password
router.post('/change-password', requireAuth, changePassword);

// List Active Sessions
router.get('/sessions', requireAuth, getSessions);

export default router;
