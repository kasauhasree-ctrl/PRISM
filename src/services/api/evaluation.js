import { buildApiUrl } from './config';
import { apiClient } from './apiClient';
import { DEMO_MODE } from './config';

const safePostJson = async (url, body = {}) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const evaluationService = {
  async evaluateAction(agentId, action, target, context = {}) {
    const url = buildApiUrl(`/evaluate`);
    try {
      const payload = { agentId, action, target, context };
      const res = DEMO_MODE ? { data: null } : await apiClient.postJson(url, payload);
      if (DEMO_MODE) throw new Error('Demo mode');
      return res.data || res;
    } catch (err) {
      // fallback to local mock logic
      const riskAssessment = this.assessRisk(action, target);
      const decision = this.makeDecision(riskAssessment, context);

      return {
        evaluationId: `eval-${Date.now()}`,
        agentId,
        action,
        target,
        risk: riskAssessment.level,
        decision: decision.action,
        policyId: decision.policyId,
        ruleId: decision.ruleId,
        reason: decision.reason,
        timestamp: new Date().toISOString(),
        evidence: decision.evidence || [],
      };
    }
  },

  assessRisk(action, target) {
    // Mock risk assessment logic
    const highRiskActions = ['transfer_funds', 'delete_records', 'access_sensitive_data'];
    const highRiskTargets = ['external_bank', 'external_api', 'production_database'];

    if (highRiskActions.includes(action) && highRiskTargets.includes(target)) {
      return { level: 'HIGH', score: 0.85 };
    }

    if (highRiskActions.includes(action) || highRiskTargets.includes(target)) {
      return { level: 'MEDIUM', score: 0.55 };
    }

    return { level: 'LOW', score: 0.15 };
  },

  makeDecision(riskAssessment, context) {
    // Mock decision logic - this would be handled by the backend
    if (riskAssessment.level === 'HIGH') {
      return {
        action: 'pause',
        policyId: 'pol-001',
        ruleId: 'rule-002',
        reason: 'High-risk action requires approval',
        evidence: ['risk_threshold_exceeded', 'external_target'],
      };
    }

    return {
      action: 'allow',
      policyId: 'pol-001',
      ruleId: 'rule-001',
      reason: 'Action within policy bounds',
      evidence: ['policy_compliant'],
    };
  },

  async getEvaluationHistory(filters = {}) {
    // Mock implementation
    return this.getMockEvaluations();
  },

  getMockEvaluations() {
    return [
      {
        evaluationId: 'eval-001',
        agentId: 'support-agent-02',
        action: 'read_customer_record',
        target: 'internal_database',
        policyId: 'pol-002',
        ruleId: 'rule-001',
        risk: 'LOW',
        decision: 'allow',
        reason: 'Action within policy bounds',
        timestamp: '2026-08-26T14:32:10Z',
      },
      {
        evaluationId: 'eval-002',
        agentId: 'finance-agent-01',
        action: 'transfer_funds',
        target: 'external_bank',
        policyId: 'pol-001',
        ruleId: 'rule-002',
        risk: 'HIGH',
        decision: 'pause',
        reason: 'Required authorization missing',
        timestamp: '2026-08-26T14:32:08Z',
      },
      {
        evaluationId: 'eval-003',
        agentId: 'research-agent-03',
        action: 'search_web',
        target: 'external_web',
        policyId: 'pol-003',
        ruleId: 'rule-001',
        risk: 'LOW',
        decision: 'allow',
        reason: 'Action within policy bounds',
        timestamp: '2026-08-26T14:31:59Z',
      },
      {
        evaluationId: 'eval-004',
        agentId: 'finance-agent-01',
        action: 'get_account_balance',
        target: 'internal_database',
        policyId: 'pol-001',
        ruleId: 'rule-001',
        risk: 'LOW',
        decision: 'allow',
        reason: 'Action within policy bounds',
        timestamp: '2026-08-26T14:31:42Z',
      },
      {
        evaluationId: 'eval-005',
        agentId: 'support-agent-02',
        action: 'update_ticket',
        target: 'internal_ticketing',
        policyId: 'pol-002',
        ruleId: 'rule-001',
        risk: 'LOW',
        decision: 'allow',
        reason: 'Action within policy bounds',
        timestamp: '2026-08-26T14:31:30Z',
      },
    ];
  },
};
