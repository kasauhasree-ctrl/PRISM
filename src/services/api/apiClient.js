import { apiConfig, buildApiUrl } from './config';

const getToken = () => localStorage.getItem('token');

export const apiClient = {
  _backendLive: false,
  _backendError: null,

  async fetchJson(endpoint, opts = {}) {
    const url = String(endpoint).startsWith('http') ? endpoint : buildApiUrl(endpoint);
    const headers = { ...(opts.headers || {}) };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    // only set content-type when body present
    if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

    try {
      const res = await fetch(url, { ...opts, headers, cache: 'no-store' });
      if (!res.ok) {
        const error = new Error(`HTTP ${res.status}`);
        error.status = res.status;
        try {
          const body = await res.clone().json();
          error.details = body.detail || body.message || body;
        } catch (e) {
          error.details = null;
        }
        throw error;
      }
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
      this._backendLive = true;
      return { live: true, data };
    } catch (err) {
      this._backendLive = false;
      throw err;
    }
  },

  async postJson(endpoint, body = {}, opts = {}) {
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    return this.fetchJson(endpoint, { method: 'POST', body: payload, ...opts, headers });
  },

  isBackendLive() {
    return this._backendLive;
  },

  async checkBackend() {
    try {
      // FastAPI may not expose a root route; OpenAPI is the stable connectivity probe.
      const res = await fetch(apiConfig.baseURL + '/openapi.json', { cache: 'no-store' });
      this._backendLive = res.ok;
      this._backendError = res.ok ? null : `HTTP ${res.status}`;
    } catch (e) {
      this._backendLive = false;
      this._backendError = e.message || 'Network request failed';
    }
    return this._backendLive;
  },

  getBackendError() {
    return this._backendError;
  }
};

export default apiClient;
