import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { agentsService } from '../services/api/agents';

export const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentsData = await agentsService.getAllAgents();
        setAgents(agentsData);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
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

  if (loading) {
    return (
      <div>
        <PageHeader title="Agents" subtitle="Monitored autonomous AI agents and their status" />
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader 
        title="Agents" 
        subtitle="Monitored autonomous AI agents and their status"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-5 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-semibold text-mono mb-1" style={{ color: '#E8E8E8' }}>{agent.id}</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>{agent.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#5A9F6B' }}></span>
                <span className="text-xs" style={{ color: '#5A9F6B', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{agent.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>{agent.type}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Policy</div>
                <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{agent.policyId}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Capabilities</div>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 rounded-sm" 
                    style={{ 
                      backgroundColor: '#0C1117', 
                      border: '1px solid #1A222B',
                      color: '#9CA3AF'
                    }}
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs" style={{ color: '#6B7280' }}>
              <span>Last activity: {formatTime(agent.lastActivity)}</span>
              <span className="text-mono">{agent.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
