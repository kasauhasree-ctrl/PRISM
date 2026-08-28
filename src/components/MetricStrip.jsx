import React from 'react';

export const MetricStrip = ({ label, value, status = 'neutral', size = 'md' }) => {
  const sizeStyles = {
    sm: { padding: '8px 12px', fontSize: '13px' },
    md: { padding: '12px 16px', fontSize: '13px' },
    lg: { padding: '16px 20px', fontSize: '14px' },
  };

  const statusStyles = {
    neutral: { backgroundColor: '#10161D', borderColor: '#202A35' },
    operational: { backgroundColor: '#10161D', borderColor: 'rgba(90, 159, 107, 0.3)' },
    warning: { backgroundColor: '#10161D', borderColor: 'rgba(184, 148, 63, 0.3)' },
    critical: { backgroundColor: '#10161D', borderColor: 'rgba(184, 92, 92, 0.3)' },
  };

  const statusIndicator = {
    neutral: '○',
    operational: '●',
    warning: '◎',
    critical: '⚠',
  };

  return (
    <div className="flex items-center justify-between border rounded-sm" style={{ ...sizeStyles[size], ...statusStyles[status] }}>
      <div className="flex items-center gap-2">
        <span style={{ color: '#6B7280' }}>{statusIndicator[status]}</span>
        <span className="font-medium" style={{ color: '#9CA3AF', letterSpacing: '0.025em' }}>{label}</span>
      </div>
      <span className="font-mono font-semibold" style={{ color: '#E8E8E8' }}>{value}</span>
    </div>
  );
};
