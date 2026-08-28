import React from 'react';

const statusStyles = {
  allow: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  monitor: { backgroundColor: 'rgba(91, 139, 184, 0.12)', color: '#5B8BB8', borderColor: 'rgba(91, 139, 184, 0.2)' },
  pause: { backgroundColor: 'rgba(184, 148, 63, 0.12)', color: '#B8943F', borderColor: 'rgba(184, 148, 63, 0.2)' },
  block: { backgroundColor: 'rgba(184, 92, 92, 0.12)', color: '#B85C5C', borderColor: 'rgba(184, 92, 92, 0.2)' },
  critical: { backgroundColor: 'rgba(184, 92, 92, 0.15)', color: '#B85C5C', borderColor: 'rgba(184, 92, 92, 0.3)' },
  active: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  operational: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  healthy: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  connected: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  candidate: { backgroundColor: 'rgba(184, 148, 63, 0.12)', color: '#B8943F', borderColor: 'rgba(184, 148, 63, 0.2)' },
  review_required: { backgroundColor: 'rgba(184, 148, 63, 0.12)', color: '#B8943F', borderColor: 'rgba(184, 148, 63, 0.2)' },
  pending_approval: { backgroundColor: 'rgba(184, 148, 63, 0.12)', color: '#B8943F', borderColor: 'rgba(184, 148, 63, 0.2)' },
  unknown: { backgroundColor: 'rgba(107, 114, 128, 0.12)', color: '#9CA3AF', borderColor: 'rgba(107, 114, 128, 0.25)' },
};

export const StatusBadge = ({ status, size = 'md' }) => {
  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };

  const displayStatus = String(status ?? 'unknown');
  const normalizedStatus = displayStatus.toLowerCase();
  const style = statusStyles[normalizedStatus] || statusStyles.monitor;

  return (
    <span className="inline-flex items-center font-medium border rounded-sm" style={{ ...style, ...sizeStyles[size], whiteSpace: 'nowrap' }}>
      {normalizedStatus === 'allow' && '●'}
      {normalizedStatus === 'monitor' && '◉'}
      {normalizedStatus === 'pause' && '◎'}
      {normalizedStatus === 'block' && '⛨'}
      {normalizedStatus === 'critical' && '⚠'}
      {normalizedStatus === 'active' && '●'}
      {normalizedStatus === 'operational' && '●'}
      {normalizedStatus === 'healthy' && '●'}
      {normalizedStatus === 'connected' && '●'}
      {normalizedStatus === 'candidate' && '◇'}
      {normalizedStatus === 'review_required' && '◇'}
      {normalizedStatus === 'pending_approval' && '◇'}
      <span style={{ marginLeft: '6px', letterSpacing: '0.025em' }}>{displayStatus.toUpperCase()}</span>
    </span>
  );
};
