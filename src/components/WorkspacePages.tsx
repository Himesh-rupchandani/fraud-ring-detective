import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowRight, ArrowUpRight, BadgeCheck, Check, CircleAlert,
  Download, FileCheck2, FileSearch, GitBranch, Network, Plus, Search, ShieldCheck,
  SlidersHorizontal, X,
} from 'lucide-react';
import {
  accounts, evidence, fraudRings, graphEdges, graphNodes, investigationId, investigations as demoInvestigations, primaryPathTransactions, riskFactors, transactions,
} from '../data/mockData';
import type { AlertRecord, EvidenceRecord, InvestigationRecord, TimelineEvent, TransactionRecord, ViewId, WorkspacePreferences } from '../types';
import { formatMoney, riskClassName } from '../utils';
import { ActivityTimeline, MoneyPathPanel, RiskBreakdown } from './Dashboard';
import { GraphExplorer } from './GraphExplorer';

interface WorkspacePagesProps {
  view: Exclude<ViewId, 'dashboard'>;
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  traceActive: boolean;
  onToggleTrace: () => void;
  onNavigate: (view: ViewId) => void;
  onOpenEvidence: (item?: EvidenceRecord) => void;
  onOpenTransaction: (transaction: TransactionRecord) => void;
  onAcknowledgeAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
  onOpenAlert: (alert: AlertRecord) => void;
  onGenerateReport: () => void;
  onCreateInvestigation: () => void;
  onExportTransactions: () => void;
  preferences: WorkspacePreferences;
  onPreferenceToggle: (key: keyof WorkspacePreferences) => void;
  alertsData: AlertRecord[];
  timelineData: TimelineEvent[];
  investigationsData: InvestigationRecord[];
  searchSeed: string;
}

const pageInfo: Record<Exclude<ViewId, 'dashboard'>, { eyebrow: string; title: string; description: string }> = {
  investigations: { eyebrow: 'CASE MANAGEMENT', title: 'Investigations', description: 'Triage open cases, review analyst ownership and track the latest disposition.' },
  rings: { eyebrow: 'CONNECTED NETWORKS', title: 'Fraud rings', description: 'Clusters ranked by risk, evidence confidence and suspected value in motion.' },
  graph: { eyebrow: 'RELATIONSHIP ANALYSIS', title: 'Graph explorer', description: 'Inspect the entity network. Select, filter, pan and zoom the current case graph.' },
  moneyPaths: { eyebrow: 'FUNDS MOVEMENT', title: 'Money paths', description: 'Follow suspicious value through linked beneficiaries and intermediary accounts.' },
  transactions: { eyebrow: 'PAYMENT ACTIVITY', title: 'Transactions', description: 'Review flagged and supporting transfers associated with the active ring.' },
  accounts: { eyebrow: 'ENTITY REGISTRY', title: 'Accounts', description: 'Known account profiles, ownership links and their current risk posture.' },
  devices: { eyebrow: 'IDENTITY SIGNALS', title: 'Devices & IPs', description: 'Shared fingerprints and network addresses connecting otherwise separate profiles.' },
  evidence: { eyebrow: 'CASE MATERIAL', title: 'Evidence', description: 'Review explainable signals with confidence, provenance and related entities.' },
  alerts: { eyebrow: 'OPERATIONAL QUEUE', title: 'Alert center', description: 'Acknowledge, investigate or dismiss signals raised by the current analysis.' },
  reports: { eyebrow: 'CASE OUTPUT', title: 'Reports & verdict', description: 'A concise, evidence-backed summary ready for investigator review.' },
  risk: { eyebrow: 'SCORING METHODOLOGY', title: 'Risk analysis', description: 'Understand how graph-derived features contribute to the account score.' },
  activity: { eyebrow: 'AUDIT LOG', title: 'Activity timeline', description: 'A time-ordered view of detection, graph analysis and analyst review.' },
  settings: { eyebrow: 'WORKSPACE', title: 'Settings', description: 'Adjust local demo preferences for this investigation workspace.' },
};

function PageTitle({ view, action }: { view: Exclude<ViewId, 'dashboard'>; action?: React.ReactNode }) {
  const info = pageInfo[view];
  return (
    <div className="page-heading workspace-page-heading">
      <div><div className="eyebrow page-eyebrow">{info.eyebrow} <span className="heading-divider">/</span> {investigationId}</div><h1>{info.title}</h1><p>{info.description}</p></div>
      {action && <div className="page-heading-actions">{action}</div>}
    </div>
  );
}

function SearchFilter({ value, onChange, placeholder = 'Filter records…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleSlashShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditing = target?.matches('input, textarea, select, [contenteditable="true"]');
      if (event.key === '/' && !isEditing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleSlashShortcut);
    return () => window.removeEventListener('keydown', handleSlashShortcut);
  }, []);
  return <label className="table-search"><Search size={14} /><input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><kbd>/</kbd></label>;
}

