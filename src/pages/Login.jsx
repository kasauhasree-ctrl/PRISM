import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { apiClient } from '../services/api/apiClient';
import { DEMO_MODE } from '../services/api/config';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendLive, setBackendLive] = useState(false);
  const [backendError, setBackendError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (DEMO_MODE) {
      setBackendLive(false);
      setBackendError('Demo mode uses local service data.');
      return undefined;
    }
    let mounted = true;
    (async () => {
      try {
        const live = await apiClient.checkBackend();
        if (mounted) {
          setBackendLive(live);
          setBackendError(live ? '' : apiClient.getBackendError());
        }
      } catch (e) {
        if (mounted) {
          setBackendLive(false);
          setBackendError(e.message || 'Network request failed');
        }
      }
    })();
    return () => { mounted = false };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError('Username or email and password are required.');
      return;
    }
    setLoading(true);
    const res = await auth.login(identifier, password);
    setLoading(false);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Authentication service unavailable.');
    }
  };

  const enterDemo = () => {
    if (auth.enterDemoMode()) navigate('/', { replace: true });
  };

  return (
    <main className="login-screen">
      <div className="login-atmosphere" aria-hidden="true"><span className="login-node node-one" /><span className="login-node node-two" /><span className="login-node node-three" /></div>
      <div className="login-corner login-corner-top"><span className="login-corner-mark">PRISM</span><span>Runtime Trust &amp; Forensics</span></div>
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card-brand">
          <div className="login-shield" aria-hidden="true"><ShieldCheck size={26} strokeWidth={1.5} /></div>
          <div><div className="login-brand-name">PRISM</div><div className="login-brand-subtitle">Runtime Trust &amp; Forensics</div></div>
          <span className="login-version">CONTROL PLANE v1.0</span>
        </div>
        <div className="login-status"><span className={`login-status-dot ${backendLive ? 'is-live' : ''}`} /><span>{DEMO_MODE ? 'DEMO MODE' : backendLive ? 'SECURE AUTHORITY ACCESS' : 'BACKEND OFFLINE'}</span></div>
        {!backendLive && backendError && <div className="login-connection-error">{backendError}</div>}
        <div className="login-divider"><span /><h1 id="login-title">AUTHORITY LOGIN</h1><span /></div>
        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-label" htmlFor="identifier">Username / Email</label>
          <input id="identifier" className="login-input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" />
          <label className="login-label" htmlFor="password">Password</label>
          <div className="login-password-wrap">
            <input id="password" className="login-input" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            <button className="login-icon-button" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          {error && <div className="login-error" role="alert"><strong>AUTHENTICATION FAILED</strong><span>{error}</span></div>}
          <button className="login-submit" type="submit" disabled={loading}>{loading ? <span className="login-spinner" aria-hidden="true" /> : <span>SIGN IN</span>}{!loading && <ArrowRight size={17} />}</button>
        </form>
        {DEMO_MODE && <div className="login-demo-option"><span>DEVELOPMENT PREVIEW</span><button type="button" onClick={enterDemo}>ENTER DEMO MODE</button></div>}
        <div className="login-security-copy"><strong>Secure. Verified. Trusted.</strong><span>Every action is monitored.</span><span>Every decision is recorded.</span></div>
      </section>
      <div className="login-corner login-corner-bottom"><span>PRISM SECURITY CONTROL PLANE</span><span>AUTHORIZED ACCESS ONLY</span></div>
    </main>
  );
};

export default Login;
