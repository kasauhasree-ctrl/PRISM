import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { systemService } from '../services/api/system';

export const Integrity = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [healthCheck, setHealthCheck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const [statusData, metricsData, healthData] = await Promise.all([
          systemService.getSystemStatus(),
          systemService.getSystemMetrics(),
          systemService.getHealthCheck(),
        ]);
        setSystemStatus(statusData);
        setSystemMetrics(metricsData);
        setHealthCheck(healthData);
      } catch (error) {
        console.error('Failed to load system data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSystemData();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="System / Integrity" subtitle="System health, integrity checks, and configuration" />
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader 
        title="System / Integrity" 
        subtitle="System health, integrity checks, and configuration"
      />

      {/* System Status */}
      <div className="mb-6 p-5 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SYSTEM STATUS</h3>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#5A9F6B' }}></span>
            <span className="text-xs" style={{ color: '#5A9F6B', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{systemStatus?.status}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Uptime</div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>{systemStatus?.uptime}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Version</div>
            <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{systemStatus?.version}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Last Restart</div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>{new Date(systemStatus?.lastRestart).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Environment</div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>Production</div>
          </div>
        </div>
      </div>

      {/* Component Health */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold tracking-wider mb-4" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>COMPONENT HEALTH</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthCheck?.components && Object.entries(healthCheck.components).map(([component, status]) => (
            <div key={component} className="p-4 rounded-sm flex items-center justify-between" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: '#9CA3AF' }}>{component.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-xs text-mono" style={{ color: '#6B7280' }}>{component}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#5A9F6B' }}></span>
                <span className="text-xs" style={{ color: '#5A9F6B', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div>
        <h3 className="text-sm font-semibold tracking-wider mb-4" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SYSTEM METRICS</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Agents Monitored</div>
            <div className="text-lg font-semibold" style={{ color: '#E8E8E8' }}>{systemMetrics?.agentsMonitored}</div>
          </div>
          <div className="p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions Evaluated</div>
            <div className="text-lg font-semibold" style={{ color: '#E8E8E8' }}>{systemMetrics?.actionsEvaluated?.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Interventions</div>
            <div className="text-lg font-semibold" style={{ color: '#E8E8E8' }}>{systemMetrics?.activeInterventions}</div>
          </div>
          <div className="p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Evaluation Rate</div>
            <div className="text-lg font-semibold" style={{ color: '#E8E8E8' }}>{systemMetrics?.evaluationRate}/s</div>
          </div>
          <div className="p-4 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Avg Latency</div>
            <div className="text-lg font-semibold" style={{ color: '#E8E8E8' }}>{systemMetrics?.averageLatency}ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};
