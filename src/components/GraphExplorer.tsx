import { useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Crosshair, ExternalLink, FileCheck2, FileText, Filter, Landmark, Maximize2, Minus, MousePointer2, Network, Plus, RotateCcw, Route, Smartphone, User } from 'lucide-react';
import { accounts, graphEdges, graphNodes, primaryPath, primaryPathTransactions, riskFactors, transactions } from '../data/mockData';
import type { GraphNode, InvestigationRecord, NodeType, ViewId } from '../types';
import { formatMoney } from '../utils';

const nodeTypeLabels: Record<NodeType, string> = {
  account: 'Accounts',
  person: 'People',
  device: 'Devices',
  ip: 'IP addresses',
};

const pathTransactionIds = new Set(primaryPathTransactions.map((transaction) => transaction.id));

type SummaryTab = 'details' | 'links' | 'transactions' | 'behavior';

const summaryTabs: { id: SummaryTab; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'links', label: 'Linked IDs' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'behavior', label: 'Behavior' },
];

/* White glyph shown inside each solid node disc; colour carries the entity type. */
const nodeGlyphs: Record<NodeType, typeof User> = {
  account: Landmark,
  person: User,
  device: Smartphone,
  ip: Network,
};

interface GraphExplorerProps {
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  traceActive: boolean;
  onToggleTrace: () => void;
  onNavigate: (view: ViewId) => void;
  fullPage?: boolean;
  showInspector?: boolean;
}

interface EntityDetailPanelProps {
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onNavigate: (view: ViewId) => void;
  embedded?: boolean;
  title?: string;
  caseId?: string;
  caseRisk?: InvestigationRecord['risk'];
  onGenerateReport?: () => void;
}

