import { buildApiUrl } from './config';

export const systemService = {
  async getSystemStatus() {
    // Mock implementation
    return {
      status: 'operational',
      uptime: '45d 12h 30m',
      version: '1.0.0',
      lastRestart: '2026-07-12T00:00:00Z',
    };
  },

  async getSystemMetrics() {
    // Mock implementation
    return {
      systemStatus: 'operational',
      activePolicy: 'Finance Controls v3',
      agentsMonitored: 12,
      actionsEvaluated: 18492,
      activeInterventions: 3,
      evaluationRate: 42.5, // evaluations per second
      averageLatency: 15, // milliseconds
    };
  },

  async getHealthCheck() {
    // Mock implementation
    return {
      status: 'healthy',
      components: {
        api: 'healthy',
        database: 'healthy',
        evaluationEngine: 'healthy',
        notificationService: 'healthy',
      },
      timestamp: new Date().toISOString(),
    };
  },
};
