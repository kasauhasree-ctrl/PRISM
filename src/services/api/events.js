import { buildApiUrl } from './config';
import { apiClient } from './apiClient';
import { DEMO_MODE } from './config';

const safeFetch = async (url, opts = {}) => {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // propagate error to caller to allow fallback
    throw err;
  }
};

export const eventsService = {
  async getLiveEvents(limit = 20) {
    const url = buildApiUrl(`/events`);
    if (DEMO_MODE) return this.getMockEvents().slice(0, limit);
    try {
      const res = await apiClient.fetchJson(url);
      const all = res.data || res;
      if (Array.isArray(all)) return all.slice(0, limit);
      return (all.events || []).slice(0, limit);
    } catch (err) {
      return this.getMockEvents().slice(0, limit);
    }
  },

  async getRecentCriticalEvents(limit = 10) {
    const url = buildApiUrl(`/events`);
    if (DEMO_MODE) return this.getMockCriticalEvents().slice(0, limit);
    try {
      const res = await apiClient.fetchJson(url);
      const all = res.data || res;
      const arr = Array.isArray(all) ? all : (all.events || []);
      const critical = arr.filter(e => String(e.decision).toLowerCase() === 'block');
      return critical.slice(0, limit);
    } catch (err) {
      return this.getMockCriticalEvents().slice(0, limit);
    }
  },

  async getInterventions(limit = 10) {
    // If backend has an interventions endpoint, use it; otherwise fallback
    const url = buildApiUrl(`/interventions`);
    if (DEMO_MODE) return this.getMockInterventions().slice(0, limit);
    try {
      const r = await apiClient.fetchJson(url);
      const res = r.data || r;
      if (Array.isArray(res)) return res.slice(0, limit);
      return (res.items || []).slice(0, limit);
    } catch (err) {
      return this.getMockInterventions().slice(0, limit);
    }
  },

  async getEventById(eventId) {
    const url = buildApiUrl(`/events/${eventId}`);
    if (DEMO_MODE) {
      return this.getMockEvents().find(e => e.eventId === eventId) || this.getMockCriticalEvents().find(e => e.eventId === eventId) || null;
    }
    try {
      const r = await apiClient.fetchJson(url);
      return r.data || r;
    } catch (err) {
      const mock = this.getMockEvents().find(e => e.eventId === eventId) || this.getMockCriticalEvents().find(e => e.eventId === eventId);
      return mock || null;
    }
  },

  // --- mocks ---
  getMockEvents() {
    const now = new Date();
    const baseTime = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
    
    return [
      {
        eventId: 'evt-20260827-001',
        timestamp: new Date(baseTime.getTime() + 120 * 1000).toISOString(),
        agentId: 'finance-agent-01',
        action: 'get_account_balance',
        target: 'internal_database',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-002',
        timestamp: new Date(baseTime.getTime() + 90 * 1000).toISOString(),
        agentId: 'support-agent-02',
        action: 'read_customer_record',
        target: 'internal_database',
        policyId: 'pol-002',
        policyName: 'Customer Policy v4',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-003',
        timestamp: new Date(baseTime.getTime() + 60 * 1000).toISOString(),
        agentId: 'finance-agent-01',
        action: 'transfer_funds',
        target: 'external_bank',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        risk: 'HIGH',
        decision: 'pause',
      },
      {
        eventId: 'evt-20260827-004',
        timestamp: new Date(baseTime.getTime() + 45 * 1000).toISOString(),
        agentId: 'research-agent-03',
        action: 'search_web',
        target: 'external_web',
        policyId: 'pol-003',
        policyName: 'Research Policy v2',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-005',
        timestamp: new Date(baseTime.getTime() + 30 * 1000).toISOString(),
        agentId: 'support-agent-02',
        action: 'update_ticket',
        target: 'internal_ticketing',
        policyId: 'pol-002',
        policyName: 'Customer Policy v4',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-006',
        timestamp: new Date(baseTime.getTime() + 20 * 1000).toISOString(),
        agentId: 'finance-agent-01',
        action: 'analyze_transactions',
        target: 'internal_database',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-007',
        timestamp: new Date(baseTime.getTime() + 15 * 1000).toISOString(),
        agentId: 'research-agent-03',
        action: 'access_api',
        target: 'external_api',
        policyId: 'pol-003',
        policyName: 'Research Policy v2',
        risk: 'MEDIUM',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-008',
        timestamp: new Date(baseTime.getTime() + 10 * 1000).toISOString(),
        agentId: 'support-agent-02',
        action: 'escalate_issue',
        target: 'internal_ticketing',
        policyId: 'pol-002',
        policyName: 'Customer Policy v4',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-009',
        timestamp: new Date(baseTime.getTime() + 5 * 1000).toISOString(),
        agentId: 'finance-agent-01',
        action: 'validate_transaction',
        target: 'internal_database',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-010',
        timestamp: new Date(baseTime.getTime() + 3 * 1000).toISOString(),
        agentId: 'research-agent-03',
        action: 'fetch_document',
        target: 'internal_storage',
        policyId: 'pol-003',
        policyName: 'Research Policy v2',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-011',
        timestamp: new Date(baseTime.getTime() + 2 * 1000).toISOString(),
        agentId: 'support-agent-02',
        action: 'create_ticket',
        target: 'internal_ticketing',
        policyId: 'pol-002',
        policyName: 'Customer Policy v4',
        risk: 'LOW',
        decision: 'allow',
      },
      {
        eventId: 'evt-20260827-012',
        timestamp: baseTime.toISOString(),
        agentId: 'finance-agent-01',
        action: 'check_compliance',
        target: 'internal_database',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        risk: 'LOW',
        decision: 'allow',
      },
    ];
  },

  getMockCriticalEvents() {
    const now = new Date();
    const baseTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
    
    return [
      {
        eventId: 'critical-20260827-001',
        timestamp: new Date(baseTime.getTime() + 20 * 60 * 1000).toISOString(),
        agentId: 'finance-agent-01',
        action: 'transfer_funds',
        target: 'external_bank',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        ruleId: 'rule-001',
        ruleName: 'External transfers prohibited',
        decision: 'block',
        reason: 'Policy violation',
        severity: 'critical',
      },
      {
        eventId: 'critical-20260827-002',
        timestamp: new Date(baseTime.getTime() + 10 * 60 * 1000).toISOString(),
        agentId: 'finance-agent-01',
        action: 'transfer_funds',
        target: 'external_bank',
        policyId: 'pol-001',
        policyName: 'Finance Controls v3',
        ruleId: 'rule-002',
        ruleName: 'External transfers require approval',
        decision: 'pause',
        reason: 'Required authorization missing',
        severity: 'high',
      },
    ];
  },

  getMockInterventions() {
    return [
      {
        interventionId: 'int-001',
        eventId: 'critical-001',
        type: 'block',
        agentId: 'finance-agent-01',
        action: 'transfer_funds',
        policyId: 'pol-001',
        ruleId: 'rule-001',
        timestamp: '2026-08-26T14:25:00Z',
        status: 'active',
        reason: 'Policy violation - external transfers prohibited',
      },
      {
        interventionId: 'int-002',
        eventId: 'critical-002',
        type: 'pause',
        agentId: 'finance-agent-01',
        action: 'transfer_funds',
        policyId: 'pol-001',
        ruleId: 'rule-002',
        timestamp: '2026-08-26T14:20:00Z',
        status: 'pending_approval',
        reason: 'Required authorization missing',
      },
    ];
  },
};