export function EntityDetailPanel({ selectedNodeId, onSelectNode, onNavigate, embedded = true, title, caseId, caseRisk, onGenerateReport }: EntityDetailPanelProps) {
  const selectedNode = graphNodes.find((node) => node.id === selectedNodeId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  const relatedNodes = Array.from(new Set(relatedEdges.map((edge) => edge.source === selectedNode.id ? edge.target : edge.source)))
    .map((id) => graphNodes.find((node) => node.id === id))
    .filter((node): node is GraphNode => Boolean(node));
  const selectedAccount = accounts.find((account) => account.id === selectedNode.id);
  const selectedTransactions = selectedAccount
    ? transactions.filter((transaction) => transaction.from === selectedAccount.id || transaction.to === selectedAccount.id)
    : [];
  const entityTypeCopy = selectedNode.type === 'ip' ? 'IP ADDRESS' : selectedNode.type.toUpperCase();
  const accountConnections = selectedAccount ? relatedNodes.filter((node) => node.type === 'account').length : relatedNodes.length;
  const deviceConnections = selectedAccount ? relatedNodes.filter((node) => node.type === 'device').length : 0;
  const ipConnections = selectedAccount ? relatedNodes.filter((node) => node.type === 'ip').length : 0;
  const [summaryTab, setSummaryTab] = useState<SummaryTab>('details');

  /* The dashboard's Investigation Summary gets the structured layout; the
     graph rail keeps its denser single-column inspector. */
  if (!embedded) {
    const EntityIcon = nodeGlyphs[selectedNode.type];
    const riskTone = (selectedNode.status ?? 'unknown').toLowerCase();
    const detailRows: { label: string; value: string }[] = [
      { label: 'Linked entities', value: String(accountConnections) },
      ...(selectedNode.type === 'account'
        ? [
            { label: 'Device links', value: String(deviceConnections) },
            { label: 'IP links', value: String(ipConnections) },
            { label: 'Transactions', value: String(selectedAccount?.transactionCount ?? selectedTransactions.length) },
          ]
        : [{ label: 'Relationships', value: String(relatedEdges.length) }]),
      ...(selectedNode.riskScore !== undefined ? [{ label: 'Risk score', value: `${selectedNode.riskScore} / 100` }] : []),
      ...(selectedAccount ? [{ label: 'Suspicious amount', value: formatMoney(selectedAccount.suspiciousAmount) }] : []),
      ...(selectedNode.location ? [{ label: 'Location', value: selectedNode.location }] : []),
      ...(selectedNode.opened ? [{ label: 'Opened', value: selectedNode.opened }] : []),
    ];
    return (
      <aside className="panel entity-summary-panel" aria-live="polite">
        <div className="entity-summary-heading">
          <div className="entity-summary-title">
            <h2>{title ?? 'Investigation Summary'}</h2>
            <span className="entity-case-id">{caseId ?? 'Current selection'}</span>
          </div>
          {caseRisk && <span className={`summary-risk-badge ${caseRisk.toLowerCase()}`}>{caseRisk} risk</span>}
        </div>

        <div className="summary-entity">
          <span className={`summary-entity-icon ${selectedNode.type}`} aria-hidden="true"><EntityIcon size={21} strokeWidth={2.2} /></span>
          <span className="summary-entity-copy">
            <strong>{selectedNode.id}</strong>
            <small>{selectedNode.type === 'account' ? selectedNode.owner : selectedNode.label} · {selectedNode.status ?? entityTypeCopy}</small>
          </span>
          {selectedNode.riskScore !== undefined && (
            <svg className={`risk-donut ${riskTone}`} viewBox="0 0 42 42" role="img" aria-label={`Risk score ${selectedNode.riskScore} out of 100`}>
              <circle className="risk-donut-track" cx="21" cy="21" r="17" />
              <circle
                className="risk-donut-value"
                cx="21" cy="21" r="17"
                transform="rotate(-90 21 21)"
                pathLength={100}
                strokeDasharray={`${selectedNode.riskScore} ${100 - selectedNode.riskScore}`}
              />
              <text className="risk-donut-score" x="21" y="19" textAnchor="middle">{selectedNode.riskScore}%</text>
              <text className="risk-donut-cap" x="21" y="25" textAnchor="middle">Risk</text>
            </svg>
          )}
        </div>

        <nav className="summary-tabs" role="tablist" aria-label="Investigation summary sections">
          {summaryTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={summaryTab === tab.id}
              className={`summary-tab ${summaryTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setSummaryTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="summary-tab-body" role="tabpanel">
          {summaryTab === 'details' && (
            <dl className="summary-rows">
              {detailRows.map((row) => (
                <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
              ))}
            </dl>
          )}
          {summaryTab === 'links' && (
            <div className="entity-links-block">
              <div className="entity-links-heading"><span>Direct connections</span><small>{relatedNodes.length}</small></div>
              <div className="entity-links-list">
                {relatedNodes.slice(0, 4).map((node) => (
                  <button key={node.id} className="entity-link-row" onClick={() => onSelectNode(node.id)}>
                    <span className={`mini-node-icon ${node.type}`} />
                    <span><b>{node.label}</b><small>{node.type}</small></span>
                    <ArrowRight size={12} />
                  </button>
                ))}
                {relatedNodes.length === 0 && <p className="empty-state-small">No direct relationships in the current view.</p>}
              </div>
            </div>
          )}
          {summaryTab === 'transactions' && (
            <div className="summary-transactions">
              {selectedTransactions.slice(0, 4).map((transaction) => (
                <div className="summary-transaction" key={transaction.id}>
                  <span className="summary-transaction-main"><b>{transaction.id}</b><small>{transaction.from} → {transaction.to} · {transaction.time}</small></span>
                  <strong>{formatMoney(transaction.amount)}</strong>
                </div>
              ))}
              {!selectedTransactions.length && <p className="empty-state-small">No transfers recorded against this selection.</p>}
            </div>
          )}
          {summaryTab === 'behavior' && (
            <div className="summary-behavior">
              <p>{selectedNode.note ?? selectedNode.provider ?? 'Linked through graph evidence in the current case.'}</p>
              <div className="summary-rows">
                <div><dt>Entity type</dt><dd>{entityTypeCopy}</dd></div>
                <div><dt>Status</dt><dd>{selectedNode.status ?? 'Monitored'}</dd></div>
                <div><dt>Relationships</dt><dd>{relatedEdges.length}</dd></div>
              </div>
            </div>
          )}
        </div>

        <div className="summary-findings">
          <div className="summary-findings-head">Key findings</div>
          <ul>
            {riskFactors.slice(0, 4).map((factor) => (
              <li key={factor.label}><CheckCircle2 size={13} aria-hidden="true" />{factor.label}</li>
            ))}
          </ul>
        </div>

        {onGenerateReport && (
          <button className="summary-report-button" onClick={onGenerateReport}><FileText size={15} /> View Full Report</button>
        )}
        <button className="entity-profile-button" onClick={() => onNavigate(selectedNode.type === 'device' || selectedNode.type === 'ip' ? 'devices' : 'accounts')}>
          Open entity record <ExternalLink size={13} />
        </button>
      </aside>
    );
  }

  return (
    <aside className={`entity-detail-panel ${embedded ? '' : 'panel entity-summary-panel'}`} aria-live="polite">
      {title && (
        <div className="entity-summary-heading">
          <div className="entity-summary-title"><div className="eyebrow">{title}</div><span className="entity-case-id">{caseId ?? 'Current selection'}</span></div>
          {caseRisk && <span className={`severity-label ${caseRisk.toLowerCase()}`}>{caseRisk} risk</span>}
        </div>
      )}
      <div className="entity-detail-topline">
        <span className={`entity-type-tag ${selectedNode.type}`}>{entityTypeCopy}</span>
        {selectedNode.type === 'account' && <span className={`risk-text ${selectedNode.status?.toLowerCase()}`}>{selectedNode.status}</span>}
      </div>
      <h3 className="entity-id">{selectedNode.id}</h3>
      <p className="entity-display-name">{selectedNode.type === 'account' ? selectedNode.owner : selectedNode.label}</p>
      {selectedNode.type === 'account' && selectedNode.riskScore !== undefined ? (
        <div className={`entity-risk-box risk-${selectedNode.status?.toLowerCase() ?? 'unknown'}`}>
          <div><span>Risk score</span><strong>{selectedNode.riskScore}<small> / 100</small></strong></div>
          <div className="entity-risk-track"><span style={{ width: `${selectedNode.riskScore}%` }} /></div>
        </div>
      ) : (
        <div className="entity-note"><span>Registry note</span><p>{selectedNode.note ?? selectedNode.provider ?? 'Linked through graph evidence in the current case.'}</p></div>
      )}
      <div className="entity-stats-grid">
        <div><span>Linked entities</span><strong>{accountConnections}</strong></div>
        {selectedNode.type === 'account' ? <>
          <div><span>Device links</span><strong>{deviceConnections}</strong></div>
          <div><span>IP links</span><strong>{ipConnections}</strong></div>
          <div><span>Transactions</span><strong>{selectedAccount?.transactionCount ?? selectedTransactions.length}</strong></div>
        </> : <div><span>Relationships</span><strong>{relatedEdges.length}</strong></div>}
      </div>
      {selectedNode.type === 'account' && <div className="entity-summary-line"><span>Suspicious amount</span><strong>{formatMoney(selectedAccount?.suspiciousAmount ?? 0)}</strong></div>}
      <div className="entity-links-block">
        <div className="entity-links-heading"><span>Direct connections</span><small>{relatedNodes.length}</small></div>
        <div className="entity-links-list">
          {relatedNodes.slice(0, 4).map((node) => (
            <button key={node.id} className="entity-link-row" onClick={() => onSelectNode(node.id)}>
              <span className={`mini-node-icon ${node.type}`} />
              <span><b>{node.label}</b><small>{node.type}</small></span>
              <ArrowRight size={12} />
            </button>
          ))}
          {relatedNodes.length === 0 && <p className="empty-state-small">No direct relationships in the current view.</p>}
        </div>
      </div>
      <button className="entity-profile-button" onClick={() => onNavigate(selectedNode.type === 'device' || selectedNode.type === 'ip' ? 'devices' : 'accounts')}>
        Open entity record <ExternalLink size={13} />
      </button>
      {onGenerateReport && <button className="entity-report-button" onClick={onGenerateReport}><FileCheck2 size={14} /> View full report <ArrowUpRight size={14} /></button>}
    </aside>
  );
}

export function GraphExplorer({ selectedNodeId, onSelectNode, traceActive, onToggleTrace, onNavigate, fullPage = false, showInspector = true }: GraphExplorerProps) {
  const [visibleTypes, setVisibleTypes] = useState<Record<NodeType, boolean>>({ account: true, person: true, device: true, ip: true });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragOrigin = useRef<{ x: number; y: number; panX: number; panY: number; scaleX: number; scaleY: number } | null>(null);

  const visibleNodes = useMemo(() => graphNodes.filter((node) => visibleTypes[node.type]), [visibleTypes]);
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(() => graphEdges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)), [visibleNodeIds]);
  const selectedNode = graphNodes.find((node) => node.id === selectedNodeId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  const relatedNodes = Array.from(new Set(relatedEdges.map((edge) => edge.source === selectedNode.id ? edge.target : edge.source)))
    .map((id) => graphNodes.find((node) => node.id === id))
    .filter((node): node is GraphNode => Boolean(node));
  const connectedIds = new Set(relatedNodes.map((node) => node.id));

  const changeZoom = (amount: number) => setZoom((value) => Math.min(1.65, Math.max(0.72, Number((value + amount).toFixed(2)))));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const toggleFilter = (type: NodeType) => setVisibleTypes((current) => ({ ...current, [type]: !current[type] }));

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || (event.target as Element).closest('[data-node]')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragOrigin.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      scaleX: 900 / bounds.width,
      scaleY: 520 / bounds.height,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragOrigin.current) return;
    const origin = dragOrigin.current;
    setPan({
      x: origin.panX + (event.clientX - origin.x) * origin.scaleX,
      y: origin.panY + (event.clientY - origin.y) * origin.scaleY,
    });
  };

  const stopDragging = () => { dragOrigin.current = null; setDragging(false); };
  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.06 : -0.06);
  };

  return (
    <section className={`panel graph-panel ${fullPage ? 'graph-panel-full' : ''}`} aria-label="Fraud ring relationship graph">
      <div className="panel-heading graph-panel-heading">
        <div>
          <div className="eyebrow">RELATIONSHIP ANALYSIS</div>
          <h2>Fraud Ring Connections {fullPage && <span className="heading-count">{visibleNodes.length} entities</span>}</h2>
          <p className="panel-subtitle">Accounts, owners, devices and network signals in this case</p>
        </div>
        <div className="graph-heading-actions">
          {fullPage && <button className={`button button-secondary button-small ${traceActive ? 'button-traced' : ''}`} onClick={onToggleTrace}><Route size={14} />{traceActive ? 'Path highlighted' : 'Trace primary path'}</button>}
          <button className="button button-quiet button-small graph-export" onClick={() => onNavigate(fullPage ? 'reports' : 'graph')} title={fullPage ? 'Open investigation report' : 'Open full graph view'}><Maximize2 size={14} /><span>{fullPage ? 'Case view' : 'Graph view'}</span></button>
        </div>
      </div>
      <div className="graph-filterbar">
        <div className="graph-filter-label"><Filter size={13} /><span>Show</span></div>
        {(Object.keys(nodeTypeLabels) as NodeType[]).map((type) => (
          <button key={type} onClick={() => toggleFilter(type)} className={`filter-chip ${visibleTypes[type] ? 'filter-chip-on' : ''} ${type}`} aria-pressed={visibleTypes[type]}>
            <span className="filter-chip-dot" />{nodeTypeLabels[type]}
          </button>
        ))}
        <span className="graph-toolbar-spacer" />
      </div>

      <div className={`graph-content ${fullPage ? 'graph-content-full' : ''} ${showInspector ? '' : 'graph-content-no-inspector'}`}>
        <div className={`graph-canvas ${dragging ? 'is-dragging' : ''}`}>
          <svg
            ref={svgRef}
            viewBox="0 0 900 520"
            role="application"
            aria-label="Interactive relationship graph. Select an entity to see its details; drag the background to pan."
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onWheel={handleWheel}
          >
            <defs>
              <pattern id="graph-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#607185" opacity=".23" />
              </pattern>
              <marker id="transfer-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc9a37" />
              </marker>
              <marker id="path-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ed9a24" />
              </marker>
            </defs>
            <rect width="900" height="520" fill="url(#graph-grid)" data-graph-background="true" />
            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              <g className="graph-edges">
                {visibleEdges.map((edge) => {
                  const source = graphNodes.find((node) => node.id === edge.source);
                  const target = graphNodes.find((node) => node.id === edge.target);
                  if (!source || !target) return null;
                  const isSelectedLink = source.id === selectedNode.id || target.id === selectedNode.id;
                  const isPathEdge = edge.type === 'transfer' && Boolean(edge.transactionId && pathTransactionIds.has(edge.transactionId));
                  const focusDim = traceActive ? !isPathEdge : Boolean(selectedNodeId && !isSelectedLink);
                  const stroke = edge.type === 'transfer' ? (isPathEdge && traceActive ? '#ed9a24' : edge.suspicious ? '#dd6b61' : '#dc9a37') : edge.type === 'device' ? '#159a69' : edge.type === 'ip' ? '#8053ca' : '#4b83c7';
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;
                  return (
                    <g className={`graph-edge-group ${focusDim ? 'edge-muted' : ''} ${isPathEdge && traceActive ? 'edge-path' : ''}`} key={edge.id}>
                      <line
                        x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                        stroke={stroke}
                        strokeWidth={isPathEdge && traceActive ? 3 : edge.type === 'transfer' ? 1.8 : 1.25}
                        strokeDasharray={edge.type === 'ip' ? '4 5' : edge.type === 'owns' ? '2 5' : undefined}
                        markerEnd={edge.type === 'transfer' ? `url(#${isPathEdge && traceActive ? 'path-arrow' : 'transfer-arrow'})` : undefined}
                      >
                        <title>{edge.type === 'transfer' ? `${edge.transactionId} · ${edge.label}` : edge.label ?? edge.type}</title>
                      </line>
                      {edge.type === 'transfer' && (isPathEdge || fullPage) && (
                        <g className={`graph-edge-label ${isPathEdge && traceActive ? 'edge-label-active' : ''}`} transform={`translate(${midX} ${midY - 7})`}>
                          <rect x="-26" y="-10" width="52" height="18" rx="3" />
                          <text textAnchor="middle" y="3">{edge.label}</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
              <g className="graph-nodes">
                {visibleNodes.map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  const isConnected = connectedIds.has(node.id);
                  const isPathNode = traceActive && primaryPath.includes(node.id);
                  const nodeDimmed = traceActive
                    ? !isPathNode && !isSelected
                    : Boolean(selectedNodeId && !isSelected && !isConnected);
                  /* Radii are tuned against the rendered scale: the full-page canvas is much
     taller than the embedded one, so it magnifies the 900x520 viewBox. These
     values keep the effective on-screen node size consistent in both. */
                  const radius = (node.type === 'account' ? (showInspector ? 15 : 19) : (showInspector ? 12 : 15)) + (isSelected ? 3 : 0);
                  return (
                    <g
                      key={node.id}
                      data-node="true"
                      className={`graph-node node-${node.type} ${isSelected ? 'node-selected' : ''} ${isConnected ? 'node-connected' : ''} ${isPathNode ? 'node-path' : ''} ${nodeDimmed ? 'node-dimmed' : ''}`}
                      transform={`translate(${node.x} ${node.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.type}: ${node.label}`}
                      aria-pressed={isSelected}
                      onClick={() => onSelectNode(node.id)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectNode(node.id); } }}
                    >
                      <circle className="node-halo" r={radius + 7} />
                      <circle className="node-shape" r={radius} />
                      <g className="node-glyph" transform={`translate(${-radius * .52} ${-radius * .52})`} aria-hidden="true">
                        {(() => { const Glyph = nodeGlyphs[node.type]; return <Glyph size={radius * 1.04} strokeWidth={2.5} />; })()}
                      </g>
                      <text className="node-label" y={radius + 13} textAnchor="middle">{node.label}</text>
                      {node.type === 'account' && node.riskScore !== undefined && node.riskScore >= 90 && <circle className="critical-dot" cx={radius * .75} cy={-radius * .75} r="3.4" />}
                      <title>{`${node.type.toUpperCase()} · ${node.label}${node.riskScore ? ` · Risk ${node.riskScore}` : ''}`}</title>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
          <div className="graph-canvas-controls">
            <div className="zoom-controls" aria-label="Graph controls">
              <button onClick={() => changeZoom(0.12)} title="Zoom in" aria-label="Zoom in"><Plus size={14} /></button>
              <button onClick={() => changeZoom(-0.12)} title="Zoom out" aria-label="Zoom out"><Minus size={14} /></button>
              <button onClick={resetView} title="Reset graph view" aria-label="Reset graph view"><RotateCcw size={14} /></button>
            </div>
            <span className="graph-zoom-readout">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="graph-canvas-hint"><MousePointer2 size={12} /><span>Select node · drag to pan · scroll to zoom</span></div>
          <div className="graph-scale-indicator"><span /> Direct relationship <i /> Transfer flow</div>
        </div>

        {showInspector && <EntityDetailPanel selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} onNavigate={onNavigate} embedded />}
      </div>

      <div className="graph-footer-bar">
        <div className="graph-legend">
          <span><i className="legend-dot account" /> Account</span>
          <span><i className="legend-dot person" /> Person</span>
          <span><i className="legend-diamond" /> Device</span>
          <span><i className="legend-hex" /> IP address</span>
        </div>
        {!fullPage && <button className={`text-button graph-trace-button ${traceActive ? 'is-active' : ''}`} onClick={onToggleTrace}>{traceActive ? <Crosshair size={14} /> : <Route size={14} />}{traceActive ? 'Path highlighted' : 'Trace primary path'} <ArrowUpRight size={13} /></button>}
        {fullPage && <span className="graph-provenance">WCC component · edge weights hidden for clarity</span>}
      </div>
    </section>
  );
}
