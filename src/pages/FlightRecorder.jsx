import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DecisionBadge } from '../components/DecisionBadge';
import { RiskBadge } from '../components/RiskBadge';
import { eventsService } from '../services/api/events';

export const FlightRecorder = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await eventsService.getLiveEvents(25);
        setEvents(eventsData);
        // If a specific event id was passed via navigation state, fetch it
        const state = location.state || {};
        if (state?.event) {
          setSelectedEvent(state.event);
        } else if (state?.eventId) {
          const ev = await eventsService.getEventById(state.eventId);
          if (ev) setSelectedEvent(ev);
        }
      } catch (error) {
        console.error('Failed to load flight recorder data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [location.state]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFullTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });
  };

  const flightColumns = [
    { header: 'TIME', key: 'timestamp', width: '85px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#6B7280' }}>{formatTime(value)}</span> },
    { header: 'DATE', key: 'timestamp', width: '100px', render: (value) => <span style={{ fontSize: '12px', color: '#6B7280' }}>{formatDate(value)}</span> },
    { header: 'EVENT ID', key: 'eventId', width: '140px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#6B7280' }}>{value}</span> },
    { header: 'AGENT', key: 'agentId', width: '130px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#9CA3AF' }}>{value}</span> },
    { header: 'ACTION', key: 'action', width: '140px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#9CA3AF' }}>{value}</span> },
    { header: 'TARGET', key: 'target', width: '120px', render: (value) => <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{value}</span> },
    { header: 'DECISION', key: 'decision', width: '90px', render: (value) => <DecisionBadge decision={value} size="sm" /> },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Flight Recorder" subtitle="Complete audit trail of all agent actions and decisions" />
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader 
        title="Flight Recorder" 
        subtitle="Complete audit trail of all agent actions and decisions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="lg:col-span-2">
          <div className="mb-6 p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Total Events</div>
                <div className="text-lg font-semibold" style={{ color: '#E8E8E8' }}>{events.length}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Recording</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-subtle" style={{ backgroundColor: '#5A9F6B' }}></span>
                  <span className="text-sm" style={{ color: '#5A9F6B' }}>ACTIVE</span>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Retention</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>90 days</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Storage</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>Encrypted</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EVENT LOG</h3>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Chronological audit trail of all system events</p>
              </div>
            </div>
            <DataTable 
              columns={flightColumns} 
              data={events}
              onRowClick={(row) => setSelectedEvent(row)}
            />
          </div>
        </div>

        {/* Event Detail Panel */}
        <div className="lg:col-span-1">
          <div className="text-xs mb-3" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EVENT DETAIL</div>
          
          {!selectedEvent ? (
            <div className="p-8 rounded-sm text-center" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
              <div className="text-sm mb-2" style={{ color: '#6B7280' }}>Select an event</div>
              <div className="text-xs" style={{ color: '#9CA3AF' }}>Click on any event to view forensic details</div>
            </div>
          ) : (
            <div className="p-5 rounded-sm space-y-4" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Event ID</div>
                <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{selectedEvent.eventId}</div>
              </div>

              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Timestamp</div>
                <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{formatFullTime(selectedEvent.timestamp)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Agent</div>
                  <div className="text-sm text-mono" style={{ color: '#E8E8E8' }}>{selectedEvent.agentId}</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Action</div>
                  <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{selectedEvent.action}</div>
                </div>
              </div>

              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Target</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>{selectedEvent.target}</div>
              </div>

              <div style={{ borderTop: '1px solid #1A222B', paddingTop: '16px' }}>
                <div className="text-xs mb-3" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>POLICY</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>{selectedEvent.policyName}</div>
              </div>

              <div style={{ borderTop: '1px solid #1A222B', paddingTop: '16px' }}>
                <div className="text-xs mb-3" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>RISK ASSESSMENT</div>
                <RiskBadge risk={selectedEvent.risk} size="md" />
              </div>

              <div style={{ borderTop: '1px solid #1A222B', paddingTop: '16px' }}>
                <div className="text-xs mb-3" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PRISM DECISION</div>
                <DecisionBadge decision={selectedEvent.decision} size="md" />
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full py-2 text-xs rounded-sm transition-colors"
                style={{ 
                  backgroundColor: '#0C1117', 
                  border: '1px solid #202A35',
                  color: '#9CA3AF'
                }}
              >
                Close Detail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
