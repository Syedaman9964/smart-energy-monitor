/**
 * ============================================================================
 * WATTVISION - AUTHENTICATION & ROLE-BASED ACCESS CONTROL MIDDLEWARE
 * ============================================================================
 * Enforces cryptographic JWT verification, HTTP-only cookie extraction,
 * server-side session activity validation, rate limiting, and role security.
 */

import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import config from '../config/index.js';
import userModel from '../models/userModel.js';

/**
 * Rate Limiter for Login Endpoint
 * Blocks brute-force credential stuffing attempts (max 10 attempts per 15 minutes)
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
    timestamp: new Date().toISOString()
  }
});

/**
 * Validates and sanitizes authentication inputs
 */
export const validateAuthInputs = (req, res, next) => {
  const { username, email, identifier, password } = req.body || {};
  const userIdentifier = (username || email || identifier || '').trim();

  if (!userIdentifier) {
    return res.status(400).json({
      success: false,
      error: 'Username is required.'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters.'
    });
  }

  req.body.identifier = userIdentifier;
  req.body.username = userIdentifier;
  if (userIdentifier.includes('@')) {
    req.body.email = userIdentifier.toLowerCase();
  }
  next();
};

/**
 * Authentication Middleware
 * Extracts token from HTTP-only cookie or Authorization header,
 * verifies signature and ensures server session is active.
 */
export const requireAuth = (req, res, next) => {
  // 1. Extract Token from Cookie or Bearer header
  let token = null;

  if (req.cookies && req.cookies.wattvision_token) {
    token = req.cookies.wattvision_token;
  } else if (req.signedCookies && req.signedCookies.wattvision_token) {
    token = req.signedCookies.wattvision_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/wattvision_token=([^;]+)/);
    if (match && match[1]) {
      token = decodeURIComponent(match[1].trim());
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in to access this resource.',
      code: 'AUTH_REQUIRED'
    });
  }

  try {
    // 2. Verify JWT signature & expiration
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3. Verify server-side session exists and is not expired/revoked
    const session = userModel.validateSession(decoded.sessionId);
    if (!session) {
      res.clearCookie('wattvision_token', { path: '/' });
      return res.status(401).json({
        success: false,
        error: 'Session has expired or was revoked. Please log in again.',
        code: 'SESSION_EXPIRED'
      });
    }

    // 4. Fetch user
    const user = userModel.findById(decoded.userId);
    if (!user) {
      res.clearCookie('wattvision_token', { path: '/' });
      return res.status(401).json({
        success: false,
        error: 'Associated user account no longer exists.',
        code: 'USER_NOT_FOUND'
      });
    }

    // 5. Attach public user and session to request
    req.user = userModel.getPublicUser(user);
    req.session = session;
    next();
  } catch (err) {
    res.clearCookie('wattvision_token', { path: '/' });
    return res.status(401).json({
      success: false,
      error: 'Invalid or corrupted session token. Please log in again.',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts endpoint to specified roles (e.g. 'ADMIN')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires ${allowedRoles.join(' or ')} privileges.`,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

/**
 * Dual IoT Hardware / Authenticated User Ingestion Middleware
 * Allows ESP32 / PZEM microcontrollers to POST live telemetry via device key
 * or valid telemetry payload, while requiring authentication for normal user requests.
 */
export const telemetryIngestionAuth = (req, res, next) => {
  // Check for device secret header
  const headerKey = req.headers['x-device-key'];
  if (headerKey && headerKey === config.deviceSecretKey) {
    return next();
  }

  // Check if body is valid hardware packet
  const body = req.body || {};
  if (body.deviceId && typeof body.voltage !== 'undefined') {
    return next();
  }

  // Fallback to standard user authentication
  return requireAuth(req, res, next);
};

export default {
  loginRateLimiter,
  validateAuthInputs,
  requireAuth,
  requireRole,
  telemetryIngestionAuth
};
