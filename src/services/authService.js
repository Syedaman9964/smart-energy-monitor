/**
 * ============================================================================
 * WATTVISION - AUTHENTICATION SERVICE (FRONTEND DEMO MODE)
 * ============================================================================
 * Client-side mock authentication engine for college project demonstration:
 *   - Enables instant 1-click or credential demo access with zero backend requirement.
 *   - Preserves session in browser storage without exposing real passwords or secrets.
 *   - Maintains user profile for Syed Aman (Root Admin) across the dashboard.
 */

const STORAGE_KEY = 'wattvision_demo_session';

class AuthService {
  constructor() {
    this.token = 'wattvision_demo_jwt';
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders(customHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      ...customHeaders
    };
  }

  /**
   * Authenticate administrator credentials (Demo mode)
   */
  async login(usernameOrEmail, password, rememberMe = true) {
    const rawInput = typeof usernameOrEmail === 'string' ? usernameOrEmail.trim() : '';
    const cleanName = rawInput && rawInput.toLowerCase() !== 'admin' ? rawInput : 'Syed Aman';

    const user = {
      id: 'usr-admin-demo',
      username: rawInput || 'Syedaman',
      email: 'admin@wattvision.energy',
      name: cleanName,
      role: 'ADMIN',
      facility: 'Bengaluru Energy Terminal (Demo Node)',
      avatarInitials: cleanName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SA',
      avatarUrl: '/assets/syed-aman-avatar.png',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const session = {
      sessionId: 'sess_demo_live',
      loginTime: new Date().toISOString(),
      ip: '127.0.0.1 (Demo Terminal)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Client Terminal'
    };

    const payload = JSON.stringify({ user, session });
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, payload);
      } else {
        sessionStorage.setItem(STORAGE_KEY, payload);
      }
    }

    return {
      success: true,
      user,
      session,
      token: this.token
    };
  }

  /**
   * Terminate user session
   */
  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
    return { success: true };
  }

  /**
   * Fetch current authenticated user session from browser storage
   */
  async getMe() {
    if (typeof window === 'undefined') return null;

    try {
      const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user) {
          return {
            user: parsed.user,
            session: parsed.session || {
              sessionId: 'sess_demo_active',
              loginTime: new Date().toISOString(),
              ip: '127.0.0.1 (Demo Terminal)'
            }
          };
        }
      }
    } catch (e) {
      // Storage parsing error, fallback to null
    }

    return null;
  }

  /**
   * Change current account password (Simulated success)
   */
  async changePassword(currentPassword, newPassword) {
    return {
      success: true,
      message: 'Demo credentials updated for current session.'
    };
  }

  /**
   * Retrieve active sessions for current user
   */
  async getSessions() {
    return [
      {
        sessionId: 'sess_demo_live',
        ip: '127.0.0.1 (Demo Terminal)',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      }
    ];
  }
}

export const authService = new AuthService();
export default authService;

