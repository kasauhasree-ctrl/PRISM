import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, CloudUpload, FileText, Lock, Upload, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { policiesService } from '../services/api/policies';
import { DEMO_MODE } from '../services/api/config';

const candidateSeed = [
  { id: 'rule-candidate-001', name: 'External transfers require explicit authorization', description: 'All external transfers require human authorization before execution.', severity: 'HIGH', enforcement: 'BLOCK', status: 'candidate' },
  { id: 'rule-candidate-002', name: 'Large transactions require dual approval', description: 'Transactions above $10,000 require dual approval.', severity: 'MEDIUM', enforcement: 'PAUSE', status: 'candidate' },
];
const activeSeed = [
  { id: 'rule-active-001', name: 'Internal database access allowed for authorized agents', description: 'Authorized agents can access internal database.', severity: 'LOW', enforcement: 'ALLOW', status: 'active' },
  { id: 'rule-active-002', name: 'Customer data access requires role-based authorization', description: 'Customer data access is controlled by role-based permissions.', severity: 'MEDIUM', enforcement: 'MONITOR', status: 'active' },
];
const stages = ['Uploaded', 'Candidate', 'Approved', 'Active', 'Runtime Enforcement'];

export const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [candidates, setCandidates] = useState(candidateSeed);
  const [approved, setApproved] = useState([]);
  const [activeRules, setActiveRules] = useState(activeSeed);
  const [stage, setStage] = useState(4);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInput = useRef(null);

  useEffect(() => {
    policiesService.getAllPolicies().then((data) => { setPolicies(data); setSelectedPolicy(data[0] || null); }).catch((error) => console.error('Failed to load policies:', error)).finally(() => setLoading(false));
  }, []);

  const policy = selectedPolicy || { id: 'pol-001', name: 'Finance Controls v3', version: '3.0.0', status: 'active', rulesCount: activeRules.length, lastUpdated: new Date().toISOString() };
  const date = (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const selectFile = (nextFile) => { if (nextFile) { setFile(nextFile); setNotice(''); } };

  const upload = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const uploaded = await policiesService.uploadRulebook(file);
      setPolicies((items) => [uploaded, ...items.filter((item) => item.id !== uploaded.id)]);
      setSelectedPolicy(uploaded);
      setCandidates(candidateSeed.map((item) => ({ ...item, policyId: uploaded.id })));
      setApproved([]); setActiveRules([]); setStage(1); setUploadOpen(false); setFile(null);
      setNotice('Rulebook uploaded. Candidate rules are ready for authority review.');
    } catch (error) { setNotice(error.message); } finally { setProcessing(false); }
  };

  const approve = async (rule) => {
    try {
      await policiesService.approveCandidate(policy.id, rule.id);
      setCandidates((items) => items.map((item) => item.id === rule.id ? { ...item, status: 'approved' } : item));
      setApproved((items) => items.some((item) => item.id === rule.id) ? items : [...items, { ...rule, status: 'approved' }]);
      setStage(approved.length + 1 === candidates.length ? 2 : 1);
      setNotice(`${rule.id} approved and staged for activation.`);
    } catch (error) { setNotice(error.message); }
  };

  const activate = async () => {
    try {
      await policiesService.activatePolicy(policy.id);
      setActiveRules(approved.map((rule) => ({ ...rule, status: 'active' })));
      setCandidates((items) => items.filter((item) => item.status !== 'approved'));
      setSelectedPolicy((item) => ({ ...item, status: 'active', version: '4.0.0', rulesCount: approved.length }));
      setStage(4); setNotice('Policy activated. Approved rules are now enforcing at runtime.');
    } catch (error) { setNotice(error.message); }
  };

  if (loading) return <div><PageHeader title="Policy Center" subtitle="Manage organizational policies and rules" /><div className="flex items-center justify-center py-12"><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#202A35', borderTopColor: '#5A9F6B' }} /></div></div>;

  return <div className="policies-page" style={{ maxWidth: '1400px', margin: '0 auto' }}>
    <PageHeader title="Policy Center" subtitle="Manage organizational policies and rules" />
    <div className="policy-heading"><div><div className="section-kicker">POLICY AUTHORITY</div><p>Review rulebooks before they become executable runtime controls.</p></div>{DEMO_MODE && <button className="policy-upload-button" onClick={() => setUploadOpen(true)}><CloudUpload size={16} /> UPLOAD RULEBOOK</button>}</div>

    <section className="policy-lifecycle panel"><div className="lifecycle-heading"><div><div className="section-kicker">POLICY LIFECYCLE</div><p>{stage === 4 ? 'Active policy is enforcing approved rules at runtime.' : stage === 2 ? 'All selected candidates approved for activation.' : 'Rules remain non-executable until authority approval and activation.'}</p></div><strong>{stages[stage].toUpperCase()}</strong></div><div className="lifecycle-track">{stages.map((item, index) => <React.Fragment key={item}><div className={`lifecycle-step ${index <= stage ? 'complete' : ''} ${index === stage ? 'current' : ''}`}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{item}</div>{index < stages.length - 1 && <i className={index < stage ? 'complete' : ''} />}</React.Fragment>)}</div></section>
    {notice && <div className="policy-notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notice"><X size={14} /></button></div>}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <aside><div className="section-kicker mb-3">POLICY REGISTER</div><div className="space-y-2">{policies.map((item) => <button className={`policy-list-item ${policy.id === item.id ? 'selected' : ''}`} key={item.id} onClick={() => setSelectedPolicy(item)}><span><strong>{item.name}</strong><small>{item.id} · v{item.version}</small></span><StatusBadge status={item.status} size="sm" /></button>)}</div><div className="policy-legend"><span><i className="uploaded" /> Uploaded</span><span><i className="candidate" /> Candidate</span><span><i className="active" /> Active</span></div></aside>
      <div className="lg:col-span-2 space-y-4">
        <section className="panel"><div className="policy-summary-head"><div><div className="section-kicker">SELECTED POLICY</div><h2>{policy.name}</h2><code>{policy.id}</code></div><StatusBadge status={policy.status} size="md" /></div><div className="policy-facts">{[['VERSION', policy.version], ['STATUS', policy.status], ['RULES', policy.rulesCount || activeRules.length], ['UPDATED', date(policy.lastUpdated)]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
        <section className="panel"><div className="policy-section-head"><div><div className="section-kicker">CANDIDATE RULES</div><p>Review required before runtime activation.</p></div><span className="review-badge">{candidates.length} REVIEW REQUIRED</span></div>{candidates.length === 0 ? <div className="policy-empty"><Check size={16} /> All candidate rules have moved through review.</div> : <div className="space-y-3">{candidates.map((rule) => <article className="rule-card" key={rule.id}><div className="rule-card-head"><div><h3>{rule.name}</h3><p>{rule.description}</p></div><span className={`severity ${rule.severity.toLowerCase()}`}>{rule.severity}</span></div><div className="rule-meta"><span>{rule.id}</span><span>ENFORCEMENT <b>{rule.enforcement}</b></span><span className={rule.status === 'approved' ? 'approved-text' : 'review-text'}>{rule.status === 'approved' ? 'APPROVED' : 'CANDIDATE'}</span></div>{rule.status === 'approved' ? <div className="approved-row"><Check size={14} /> Approved for activation</div> : <button className="approve-button" onClick={() => approve(rule)}><Check size={14} /> APPROVE CANDIDATE</button>}</article>)}</div>}</section>
        <section className="panel"><div className="policy-section-head"><div><div className="section-kicker">APPROVED / ACTIVE RULES</div><p>Only activated rules participate in runtime enforcement.</p></div>{approved.length > 0 && stage < 4 && <button className="activate-button" onClick={activate}><Lock size={14} /> ACTIVATE POLICY</button>}</div>{approved.length > 0 && stage < 4 && <div className="approved-staging">{approved.length} approved rule{approved.length === 1 ? '' : 's'} staged for activation</div>}{activeRules.length === 0 ? <div className="policy-empty">No active rules. Approve candidates, then activate the policy.</div> : <div className="space-y-3">{activeRules.map((rule) => <article className="rule-card active-rule" key={rule.id}><div className="rule-card-head"><div><h3>{rule.name}</h3><p>{rule.description}</p></div><span className="severity low">{rule.severity}</span></div><div className="rule-meta"><span>{rule.id}</span><span>ENFORCEMENT <b>{rule.enforcement}</b></span><span className="active-text">ACTIVE</span></div></article>)}</div>}</section>
      </div>
    </div>

    {uploadOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setUploadOpen(false)}><section className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title"><div className="modal-header"><div><div className="section-kicker">POLICY AUTHORITY</div><h2 id="upload-title">Upload Rulebook</h2><p>Import a rulebook for candidate extraction and review.</p></div><button className="modal-close" onClick={() => setUploadOpen(false)} aria-label="Close upload dialog"><X size={18} /></button></div><div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0]); }} onClick={() => fileInput.current?.click()}><Upload size={25} /><strong>{file ? file.name : 'Drop rulebook here'}</strong><span>{file ? `${(file.size / 1024).toFixed(1)} KB ready for upload` : 'or select a YAML, JSON, or PDF file'}</span><input ref={fileInput} type="file" accept=".yaml,.yml,.json,.pdf" hidden onChange={(event) => selectFile(event.target.files?.[0])} /></div><div className="upload-warning"><FileText size={15} /> Uploaded rules remain candidates until explicitly approved and activated.</div><div className="modal-actions"><button className="modal-secondary" onClick={() => setUploadOpen(false)}>CANCEL</button><button className="policy-upload-button" disabled={!file || processing} onClick={upload}>{processing ? 'PROCESSING...' : 'UPLOAD RULEBOOK'} <ChevronRight size={15} /></button></div></section></div>}
  </div>;
};
