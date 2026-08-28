import React from 'react';
import { useNotifications } from './NotificationProvider';

export const NotificationPanel = ({ onClose }) => {
  const { list, dismiss, markSeen } = useNotifications();

  return (
    <div style={{ position: 'absolute', right: 20, top: 60, width: 360, maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#0B0F14', border: '1px solid #1E293B', padding: 12, borderRadius: 6, zIndex: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ color: '#E8E8E8', fontWeight: 600 }}>Notifications</div>
        <button onClick={onClose} style={{ color: '#9CA3AF', background: 'transparent', border: 'none' }}>Close</button>
      </div>
      {list.length === 0 && <div style={{ color: '#9CA3AF' }}>No notifications</div>}
      {list.map(n => (
        <div key={n.id} style={{ padding: 10, borderRadius: 6, marginBottom: 8, backgroundColor: n.seen ? '#0F141A' : 'rgba(184,92,92,0.04)', border: '1px solid #162030' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#E8E8E8', fontWeight: 600 }}>{n.title}</div>
            <div style={{ color: '#9CA3AF', fontSize: 12 }}>{new Date(n.timestamp).toLocaleTimeString()}</div>
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 6 }}>{n.message}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => { markSeen(n.id); }} style={{ fontSize: 12, padding: '6px 8px', background: '#0C1117', border: '1px solid #202A35', color: '#9CA3AF' }}>Mark seen</button>
            <button onClick={() => dismiss(n.id)} style={{ fontSize: 12, padding: '6px 8px', background: '#2B0E0E', border: '1px solid rgba(184,92,92,0.2)', color: '#FCA5A5' }}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
