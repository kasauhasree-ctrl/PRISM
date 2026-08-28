import { buildApiUrl } from './config';
import { apiClient } from './apiClient';
import { DEMO_MODE } from './config';

const getAuthHeaders = () => {
  // Try common localStorage keys for an existing JWT, but don't invent an auth flow.
  const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeFetch = async (url, opts = {}) => {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const policiesService = {
  async uploadRulebook(file) {
    if (!DEMO_MODE) throw new Error('Rulebook upload requires the backend endpoint /policies/upload.');
    return {
      id: 'pol-demo-004',
      name: file?.name?.replace(/\.[^.]+$/, '') || 'Finance Controls v4',
      version: '4.0.0-candidate',
      status: 'candidate',
      rulesCount: 2,
      lastUpdated: new Date().toISOString(),
      sourceFile: file?.name || 'finance-controls-rulebook.yaml',
    };
  },

  async approveCandidate(policyId, candidateId) {
    if (!DEMO_MODE) throw new Error(`Candidate approval requires /policies/${policyId}/approve/${candidateId}.`);
    return { policyId, candidateId, status: 'approved', approvedAt: new Date().toISOString() };
  },

  async activatePolicy(policyId) {
    if (!DEMO_MODE) throw new Error(`Policy activation requires /policies/${policyId}/activate.`);
    return { policyId, status: 'active', activatedAt: new Date().toISOString() };
  },

  async getActivePolicy() {
    const url = buildApiUrl(`/policies/active`);
    if (DEMO_MODE) return (await this.getAllPolicies())[0] || null;
    try {
      const res = await apiClient.fetchJson(url);
      return res.data || res;
    } catch (err) {
      // fallback: try to infer from existing mock getAllPolicies
      try {
        const all = await this.getAllPolicies();
        return all && all.length ? all[0] : null;
      } catch (e) {
        return null;
      }
    }
  },

  async getActivePolicyRules(policyId) {
    const url = buildApiUrl(`/policies/active/rules${policyId ? `?policyId=${policyId}` : ''}`);
    if (DEMO_MODE) return this.getPolicyRules(policyId || 'pol-001');
    try {
      const res = await apiClient.fetchJson(url);
      return res.data || res;
    } catch (err) {
      // fallback to mock rules
      try {
        return await this.getPolicyRules(policyId || 'pol-001');
      } catch (e) {
        return [];
      }
    }
  },

  // --- existing mock helpers preserved ---
  async getAllPolicies() {
    // Mock implementation
    return [
      {
        id: 'pol-001',
        name: 'Finance Controls v3',
        version: '3.0.0',
        status: 'active',
        rulesCount: 12,
        lastUpdated: '2026-08-25T14:30:00Z',
      },
      {
        id: 'pol-002',
        name: 'Customer Policy v4',
        version: '4.1.0',
        status: 'active',
        rulesCount: 8,
        lastUpdated: '2026-08-24T09:15:00Z',
      },
      {
        id: 'pol-003',
        name: 'Research Policy v2',
        version: '2.0.0',
        status: 'active',
        rulesCount: 5,
        lastUpdated: '2026-08-20T16:45:00Z',
      },
    ];
  },

  async getPolicyById(id) {
    // Mock implementation
    const policies = await this.getAllPolicies();
    return policies.find(p => p.id === id);
  },

  async getPolicyRules(policyId) {
    // Mock implementation
    return [
      {
        id: 'rule-001',
        policyId: policyId,
        name: 'External transfers prohibited',
        description: 'Agents cannot initiate transfers to external bank accounts',
        severity: 'high',
        status: 'ACTIVE',
        enforcement: 'block',
      },
      {
        id: 'rule-002',
        policyId: policyId,
        name: 'External transfers require approval',
        description: 'Transfers above threshold require manual approval',
        severity: 'medium',
        status: 'ACTIVE',
        enforcement: 'pause',
      },
    ];
  },

  async getCandidateRules(policyId) {
    // Mock implementation
    return [
      {
        id: 'rule-candidate-001',
        policyId: policyId,
        name: 'External transfers require explicit authorization',
        description: 'All external transfers must have explicit human authorization',
        severity: 'HIGH',
        status: 'REVIEW_REQUIRED',
        enforcement: 'PAUSE',
      },
      {
        id: 'rule-candidate-002',
        policyId: policyId,
        name: 'Large transactions require dual approval',
        description: 'Transactions above $10,000 require dual approval',
        severity: 'MEDIUM',
        status: 'REVIEW_REQUIRED',
        enforcement: 'MONITOR',
      },
    ];
  },

  async getActiveRules(policyId) {
    // Mock implementation
    return [
      {
        id: 'rule-active-001',
        policyId: policyId,
        name: 'Internal database access allowed for authorized agents',
        description: 'Authorized agents can access internal database',
        severity: 'LOW',
        status: 'ACTIVE',
        enforcement: 'ALLOW',
      },
      {
        id: 'rule-active-002',
        policyId: policyId,
        name: 'Customer data access requires role-based authorization',
        description: 'Customer data access is controlled by role-based permissions',
        severity: 'MEDIUM',
        status: 'ACTIVE',
        enforcement: 'MONITOR',
      },
    ];
  },
};
