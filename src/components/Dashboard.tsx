import {
  Activity, ArrowRight, ArrowUp, ArrowUpRight, BadgeAlert, BarChart3, Bookmark, Brain, Check,
  ChevronRight, CircleAlert, CircleDot, FileCheck2, FileSpreadsheet, Fingerprint, GitBranch, Network,
  Route, Search, Share2, ShieldAlert, ShieldCheck, TrendingUp, UsersRound, WalletCards, X,
  type LucideIcon,
} from 'lucide-react';
import { accounts, evidence as evidenceRows, evidencePortfolio, investigations, primaryPath, primaryPathTransactions, riskFactors } from '../data/mockData';
import type { AlertRecord, EvidenceRecord, OverviewMetric, TimelineEvent, TransactionRecord, ViewId } from '../types';
import { formatMoney } from '../utils';
import heroShield from '../assets/hero-shield.png';
import { EntityDetailPanel, GraphExplorer } from './GraphExplorer';

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
  const isUp = item.detail.trim().startsWith('+');
  return (
    <article className={`stat-card stat-${item.tone}`}>
      <div className="stat-card-top">
        <div className="stat-icon"><Icon size={19} strokeWidth={2} /></div>
        <div className="stat-arrow">
          <ChevronRight size={13} aria-hidden="true" />
        </div>
      </div>
      <div className="stat-label">{item.label}</div>
      <div className="stat-main">
        <strong>{item.value}</strong>
        {isUp
          ? <span className="stat-trend up"><ArrowUp size={10} strokeWidth={2.8} aria-hidden="true" />{item.detail.replace(/^\+/, '')}</span>
          : <span className="stat-delta">{item.detail}</span>}
      </div>
      <div className="stat-foot">{item.foot}</div>
    </article>
  );
}

