import {
  Activity, ArrowRight, ArrowUpRight, BadgeAlert, Bookmark, Check,
  ChevronRight, CircleDot, Clock3, FileCheck2, Fingerprint, GitBranch, Network,
  Plus, Route, ShieldAlert, ShieldCheck, TrendingUp, WalletCards, X,
  type LucideIcon,
} from 'lucide-react';
import { accounts, evidence as evidenceRows, evidencePortfolio, investigations, overviewMetrics, primaryPath, primaryPathTransactions, riskFactors } from '../data/mockData';
import type { AlertRecord, EvidenceRecord, OverviewMetric, TimelineEvent, TransactionRecord, ViewId } from '../types';
import { formatMoney } from '../utils';
import { GraphExplorer } from './GraphExplorer';

interface DashboardProps {
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  traceActive: boolean;
  onToggleTrace: () => void;
  onNavigate: (view: ViewId) => void;
  onOpenEvidence: (evidence?: EvidenceRecord) => void;
  onOpenTransaction: (transaction: TransactionRecord) => void;
  onAcknowledgeAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
  onOpenAlert: (alert: AlertRecord) => void;
  onSaveView: () => void;
  savedView: boolean;
  showConfidence: boolean;
  onNewInvestigation: () => void;
  onGenerateReport: () => void;
  alertsData: AlertRecord[];
  timelineData: TimelineEvent[];
}

const overviewIcons: Record<OverviewMetric['icon'], LucideIcon> = {
  cases: ShieldAlert,
  rings: Network,
  accounts: Fingerprint,
  exposure: WalletCards,
};

function StatCard({ item }: { item: OverviewMetric }) {
  const Icon = overviewIcons[item.icon];
  return (
    <article className={`stat-card stat-${item.tone}`}>
      <div className="stat-card-top"><span>{item.label}</span><span className="stat-icon"><Icon size={15} strokeWidth={1.8} /></span></div>
      <div className="stat-main"><strong>{item.value}</strong><span className="stat-delta">{item.detail}</span></div>
      <div className="stat-foot"><span className="stat-foot-mark" />{item.foot}</div>
    </article>
  );
}

function CaseBrief({ onNavigate, onGenerateReport }: { onNavigate: (view: ViewId) => void; onGenerateReport: () => void }) {
  const priorityCase = investigations[0];
  const caseAccount = accounts.find((account) => account.id === priorityCase.primaryAccount) ?? accounts[0];
  return (
    <section className="case-brief panel">
      <div className="case-brief-main">
        <div className="case-title-row">
          <span className="case-type-mark"><ShieldAlert size={17} /></span>
          <span className="eyebrow">PRIORITY INVESTIGATION</span>
          <span className="case-id-pill">{priorityCase.id}</span>
          <span className="status-pill status-investigating"><span /> {priorityCase.status}</span>
        </div>
        <h2>{priorityCase.title} <span className="case-divider">/</span> <span className="muted-title">Mumbai–Pune corridor</span></h2>
        <p className="case-brief-copy">A connected account cluster moved <strong>₹18.4L</strong> through three intermediaries in eleven minutes. Shared device and network signals link the beneficiaries.</p>
        <div className="case-meta-line">
          <span><UserIcon /> Anjali Deshmukh</span>
          <span><Clock3 size={13} /> Updated 10:53 IST</span>
          <span><CircleDot size={13} /> Primary: <button onClick={() => onNavigate('accounts')}>{caseAccount.id}</button></span>
        </div>
      </div>
      <div className="case-brief-score">
        <div className="risk-score-label"><span>CASE RISK</span><span className={`severity-label ${priorityCase.risk.toLowerCase()}`}>{priorityCase.risk.toUpperCase()}</span></div>
        <div className="case-score-number">{priorityCase.score}<span>/100</span></div>
        <div className="score-progress"><span style={{ width: `${priorityCase.score}%` }} /></div>
        <div className="case-score-caption"><span><ShieldCheck size={13} /> 93% evidence confidence</span><span>18 entities</span></div>
      </div>
      <div className="case-brief-actions">
        <button className="button button-quiet button-small" onClick={() => onNavigate('graph')}><Network size={14} /> Open graph</button>
        <button className="button button-quiet button-small" onClick={onGenerateReport}><FileCheck2 size={14} /> Summary</button>
      </div>
      <div className="case-brief-metrics">
        <div><span>Linked accounts</span><b>07</b></div>
        <div><span>Devices</span><b>04</b></div>
        <div><span>IP addresses</span><b>03</b></div>
        <div><span>Transactions</span><b>{priorityCase.transactions}</b></div>
        <div><span>Flagged amount</span><b>{formatMoney(priorityCase.amount)}</b></div>
        <div><span>Detection confidence</span><b>93%</b></div>
      </div>
    </section>
  );
}

