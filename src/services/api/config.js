const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE || '').trim().toLowerCase() === 'true';

export const apiConfig = {
  baseURL: API_BASE_URL,
  demoMode: DEMO_MODE,
  timeout: 10000,
};

export const buildApiUrl = (endpoint) => {
  return `${apiConfig.baseURL}${endpoint}`;
};
