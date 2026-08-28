import React from 'react';

const decisionStyles = {
  allow: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  monitor: { backgroundColor: 'rgba(91, 139, 184, 0.12)', color: '#5B8BB8', borderColor: 'rgba(91, 139, 184, 0.2)' },
  pause: { backgroundColor: 'rgba(184, 148, 63, 0.12)', color: '#B8943F', borderColor: 'rgba(184, 148, 63, 0.2)' },
  block: { backgroundColor: 'rgba(184, 92, 92, 0.12)', color: '#B85C5C', borderColor: 'rgba(184, 92, 92, 0.2)' },
};

export const DecisionBadge = ({ decision, size = 'md' }) => {
  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };

  const displayDecision = String(decision ?? 'unknown');
  const normalizedDecision = displayDecision.toLowerCase();
  const style = decisionStyles[normalizedDecision] || decisionStyles.monitor;

  return (
    <span className="inline-flex items-center font-medium border rounded-sm" style={{ ...style, ...sizeStyles[size], whiteSpace: 'nowrap' }}>
      {normalizedDecision === 'allow' && '○'}
      {normalizedDecision === 'monitor' && '◉'}
      {normalizedDecision === 'pause' && '◎'}
      {normalizedDecision === 'block' && '⛨'}
      <span style={{ marginLeft: '6px', letterSpacing: '0.025em' }}>{displayDecision.toUpperCase()}</span>
    </span>
  );
};