function UserIcon() {
  return <span className="tiny-avatar">AD</span>;
}

export function RiskBreakdown({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`panel risk-panel ${compact ? 'risk-panel-compact' : ''}`}>
      <div className="panel-heading">
        <div><div className="eyebrow">EXPLAINABLE SCORING</div><h2>Risk analysis</h2></div>
        <span className="icon-button panel-more" title="Risk score methodology: additive feature contributions" aria-label="Risk score methodology"><CircleDot size={16} /></span>
      </div>
      <div className="risk-total-row">
        <div className="risk-dial" aria-label="Risk score 94 out of 100"><span>94</span><small>/100</small></div>
        <div className="risk-total-copy"><span className="severity-label critical">CRITICAL RISK</span><strong>Strong network indicators</strong><p>Score is a sum of seven observable factors, not a black-box prediction.</p></div>
      </div>
      <div className="risk-factors-heading"><span>CONTRIBUTING FACTORS</span><small>POINTS</small></div>
      <div className="risk-factor-list">
        {riskFactors.map((factor) => (
          <div className="risk-factor" key={factor.label} title={factor.explanation}>
            <div className="risk-factor-label"><span>{factor.label}</span><b>+{factor.points}</b></div>
            <div className="risk-factor-track"><span style={{ width: `${Math.max(10, (factor.points / 22) * 100)}%` }} /></div>
            {!compact && <p>{factor.explanation}</p>}
          </div>
        ))}
      </div>
      <div className="risk-method-note"><ShieldCheck size={13} /><span>Contribution sum <b>94 pts</b> · Last recalculated 10:51 IST</span></div>
    </section>
  );
}

