import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import NotificationPanel from './NotificationPanel';
import { useAuth } from './AuthContext';

export const Topbar = () => {
  const location = useLocation();
  const { demoMode } = useAuth();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getPageTitle = () => {
    if (pathSegments.length === 0) return 'OVERVIEW';
    return pathSegments[pathSegments.length - 1].toUpperCase().replace(/-/g, ' ');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 flex-shrink-0" style={{ backgroundColor: '#0B0F14', borderBottom: '1px solid #1E293B', position: 'relative' }}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-mono whitespace-nowrap" style={{ color: '#6B7280', letterSpacing: '0.05em' }}>PRISM</span>
        <span style={{ color: '#3E5060' }}>/</span>
        <span className="text-sm font-medium truncate" style={{ color: '#E8E8E8', letterSpacing: '0.015em' }}>{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-8 text-xs whitespace-nowrap" style={{ letterSpacing: '0.015em' }}>
        <div className="hidden md:flex items-center gap-2">
          <span style={{ color: '#6B7280' }}>Policy</span>
          <span className="font-mono" style={{ color: '#9CA3AF' }}>Finance Controls v3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-subtle" style={{ backgroundColor: '#5A9F6B' }}></span>
          <span className="hidden sm:inline" style={{ color: '#6B7280' }}>Backend</span>
          <span style={{ color: demoMode ? '#B8943F' : '#5A9F6B' }}>{demoMode ? 'DEMO DATA' : 'CONNECTED'}</span>
        </div>
        {demoMode && <span className="demo-mode-indicator">DEMO MODE</span>}
        <div className="hidden sm:flex items-center gap-2">
          <span style={{ color: '#6B7280' }}>Authority</span>
          <span style={{ color: '#9CA3AF' }}>admin</span>
        </div>
        <div style={{ position: 'relative' }}>
          {/* notification indicator */}
          <NotificationIcon />
        </div>
        <div className="hidden sm:flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

const NotificationIcon = () => {
  const { unreadCount, list } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={() => setOpen(v => !v)} style={{ background: 'transparent', border: 'none', color: '#9CA3AF', position: 'relative' }} aria-label="Notifications">
        🔔 {unreadCount > 0 && <span style={{ background: '#B85C5C', color: '#fff', borderRadius: 8, padding: '1px 6px', marginLeft: 6, fontSize: 12 }}>{unreadCount}</span>}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
};

const UserMenu = () => {
  const { logout } = useAuth();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={() => logout()} className="text-xs px-2 py-1 rounded-sm" style={{ background: 'transparent', border: '1px solid #22303A', color: '#9CA3AF' }}>Sign out</button>
    </div>
  );
};
