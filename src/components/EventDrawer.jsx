import React from 'react';

export const EventDrawer = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: 'min(420px, 100vw)', backgroundColor: '#0B0F14', borderLeft: '1px solid #1E293B', padding: 20, zIndex: 70, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ color: '#E8E8E8', fontSize: 16, fontWeight: 700 }}>Event Detail</div>
          <div style={{ color: '#9CA3AF', fontSize: 12 }}>{event.eventId}</div>
        </div>
        <div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9CA3AF' }}>Close</button>
        </div>
      </div>

      <div style={{ color: '#9CA3AF', fontSize: 13 }}>
        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Timestamp</div>
          <div style={{ color: '#E8E8E8' }}>{new Date(event.timestamp).toLocaleString()}</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Agent</div>
          <div style={{ color: '#E8E8E8' }}>{event.agentId}</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Action</div>
          <div style={{ color: '#9CA3AF' }}>{event.action}</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Target</div>
          <div style={{ color: '#9CA3AF' }}>{event.target}</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Policy</div>
          <div style={{ color: '#9CA3AF' }}>{event.policyName}</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Decision</div>
          <div style={{ color: '#E8E8E8' }}>{event.decision}</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Reason</div>
          <div style={{ color: '#9CA3AF' }}>{event.reason || '—'}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="text-xs" style={{ color: '#6B7280', textTransform: 'uppercase' }}>Forensic Decision Trace</div>
          <div style={{ marginTop: 8, color: '#9CA3AF' }}>
            <div>Agent Action → Context → Policy Match → Rule Evaluation → Risk Assessment → IICP Decision → Flight Recorder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDrawer;