export function MoneyPathPanel({
  traceActive,
  onToggleTrace,
  onOpenTransaction,
}: {
  traceActive: boolean;
  onToggleTrace: () => void;
  onOpenTransaction: (transaction: TransactionRecord) => void;
}) {
  return (
    <section className="panel money-path-panel">
      <div className="panel-heading money-path-heading">
        <div><div className="eyebrow">SUSPICIOUS MOVEMENT</div><h2>Money path <span className="heading-count">3 hops · 10m 08s</span></h2></div>
        <button className={`button button-secondary button-small ${traceActive ? 'button-traced' : ''}`} onClick={onToggleTrace}>
          {traceActive ? <Check size={14} /> : <Route size={14} />}{traceActive ? 'Path highlighted' : 'Trace path'}
        </button>
      </div>
      <div className="path-context-row">
        <span><span className="path-pulse" /> Primary account</span><span>Observed 02 Oct 2026 · 10:31–10:41 IST</span><span className="path-total">Total moved <b>₹18.4L</b></span>
      </div>
      <div className={`path-sequence ${traceActive ? 'path-sequence-active' : ''}`}>
        {primaryPath.map((accountId, index) => {
          const account = accounts.find((item) => item.id === accountId);
          const outgoing = primaryPathTransactions[index];
          return (
            <div className="path-step-wrap" key={accountId}>
              <button className={`path-account ${index === 0 ? 'path-origin' : ''} ${index === primaryPath.length - 1 ? 'path-destination' : ''}`} onClick={() => onOpenTransaction(outgoing ?? primaryPathTransactions[2])} title={`Open transfer activity for ${accountId}`}>
                <span className="path-account-type">{index === 0 ? 'ORIGIN' : index === primaryPath.length - 1 ? 'BENEFICIARY' : `HOP 0${index}`}</span>
                <strong>{accountId}</strong>
                <small>{account?.owner}</small>
              </button>
              {index < primaryPath.length - 1 && outgoing && (
                <div className="path-transfer">
                  <div className="path-transfer-amount">{formatMoney(outgoing.amount)}</div>
                  <div className="path-transfer-line"><span /><ArrowRight size={13} /></div>
                  <button onClick={() => onOpenTransaction(outgoing)}>{outgoing.id}<small>{outgoing.time}</small></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="path-explain-row"><span><GitBranch size={14} /> Path confidence <b>92%</b></span><span>Risk contribution <b>+19 pts</b></span><button className="text-button" onClick={() => onOpenTransaction(primaryPathTransactions[0])}>Review first transfer <ArrowUpRight size={13} /></button></div>
    </section>
  );
}

export function AlertListPanel({
  alertsData,
  onAcknowledge,
  onDismiss,
  onOpen,
  onViewAll,
  compact = false,
}: {
  alertsData: AlertRecord[];
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpen: (alert: AlertRecord) => void;
  onViewAll: () => void;
  compact?: boolean;
}) {
  const displayed = (compact ? alertsData.filter((alert) => alert.status !== 'Resolved').slice(0, 3) : alertsData.filter((alert) => alert.status !== 'Resolved'));
  return (
    <section className="panel alert-panel">
      <div className="panel-heading">
        <div><div className="eyebrow">REQUIRES ATTENTION</div><h2>Alert center <span className="heading-count">{alertsData.filter((alert) => alert.status === 'New').length} new</span></h2></div>
        <button className="text-button" onClick={onViewAll}>View all <ChevronRight size={14} /></button>
      </div>
      <div className="alert-list">
        {displayed.map((alert) => (
          <article className={`alert-item ${alert.severity.toLowerCase()}`} key={alert.id}>
            <div className={`alert-severity-mark ${alert.severity.toLowerCase()}`}><BadgeAlert size={15} /></div>
            <div className="alert-copy">
              <div className="alert-title-line"><strong>{alert.title}</strong><span className={`severity-label ${alert.severity.toLowerCase()}`}>{alert.severity}</span></div>
              <p>{alert.description}</p>
              <div className="alert-meta"><span>{alert.id}</span><span>{alert.time}</span><button onClick={() => onOpen(alert)}>{alert.accountId}</button></div>
            </div>
            <div className="alert-actions">
              {alert.status === 'New' ? <button title="Acknowledge alert" aria-label="Acknowledge alert" onClick={() => onAcknowledge(alert.id)}><Check size={14} /></button> : <span className="acknowledged-icon" title="Acknowledged"><Check size={13} /></span>}
              <button title="Dismiss alert" aria-label="Dismiss alert" onClick={() => onDismiss(alert.id)}><X size={14} /></button>
            </div>
          </article>
        ))}
        {!displayed.length && <div className="empty-state"><ShieldCheck size={19} /><strong>All clear</strong><span>No open alerts need attention.</span></div>}
      </div>
    </section>
  );
}

export function ActivityTimeline({ events, onViewAll, limit = 6 }: { events: TimelineEvent[]; onViewAll?: () => void; limit?: number }) {
  const visibleEvents = events.slice(-limit);
  return (
    <section className="panel timeline-panel">
      <div className="panel-heading">
        <div><div className="eyebrow">CASE AUDIT TRAIL</div><h2>Investigation activity</h2></div>
        {onViewAll && <button className="icon-button panel-more" title="Open activity timeline" aria-label="Open activity timeline" onClick={onViewAll}><ArrowUpRight size={15} /></button>}
      </div>
      <ol className="timeline-list">
        {visibleEvents.map((event) => (
          <li className={`timeline-event timeline-${event.kind}`} key={event.id}>
            <span className="timeline-marker"><i /></span>
            <div className="timeline-event-copy"><div className="timeline-event-head"><strong>{event.title}</strong><time>{event.time}</time></div><p>{event.description}</p></div>
          </li>
        ))}
      </ol>
      {onViewAll && <button className="timeline-all-button" onClick={onViewAll}><Activity size={13} /> Full activity log <ArrowRight size={13} /></button>}
    </section>
  );
}

export function EvidencePanel({ items, onOpenEvidence, onViewAll, showConfidence }: { items: EvidenceRecord[]; onOpenEvidence: (item?: EvidenceRecord) => void; onViewAll: () => void; showConfidence: boolean }) {
  return (
    <section className="panel evidence-panel">
      <div className="panel-heading">
        <div className="evidence-heading-copy"><div className="eyebrow">DOCUMENTED SIGNALS</div><h2>Evidence trail <span className="heading-count">{items.length} case-linked</span></h2><p className="evidence-portfolio-note">{evidencePortfolio.totalItems} workspace items · {evidencePortfolio.addedToday} added today · {evidencePortfolio.averageConfidence}% average confidence</p></div>
        <button className="text-button" onClick={onViewAll}>View evidence <ChevronRight size={14} /></button>
      </div>
      <div className="evidence-table-wrap">
        <table className="data-table evidence-table">
          <thead><tr><th>Evidence ID</th><th>Finding</th><th>Source / related entity</th>{showConfidence && <th>Confidence</th>}<th>Observed</th><th aria-label="Open evidence" /></tr></thead>
          <tbody>
            {items.slice(0, 4).map((item) => (
              <tr key={item.id} onClick={() => onOpenEvidence(item)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpenEvidence(item); }}>
                <td><span className="mono-id">{item.id}</span></td>
                <td><span className="evidence-type"><FileCheck2 size={14} />{item.type}</span><small className="table-secondary">{item.summary}</small></td>
                <td><span className="evidence-source">{item.source}</span><small className="table-secondary">{item.relatedEntity}</small></td>
                {showConfidence && <td><span className="confidence-value">{item.confidence}%</span><span className="confidence-bar"><i style={{ width: `${item.confidence}%` }} /></span></td>}
                <td><span className="table-secondary">{item.timestamp}</span></td>
                <td><button className="table-open-button" aria-label={`Open ${item.id}`} onClick={(event) => { event.stopPropagation(); onOpenEvidence(item); }}><ArrowUpRight size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="evidence-footer"><span><ShieldCheck size={13} /> Evidence is traceable to source relationships</span><button className="text-button" onClick={() => onOpenEvidence()}>Open evidence trail <ArrowRight size={13} /></button></div>
    </section>
  );
}

export function Dashboard(props: DashboardProps) {
  return (
    <div className="dashboard-page">
      <div className="page-heading dashboard-page-heading">
        <div><div className="eyebrow page-eyebrow">FRIDAY, 02 OCTOBER 2026 <span className="heading-divider">/</span> DEMO WORKSPACE</div><h1>Investigation overview</h1><p>Monitor connected activity and move from signal to evidence.</p></div>
        <div className="page-heading-actions">
          <button className={`button button-secondary ${props.savedView ? 'is-saved' : ''}`} onClick={props.onSaveView}>{props.savedView ? <Check size={15} /> : <Bookmark size={15} />}{props.savedView ? 'View saved' : 'Save view'}</button>
          <button className="button button-primary" onClick={props.onNewInvestigation}><Plus size={16} /> New investigation</button>
        </div>
      </div>

      <div className="stats-grid" aria-label="Workspace overview metrics">{overviewMetrics.map((item) => <StatCard key={item.label} item={item} />)}</div>
      <CaseBrief onNavigate={props.onNavigate} onGenerateReport={props.onGenerateReport} />

      <div className="dashboard-columns">
        <div className="dashboard-primary-column">
          <GraphExplorer selectedNodeId={props.selectedNodeId} onSelectNode={props.onSelectNode} traceActive={props.traceActive} onToggleTrace={props.onToggleTrace} onNavigate={props.onNavigate} />
          <MoneyPathPanel traceActive={props.traceActive} onToggleTrace={props.onToggleTrace} onOpenTransaction={props.onOpenTransaction} />
        </div>
        <div className="dashboard-side-column">
          <RiskBreakdown compact />
          <AlertListPanel alertsData={props.alertsData} onAcknowledge={props.onAcknowledgeAlert} onDismiss={props.onDismissAlert} onOpen={props.onOpenAlert} onViewAll={() => props.onNavigate('alerts')} compact />
          <ActivityTimeline events={props.timelineData} onViewAll={() => props.onNavigate('activity')} />
        </div>
      </div>

      <EvidencePanel items={evidenceRows} onOpenEvidence={props.onOpenEvidence} onViewAll={() => props.onNavigate('evidence')} showConfidence={props.showConfidence} />
      <div className="dashboard-footer-note"><span><TrendingUp size={14} /> Ring score reflects graph-derived evidence and analyst review context.</span><button className="text-button" onClick={props.onGenerateReport}>Generate case report <ArrowUpRight size={13} /></button></div>
    </div>
  );
}

