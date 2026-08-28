import React from 'react';

export const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <div className="text-xs mb-2 font-mono muted" style={{ letterSpacing: '0.05em' }}>
          {breadcrumbs.join(' / ')}
        </div>
      )}
      <h1 className="font-semibold tracking-tight" style={{ fontSize: '28px', color: 'var(--color-text-primary)', letterSpacing: '0.015em' }}>{title}</h1>
      {subtitle && <p className="mt-1 muted" style={{ fontSize: '14px', letterSpacing: '0.015em' }}>{subtitle}</p>}
    </div>
  );
};
