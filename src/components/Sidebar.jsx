import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, Activity, Play, Shield, AlertTriangle, FileText, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';
import { apiClient } from '../services/api/apiClient';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/agents', label: 'Agents', icon: Bot },
  { path: '/runtime', label: 'Runtime Monitor', icon: Activity },
  { path: '/evaluation', label: 'Action Evaluation', icon: Play },
  { path: '/policies', label: 'Policies', icon: Shield },
  { path: '/interventions', label: 'Interventions', icon: AlertTriangle },
  { path: '/flight-recorder', label: 'Flight Recorder', icon: FileText },
  { path: '/integrity', label: 'System / Integrity', icon: Settings },
];

export const Sidebar = () => {
  const { demoMode } = useAuth();
  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col h-screen" style={{ backgroundColor: '#0B0F14', borderRight: '1px solid #1E293B' }}>
      <div className="p-5" style={{ borderBottom: '1px solid #1E293B' }}>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#E8E8E8' }}>PRISM</h1>
        <p className="text-xs mt-1" style={{ color: '#6B7280', letterSpacing: '0.025em' }}>Runtime Trust & Forensics</p>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 rounded-sm ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`
            }
            style={({ isActive }) => isActive ? { 
              backgroundColor: 'rgba(90, 159, 107, 0.06)',
              borderLeft: '3px solid #5A9F6B',
              paddingLeft: '12px'
            } : { 
              paddingLeft: '12px',
              borderLeft: '3px solid transparent'
            }}
          >
            <item.icon size={18} strokeWidth={1.5} />
            <span style={{ letterSpacing: '0.015em' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-5" style={{ borderTop: '1px solid #1E293B' }}>
        <div className="text-xs mb-3" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>INFRASTRUCTURE</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-subtle" style={{ backgroundColor: '#5A9F6B' }}></span>
          <span style={{ color: '#9CA3AF' }}>{demoMode ? 'Demo data active' : apiClient.isBackendLive() ? 'Backend Connected' : 'Backend Offline'}</span>
        </div>
      </div>
    </aside>
  );
};
