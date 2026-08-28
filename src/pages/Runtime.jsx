import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DecisionBadge } from '../components/DecisionBadge';
import { RiskBadge } from '../components/RiskBadge';
import { eventsService } from '../services/api/events';
import { agentsService } from '../services/api/agents';

export const Runtime = () => {
  const [runtimeEvents, setRuntimeEvents] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, agentsData] = await Promise.all([
          eventsService.getLiveEvents(20),
          agentsService.getAllAgents(),
        ]);
        setRuntimeEvents(eventsData);
        setAgents(agentsData);
      } catch (error) {
        console.error('Failed to load runtime data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const runtimeColumns = [
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
        <PageHeader title="Runtime Monitor" subtitle="Real-time agent activity monitoring and evaluation" />
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader 
        title="Runtime Monitor" 
        subtitle="Real-time agent activity monitoring and evaluation"
      />

      {/* Active Agents */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ACTIVE AGENTS</h3>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Currently monitored autonomous systems</p>
          </div>
          <span className="text-xs" style={{ color: '#6B7280' }}>{agents.length} active</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent) => (
            <div key={agent.id} className="p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-mono" style={{ color: '#E8E8E8' }}>{agent.id}</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#5A9F6B' }}></span>
                  <span className="text-xs" style={{ color: '#5A9F6B', textTransform: 'uppercase' }}>{agent.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type</div>
                  <div className="text-xs" style={{ color: '#9CA3AF' }}>{agent.type}</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Policy</div>
                  <div className="text-xs" style={{ color: '#9CA3AF' }}>{agent.policyId}</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Last Activity</div>
                  <div className="text-xs text-mono" style={{ color: '#6B7280' }}>{formatTime(agent.lastActivity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Runtime Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>RUNTIME EVENTS</h3>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Real-time agent actions and policy evaluations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-subtle" style={{ backgroundColor: '#5A9F6B' }}></span>
            <span className="text-xs font-medium" style={{ color: '#5A9F6B', letterSpacing: '0.025em' }}>LIVE</span>
          </div>
        </div>
        <DataTable 
          columns={runtimeColumns} 
          data={runtimeEvents}
        />
      </div>
    </div>
  );
};
