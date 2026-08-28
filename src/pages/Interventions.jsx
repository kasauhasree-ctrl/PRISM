import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { eventsService } from '../services/api/events';

export const Interventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterventions = async () => {
      try {
        const interventionsData = await eventsService.getInterventions(10);
        setInterventions(interventionsData);
      } catch (error) {
        console.error('Failed to load interventions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInterventions();
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Interventions" subtitle="Active and historical security interventions" />
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader 
        title="Interventions" 
        subtitle="Active and historical security interventions"
      />

      <div className="space-y-3">
        {interventions.map((intervention) => (
          <div key={intervention.interventionId} className="p-5 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <StatusBadge status={intervention.type} size="md" />
                <div>
                  <div className="text-sm font-semibold text-mono" style={{ color: '#E8E8E8' }}>{intervention.agentId}</div>
                  <div className="text-xs text-mono" style={{ color: '#6B7280' }}>{intervention.action}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-mono" style={{ color: '#6B7280' }}>{formatTime(intervention.timestamp)}</div>
                <div className="text-xs" style={{ color: '#6B7280' }}>{formatDate(intervention.timestamp)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Policy</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>{intervention.policyId}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Rule</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>{intervention.ruleId}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Reason</div>
              <div className="text-sm" style={{ color: '#9CA3AF' }}>{intervention.reason}</div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ 
                  backgroundColor: intervention.status === 'active' ? '#B8943F' : '#5A9F6B' 
                }}></span>
                <span style={{ 
                  color: intervention.status === 'active' ? '#B8943F' : '#5A9F6B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}>{intervention.status.replace('_', ' ')}</span>
              </div>
              <span className="text-mono" style={{ color: '#6B7280' }}>{intervention.interventionId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