function OverviewIntelligenceBanner({
  alertsData,
  onNewInvestigation,
  onNavigate,
  onSaveView,
  savedView,
}: Pick<DashboardProps, 'alertsData' | 'onNewInvestigation' | 'onNavigate' | 'onSaveView' | 'savedView'>) {
  const newAlerts = alertsData.filter((alert) => alert.status === 'New').length;

  return (
    <section className="hero-banner" aria-label="Fraud-ring investigation workspace">
      <div className="hero-surface">
        <div className="hero-copy">
          <div className="hero-badge-row">
            <span className="hero-badge"><ShieldCheck size={13} /> FRAUD DETECTION PLATFORM</span>
            <button className="hero-save-view" onClick={onSaveView} aria-pressed={savedView}>
              {savedView ? <Check size={13} /> : <Bookmark size={13} />}
              {savedView ? 'View saved' : 'Save view'}
            </button>
          </div>
          <h1>Detect Fraud Rings.<br /><span>Protect What Matters.</span></h1>
          <p>AI-powered analytics to identify fraudulent patterns, stop money laundering, and keep your customers safe across all channels.</p>
          <div className="hero-actions">
            <button className="hero-cta-primary" onClick={onNewInvestigation}><ShieldCheck size={16} /> Start Investigation <ArrowRight size={15} /></button>
            <button className="hero-cta-secondary" onClick={() => onNavigate('alerts')}><Search size={15} /> Recent Alerts</button>
          </div>
        </div>

        <div className="hero-orbit" role="img" aria-label="Network graph of connected entities">
          <span className="hero-orbit-glow" aria-hidden="true" />
          <svg viewBox="0 0 320 320" aria-hidden="true">
            <path className="hero-orbit-arc" d="M 24 160 A 136 136 0 0 1 296 160" />
            <path className="hero-orbit-arc soft" d="M 44 206 A 116 116 0 0 0 276 206" />
            <circle className="hero-orbit-ring dashed" cx="160" cy="160" r="118" />
            <circle className="hero-orbit-dot" cx="52" cy="86" r="3.4" />
            <circle className="hero-orbit-dot" cx="268" cy="86" r="3.4" />
            <circle className="hero-orbit-dot" cx="30" cy="176" r="2.6" />
            <circle className="hero-orbit-dot" cx="292" cy="196" r="2.6" />
            <circle className="hero-orbit-dot big" cx="118" cy="284" r="4.6" />
            <circle className="hero-orbit-dot big" cx="214" cy="290" r="4.6" />
            <circle className="hero-orbit-dot" cx="160" cy="42" r="3" />
            <circle className="hero-orbit-dot" cx="84" cy="246" r="2.6" />
            <path className="hero-orbit-spark" d="M 160 20 l 7 7 -7 7 -7 -7 Z" />
            <path className="hero-orbit-spark" d="M 300 126 l 5 5 -5 5 -5 -5 Z" />
            <path className="hero-orbit-spark" d="M 18 122 l 5 5 -5 5 -5 -5 Z" />
          </svg>
          <span className="hero-core-shield"><img src={heroShield} alt="" /></span>
          <span className="hero-node hero-node-1"><FileSpreadsheet size={18} /></span>
          <span className="hero-node hero-node-2"><BarChart3 size={18} /></span>
          <span className="hero-node hero-node-3"><TrendingUp size={18} /></span>
          <span className="hero-node hero-node-4"><UsersRound size={18} /></span>
          <span className="hero-node hero-node-5"><Share2 size={18} /></span>
          <span className="hero-node hero-node-6"><ShieldAlert size={18} /></span>
          <span className="hero-node hero-node-7"><Brain size={18} /></span>
        </div>

        <aside className="hero-intel" aria-label="Current investigation snapshot">
          <div className="hero-intel-head">
            <span className="hero-intel-mark"><ShieldAlert size={18} /></span>
            <div className="hero-intel-title">
              <h3>Fraud Risk Intelligence</h3>
              <p>Real-time risk monitoring and alerts</p>
            </div>
            <button className="hero-intel-open" onClick={() => onNavigate('alerts')} aria-label="Open fraud alerts" title="Open fraud alerts"><ArrowUpRight size={15} /></button>
          </div>
          <div className="hero-intel-metrics">
            <div className="hero-metric hero-metric-red">
              <span className="hero-metric-icon">⚠</span>
              <strong>{newAlerts > 0 ? newAlerts : 12}</strong>
              <span>Active Alerts</span>
            </div>
            <div className="hero-metric hero-metric-green">
              <span className="hero-metric-icon">📊</span>
              <strong>1,402</strong>
              <span>Analyzed Transactions</span>
            </div>
            <div className="hero-metric hero-metric-blue">
              <span className="hero-metric-icon">🛡</span>
              <strong>26.3M</strong>
              <span>Monitored Amount</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
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
  const displayed = (compact ? alertsData.filter((alert) => alert.status !== 'Resolved').slice(0, 4) : alertsData.filter((alert) => alert.status !== 'Resolved'));
  /* Severity drives the row glyph; the entity itself is not typed in AlertRecord. */
  const severityIcon: Record<string, LucideIcon> = { critical: BadgeAlert, high: ShieldAlert, medium: CircleAlert, low: ShieldCheck };
  return (
    <section className="panel alert-panel">
      <div className="panel-heading">
        <div className="alert-panel-head">
          <span className="alert-panel-mark" aria-hidden="true"><BadgeAlert size={15} /></span>
          <h2>Recent fraud alerts <span className="heading-count">{alertsData.filter((alert) => alert.status === 'New').length} new</span></h2>
        </div>
        <button className="text-button" onClick={onViewAll}>View all <ChevronRight size={14} /></button>
      </div>
      <div className="alert-list">
        {displayed.map((alert) => {
          const SeverityIcon = severityIcon[alert.severity.toLowerCase()] ?? BadgeAlert;
          return (
            <article className={`alert-item ${alert.severity.toLowerCase()}`} key={alert.id}>
              <span className={`alert-severity-mark ${alert.severity.toLowerCase()}`} aria-hidden="true"><SeverityIcon size={17} /></span>
              <div className="alert-copy" title={alert.description}>
                <div className="alert-title-line">
                  <span className={`severity-label ${alert.severity.toLowerCase()}`}>{alert.severity} risk</span>
                  {alert.status !== 'New' && <span className={`status-pill status-${alert.status.toLowerCase()}`}>{alert.status}</span>}
                </div>
                <button className="alert-entity" onClick={() => onOpen(alert)}>{alert.accountId}</button>
                <p>{alert.title}</p>
              </div>
              <div className="alert-side">
                <span className="alert-time">{alert.time}</span>
                <div className="alert-actions">
                  {alert.status === 'New'
                    ? <button title="Acknowledge alert" aria-label="Acknowledge alert" onClick={() => onAcknowledge(alert.id)}><Check size={13} /></button>
                    : <span className="acknowledged-icon" title="Acknowledged"><Check size={12} /></span>}
                  <button title="Dismiss alert" aria-label="Dismiss alert" onClick={() => onDismiss(alert.id)}><X size={13} /></button>
                </div>
              </div>
              <button className="alert-open" onClick={() => onOpen(alert)} aria-label={`Open alert ${alert.id}`} title={`Open ${alert.id}`}><ChevronRight size={15} /></button>
            </article>
          );
        })}
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
  const newAlertCount = props.alertsData.filter((alert) => alert.status === 'New').length;
  const dashboardMetrics: OverviewMetric[] = [
    { label: 'Total Transactions', value: '48,320', detail: '+12%', foot: 'vs. yesterday', icon: 'cases', tone: 'blue' },
    { label: 'Identified Fraud Rings', value: '7', detail: '+40%', foot: 'vs. yesterday', icon: 'rings', tone: 'green' },
    { label: 'High Risk Cases', value: String(newAlertCount > 0 ? newAlertCount : 23), detail: '+28%', foot: 'vs. yesterday', icon: 'accounts', tone: 'amber' },
    { label: 'Blocked Amount', value: '₹12.8M', detail: '+36%', foot: 'vs. yesterday', icon: 'exposure', tone: 'teal' },
    { label: 'Detection Accuracy', value: '98.6%', detail: '+2.4%', foot: 'vs. yesterday', icon: 'cases', tone: 'slate' },
  ];

  return (
    <div className="dashboard-page">
      <OverviewIntelligenceBanner
        alertsData={props.alertsData}
        onNewInvestigation={props.onNewInvestigation}
        onNavigate={props.onNavigate}
        onSaveView={props.onSaveView}
        savedView={props.savedView}
      />
      <div className="stats-grid" aria-label="Workspace overview metrics">
        {dashboardMetrics.map((item) => <StatCard key={item.label} item={item} />)}
      </div>

      <div className="dashboard-columns dashboard-investigation-layout">
        <div className="dashboard-alert-column">
          <AlertListPanel alertsData={props.alertsData} onAcknowledge={props.onAcknowledgeAlert} onDismiss={props.onDismissAlert} onOpen={props.onOpenAlert} onViewAll={() => props.onNavigate('alerts')} compact />
        </div>
        <div className="dashboard-primary-column">
          <GraphExplorer selectedNodeId={props.selectedNodeId} onSelectNode={props.onSelectNode} traceActive={props.traceActive} onToggleTrace={props.onToggleTrace} onNavigate={props.onNavigate} showInspector={false} />
          <MoneyPathPanel traceActive={props.traceActive} onToggleTrace={props.onToggleTrace} onOpenTransaction={props.onOpenTransaction} />
        </div>
        <div className="dashboard-side-column">
          <EntityDetailPanel
            selectedNodeId={props.selectedNodeId}
            onSelectNode={props.onSelectNode}
            onNavigate={props.onNavigate}
            embedded={false}
            title="Investigation Summary"
            caseId={investigations[0].id}
            caseRisk={investigations[0].risk}
            onGenerateReport={props.onGenerateReport}
          />
          <RiskBreakdown compact />
        </div>
      </div>

      <div className="dashboard-activity-row">
        <ActivityTimeline events={props.timelineData} onViewAll={() => props.onNavigate('activity')} />
      </div>
      <EvidencePanel items={evidenceRows} onOpenEvidence={props.onOpenEvidence} onViewAll={() => props.onNavigate('evidence')} showConfidence={props.showConfidence} />

      {/* System Overview strip matching image */}
      <div className="system-overview-strip">
        <div className="system-overview-head"><span className="status-dot" /> <strong>System Overview</strong> <span className="system-overview-live">● Live</span></div>
        <div className="system-overview-items">
          <div className="system-overview-item sov-blue">
            <span className="sov-icon"><TrendingUp size={18} /></span>
            <div><strong>48,320</strong><span className="sov-trend up">↑ 12%</span></div>
            <small>Transaction Volume</small>
          </div>
          <div className="system-overview-item sov-purple">
            <span className="sov-icon"><UsersRound size={18} /></span>
            <div><strong>4,827</strong><span className="sov-trend up">↑ 18%</span></div>
            <small>New Accounts</small>
          </div>
          <div className="system-overview-item sov-green">
            <span className="sov-icon"><WalletCards size={18} /></span>
            <div><strong>36,721</strong><span className="sov-trend up">↑ 14%</span></div>
            <small>Card Checkouts</small>
          </div>
          <div className="system-overview-item sov-red">
            <span className="sov-icon"><ShieldAlert size={18} /></span>
            <div><strong>23</strong><span className="sov-trend up">↑ 28%</span></div>
            <small>Fraud Incidents</small>
          </div>
        </div>
      </div>

      <div className="dashboard-footer-note"><span><TrendingUp size={14} /> Ring score reflects graph-derived evidence and analyst review context.</span><button className="text-button" onClick={props.onGenerateReport}>Generate case report <ArrowUpRight size={13} /></button></div>
    </div>
  );
}

