import React, { useEffect, useState } from 'react';
import authService from '../services/api/auth';
import { apiClient } from '../services/api/apiClient';
import { DEMO_MODE } from '../services/api/config';
import { AuthContext } from './AuthContext';

const DEMO_SESSION_KEY = 'prism_demo_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(DEMO_MODE && sessionStorage.getItem(DEMO_SESSION_KEY) === 'true');
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token') || (DEMO_MODE && sessionStorage.getItem(DEMO_SESSION_KEY) === 'true'));
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Optionally verify token on mount (best-effort)
    const verify = async () => {
      try {
        if (DEMO_MODE && sessionStorage.getItem(DEMO_SESSION_KEY) === 'true') {
          setDemoMode(true);
          setAuthenticated(true);
          setUser({ id: 'demo-authority', role: 'demo', mode: 'demo' });
          return;
        }
        const token = localStorage.getItem('token');
        if (token) {
          const v = await authService.verifyToken(token);
          if (v && v.valid) {
            setAuthenticated(true);
            // user info remains mock unless backend provides a profile endpoint
            setUser(JSON.parse(localStorage.getItem('user') || 'null') || { id: 'admin' });
            apiClient._backendLive = true;
          } else {
            authService.logout();
            setAuthenticated(false);
            setUser(null);
          }
        }
      } catch (e) {
        // ignore - remain unauthenticated
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  const login = async (identifier, password) => {
    const res = await authService.login(identifier, password);
    if (res.success) {
      setAuthenticated(true);
      setUser(res.data.user || { id: 'admin' });
      apiClient._backendLive = true;
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const enterDemoMode = () => {
    if (!DEMO_MODE) return false;
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
    setDemoMode(true);
    setAuthenticated(true);
    setUser({ id: 'demo-authority', role: 'demo', mode: 'demo' });
    return true;
  };

  const logout = () => {
    authService.logout();
    setAuthenticated(false);
    setUser(null);
    setDemoMode(false);
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, authenticated, checking, demoMode, login, enterDemoMode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
