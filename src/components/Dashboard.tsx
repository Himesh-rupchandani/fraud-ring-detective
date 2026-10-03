import {
  Activity, ArrowRight, ArrowUp, ArrowUpRight, BadgeAlert, Bookmark, Check,
  ChevronRight, CircleAlert, CircleDollarSign, CircleDot, FileCheck2, Fingerprint, GitBranch, Network,
  Route, ShieldAlert, ShieldCheck, TrendingUp, WalletCards, X,
  type LucideIcon,
} from 'lucide-react';
import { accounts, evidence as evidenceRows, evidencePortfolio, investigations, overviewMetrics, primaryPath, primaryPathTransactions, riskFactors } from '../data/mockData';
import type { AlertRecord, EvidenceRecord, OverviewMetric, TimelineEvent, TransactionRecord, ViewId } from '../types';
import { formatMoney } from '../utils';
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
  /* A leading "+" in `detail` marks a genuine upward movement; anything else is
     contextual copy and stays neutral. Data itself is untouched. */
  const isUp = item.detail.trim().startsWith('+');
  return (
    <article className={`stat-card stat-${item.tone}`}>
      <span className="stat-icon"><Icon size={21} strokeWidth={2} /></span>
      <div className="stat-card-content">
        <div className="stat-card-top"><span>{item.label}</span></div>
        <div className="stat-main">
          <strong>{item.value}</strong>
          {isUp
            ? <span className="stat-trend up"><ArrowUp size={12} strokeWidth={2.8} aria-hidden="true" />{item.detail.replace(/^\+/, '')}</span>
            : <span className="stat-delta">{item.detail}</span>}
        </div>
        <div className="stat-foot">{item.foot}</div>
      </div>
      <ChevronRight className="stat-arrow" size={16} aria-hidden="true" />
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
  const activeCase = investigations[0];
  const newAlerts = alertsData.filter((alert) => alert.status === 'New').length;
  const sparkLine = 'M0 60 L24 54 L48 58 L72 46 L96 50 L120 38 L144 44 L168 32 L192 36 L216 26 L240 30 L264 20 L288 24 L320 12';
  const sparkArea = `${sparkLine} L320 78 L0 78 Z`;

  return (
    <section className="hero-banner" aria-label="Fraud-ring investigation workspace">
      <div className="hero-surface">
        <div className="hero-copy">
          <div className="hero-badge-row">
            <span className="hero-badge"><TrendingUp size={14} /> Fraud-ring investigation workspace</span>
            <button className="hero-save-view" onClick={onSaveView} aria-pressed={savedView}>
              {savedView ? <Check size={13} /> : <Bookmark size={13} />}
              {savedView ? 'View saved' : 'Save view'}
            </button>
          </div>
          <h1>Detect Fraud Rings.<br /><span>Protect What Matters.</span></h1>
          <p>Follow account, device and transfer links across the network, weigh explainable risk factors, and keep every finding tied to its evidence.</p>
          <div className="hero-actions">
            <button className="hero-cta-primary" onClick={onNewInvestigation}><ShieldCheck size={16} /> Start investigation <ArrowRight size={15} /></button>
            <button className="hero-cta-secondary" onClick={() => onNavigate('moneyPaths')}><GitBranch size={16} /> Trace money path</button>
          </div>
          <div className="hero-facts">
            <div><span className="hero-fact-icon"><Network size={17} /></span><strong>{activeCase.entities} entities</strong><small>Linked in this case graph</small></div>
            <div><span className="hero-fact-icon"><FileCheck2 size={17} /></span><strong>{evidencePortfolio.totalItems} evidence items</strong><small>Average confidence {evidencePortfolio.averageConfidence}%</small></div>
            <div><span className="hero-fact-icon"><ShieldCheck size={17} /></span><strong>Explainable score</strong><small>Seven weighted factors</small></div>
          </div>
        </div>

        <div className="hero-snapshot" role="img" aria-label="Current case graph: seven accounts linked by a three-hop transfer path through four devices and three network addresses">
          <div className="hero-snapshot-head">
            <span className="eyebrow">CASE GRAPH SNAPSHOT</span>
            <span className="hero-snapshot-meta">{activeCase.entities} entities · {activeCase.transactions} transfers</span>
          </div>
          <svg viewBox="0 0 320 292" aria-hidden="true" className="hero-snapshot-svg">
            <defs>
              <marker id="heroPathArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#b0590a" />
              </marker>
            </defs>

            {/* concentric guide rings — read as a graph viewport, not decoration */}
            <circle cx="160" cy="146" r="60" className="snap-ring" />
            <circle cx="160" cy="146" r="100" className="snap-ring dashed" />
            <circle cx="160" cy="146" r="136" className="snap-ring faint" />

            {/* supporting links */}
            <g className="snap-links">
              <line x1="160" y1="146" x2="95" y2="80" />
              <line x1="160" y1="146" x2="245" y2="96" />
              <line x1="160" y1="146" x2="72" y2="196" />
              <line x1="160" y1="146" x2="250" y2="212" />
              <line x1="95" y1="80" x2="52" y2="146" />
              <line x1="245" y1="96" x2="272" y2="164" />
              <line x1="250" y1="212" x2="176" y2="262" />
            </g>

            {/* the traced three-hop money path */}
            <g className="snap-path">
              <line x1="160" y1="146" x2="95" y2="80" markerEnd="url(#heroPathArrow)" />
              <line x1="95" y1="80" x2="245" y2="96" markerEnd="url(#heroPathArrow)" />
              <line x1="245" y1="96" x2="250" y2="212" markerEnd="url(#heroPathArrow)" />
            </g>

            {/* supporting entities */}
            <g className="snap-node minor">
              <rect x="46" y="140" width="12" height="12" rx="3" />
              <text x="52" y="168" textAnchor="middle">DV-88F1</text>
            </g>
            <g className="snap-node minor ip">
              <path d="M 272 158 l 6 3.5 v 7 l -6 3.5 -6 -3.5 v -7 z" />
              <text x="272" y="186" textAnchor="middle">103.91.44.18</text>
            </g>
            <g className="snap-node minor">
              <rect x="252" y="168" width="12" height="12" rx="3" />
              <text x="258" y="196" textAnchor="middle">DV-9D04</text>
            </g>
            <g className="snap-node minor">
              <rect x="170" y="256" width="12" height="12" rx="3" />
              <text x="176" y="284" textAnchor="middle">DV-0A73</text>
            </g>
            <g className="snap-node minor plain">
              <circle cx="66" cy="196" r="6" />
              <text x="66" y="224" textAnchor="middle">ACC-310442</text>
            </g>

            {/* money path accounts, in order */}
            <g className="snap-node origin">
              <circle cx="160" cy="146" r="19" />
              <text className="snap-glyph" x="160" y="151.5" textAnchor="middle">01</text>
              <text x="160" y="122" textAnchor="middle">ACC-849201</text>
            </g>
            <g className="snap-node hop">
              <circle cx="95" cy="80" r="15" />
              <text className="snap-glyph" x="95" y="84.5" textAnchor="middle">02</text>
              <text x="95" y="56" textAnchor="middle">ACC-928312</text>
            </g>
            <g className="snap-node hop">
              <circle cx="245" cy="96" r="15" />
              <text className="snap-glyph" x="245" y="100.5" textAnchor="middle">03</text>
              <text x="245" y="72" textAnchor="middle">ACC-113829</text>
            </g>
            <g className="snap-node sink">
              <circle cx="250" cy="212" r="17" />
              <text className="snap-glyph" x="250" y="216.5" textAnchor="middle">04</text>
              <text x="250" y="244" textAnchor="middle">ACC-774201</text>
            </g>
          </svg>
          <div className="hero-snapshot-foot">
            <span className="snap-legend"><i className="snap-dot origin" />Origin</span>
            <span className="snap-legend"><i className="snap-dot hop" />Intermediary</span>
            <span className="snap-legend"><i className="snap-dot sink" />Destination</span>
            <span className="snap-legend"><i className="snap-line" />Supporting link</span>
          </div>
        </div>

        <aside className="hero-intel" aria-label="Current investigation snapshot">
          <div className="hero-intel-head">
            <span className="hero-intel-mark"><ShieldAlert size={20} /></span>
            <div className="hero-intel-title">
              <h3>Fraud Risk Intelligence <span className="hero-live"><i />Demo data</span></h3>
              <p>{activeCase.id} · Updated {activeCase.updated}</p>
            </div>
            <button className="hero-intel-open" onClick={() => onNavigate('alerts')} aria-label="Open fraud alerts" title="Open fraud alerts"><ArrowUpRight size={17} /></button>
          </div>
          <div className="hero-chart">
            <div className="hero-chart-head">
              <span>Traced value · last 14 days</span>
              <div className="hero-chart-pill">
                <strong>{formatMoney(activeCase.amount)}</strong>
                <em>▲ 24%</em>
              </div>
            </div>
            <svg className="hero-spark" viewBox="0 0 320 78" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4d8dfb" stopOpacity=".45" />
                  <stop offset="100%" stopColor="#4d8dfb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g className="hero-spark-grid">
                <line x1="0" y1="20" x2="320" y2="20" />
                <line x1="0" y1="42" x2="320" y2="42" />
                <line x1="0" y1="64" x2="320" y2="64" />
              </g>
              <path className="hero-spark-area" d={sparkArea} fill="url(#heroSparkFill)" />
              <path className="hero-spark-line" d={sparkLine} />
              <circle className="hero-spark-dot" cx="320" cy="12" r="3.4" />
            </svg>
            <small className="hero-chart-note">Illustrative trend · synthetic records</small>
          </div>
          <div className="hero-tiles">
            <div className="hero-tile tile-alerts">
              <span className="hero-tile-icon"><BadgeAlert size={15} /></span>
              <span className="hero-tile-label">New alerts</span>
              <strong>{String(newAlerts).padStart(2, '0')}</strong>
              <span className="hero-tile-delta down">▼ 32% <em>vs. last week</em></span>
            </div>
            <div className="hero-tile tile-transfers">
              <span className="hero-tile-icon"><WalletCards size={15} /></span>
              <span className="hero-tile-label">Linked transfers</span>
              <strong>{activeCase.transactions}</strong>
              <span className="hero-tile-delta up">▲ 18% <em>vs. last week</em></span>
            </div>
            <div className="hero-tile tile-value">
              <span className="hero-tile-icon"><CircleDollarSign size={15} /></span>
              <span className="hero-tile-label">Traced value</span>
              <strong>{formatMoney(activeCase.amount)}</strong>
              <span className="hero-tile-delta up">▲ 24% <em>vs. last month</em></span>
            </div>
          </div>
        </aside>
      </div>

      <div className="hero-band">
        <div className="hero-band-items">
          <div><span className="hero-band-icon"><Route size={18} /></span><strong>Network-first review</strong><small>Follow funds across linked accounts</small></div>
          <div><span className="hero-band-icon"><CircleDollarSign size={18} /></span><strong>Explainable scoring</strong><small>Seven weighted, visible factors</small></div>
          <div><span className="hero-band-icon"><FileCheck2 size={18} /></span><strong>Evidence-backed</strong><small>Every finding links to source records</small></div>
          <div><span className="hero-band-icon"><ShieldCheck size={18} /></span><strong>Human verdict</strong><small>The analyst decides, not the score</small></div>
        </div>
        <div className="hero-band-tagline" aria-hidden="true"><span>Detect</span><em>→</em><span>Trace</span><em>→</em><span>Verify</span></div>
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
    ...overviewMetrics,
    {
      label: 'New fraud alerts',
      value: String(newAlertCount).padStart(2, '0'),
      detail: 'Awaiting triage',
      foot: 'Review priority signals',
      icon: 'cases',
      tone: 'red',
    },
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
      <div className="dashboard-footer-note"><span><TrendingUp size={14} /> Ring score reflects graph-derived evidence and analyst review context.</span><button className="text-button" onClick={props.onGenerateReport}>Generate case report <ArrowUpRight size={13} /></button></div>
    </div>
  );
}

