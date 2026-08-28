import { buildApiUrl } from './config';

export const agentsService = {
  async getAllAgents() {
    // Mock implementation
    return this.getMockAgents();
  },

  async getAgentById(id) {
    // Mock implementation
    const agents = await this.getAllAgents();
    return agents.find(a => a.id === id);
  },

  async getAgentStatus(id) {
    // Mock implementation
    return {
      agentId: id,
      status: 'active',
      lastActivity: new Date().toISOString(),
      actionsEvaluated: Math.floor(Math.random() * 1000) + 100,
      interventions: Math.floor(Math.random() * 5),
    };
  },

  getMockAgents() {
    return [
      {
        id: 'finance-agent-01',
        name: 'Finance Agent 01',
        type: 'financial',
        status: 'active',
        policyId: 'pol-001',
        lastActivity: '2026-08-26T14:32:08Z',
        capabilities: ['transfer_funds', 'get_account_balance', 'analyze_transactions'],
      },
      {
        id: 'support-agent-02',
        name: 'Support Agent 02',
        type: 'customer_service',
        status: 'active',
        policyId: 'pol-002',
        lastActivity: '2026-08-26T14:32:10Z',
        capabilities: ['read_customer_record', 'update_ticket', 'escalate_issue'],
      },
      {
        id: 'research-agent-03',
        name: 'Research Agent 03',
        type: 'research',
        status: 'active',
        policyId: 'pol-003',
        lastActivity: '2026-08-26T14:31:59Z',
        capabilities: ['search_web', 'analyze_data', 'generate_report'],
      },
    ];
  },
};
