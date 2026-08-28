import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DecisionBadge } from '../components/DecisionBadge';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { systemService } from '../services/api/system';
import { eventsService } from '../services/api/events';
import { policiesService } from '../services/api/policies';
import { runtimeService } from '../services/runtime';
import { useNotifications } from '../components/NotificationProvider';
import EventDrawer from '../components/EventDrawer';
import { apiClient } from '../services/api/apiClient';

export const Overview = () => {
  const [metrics, setMetrics] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [criticalEvents, setCriticalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockBanner, setBlockBanner] = useState(null);
  const navigate = useNavigate();
  const seenEventIdsRef = useRef(new Set());
  const pollRef = useRef(null);
  const [activePolicy, setActivePolicy] = useState(null);
  const [activePolicyRules, setActivePolicyRules] = useState([]);
  const [policyUnavailable, setPolicyUnavailable] = useState(false);
  const [drawerEvent, setDrawerEvent] = useState(null);
  const { add } = useNotifications();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, eventsData, criticalData] = await Promise.all([
          systemService.getSystemMetrics(),
          eventsService.getLiveEvents(12),
          eventsService.getRecentCriticalEvents(2),
        ]);
        setMetrics(metricsData);
        setLiveEvents(eventsData);
        setCriticalEvents(criticalData);

        // load active policy
        try {
          const policyRes = await policiesService.getActivePolicy();
          if (policyRes) {
            // The backend may return the policy object directly or nested
            const policy = policyRes.policy || policyRes || null;
            setActivePolicy(policy);
            // try fetch rules
            try {
              const rulesRes = await policiesService.getActivePolicyRules(policy?.id || policy?.policyId);
              const rules = Array.isArray(rulesRes) ? rulesRes : (rulesRes.rules || []);
              setActivePolicyRules(rules);
              setPolicyUnavailable(false);
            } catch (err) {
              setActivePolicyRules([]);
              setPolicyUnavailable(false);
            }
          } else {
            setActivePolicy(null);
            setActivePolicyRules([]);
            setPolicyUnavailable(false);
          }
        } catch (err) {
          // backend unavailable for policies
          setPolicyUnavailable(true);
          // fall back to metrics' activePolicy (mock)
          setActivePolicy({ name: metricsData?.activePolicy || 'Finance Controls v3', id: metricsData?.activePolicy });
          setActivePolicyRules([]);
        }

        // prime seen events
        const ids = new Set();
        (eventsData || []).forEach(e => ids.add(e.eventId));
        (criticalData || []).forEach(e => ids.add(e.eventId));
        seenEventIdsRef.current = ids;
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // start centralized runtime service
    runtimeService.start();
    const unsub = runtimeService.subscribe(({ events, metrics, latestEvent }) => {
      setLiveEvents(events.slice(0, 50));
      // merge critical events
      const critical = events.filter(e => String(e.decision).toLowerCase() === 'block' || String(e.decision).toLowerCase() === 'pause');
      setCriticalEvents(critical.slice(0, 10));
      if (latestEvent) {
        const decision = String(latestEvent.decision || '').toLowerCase();
        if (decision === 'block') {
          setBlockBanner(latestEvent);
          // also add notification
          add({ title: 'Critical Intervention', message: `${latestEvent.agentId} ${latestEvent.action} — ${latestEvent.policyName}`, level: 'critical' });
          setTimeout(() => setBlockBanner(null), 20000);
        } else if (decision === 'pause') {
          add({ title: 'Intervention (pause)', message: `${latestEvent.agentId} ${latestEvent.action}`, level: 'warning' });
        }
      }
      if (metrics) setMetrics(metrics);
    });

    return () => {
      unsub();
      runtimeService.stop();
    };
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const liveEventsColumns = [
    { header: 'TIME', key: 'timestamp', width: '90px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#6B7280' }}>{formatTime(value)}</span> },
    { header: 'AGENT', key: 'agentId', width: '150px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#9CA3AF' }}>{value}</span> },
    { header: 'ACTION', key: 'action', width: '150px', render: (value) => <span className="text-mono" style={{ fontSize: '12px', color: '#9CA3AF' }}>{value}</span> },
    { header: 'TARGET', key: 'target', width: '150px', render: (value) => <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{value}</span> },
    { header: 'POLICY', key: 'policyName', width: '150px', render: (value) => <span style={{ fontSize: '12px', color: '#6B7280' }}>{value}</span> },
    { header: 'RISK', key: 'risk', width: '85px', render: (value) => <RiskBadge risk={value} size="sm" /> },
    { header: 'DECISION', key: 'decision', width: '100px', render: (value) => <DecisionBadge decision={value} size="sm" /> },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Overview" subtitle="Runtime trust and enforcement control plane" />
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#1E293B', borderTopColor: '#5A9F6B' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {blockBanner && (
        <div className="mb-4 p-3 rounded-sm" style={{ backgroundColor: 'rgba(184, 92, 92, 0.12)', border: '1px solid rgba(184, 92, 92, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold" style={{ color: '#E8E8E8' }}>Critical: BLOCK detected</div>
              <div className="text-xs muted">Agent: {blockBanner.agentId} · Action: {blockBanner.action} · Policy: {blockBanner.policyName}</div>
              <div className="text-xs" style={{ color: '#FCA5A5' }}>{blockBanner.reason}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-1 rounded-sm" style={{ backgroundColor: '#2B0E0E', border: '1px solid rgba(184,92,92,0.3)', color: '#FCA5A5' }} onClick={() => setBlockBanner(null)}>Dismiss</button>
              <button className="text-xs px-3 py-1 rounded-sm" style={{ backgroundColor: '#B85C5C', color: '#fff' }} onClick={() => navigate('/flight-recorder', { state: { eventId: blockBanner.eventId, event: blockBanner } })}>Inspect</button>
            </div>
          </div>
        </div>
      )}
      <PageHeader 
        title="Overview" 
        subtitle="Runtime trust and enforcement control plane"
      />

      {/* System Status Bar */}
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-status-success)' }}></span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-status-success)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>System Operational</span>
        </div>
        <div className="flex items-center gap-6 text-xs muted">
          <span>{apiClient.isBackendLive() ? 'Backend Connected' : 'Demo data active'}</span>
          <span>Active: Finance Controls v3</span>
        </div>
      </div>

      {/* Runtime Activity Visualization */}
      <div className="mb-6 panel panel-compact">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Runtime Activity</div>
          <div className="text-xs text-mono" style={{ color: '#5A9F6B' }}>Last 60s</div>
        </div>
        <div className="flex items-end gap-1 h-8">
          {[...Array(60)].map((_, i) => {
            const height = Math.random() * 28 + 4;
            const isRecent = i > 50;
            return (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: `${height}px`,
                  backgroundColor: isRecent ? '#5A9F6B' : '#1E293B',
                  borderRadius: '1px',
                  opacity: isRecent ? 1 : 0.5 + (i / 60) * 0.5
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Runtime State - Improved Hierarchy */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Active Policy - Prominent */}
        <div className="lg:col-span-1">
          <div className="panel">
            <div className="text-xs mb-2 muted" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Policy</div>
              <div className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)', letterSpacing: '0.015em' }}>
                {activePolicy?.name || activePolicy?.displayName || metrics?.activePolicy || 'Finance Controls v3'}
              </div>
              <div className="text-xs muted">
                {activePolicy?.version && <span style={{ marginRight: 8 }}>Version {activePolicy.version}</span>}
                {activePolicy?.id && <span style={{ marginRight: 8 }}>ID {activePolicy.id}</span>}
                {activePolicy?.status && <span style={{ marginRight: 8 }}>{String(activePolicy.status).toUpperCase()}</span>}
                <span>Enforcing {activePolicyRules?.length || metrics?.rulesCount || 0} rules</span>
              </div>
              {policyUnavailable && (
                <div className="text-xs mt-2" style={{ color: '#9CA3AF' }}>Backend unavailable — showing cached data</div>
              )}
          </div>
        </div>
        
        {/* Compact Metrics */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          <div>
            <div className="panel panel-compact">
              <div className="text-xs mb-2 muted" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>Agents</div>
              <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{metrics?.agentsMonitored || 12}</div>
              <div className="text-xs muted">Monitored</div>
            </div>
          </div>
          
          <div>
            <div className="panel panel-compact">
              <div className="text-xs mb-2 muted" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>Evaluations</div>
              <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{(metrics?.actionsEvaluated || 18492).toLocaleString()}</div>
              <div className="text-xs muted">Total decisions</div>
            </div>
          </div>
          
          <div>
            <div className="panel panel-compact">
              <div className="text-xs mb-2 muted" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>Interventions</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{metrics?.activeInterventions || 3}</span>
                {(metrics?.activeInterventions || 3) > 0 && <span className="w-2 h-2 rounded-full animate-pulse-subtle" style={{ backgroundColor: 'var(--color-status-warning)' }}></span>}
              </div>
              <div className="text-xs muted">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Enforcement Stream - Hero Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Enforcement Stream</h3>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Real-time policy evaluation and decisions</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm" style={{ backgroundColor: 'rgba(90, 159, 107, 0.1)', border: '1px solid rgba(90, 159, 107, 0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-subtle" style={{ backgroundColor: '#5A9F6B' }}></span>
              <span className="text-xs font-medium" style={{ color: '#5A9F6B', letterSpacing: '0.025em' }}>LIVE</span>
            </div>
          </div>
          <DataTable 
            columns={liveEventsColumns} 
            data={liveEvents}
            onRowClick={(row) => setDrawerEvent(row)}
          />
        </div>

        {/* Active Interventions - Important Panel */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Interventions</h3>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Policy violations requiring attention</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-sm" style={{ backgroundColor: 'rgba(184, 148, 63, 0.1)', color: '#B8943F', border: '1px solid rgba(184, 148, 63, 0.2)' }}>
              0{criticalEvents.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {criticalEvents.map((event) => (
              <div 
                key={event.eventId} 
                className="p-4 rounded-sm"
                style={{ 
                  backgroundColor: '#0F141A', 
                  border: event.decision === 'block' ? '1px solid rgba(184, 92, 92, 0.3)' : '1px solid rgba(184, 148, 63, 0.3)',
                  borderLeft: event.decision === 'block' ? '3px solid #B85C5C' : '3px solid #B8943F'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={event.decision} size="sm" />
                  <span className="text-xs text-mono" style={{ color: '#6B7280' }}>{formatTime(event.timestamp)}</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Agent</div>
                    <div className="text-sm text-mono font-medium" style={{ color: '#E8E8E8' }}>{event.agentId}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Action</div>
                    <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{event.action}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Policy</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{event.policyName}</div>
                  </div>
                  
                  <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Reason</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{event.reason}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enforcement Pipeline - Improved Visual */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Enforcement Pipeline</h3>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Runtime decision execution trace</p>
          </div>
        </div>
        
        <div className="panel overflow-x-auto" style={{ padding: '18px' }}>
          <div className="flex items-center justify-between gap-4" style={{ minWidth: '900px' }}>
            {[
              { num: '01', label: 'POLICY', content: 'Finance Controls v3' },
              { num: '02', label: 'RULE', content: 'External transfers require approval' },
              { num: '03', label: 'AGENT ACTION', content: 'finance-agent-01 / transfer_funds' },
              { num: '04', label: 'EVALUATION', content: 'RULE VIOLATION' },
              { num: '05', label: 'DECISION', content: 'PAUSE', highlight: true },
              { num: '06', label: 'EVIDENCE', content: 'EVENT RECORDED' },
            ].map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="flex-1" style={{ minWidth: '140px' }}>
                  <div className="panel panel-compact" style={{ backgroundColor: step.highlight ? 'var(--color-background-elevated)' : 'var(--color-background-secondary)', borderLeft: step.highlight ? '3px solid var(--color-status-warning)' : '3px solid var(--color-border-subtle)' }}>
                    <div className="text-xs mb-2 muted">{step.num}</div>
                    <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{step.label}</div>
                    <div className="text-xs text-mono muted" style={{ color: step.highlight ? 'var(--color-status-warning)' : undefined }}>{step.content}</div>
                  </div>
                </div>
                {index < 5 && (
                  <div style={{ color: '#1E293B', fontSize: '20px', flexShrink: 0 }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>System Health</h3>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Component status and connectivity</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Runtime Engine', status: 'operational' },
            { name: 'Policy Engine', status: 'operational' },
            { name: 'Event Recorder', status: 'operational' },
            { name: 'Backend', status: 'connected' },
          ].map((component) => (
            <div key={component.name} className="p-3 rounded-sm flex items-center justify-between" style={{ backgroundColor: '#0F141A', border: '1px solid #1E293B' }}>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{component.name}</span>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#5A9F6B' }}></span>
                <span className="text-xs" style={{ color: '#5A9F6B', letterSpacing: '0.025em', textTransform: 'uppercase' }}>{component.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EventDrawer event={drawerEvent} onClose={() => setDrawerEvent(null)} />
    </div>
  );
};