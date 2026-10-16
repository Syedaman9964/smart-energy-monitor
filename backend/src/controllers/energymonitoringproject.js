/**
 * ============================================================================
 * WATTVISION - AUTHENTICATION CONTROLLER
 * ============================================================================
 * Secure credential validation, JWT token issuance, HTTP-only cookie management,
 * user session verification, and password updates.
 */

import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import userModel from '../models/userModel.js';

/**
 * Authenticates user credentials and establishes a secure session
 * POST /api/auth/login
 */
export const login = (req, res) => {
  try {
    const { username, email, identifier, password, rememberMe } = req.body;
    const userIdentifier = (username || email || identifier || '').trim();

    // Authoritative server-side validation
    if (!userIdentifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required.'
      });
    }

    const user = userModel.findByUsernameOrEmail(userIdentifier);
    const isPasswordValid = user ? userModel.verifyPassword(user, password) : false;

    // Security Rule: Return identical generic error on either missing user or wrong password
    if (!user || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    // Extract client IP and User Agent
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Terminal';

    // Create persistent server session
    const session = userModel.createSession(user, { ip: clientIp, userAgent });

    // Duration based on rememberMe flag
    const maxAgeMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresInStr = rememberMe ? '7d' : config.jwtExpiresIn;

    // Sign cryptographic JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        sessionId: session.sessionId,
        role: user.role,
        email: user.email
      },
      config.jwtSecret,
      { expiresIn: expiresInStr }
    );

    // Set secure HTTP-only cookie
    res.cookie('wattvision_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: maxAgeMs,
      path: '/'
    });

    console.log(`[AUTH] User '${user.email}' (${user.role}) authenticated successfully from ${clientIp}`);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: userModel.getPublicUser(user),
      session: {
        sessionId: session.sessionId,
        loginTime: session.createdAt,
        ip: session.ip,
        userAgent: session.userAgent
      },
      token // Return as fallback for non-browser/header consumers
    });
  } catch (error) {
    console.error('[AUTH ERROR] Login failed', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected authentication error occurred.'
    });
  }
};

/**
 * Invalidate session and destroy authentication cookie
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  try {
    let token = req.cookies?.wattvision_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.slice(7).trim();
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        if (decoded && decoded.sessionId) {
          userModel.destroySession(decoded.sessionId);
        }
      } catch (e) {
        // Token already expired or invalid
      }
    }

    // Clear HTTP-only cookie
    res.clearCookie('wattvision_token', {
      path: '/',
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax'
    });

    return res.json({
      success: true,
      message: 'Logged out successfully. Session destroyed.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error during logout.'
    });
  }
};

/**
 * Returns current authenticated user and session metadata
 * GET /api/auth/me
 */
export const getMe = (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
      session: {
        sessionId: req.session.sessionId,
        loginTime: req.session.createdAt,
        ip: req.session.ip,
        userAgent: req.session.userAgent
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Changes password for currently authenticated user
 * POST /api/auth/change-password
 */
export const changePassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long.'
      });
    }

    const user = userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const isCurrentValid = userModel.verifyPassword(user, currentPassword);
    if (!isCurrentValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password does not match.'
      });
    }

    userModel.updatePassword(user.id, newPassword);

    console.log(`[AUTH] Password updated for user '${user.email}'`);

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Returns list of active sessions for current user
 * GET /api/auth/sessions
 */
export const getSessions = (req, res) => {
  try {
    const sessions = userModel.getUserSessions(req.user.id);
    return res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  login,
  logout,
  getMe,
  changePassword,
  getSessions
};
