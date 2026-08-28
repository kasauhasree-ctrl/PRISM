import React from 'react';

const riskStyles = {
  low: { backgroundColor: 'rgba(90, 159, 107, 0.12)', color: '#5A9F6B', borderColor: 'rgba(90, 159, 107, 0.2)' },
  medium: { backgroundColor: 'rgba(184, 148, 63, 0.12)', color: '#B8943F', borderColor: 'rgba(184, 148, 63, 0.2)' },
  high: { backgroundColor: 'rgba(212, 116, 61, 0.12)', color: '#D4743D', borderColor: 'rgba(212, 116, 61, 0.2)' },
};

export const RiskBadge = ({ risk, size = 'md' }) => {
  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };

  const displayRisk = String(risk ?? 'unknown');
  const normalizedRisk = displayRisk.toLowerCase();
  const style = riskStyles[normalizedRisk] || riskStyles.low;

  return (
    <span className="inline-flex items-center font-medium border rounded-sm" style={{ ...style, ...sizeStyles[size], whiteSpace: 'nowrap' }}>
      {normalizedRisk === 'low' && '▼'}
      {normalizedRisk === 'medium' && '◆'}
      {normalizedRisk === 'high' && '▲'}
      <span style={{ marginLeft: '6px', letterSpacing: '0.025em' }}>{displayRisk.toUpperCase()}</span>
    </span>
  );
};
