import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Crosshair, ExternalLink, FileCheck2, Filter,
  Maximize2, Minus, MousePointer2, Plus, RotateCcw, Route,
} from 'lucide-react';
import { accounts, evidence, graphEdges, graphNodes, primaryPath, primaryPathTransactions, transactions } from '../data/mockData';
import type { GraphNode, NodeType, ViewId } from '../types';
import { formatMoney } from '../utils';

const nodeTypeLabels: Record<NodeType, string> = {
  account: 'Accounts',
  person: 'People',
  device: 'Devices',
  ip: 'IP addresses',
};

const pathTransactionIds = new Set(primaryPathTransactions.map((transaction) => transaction.id));

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
}

export function EntityDetailPanel({ selectedNodeId, onSelectNode, onNavigate, embedded = true, title }: EntityDetailPanelProps) {
  const selectedNode = graphNodes.find((node) => node.id === selectedNodeId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  const relatedNodes = Array.from(new Set(relatedEdges.map((edge) => edge.source === selectedNode.id ? edge.target : edge.source)))
    .map((id) => graphNodes.find((node) => node.id === id))
    .filter((node): node is GraphNode => Boolean(node));
  const selectedAccount = accounts.find((account) => account.id === selectedNode.id);
  const selectedTransactions = selectedAccount
    ? transactions.filter((transaction) => transaction.from === selectedAccount.id || transaction.to === selectedAccount.id)
    : [];
  const entityEvidence = evidence.filter(
    (item) => item.source.includes(selectedNode.id) || item.relatedEntity.includes(selectedNode.id),
  );
  const entityTypeCopy = selectedNode.type === 'ip' ? 'IP ADDRESS' : selectedNode.type.toUpperCase();
  const accountConnections = selectedAccount ? relatedNodes.filter((node) => node.type === 'account').length : relatedNodes.length;
  const deviceConnections = selectedAccount ? relatedNodes.filter((node) => node.type === 'device').length : 0;
  const ipConnections = selectedAccount ? relatedNodes.filter((node) => node.type === 'ip').length : 0;

  return (
    <aside className={`entity-detail-panel ${embedded ? '' : 'panel entity-summary-panel'}`} aria-live="polite">
      {title && (
        <div className="entity-summary-heading">
          <div>
            <div className="eyebrow">ENTITY INSPECTOR</div>
            <h2>{title}</h2>
          </div>
          <span className="inspector-badge">Active selection</span>
        </div>
      )}

      <div className="entity-header-card">
        <div className="entity-detail-topline">
          <span className={`entity-type-tag ${selectedNode.type}`}>{entityTypeCopy}</span>
          {selectedNode.type === 'account' && selectedNode.status && (
            <span className={`severity-label ${selectedNode.status.toLowerCase()}`}>
              {selectedNode.status}
            </span>
          )}
        </div>
        <h3 className="entity-id">{selectedNode.id}</h3>
        <p className="entity-display-name">
          {selectedNode.type === 'account'
            ? `${selectedNode.owner} · ${selectedAccount?.bank ?? 'Verified Institution'}`
            : selectedNode.label}
        </p>
        {selectedAccount && (
          <div className="entity-meta-subline">
            <span>{selectedAccount.location}</span>
            <span>·</span>
            <span>Opened {selectedAccount.opened}</span>
          </div>
        )}
      </div>

      {selectedNode.type === 'account' && selectedNode.riskScore !== undefined ? (
        <div className={`entity-risk-box risk-${selectedNode.status?.toLowerCase() ?? 'unknown'}`}>
          <div>
            <span>COMPOSITE RISK SCORE</span>
            <strong>{selectedNode.riskScore}<small> / 100</small></strong>
          </div>
          <div className="entity-risk-track"><span style={{ width: `${selectedNode.riskScore}%` }} /></div>
        </div>
      ) : (
        <div className="entity-note">
          <span>Registry intelligence</span>
          <p>{selectedNode.note ?? selectedNode.provider ?? 'Linked through graph evidence in the current investigation.'}</p>
        </div>
      )}

      <div className="entity-stats-grid">
        <div><span>Linked entities</span><strong>{relatedNodes.length}</strong></div>
        {selectedNode.type === 'account' ? (
          <>
            <div><span>Devices / IPs</span><strong>{deviceConnections} / {ipConnections}</strong></div>
            <div><span>Transactions</span><strong>{selectedAccount?.transactionCount ?? selectedTransactions.length}</strong></div>
            <div><span>Flagged volume</span><strong className={selectedAccount?.suspiciousAmount ? 'tone-red' : ''}>{selectedAccount?.suspiciousAmount ? formatMoney(selectedAccount.suspiciousAmount) : '₹0'}</strong></div>
          </>
        ) : (
          <div><span>Account links</span><strong>{accountConnections}</strong></div>
        )}
      </div>

      {entityEvidence.length > 0 && (
        <div className="entity-findings-block">
          <div className="entity-links-heading">
            <span>Key findings</span>
            <small>{entityEvidence.length} signals</small>
          </div>
          <div className="entity-findings-list">
            {entityEvidence.slice(0, 2).map((item) => (
              <div className="entity-finding-item" key={item.id}>
                <FileCheck2 size={13} />
                <div>
                  <strong>{item.type} <span>({item.confidence}%)</span></strong>
                  <small>{item.summary}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="entity-links-block">
        <div className="entity-links-heading">
          <span>Direct connections</span>
          <small>{relatedNodes.length} linked</small>
        </div>
        <div className="entity-links-list">
          {relatedNodes.slice(0, 5).map((node) => (
            <button key={node.id} className="entity-link-row" onClick={() => onSelectNode(node.id)}>
              <span className={`mini-node-icon ${node.type}`} />
              <span>
                <b>{node.id}</b>
                <small>{node.type === 'account' ? `${node.owner} · Account` : `${node.label} · ${node.type === 'ip' ? 'IP' : node.type}`}</small>
              </span>
              {node.riskScore !== undefined && <span className={`mini-risk-score ${node.riskScore >= 85 ? 'high' : ''}`}>{node.riskScore}</span>}
              <ArrowRight size={12} />
            </button>
          ))}
          {relatedNodes.length === 0 && <p className="empty-state-small">No direct relationships in the current view.</p>}
        </div>
      </div>

      <button
        className="entity-profile-button"
        onClick={() => onNavigate(selectedNode.type === 'device' || selectedNode.type === 'ip' ? 'devices' : 'accounts')}
      >
        <span>Open full entity record</span>
        <ExternalLink size={13} />
      </button>
    </aside>
  );
}

export function GraphExplorer({
  selectedNodeId,
  onSelectNode,
  traceActive,
  onToggleTrace,
  onNavigate,
  fullPage = false,
  showInspector = true,
}: GraphExplorerProps) {
  const [visibleTypes, setVisibleTypes] = useState<Record<NodeType, boolean>>({
    account: true,
    person: true,
    device: true,
    ip: true,
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragOrigin = useRef<{ x: number; y: number; panX: number; panY: number; scaleX: number; scaleY: number } | null>(null);

  const visibleNodes = useMemo(() => graphNodes.filter((node) => visibleTypes[node.type]), [visibleTypes]);
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(
    () => graphEdges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)),
    [visibleNodeIds],
  );
  const selectedNode = graphNodes.find((node) => node.id === selectedNodeId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  const relatedNodes = Array.from(new Set(relatedEdges.map((edge) => edge.source === selectedNode.id ? edge.target : edge.source)))
    .map((id) => graphNodes.find((node) => node.id === id))
    .filter((node): node is GraphNode => Boolean(node));
  const connectedIds = new Set(relatedNodes.map((node) => node.id));

  const changeZoom = (amount: number) =>
    setZoom((value) => Math.min(1.65, Math.max(0.72, Number((value + amount).toFixed(2)))));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
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

  const stopDragging = () => {
    dragOrigin.current = null;
    setDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.06 : -0.06);
  };

  return (
    <section className={`panel graph-panel ${fullPage ? 'graph-panel-full' : ''}`} aria-label="Fraud ring relationship graph">
      <div className="panel-heading graph-panel-heading">
        <div>
          <div className="eyebrow">NETWORK TOPOLOGY &amp; LINK ANALYSIS</div>
          <h2>Fraud relationship graph <span className="heading-count">{visibleNodes.length} entities · {visibleEdges.length} links</span></h2>
        </div>
        <div className="graph-heading-actions">
          <button
            className={`button button-secondary button-small ${traceActive ? 'button-traced' : ''}`}
            onClick={onToggleTrace}
          >
            {traceActive ? <Crosshair size={13} /> : <Route size={13} />}
            {traceActive ? 'Path highlighted' : 'Trace money path'}
          </button>
          <button
            className="button button-quiet button-small graph-export"
            onClick={() => onNavigate(fullPage ? 'reports' : 'graph')}
            title={fullPage ? 'Open investigation report' : 'Expand full graph explorer'}
          >
            <Maximize2 size={13} />
            <span>{fullPage ? 'Case report' : 'Expand'}</span>
          </button>
        </div>
      </div>

      <div className="graph-filterbar">
        <div className="graph-filter-label"><Filter size={12} /><span>Filter</span></div>
        {(Object.keys(nodeTypeLabels) as NodeType[]).map((type) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className={`filter-chip ${visibleTypes[type] ? 'filter-chip-on' : ''} ${type}`}
            aria-pressed={visibleTypes[type]}
          >
            <span className="filter-chip-dot" />
            {nodeTypeLabels[type]}
          </button>
        ))}
        <span className="graph-toolbar-spacer" />
        <div className="zoom-controls" aria-label="Graph controls">
          <button onClick={() => changeZoom(-0.12)} title="Zoom out" aria-label="Zoom out"><Minus size={13} /></button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => changeZoom(0.12)} title="Zoom in" aria-label="Zoom in"><Plus size={13} /></button>
          <button onClick={resetView} title="Reset graph view" aria-label="Reset graph view"><RotateCcw size={12} /></button>
        </div>
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
              <pattern id="graph-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
                <circle cx="14" cy="14" r="1" fill="#cbd5e1" />
              </pattern>
              <marker id="transfer-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
              </marker>
              <marker id="suspicious-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
              </marker>
              <marker id="path-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
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
                  const stroke =
                    edge.type === 'transfer'
                      ? isPathEdge && traceActive
                        ? '#d97706'
                        : edge.suspicious
                          ? '#dc2626'
                          : '#2563eb'
                      : edge.type === 'device'
                        ? '#0d9488'
                        : edge.type === 'ip'
                          ? '#64748b'
                          : '#94a3b8';
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;
                  const markerId =
                    edge.type === 'transfer'
                      ? isPathEdge && traceActive
                        ? 'path-arrow'
                        : edge.suspicious
                          ? 'suspicious-arrow'
                          : 'transfer-arrow'
                      : undefined;
                  return (
                    <g
                      className={`graph-edge-group ${focusDim ? 'edge-muted' : ''} ${isPathEdge && traceActive ? 'edge-path' : ''}`}
                      key={edge.id}
                    >
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={stroke}
                        strokeWidth={isPathEdge && traceActive ? 2.8 : edge.type === 'transfer' ? 2 : 1.35}
                        strokeDasharray={edge.type === 'ip' ? '4 4' : edge.type === 'owns' ? '2 4' : undefined}
                        markerEnd={markerId ? `url(#${markerId})` : undefined}
                      >
                        <title>{edge.type === 'transfer' ? `${edge.transactionId} · ${edge.label}` : edge.label ?? edge.type}</title>
                      </line>
                      {edge.type === 'transfer' && (isPathEdge || fullPage || isSelectedLink) && (
                        <g
                          className={`graph-edge-label ${isPathEdge && traceActive ? 'edge-label-active' : edge.suspicious ? 'edge-label-suspicious' : ''}`}
                          transform={`translate(${midX} ${midY - 8})`}
                        >
                          <rect x="-26" y="-10" width="52" height="18" rx="4" />
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
                  const radius = node.type === 'account' ? 20 : 15;
                  const isHighRiskAccount = node.type === 'account' && (node.riskScore ?? 0) >= 85;
                  return (
                    <g
                      key={node.id}
                      data-node="true"
                      className={`graph-node node-${node.type} ${isSelected ? 'node-selected' : ''} ${isConnected ? 'node-connected' : ''} ${isPathNode ? 'node-path' : ''} ${nodeDimmed ? 'node-dimmed' : ''} ${isHighRiskAccount ? 'node-high-risk' : ''}`}
                      transform={`translate(${node.x} ${node.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.type}: ${node.label}`}
                      aria-pressed={isSelected}
                      onClick={() => onSelectNode(node.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onSelectNode(node.id);
                        }
                      }}
                    >
                      <circle className="node-halo" r={radius + 7} />
                      {node.type === 'device' ? (
                        <rect className="node-shape" x="-12" y="-12" width="24" height="24" rx="4" transform="rotate(45)" />
                      ) : node.type === 'ip' ? (
                        <path className="node-shape" d="M -14 -8 L 0 -16 L 14 -8 L 14 8 L 0 16 L -14 8 Z" />
                      ) : (
                        <circle className="node-shape" r={radius} />
                      )}
                      {node.type === 'account' && node.riskScore !== undefined ? (
                        <text className="node-score-text" y="4" textAnchor="middle">{node.riskScore}</text>
                      ) : (
                        <circle className="node-core" r="3.8" />
                      )}
                      <text className="node-label" y={node.type === 'account' ? 35 : 31} textAnchor="middle">
                        {node.label}
                      </text>
                      {node.type === 'account' && node.riskScore !== undefined && node.riskScore >= 90 && (
                        <circle className="critical-dot" cx="14" cy="-14" r="4.2" />
                      )}
                      <title>{`${node.type.toUpperCase()} · ${node.label}${node.riskScore ? ` · Risk ${node.riskScore}` : ''}`}</title>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
          <div className="graph-canvas-hint">
            <MousePointer2 size={12} />
            <span>Click node to inspect · Drag to pan · Scroll to zoom</span>
          </div>
          <div className="graph-scale-indicator">
            <span className="scale-line-direct" /> Linked entity
            <i className="scale-line-transfer" /> Flagged transfer
          </div>
        </div>

        {showInspector && (
          <EntityDetailPanel
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onNavigate={onNavigate}
            embedded
            title="Entity inspector"
          />
        )}
      </div>

      <div className="graph-footer-bar">
        <div className="graph-legend">
          <span><i className="legend-dot account" /> Account (score)</span>
          <span><i className="legend-dot person" /> Beneficial owner</span>
          <span><i className="legend-diamond" /> Device ID</span>
          <span><i className="legend-hex" /> IP address</span>
          <span><i className="legend-dot critical-badge" /> Critical risk (&ge;90)</span>
        </div>
        {!fullPage && (
          <button className={`text-button graph-trace-button ${traceActive ? 'is-active' : ''}`} onClick={() => onNavigate('graph')}>
            Full graph workspace <ArrowUpRight size={13} />
          </button>
        )}
        {fullPage && <span className="graph-provenance">Connected component FR-2026-1042 · 18 nodes · 27 edges</span>}
      </div>
    </section>
  );
}
