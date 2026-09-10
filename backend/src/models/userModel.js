/**
 * ============================================================================
 * WATTVISION - USER MODEL & SECURE SESSION STORE
 * ============================================================================
 * Production user entity management with salted bcrypt password hashing,
 * role-based access control (ADMIN / USER), and active session lifecycle tracking.
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data_store.json');

class UserModel {
  constructor() {
    this.users = [];
    this.sessions = new Map(); // sessionId -> sessionData
    this.init();
  }

  init() {
    // Load existing persisted data if available
    let storedUsers = null;
    let storedSessions = null;

    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.authUsers)) {
          storedUsers = parsed.authUsers;
        }
        if (Array.isArray(parsed.authSessions)) {
          storedSessions = parsed.authSessions;
        }
      }
    } catch (e) {
      console.warn('[UserModel] Starting with fresh user store');
    }

    if (storedUsers && storedUsers.length > 0) {
      this.users = storedUsers;
      const admin = this.users.find(u => u.id === 'usr-admin-01' || u.role === 'ADMIN');
      if (admin && !admin.username) {
        admin.username = config.adminUsername || 'Syedaman';
        this.persist();
      }
    } else {
      // Seed default accounts with salted bcrypt hashes
      const adminSalt = bcrypt.genSaltSync(10);
      const adminHash = bcrypt.hashSync(config.adminPassword, adminSalt);

      const userSalt = bcrypt.genSaltSync(10);
      const userHash = bcrypt.hashSync(config.userPassword, userSalt);

      this.users = [
        {
          id: 'usr-admin-01',
          username: config.adminUsername || 'Syedaman',
          email: config.adminEmail,
          name: config.adminName,
          role: 'ADMIN',
          passwordHash: adminHash,
          facility: 'Main Facility #4 (Bengaluru)',
          avatarInitials: config.adminName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SA',
          avatarUrl: '/assets/syed-aman-avatar.png',
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: 'usr-analyst-02',
          email: config.userEmail,
          name: config.userName,
          role: 'USER',
          passwordHash: userHash,
          facility: 'Substation #2 (Bengaluru)',
          avatarInitials: config.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'EA',
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      ];
      this.persist();
    }

    // Restore sessions if any
    if (storedSessions && Array.isArray(storedSessions)) {
      const now = Date.now();
      storedSessions.forEach((s) => {
        // Only restore non-expired sessions (24 hour max age)
        const age = now - new Date(s.createdAt).getTime();
        if (age < 24 * 60 * 60 * 1000) {
          this.sessions.set(s.sessionId, s);
        }
      });
    }
  }

  persist() {
    try {
      let state = {};
      if (fs.existsSync(DATA_FILE)) {
        try {
          state = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {}
      }

      state.authUsers = this.users;
      state.authSessions = Array.from(this.sessions.values());

      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
    } catch (e) {
      // Ignore if filesystem is read-only
    }
  }

  findByEmail(email) {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    return this.users.find(u => u.email.toLowerCase() === normalized) || null;
  }

  findByUsernameOrEmail(identifier) {
    if (!identifier) return null;
    const normalized = identifier.toLowerCase().trim();
    return this.users.find(u =>
      (u.username && u.username.toLowerCase() === normalized) ||
      (u.email && u.email.toLowerCase() === normalized)
    ) || null;
  }

  findById(id) {
    if (!id) return null;
    return this.users.find(u => u.id === id) || null;
  }

  verifyPassword(user, plainPassword) {
    if (!user || !user.passwordHash || !plainPassword) return false;
    return bcrypt.compareSync(plainPassword, user.passwordHash);
  }

  createSession(user, { ip = '127.0.0.1', userAgent = 'Unknown' } = {}) {
    const sessionId = `sess_${crypto.randomBytes(24).toString('hex')}`;
    const now = new Date().toISOString();

    const sessionData = {
      sessionId,
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      facility: user.facility,
      ip,
      userAgent,
      createdAt: now,
      lastActiveAt: now
    };

    this.sessions.set(sessionId, sessionData);

    // Update user's last login
    user.lastLogin = now;
    this.persist();

    return sessionData;
  }

  validateSession(sessionId) {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check expiration (24h)
    const now = Date.now();
    const createdTime = new Date(session.createdAt).getTime();
    if (now - createdTime > 24 * 60 * 60 * 1000) {
      this.sessions.delete(sessionId);
      this.persist();
      return null;
    }

    // Touch lastActiveAt
    session.lastActiveAt = new Date().toISOString();
    return session;
  }

  destroySession(sessionId) {
    if (!sessionId) return false;
    const deleted = this.sessions.delete(sessionId);
    if (deleted) this.persist();
    return deleted;
  }

  destroyAllUserSessions(userId) {
    let count = 0;
    for (const [sId, sess] of this.sessions.entries()) {
      if (sess.userId === userId) {
        this.sessions.delete(sId);
        count++;
      }
    }
    if (count > 0) this.persist();
    return count;
  }

  getUserSessions(userId) {
    const list = [];
    for (const sess of this.sessions.values()) {
      if (sess.userId === userId) {
        list.push({
          sessionId: sess.sessionId,
          ip: sess.ip,
          userAgent: sess.userAgent,
          createdAt: sess.createdAt,
          lastActiveAt: sess.lastActiveAt
        });
      }
    }
    return list;
  }

  updatePassword(userId, newPassword) {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');

    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    this.persist();
    return true;
  }

  getPublicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      username: user.username || (user.id === 'usr-admin-01' ? (config.adminUsername || 'Syedaman') : null),
      email: user.email,
      name: user.name,
      role: user.role,
      facility: user.facility,
      avatarInitials: user.avatarInitials,
      avatarUrl: user.avatarUrl || (user.id === 'usr-admin-01' ? '/assets/syed-aman-avatar.png' : null),
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };
  }
}

export const userModel = new UserModel();
export default userModel;
