import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell = ({ children }) => {
  return (
    <div className="app-shell flex min-h-screen" style={{ backgroundColor: '#080B10', gap: '20px' }}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto" style={{ padding: '36px', paddingBottom: '48px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
