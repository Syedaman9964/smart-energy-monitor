/**
 * ============================================================================
 * WATTVISION - AUTHENTICATION SERVICE
 * ============================================================================
 * Client-side authentication layer interfacing with backend Express API:
 *   - Issues requests with credentials: 'include' for secure HTTP-only cookies.
 *   - Manages in-memory token fallback for WebSocket tickets and headers.
 *   - Provides robust error parsing without exposing raw exceptions.
 */

class AuthService {
  constructor() {
    // Determine base URL matching ApiService logic
    const envApi = typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL)
      : undefined;

    if (envApi && envApi.trim() !== '') {
      this.baseUrl = envApi.trim().replace(/\/$/, '');
    } else {
      this.baseUrl = ''; // Relative path leverages Vite /api proxy
    }

    // Token stored for WebSocket connection and non-cookie environments
    this.token = typeof window !== 'undefined' ? localStorage.getItem('wattvision_auth_token') : null;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
    // Strict Security: Rely on HTTP-only cookies rather than persisting tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wattvision_auth_token');
    }
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * Authenticate administrator credentials
   * POST /api/auth/login
   */
  async login(usernameOrEmail, password, rememberMe = false) {
    try {
      const identifier = typeof usernameOrEmail === 'string' ? usernameOrEmail.trim() : '';
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensures HTTP-only cookie is set in browser
        body: JSON.stringify({
          username: identifier,
          email: identifier,
          identifier: identifier,
          password,
          rememberMe
        }),
        signal: AbortSignal.timeout(8000)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        token: data.token
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Terminate user session and clear authentication cookie
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await fetch(`${this.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });
    } catch (e) {
      console.warn('[AuthService] Logout request warning', e.message);
    } finally {
      this.setToken(null);
    }
    return { success: true };
  }

  /**
   * Fetch current authenticated user session
   * GET /api/auth/me
   */
  async getMe() {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
        }
        return null;
      }

      const data = await response.json();
      if (data.success && data.user) {
        return {
          user: data.user,
          session: data.session
        };
      }
      return null;
    } catch (err) {
      // Backend not reached or unauthenticated
      return null;
    }
  }

  /**
   * Change current account password
   * POST /api/auth/change-password
   */
  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${this.baseUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
      signal: AbortSignal.timeout(8000)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update password.');
    }
    return data;
  }

  /**
   * Retrieve active sessions for current user
   * GET /api/auth/sessions
   */
  async getSessions() {
    const response = await fetch(`${this.baseUrl}/api/auth/sessions`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
      signal: AbortSignal.timeout(5000)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to retrieve sessions.');
    }
    return data.data || [];
  }
}

export const authService = new AuthService();
export default authService;
