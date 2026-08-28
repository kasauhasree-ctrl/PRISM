import { buildApiUrl } from './config';
import { apiClient } from './apiClient';

const TOKEN_KEY = 'token';

export const authService = {
  async getCurrentUser() {
    // preserved mock behavior for demo mode
    return { id: 'admin', role: 'admin', permissions: ['read', 'write', 'intervene'] };
  },

  async verifyToken(token) {
    // best-effort verification via a protected endpoint could be added later
    return { valid: !!token };
  },

  async login(identifier, password) {
    const url = buildApiUrl(`/auth/login`);
    try {
      const res = await apiClient.postJson(url, { username: identifier, password });
      const data = res.data || {};

      // Accept common token fields returned by backends
      const token = data.access_token || data.token || data.accessToken || data.jwt || data.id_token || (data.data && (data.data.access_token || data.data.token));

      if (!token) {
        // if backend returned an object that wraps token differently, just fail gracefully
        throw new Error('No token in login response');
      }

      localStorage.setItem(TOKEN_KEY, token);
      // optional: store user info if provided
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, token, data };
    } catch (err) {
      console.error('PRISM authentication request failed:', err);
      return {
        success: false,
        status: err.status || null,
        error: err.status === 401 || err.status === 403
          ? 'Authentication rejected.'
          : err.status === 422
            ? 'The login request does not match the backend schema.'
            : err.status >= 500
              ? 'Authentication service error.'
              : 'Authentication service unavailable.',
        details: err.details || err.message || String(err),
      };
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
    // reset client backend live flag if needed
    try { apiClient._backendLive = false; } catch (e) {}
  }
};

export default authService;