function NoRows({ label }: { label: string }) {
  return <div className="empty-state table-empty"><FileSearch size={20} /><strong>No {label} match</strong><span>Try a different search term or filter.</span></div>;
}

function AccountsPage({ onSelectNode, onNavigate, searchSeed }: { onSelectNode: (id: string) => void; onNavigate: (view: ViewId) => void; searchSeed: string }) {
  const [query, setQuery] = useState(searchSeed);
  const [riskFilter, setRiskFilter] = useState('all');
  useEffect(() => setQuery(searchSeed), [searchSeed]);
  const rows = useMemo(() => accounts.filter((account) => {
    const matchesQuery = `${account.id} ${account.owner} ${account.bank} ${account.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (riskFilter === 'all' || account.status.toLowerCase() === riskFilter);
  }), [query, riskFilter]);
  return (
    <>
      <PageTitle view="accounts" action={<button className="button button-secondary" onClick={() => onNavigate('graph')}><Network size={15} /> Open graph</button>} />
      <div className="workspace-summary-row">
        <div className="summary-chip"><span>Registered accounts</span><b>07</b></div><div className="summary-chip"><span>Critical / high</span><b className="tone-red">04</b></div><div className="summary-chip"><span>Shared device links</span><b className="tone-teal">08</b></div><div className="summary-chip"><span>Network total</span><b>₹18.4L</b></div>
      </div>
      <section className="panel workspace-table-panel">
        <div className="table-toolbar"><div><strong>Account registry</strong><span>{rows.length} of {accounts.length} entities</span></div><div className="table-toolbar-controls"><SearchFilter value={query} onChange={setQuery} placeholder="Search ID, owner, institution…" /><select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} aria-label="Filter accounts by risk"><option value="all">All risk levels</option><option value="critical">Critical</option><option value="high">High</option><option value="elevated">Elevated</option><option value="monitored">Monitored</option></select></div></div>
        {rows.length ? <div className="table-scroll"><table className="data-table workspace-table"><thead><tr><th>Account</th><th>Owner</th><th>Institution</th><th>Relationships</th><th>Transactions</th><th>Flagged amount</th><th>Risk</th><th /></tr></thead><tbody>
          {rows.map((account) => <tr key={account.id} onClick={() => { onSelectNode(account.id); onNavigate('graph'); }} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') { onSelectNode(account.id); onNavigate('graph'); } }}>
            <td><button className="mono-id table-link" onClick={(event) => { event.stopPropagation(); onSelectNode(account.id); onNavigate('graph'); }}>{account.id}</button><small className="table-secondary">Opened {account.opened}</small></td>
            <td><strong>{account.owner}</strong><small className="table-secondary">{account.location}</small></td><td>{account.bank}</td>
            <td><span className="relationship-count"><i className="mini-node-icon device" />{account.deviceIds.length} devices</span><span className="relationship-count"><i className="mini-node-icon ip" />{account.ipIds.length} IPs</span></td>
            <td>{account.transactionCount}<small className="table-secondary">in current ring</small></td><td>{account.suspiciousAmount ? formatMoney(account.suspiciousAmount) : '—'}</td>
            <td><span className={`risk-pill ${riskClassName(account.status)}`}><i />{account.status} <b>{account.riskScore}</b></span></td><td><ArrowUpRight size={14} className="table-row-arrow" /></td>
          </tr>)}
        </tbody></table></div> : <NoRows label="accounts" />}
      </section>
    </>
  );
}

function TransactionsPage({ onOpenTransaction, onExportTransactions, searchSeed }: { onOpenTransaction: (transaction: TransactionRecord) => void; onExportTransactions: () => void; searchSeed: string }) {
  const [query, setQuery] = useState(searchSeed);
  const [status, setStatus] = useState('all');
  const [minAmount, setMinAmount] = useState('all');
  useEffect(() => setQuery(searchSeed), [searchSeed]);
  const rows = useMemo(() => transactions.filter((transaction) => {
    const matchesQuery = `${transaction.id} ${transaction.from} ${transaction.to} ${transaction.channel} ${transaction.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'all' || transaction.status.toLowerCase() === status;
    const threshold = minAmount === 'all' ? 0 : minAmount === '100000' ? 100000 : 300000;
    return matchesQuery && matchesStatus && transaction.amount >= threshold;
  }), [query, status, minAmount]);
  const flaggedAmount = rows.reduce((sum, tx) => sum + (tx.status === 'Flagged' ? tx.amount : 0), 0);
  return (
    <>
      <PageTitle view="transactions" action={<button className="button button-secondary" onClick={onExportTransactions}><ArrowDownToLine size={15} /> Export CSV</button>} />
      <div className="workspace-summary-row">
        <div className="summary-chip"><span>Linked transfers</span><b>27</b></div><div className="summary-chip"><span>Flagged</span><b className="tone-red">03</b></div><div className="summary-chip"><span>Flagged value</span><b>₹18.4L</b></div><div className="summary-chip"><span>Peak risk</span><b className="tone-red">96 / 100</b></div>
      </div>
      <section className="panel workspace-table-panel">
        <div className="table-toolbar"><div><strong>Transaction ledger</strong><span>02 Oct 2026 · {rows.length} matching records</span></div><div className="table-toolbar-controls"><SearchFilter value={query} onChange={setQuery} placeholder="Search transaction or account…" /><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter transactions by status"><option value="all">Any status</option><option value="flagged">Flagged</option><option value="reviewed">Reviewed</option><option value="cleared">Cleared</option></select><select value={minAmount} onChange={(event) => setMinAmount(event.target.value)} aria-label="Filter minimum amount"><option value="all">Any amount</option><option value="100000">₹1L and above</option><option value="300000">₹3L and above</option></select></div></div>
        {rows.length ? <div className="table-scroll"><table className="data-table workspace-table transaction-table"><thead><tr><th>Transfer</th><th>Origin → beneficiary</th><th>Amount</th><th>Channel</th><th>Observed</th><th>Route</th><th>Risk</th><th>Status</th></tr></thead><tbody>
          {rows.map((transaction) => <tr key={transaction.id} onClick={() => onOpenTransaction(transaction)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpenTransaction(transaction); }}>
            <td><button className="mono-id table-link" onClick={(event) => { event.stopPropagation(); onOpenTransaction(transaction); }}>{transaction.id}</button><small className="table-secondary">{transaction.date}</small></td><td><span className="transfer-pair"><b>{transaction.from}</b><ArrowRight size={13} /><b>{transaction.to}</b></span></td><td><strong>{formatMoney(transaction.amount)}</strong></td><td><span className="channel-tag">{transaction.channel}</span></td><td>{transaction.time} IST</td><td>{transaction.location}</td><td><span className={`risk-score-inline ${transaction.riskScore >= 80 ? 'tone-red' : transaction.riskScore >= 60 ? 'tone-amber' : ''}`}>{transaction.riskScore}</span></td><td><span className={`status-pill status-${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
          </tr>)}
        </tbody></table></div> : <NoRows label="transactions" />}
        <div className="table-footer"><span>Showing {rows.length} demo transfer records. The case summary reflects the complete 27-transaction network.</span><span>Flagged value in current filter: <b>{formatMoney(flaggedAmount)}</b></span></div>
      </section>
    </>
  );
}

function InvestigationsPage({ rows, onNavigate, onSelectNode, onCreateInvestigation, searchSeed }: { rows: InvestigationRecord[]; onNavigate: (view: ViewId) => void; onSelectNode: (id: string) => void; onCreateInvestigation: () => void; searchSeed: string }) {
  const [query, setQuery] = useState(searchSeed);
  const [status, setStatus] = useState('all');
  useEffect(() => setQuery(searchSeed), [searchSeed]);
  const filtered = rows.filter((row) => `${row.id} ${row.title} ${row.primaryAccount} ${row.investigator}`.toLowerCase().includes(query.toLowerCase()) && (status === 'all' || row.status.toLowerCase() === status));
  return (
    <>
      <PageTitle view="investigations" action={<button className="button button-primary" onClick={onCreateInvestigation}><Plus size={15} /> Create investigation</button>} />
      <div className="workspace-summary-row"><div className="summary-chip"><span>Open cases</span><b>14</b></div><div className="summary-chip"><span>Critical</span><b className="tone-red">03</b></div><div className="summary-chip"><span>Review pending</span><b className="tone-amber">05</b></div><div className="summary-chip"><span>Avg. resolution</span><b>2.4 days</b></div></div>
      <section className="panel workspace-table-panel"><div className="table-toolbar"><div><strong>Investigation queue</strong><span>{filtered.length} visible cases</span></div><div className="table-toolbar-controls"><SearchFilter value={query} onChange={setQuery} placeholder="Search case, account, analyst…" /><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter investigation status"><option value="all">All statuses</option><option value="under investigation">Under investigation</option><option value="review pending">Review pending</option><option value="monitoring">Monitoring</option><option value="closed">Closed</option></select></div></div>
        <div className="table-scroll"><table className="data-table workspace-table"><thead><tr><th>Investigation</th><th>Lead account</th><th>Assigned to</th><th>Entities</th><th>Linked transfers</th><th>Amount</th><th>Risk</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((row) => <tr key={row.id} onClick={() => { onSelectNode(row.primaryAccount); onNavigate('graph'); }} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') { onSelectNode(row.primaryAccount); onNavigate('graph'); } }}><td><button className="mono-id table-link" onClick={(event) => { event.stopPropagation(); onSelectNode(row.primaryAccount); onNavigate('graph'); }}>{row.id}</button><small className="table-secondary">{row.title} · {row.updated}</small></td><td>{row.primaryAccount}</td><td>{row.investigator}</td><td>{row.entities}</td><td>{row.transactions}</td><td>{formatMoney(row.amount)}</td><td><span className={`risk-pill ${riskClassName(row.risk)}`}><i />{row.risk} <b>{row.score}</b></span></td><td><span className={`status-pill status-${row.status.toLowerCase().replace(/ /g, '-')}`}>{row.status}</span></td><td><ArrowUpRight className="table-row-arrow" size={14} /></td></tr>)}</tbody></table></div>
        {!filtered.length && <NoRows label="investigations" />}
      </section>
    </>
  );
}

function RingsPage({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  return (
    <>
      <PageTitle view="rings" action={<button className="button button-secondary" onClick={() => onNavigate('graph')}><Network size={15} /> Compare on graph</button>} />
      <section className="panel workspace-table-panel ring-table-panel">
        <div className="table-toolbar">
          <div><strong>Ranked ring candidates</strong><span>{fraudRings.length} connected components · ordered by risk score</span></div>
        </div>
        <div className="table-scroll">
          <table className="data-table workspace-table ring-table">
            <thead><tr><th>Candidate</th><th>Risk score</th><th>Network</th><th>Transfers</th><th>Suspected value</th><th>Evidence confidence</th><th /></tr></thead>
            <tbody>{fraudRings.map((ring, index) => (
              <tr key={ring.id}>
                <td><div className="ring-candidate-cell"><span className="ring-rank">{String(index + 1).padStart(2, '0')}</span><span><strong>{ring.label.replace(/^Ring \d+ · /, '')}</strong><small className="table-secondary">Connected component · {ring.id}</small></span></div></td>
                <td data-label="Risk score"><span className={`risk-pill ${riskClassName(ring.risk)}`}><i />{ring.risk}<b>{ring.score}</b></span><span className="ring-score-track"><i style={{ width: `${ring.score}%` }} /></span></td>
                <td data-label="Network"><strong>{ring.accounts} accounts</strong><small className="table-secondary">{ring.devices} devices · {ring.ips} IPs</small></td>
                <td data-label="Transfers">{ring.transactions}</td>
                <td data-label="Suspected value"><strong>{formatMoney(ring.amount)}</strong></td>
                <td data-label="Evidence confidence"><span className="confidence-value">{ring.confidence}%</span><span className="confidence-bar"><i style={{ width: `${ring.confidence}%` }} /></span></td>
                <td><button className="button button-quiet button-small ring-open-button" onClick={() => onNavigate('graph')}>Inspect <ArrowUpRight size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="ring-table-note"><span>Candidates combine transfer edges and shared-identity links; scores rank review priority, not findings.</span><button className="text-button" onClick={() => onNavigate('risk')}>Scoring methodology <ArrowUpRight size={13} /></button></div>
      </section>
    </>
  );
}

function DevicesPage({ searchSeed }: { searchSeed: string }) {
  const [query, setQuery] = useState(searchSeed);
  const [type, setType] = useState('all');
  useEffect(() => setQuery(searchSeed), [searchSeed]);
  const entities = graphNodes.filter((node) => node.type === 'device' || node.type === 'ip');
  const filtered = entities.filter((node) => {
    const matchesType = type === 'all' || node.type === type;
    const linkedAccounts = graphEdges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => edge.source === node.id ? edge.target : edge.source).filter((id) => id.startsWith('ACC-'));
    return matchesType && `${node.id} ${node.label} ${node.provider} ${linkedAccounts.join(' ')}`.toLowerCase().includes(query.toLowerCase());
  });
  return (
    <>
      <PageTitle view="devices" />
      <div className="workspace-summary-row"><div className="summary-chip"><span>Device fingerprints</span><b>04</b></div><div className="summary-chip"><span>Network addresses</span><b>03</b></div><div className="summary-chip"><span>Shared signals</span><b className="tone-teal">05</b></div><div className="summary-chip"><span>Linked profiles</span><b>11</b></div></div>
      <section className="panel workspace-table-panel"><div className="table-toolbar"><div><strong>Device & network registry</strong><span>{filtered.length} signals in {investigationId}</span></div><div className="table-toolbar-controls"><SearchFilter value={query} onChange={setQuery} placeholder="Search fingerprint, IP or account…" /><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter device type"><option value="all">All signals</option><option value="device">Devices</option><option value="ip">IP addresses</option></select></div></div>
        <div className="table-scroll"><table className="data-table workspace-table"><thead><tr><th>Entity ID</th><th>Signal type</th><th>Registry detail</th><th>Connected accounts</th><th>Relationships</th><th>Assessment</th></tr></thead><tbody>{filtered.map((node) => { const related = graphEdges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => edge.source === node.id ? edge.target : edge.source).filter((id) => id.startsWith('ACC-')); return <tr key={node.id}><td><span className="mono-id">{node.id}</span></td><td><span className={`entity-type-tag ${node.type}`}>{node.type === 'ip' ? 'IP ADDRESS' : 'DEVICE'}</span></td><td><strong>{node.provider}</strong></td><td><div className="entity-account-tags">{related.map((id) => <span key={id}>{id}</span>)}</div></td><td>{related.length} account links</td><td><span className={`signal-assessment ${related.length > 1 ? 'signal-shared' : ''}`}><i />{related.length > 1 ? 'Shared signal' : 'Context only'}</span></td></tr>; })}</tbody></table></div>{!filtered.length && <NoRows label="signals" />}</section>
    </>
  );
}

function EvidenceWorkspace({ onOpenEvidence, searchSeed, showConfidence }: { onOpenEvidence: (item?: EvidenceRecord) => void; searchSeed: string; showConfidence: boolean }) {
  const [query, setQuery] = useState(searchSeed);
  const [type, setType] = useState('all');
  useEffect(() => setQuery(searchSeed), [searchSeed]);
  const rows = evidence.filter((item) => `${item.id} ${item.type} ${item.source} ${item.relatedEntity} ${item.summary}`.toLowerCase().includes(query.toLowerCase()) && (type === 'all' || item.type.toLowerCase().includes(type)));
  return (
    <>
      <PageTitle view="evidence" action={<button className="button button-secondary" onClick={() => onOpenEvidence()}><FileCheck2 size={15} /> Evidence trail</button>} />
      <div className="workspace-summary-row"><div className="summary-chip"><span>Linked items</span><b>05</b></div><div className="summary-chip"><span>Avg. confidence</span><b>89%</b></div><div className="summary-chip"><span>High confidence</span><b className="tone-teal">03</b></div><div className="summary-chip"><span>Provenance</span><b>100%</b></div></div>
      <section className="panel workspace-table-panel"><div className="table-toolbar"><div><strong>Evidence register</strong><span>Every signal linked to an entity and observation</span></div><div className="table-toolbar-controls"><SearchFilter value={query} onChange={setQuery} placeholder="Search evidence or source…" /><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter evidence type"><option value="all">All evidence types</option><option value="device">Device</option><option value="ip">IP</option><option value="transfer">Transfer</option><option value="velocity">Velocity</option><option value="identity">Identity</option></select></div></div>
        {rows.length ? <div className="table-scroll"><table className="data-table workspace-table evidence-register-table"><thead><tr><th>Evidence ID</th><th>Type / observation</th><th>Source relationship</th><th>Related entity</th>{showConfidence && <th>Confidence</th>}<th>Timestamp</th><th /></tr></thead><tbody>{rows.map((item) => <tr key={item.id} onClick={() => onOpenEvidence(item)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpenEvidence(item); }}><td><span className="mono-id">{item.id}</span></td><td><strong>{item.type}</strong><small className="table-secondary">{item.summary}</small></td><td>{item.source}</td><td><span className="mono-id">{item.relatedEntity}</span></td>{showConfidence && <td><span className="confidence-value">{item.confidence}%</span><span className="confidence-bar"><i style={{ width: `${item.confidence}%` }} /></span></td>}<td>{item.timestamp}</td><td><button className="table-open-button" aria-label={`View ${item.id}`} onClick={(event) => { event.stopPropagation(); onOpenEvidence(item); }}><ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div> : <NoRows label="evidence items" />}
      </section>
    </>
  );
}

function AlertsWorkspace({ alertsData, onAcknowledge, onDismiss, onOpen, onOpenEvidence, onNavigate }: { alertsData: AlertRecord[]; onAcknowledge: (id: string) => void; onDismiss: (id: string) => void; onOpen: (alert: AlertRecord) => void; onOpenEvidence: (item?: EvidenceRecord) => void; onNavigate: (view: ViewId) => void }) {
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const filtered = alertsData.filter((alert) => (severity === 'all' || alert.severity.toLowerCase() === severity) && (status === 'all' || alert.status.toLowerCase() === status));
  return (
    <>
      <PageTitle view="alerts" />
      <div className="workspace-summary-row"><div className="summary-chip"><span>New</span><b className="tone-red">{alertsData.filter((item) => item.status === 'New').length.toString().padStart(2, '0')}</b></div><div className="summary-chip"><span>Acknowledged</span><b>{alertsData.filter((item) => item.status === 'Acknowledged').length.toString().padStart(2, '0')}</b></div><div className="summary-chip"><span>Critical</span><b className="tone-red">{alertsData.filter((item) => item.severity === 'Critical').length.toString().padStart(2, '0')}</b></div><div className="summary-chip"><span>Last signal</span><b>2 min ago</b></div></div>
      <div className="alerts-layout">
      <section className="panel alert-workspace-panel"><div className="table-toolbar"><div><strong>Active signals</strong><span>{filtered.length} records · current case</span></div><div className="table-toolbar-controls"><select value={severity} onChange={(event) => setSeverity(event.target.value)} aria-label="Filter by severity"><option value="all">All severities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by alert status"><option value="all">All statuses</option><option value="new">New</option><option value="acknowledged">Acknowledged</option><option value="resolved">Resolved</option></select></div></div>
        {filtered.length ? <div className="alert-list alert-list-workspace">{filtered.map((alert) => <article className={`alert-item ${alert.severity.toLowerCase()}`} key={alert.id}><div className={`alert-severity-mark ${alert.severity.toLowerCase()}`}><CircleAlert size={16} /></div><div className="alert-copy"><div className="alert-title-line"><strong>{alert.title}</strong><span className={`severity-label ${alert.severity.toLowerCase()}`}>{alert.severity}</span><span className={`status-pill status-${alert.status.toLowerCase()}`}>{alert.status}</span></div><p>{alert.description}</p><div className="alert-meta"><span>{alert.id}</span><span>{alert.time}</span><button onClick={() => onOpen(alert)}>{alert.accountId}</button></div></div><div className="alert-actions"><button className="alert-action-text" onClick={() => alert.status === 'New' ? onAcknowledge(alert.id) : onOpen(alert)}>{alert.status === 'New' ? <><Check size={13} /> Acknowledge</> : <><ArrowUpRight size={13} /> Review</>}</button><button title="Dismiss alert" aria-label="Dismiss alert" onClick={() => onDismiss(alert.id)}><X size={14} /></button></div></article>)}</div> : <NoRows label="alerts" />}
      </section>
      <aside className="alert-context-rail" aria-label="Current investigation context">
        <section className="panel alert-case-context">
          <div className="eyebrow">CURRENT INVESTIGATION</div>
          <div className="alert-case-context-title"><strong>{demoInvestigations[0].id}</strong><span className="severity-label critical">{demoInvestigations[0].risk}</span></div>
          <h2>{demoInvestigations[0].title}</h2>
          <p>Signals in this queue are linked to the Mumbai–Pune transfer network.</p>
          <dl className="alert-case-facts">
            <div><dt>Primary account</dt><dd>{demoInvestigations[0].primaryAccount}</dd></div>
            <div><dt>Case risk</dt><dd>{demoInvestigations[0].score} / 100</dd></div>
            <div><dt>Funds in path</dt><dd>{formatMoney(demoInvestigations[0].amount)}</dd></div>
          </dl>
          <div className="alert-context-actions">
            <button className="button button-secondary button-small" onClick={() => onNavigate('graph')}><Network size={13} /> Inspect network</button>
            <button className="button button-quiet button-small" onClick={() => onNavigate('evidence')}><FileCheck2 size={13} /> Evidence</button>
          </div>
        </section>
        <section className="panel alert-evidence-context">
          <div className="eyebrow">LINKED EVIDENCE</div>
          <p>Open a source item to validate the signal before recording a disposition.</p>
          {evidence.slice(0, 2).map((item) => (
            <button className="alert-evidence-link" key={item.id} onClick={() => onOpenEvidence(item)}>
              <span>{item.id} · {item.confidence}%</span>
              <strong>{item.type}</strong>
              <small>{item.summary}</small>
            </button>
          ))}
        </section>
      </aside>
      </div>
    </>
  );
}

function MoneyPathsWorkspace({ traceActive, onToggleTrace, onOpenTransaction, onNavigate }: { traceActive: boolean; onToggleTrace: () => void; onOpenTransaction: (transaction: TransactionRecord) => void; onNavigate: (view: ViewId) => void }) {
  return <><PageTitle view="moneyPaths" action={<button className="button button-secondary" onClick={() => onNavigate('graph')}><Network size={15} /> Show on graph</button>} /><div className="money-path-page-main"><MoneyPathPanel traceActive={traceActive} onToggleTrace={onToggleTrace} onOpenTransaction={onOpenTransaction} /><section className="panel path-transfers-panel"><div className="panel-heading"><div><div className="eyebrow">PATH TRANSACTION DETAIL</div><h2>Observed transfer sequence</h2></div><span className="severity-label critical">HIGH CONFIDENCE</span></div><div className="path-transfer-table">{primaryPathTransactions.map((transaction, index) => <button className="path-transfer-table-row" key={transaction.id} onClick={() => onOpenTransaction(transaction)}><span className="path-hop-index">0{index + 1}</span><span className="path-transfer-table-main"><b>{transaction.from} <ArrowRight size={13} /> {transaction.to}</b><small>{transaction.id} · {transaction.channel} · {transaction.time} IST</small></span><strong>{formatMoney(transaction.amount)}</strong><span className="risk-score-inline tone-red">{transaction.riskScore}</span><ArrowUpRight size={14} /></button>)}</div><div className="path-footnote"><GitBranch size={14} /><span>Three consecutive movements satisfy the connected path rule. Distinct devices and shared IP links increase ring confidence.</span></div></section></div></>;
}

function ReportsPage({ onGenerateReport, onOpenEvidence, onNavigate }: { onGenerateReport: () => void; onOpenEvidence: (item?: EvidenceRecord) => void; onNavigate: (view: ViewId) => void }) {
  return (
    <>
      <PageTitle view="reports" action={<button className="button button-primary" onClick={onGenerateReport}><Download size={15} /> Generate report</button>} />
      <section className="panel report-summary-panel"><div className="report-summary-top"><div><div className="eyebrow">INVESTIGATION SUMMARY · {investigationId}</div><h2>High-risk connected transaction network</h2><p>Review summary for the Mumbai–Pune corridor network. The conclusion is supported by graph relationships and transaction evidence; analyst review is still required.</p></div><div className="report-verdict-stamp"><span>PROVISIONAL VERDICT</span><strong>HIGH RISK</strong><small>Not a final determination</small></div></div><div className="report-summary-metrics"><div><span>Risk score</span><b className="tone-red">94 / 100</b></div><div><span>Entities</span><b>18</b></div><div><span>Accounts</span><b>07</b></div><div><span>Devices</span><b>04</b></div><div><span>IP addresses</span><b>03</b></div><div><span>Transactions</span><b>27</b></div><div><span>Suspicious amount</span><b>₹18.4L</b></div><div><span>Evidence confidence</span><b>93%</b></div></div><div className="report-evidence-summary"><div><h3>Evidence basis</h3><ul><li><BadgeCheck size={15} /> Shared device fingerprints connect separate beneficiary profiles.</li><li><BadgeCheck size={15} /> Shared IP relationships overlap with the transfer sequence.</li><li><BadgeCheck size={15} /> Three-hop movement occurred in 10m 08s with unusual velocity.</li><li><BadgeCheck size={15} /> Connected-component analysis identifies a seven-account ring.</li></ul></div><div className="report-confidence-card"><span>Evidence coverage</span><strong>93%</strong><div className="confidence-bar confidence-bar-wide"><i style={{ width: '93%' }} /></div><small>5 registered items · 4 independently observable signals</small><button className="text-button" onClick={() => onOpenEvidence()}>Review evidence trail <ArrowRight size={13} /></button></div></div><div className="report-disclaimer"><ShieldCheck size={15} /><span><b>Investigator review required.</b> This demo report is generated from synthetic frontend data and is not a real-world finding or legal conclusion.</span></div><div className="report-panel-actions"><button className="button button-secondary" onClick={() => onNavigate('evidence')}><FileCheck2 size={15} /> Review evidence</button></div></section>
    </>
  );
}

function RiskPage({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  return <><PageTitle view="risk" action={<button className="button button-secondary" onClick={() => onNavigate('evidence')}><FileCheck2 size={15} /> View supporting evidence</button>} /><div className="risk-workspace-grid"><RiskBreakdown /><section className="panel risk-explanation-panel"><div className="panel-heading"><div><div className="eyebrow">SCORING NOTES</div><h2>How to interpret this score</h2></div><ShieldCheck size={17} className="tone-teal" /></div><p className="risk-explanation-intro">The score is a transparent sum of graph-derived signals. Each contribution points to an observable relationship or behavior and can be reviewed independently.</p><div className="risk-explanation-list">{riskFactors.map((factor, index) => <div key={factor.label} className="risk-explanation-row"><span className="factor-index">0{index + 1}</span><div><strong>{factor.label}</strong><p>{factor.explanation}</p></div><b>+{factor.points}</b></div>)}</div><div className="risk-disposition"><CircleAlert size={16} /><p><strong>Recommended handling</strong><br />Prioritize evidence preservation and verify account ownership through approved channels. A high risk score alone does not establish intent.</p></div></section></div></>;
}

function ActivityPage({ events }: { events: TimelineEvent[] }) {
  return (
    <>
      <PageTitle view="activity" />
      <div className="activity-page-grid">
        <div className="activity-summary-column">
          <section className="panel activity-day-card"><div className="eyebrow">02 OCTOBER 2026</div><h2>Case activity</h2><p>All timestamps shown in India Standard Time (UTC+05:30).</p><div className="activity-day-stats"><span><b>{events.length.toString().padStart(2, '0')}</b> events</span><span><b>11 min</b> detection to review</span></div></section>
          <section className="panel activity-provenance"><div><Activity size={16} /><strong>Audit integrity</strong></div><p>Events in this demo are illustrative, ordered and tied to {investigationId}. A production implementation should store immutable analyst actions and source references.</p></section>
        </div>
        <ActivityTimeline events={events} limit={events.length} />
      </div>
    </>
  );
}

function SettingsPage({ preferences, onPreferenceToggle }: { preferences: WorkspacePreferences; onPreferenceToggle: (key: keyof WorkspacePreferences) => void }) {
  const controls: { key: keyof WorkspacePreferences; title: string; description: string }[] = [
    { key: 'liveStatus', title: 'Live status indicators', description: 'Show workspace sync and system availability in the top navigation.' },
    { key: 'showConfidence', title: 'Evidence confidence labels', description: 'Show confidence values and bars in evidence registers.' },
    { key: 'compactTables', title: 'Compact table density', description: 'Reduce row height in dense transaction and entity registers.' },
  ];
  return <><PageTitle view="settings" /><div className="settings-layout"><section className="panel settings-panel"><div className="panel-heading"><div><div className="eyebrow">DISPLAY PREFERENCES</div><h2>Investigation workspace</h2></div><SlidersHorizontal size={17} /></div>{controls.map((setting) => <div className="setting-row" key={setting.key}><div><strong>{setting.title}</strong><p>{setting.description}</p></div><button className={`toggle-control ${preferences[setting.key] ? 'toggle-on' : ''}`} aria-pressed={preferences[setting.key]} aria-label={`${preferences[setting.key] ? 'Disable' : 'Enable'} ${setting.title}`} onClick={() => onPreferenceToggle(setting.key)}><span /></button></div>)}<div className="settings-local-note"><ShieldCheck size={14} /> These preferences are held locally for this demo session.</div></section><section className="panel settings-info-panel"><div className="eyebrow">DEMO ENVIRONMENT</div><h2>Built for review, not production</h2><p>Ringtrace is currently using structured synthetic data. No real accounts, transactions, device fingerprints or personal records are loaded.</p><div className="settings-info-list"><div><span>Tenant</span><b>IN-West · Demo</b></div><div><span>Data snapshot</span><b>02 Oct 2026 · 10:53 IST</b></div><div><span>Graph source</span><b>Mock connected component</b></div><div><span>Model status</span><b>Explainable rules demo</b></div></div><div className="settings-build-label">Workspace build <code>1.0.4-demo</code></div></section></div></>;
}

export function WorkspacePages(props: WorkspacePagesProps) {
  switch (props.view) {
    case 'graph':
      return <><PageTitle view="graph" action={<button className="button button-secondary" onClick={() => props.onNavigate('moneyPaths')}><GitBranch size={15} /> Money paths</button>} /><GraphExplorer selectedNodeId={props.selectedNodeId} onSelectNode={props.onSelectNode} traceActive={props.traceActive} onToggleTrace={props.onToggleTrace} onNavigate={props.onNavigate} fullPage /></>;
    case 'investigations': return <InvestigationsPage rows={props.investigationsData} onNavigate={props.onNavigate} onSelectNode={props.onSelectNode} onCreateInvestigation={props.onCreateInvestigation} searchSeed={props.searchSeed} />;
    case 'rings': return <RingsPage onNavigate={props.onNavigate} />;
    case 'moneyPaths': return <MoneyPathsWorkspace traceActive={props.traceActive} onToggleTrace={props.onToggleTrace} onOpenTransaction={props.onOpenTransaction} onNavigate={props.onNavigate} />;
    case 'transactions': return <TransactionsPage onOpenTransaction={props.onOpenTransaction} onExportTransactions={props.onExportTransactions} searchSeed={props.searchSeed} />;
    case 'accounts': return <AccountsPage onSelectNode={props.onSelectNode} onNavigate={props.onNavigate} searchSeed={props.searchSeed} />;
    case 'devices': return <DevicesPage searchSeed={props.searchSeed} />;
    case 'evidence': return <EvidenceWorkspace onOpenEvidence={props.onOpenEvidence} searchSeed={props.searchSeed} showConfidence={props.preferences.showConfidence} />;
    case 'alerts': return <AlertsWorkspace alertsData={props.alertsData} onAcknowledge={props.onAcknowledgeAlert} onDismiss={props.onDismissAlert} onOpen={props.onOpenAlert} onOpenEvidence={props.onOpenEvidence} onNavigate={props.onNavigate} />;
    case 'reports': return <ReportsPage onGenerateReport={props.onGenerateReport} onOpenEvidence={props.onOpenEvidence} onNavigate={props.onNavigate} />;
    case 'risk': return <RiskPage onNavigate={props.onNavigate} />;
    case 'activity': return <ActivityPage events={props.timelineData} />;
    case 'settings': return <SettingsPage preferences={props.preferences} onPreferenceToggle={props.onPreferenceToggle} />;
    default: return null;
  }
}
