import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { DecisionBadge } from '../components/DecisionBadge';
import { RiskBadge } from '../components/RiskBadge';
import { evaluationService } from '../services/api/evaluation';

export const Evaluation = () => {
  const [formData, setFormData] = useState({
    agent: 'finance-agent-01',
    action: 'transfer_funds',
    target: 'external_bank',
    context: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const evaluationResult = await evaluationService.evaluateAction(
        formData.agent,
        formData.action,
        formData.target,
        formData.context ? { context: formData.context } : {}
      );
      setResult(evaluationResult);
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader 
        title="Action Evaluation" 
        subtitle="Test an autonomous agent action against the active PRISM policy"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div>
          <div className="p-5 rounded-sm mb-6" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
            <h3 className="text-sm font-semibold tracking-wider mb-4" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ACTION INPUT</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Agent</label>
                <select
                  value={formData.agent}
                  onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-sm border"
                  style={{ 
                    backgroundColor: '#0C1117', 
                    borderColor: '#202A35',
                    color: '#9CA3AF'
                  }}
                >
                  <option value="finance-agent-01">finance-agent-01</option>
                  <option value="support-agent-02">support-agent-02</option>
                  <option value="research-agent-03">research-agent-03</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Action</label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-sm border"
                  style={{ 
                    backgroundColor: '#0C1117', 
                    borderColor: '#202A35',
                    color: '#9CA3AF'
                  }}
                >
                  <option value="transfer_funds">transfer_funds</option>
                  <option value="get_account_balance">get_account_balance</option>
                  <option value="read_customer_record">read_customer_record</option>
                  <option value="search_web">search_web</option>
                  <option value="update_ticket">update_ticket</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Target</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-sm border"
                  style={{ 
                    backgroundColor: '#0C1117', 
                    borderColor: '#202A35',
                    color: '#9CA3AF'
                  }}
                >
                  <option value="external_bank">external_bank</option>
                  <option value="internal_database">internal_database</option>
                  <option value="external_web">external_web</option>
                  <option value="internal_ticketing">internal_ticketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Context (Optional)</label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Additional context or parameters"
                  className="w-full px-3 py-2 text-sm rounded-sm border"
                  style={{ 
                    backgroundColor: '#0C1117', 
                    borderColor: '#202A35',
                    color: '#9CA3AF'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold rounded-sm transition-colors"
                style={{ 
                  backgroundColor: loading ? '#202A35' : '#5A9F6B',
                  color: '#E8E8E8',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'EVALUATING...' : 'EVALUATE ACTION'}
              </button>
            </form>
          </div>

          {/* Demo Tip */}
          <div className="p-4 rounded-sm" style={{ backgroundColor: '#0C1117', border: '1px solid #1A222B' }}>
            <div className="text-xs mb-2" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Demo Tip</div>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              Try <span className="text-mono" style={{ color: '#E8E8E8' }}>finance-agent-01 / transfer_funds / external_bank</span> to see PRISM detect a high-risk policy violation.
            </p>
          </div>
        </div>

        {/* Right: Decision Result */}
        <div>
          {!result && !loading && (
            <div className="p-8 rounded-sm text-center" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
              <div className="text-sm mb-2" style={{ color: '#6B7280' }}>PRISM DECISION</div>
              <div className="text-xs" style={{ color: '#9CA3AF' }}>Awaiting action evaluation...</div>
            </div>
          )}

          {loading && (
            <div className="p-8 rounded-sm text-center" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
              <div className="w-4 h-4 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }}></div>
              <div className="text-sm" style={{ color: '#9CA3AF' }}>Evaluating action against policy...</div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Decision Card */}
              <div className="p-5 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold tracking-wider" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PRISM DECISION</div>
                  <DecisionBadge decision={result.decision} size="md" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Risk Level</div>
                    <RiskBadge risk={result.risk} size="md" />
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Event ID</div>
                    <div className="text-sm text-mono" style={{ color: '#9CA3AF' }}>{result.evaluationId}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Policy</div>
                    <div className="text-sm" style={{ color: '#9CA3AF' }}>{result.policyId}</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Rule</div>
                    <div className="text-sm" style={{ color: '#9CA3AF' }}>{result.ruleId}</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Reason</div>
                    <div className="text-sm" style={{ color: '#9CA3AF' }}>{result.reason}</div>
                  </div>
                </div>
              </div>

              {/* Evaluation Chain */}
              <div className="p-5 rounded-sm" style={{ backgroundColor: '#10161D', border: '1px solid #202A35' }}>
                <div className="text-sm font-semibold tracking-wider mb-4" style={{ color: '#E8E8E8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EVALUATION CHAIN</div>
                
                <div className="space-y-0">
                  {[
                    { label: 'AGENT ACTION', value: `${result.agentId} / ${result.action}` },
                    { label: 'TARGET', value: result.target },
                    { label: 'POLICY', value: result.policyId },
                    { label: 'RULE EVALUATION', value: result.ruleId },
                    { label: 'RISK ASSESSMENT', value: result.risk },
                    { label: 'PRISM DECISION', value: result.decision, highlight: true },
                    { label: 'FORENSIC EVENT', value: result.evaluationId },
                  ].map((step, index) => (
                    <React.Fragment key={step.label}>
                      <div className="flex items-center justify-between py-3" style={{ borderBottom: index < 6 ? '1px solid #1A222B' : 'none' }}>
                        <div className="text-xs" style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{step.label}</div>
                        <div className={`text-sm text-mono ${step.highlight ? 'font-semibold' : ''}`} style={{ color: step.highlight ? (result.decision === 'block' ? '#B85C5C' : result.decision === 'pause' ? '#B8943F' : '#5A9F6B') : '#9CA3AF' }}>
                          {step.value}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-center" style={{ color: '#6B7280' }}>
                Evaluated at {formatTime(result.timestamp)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};