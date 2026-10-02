import { useEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, Check, Download, FileCheck2, FileText, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { accounts, evidence, investigations } from '../data/mockData';
import type { AlertRecord, EvidenceRecord, TransactionRecord } from '../types';
import { formatMoney } from '../utils';

export type AppModal =
  | { type: 'report' }
  | { type: 'new-investigation' }
  | { type: 'evidence'; item?: EvidenceRecord }
  | { type: 'transaction'; item: TransactionRecord }
  | { type: 'alert'; item: AlertRecord };

export function ModalShell({ title, eyebrow, children, onClose, size = 'medium' }: { title: string; eyebrow?: string; children: React.ReactNode; onClose: () => void; size?: 'medium' | 'large' }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`modal-shell modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2 id="modal-title">{title}</h2></div>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </header>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
}

export function TransactionDetail({ transaction, onClose }: { transaction: TransactionRecord; onClose: () => void }) {
  return (
    <ModalShell title="Transfer record" eyebrow={transaction.id} onClose={onClose}>
      <div className="transaction-detail-status"><span className={`status-pill status-${transaction.status.toLowerCase()}`}>{transaction.status}</span><span className={`risk-score-inline ${transaction.riskScore >= 80 ? 'tone-red' : 'tone-amber'}`}>Risk {transaction.riskScore}/100</span></div>
      <div className="transaction-detail-amount"><small>TRANSFER AMOUNT</small><strong>{formatMoney(transaction.amount)}</strong><span>{transaction.date} · {transaction.time} IST</span></div>
      <div className="transaction-route-card"><div><small>SENDER</small><b>{transaction.from}</b><span>{accounts.find((account) => account.id === transaction.from)?.owner}</span></div><ArrowRight size={18} /><div><small>RECEIVER</small><b>{transaction.to}</b><span>{accounts.find((account) => account.id === transaction.to)?.owner}</span></div></div>
      <div className="modal-data-grid"><div><span>Payment rail</span><b>{transaction.channel}</b></div><div><span>Observed route</span><b>{transaction.location}</b></div><div><span>Investigation</span><b>FR-2026-1042</b></div><div><span>Review note</span><b>{transaction.status === 'Flagged' ? 'Part of traced money path' : 'Supporting network activity'}</b></div></div>
      <div className="modal-callout"><ShieldAlert size={15} /><span>Transfer values and account names are synthetic demo data. No payment was initiated.</span></div>
    </ModalShell>
  );
}

function EvidenceBody({ item }: { item: EvidenceRecord }) {
  return <>
    <div className="evidence-modal-top"><span className="evidence-modal-icon"><FileCheck2 size={17} /></span><div><span className="entity-type-tag account">{item.type.toUpperCase()}</span><h3>{item.summary}</h3></div><div className="evidence-modal-confidence"><strong>{item.confidence}%</strong><small>CONFIDENCE</small></div></div>
    <div className="evidence-finding"><div className="eyebrow">OBSERVATION</div><p>{item.finding}</p></div>
    <div className="modal-data-grid"><div><span>Evidence ID</span><b>{item.id}</b></div><div><span>Source relationship</span><b>{item.source}</b></div><div><span>Related entity</span><b>{item.relatedEntity}</b></div><div><span>Observed</span><b>{item.timestamp}</b></div></div>
    <div className="modal-callout"><ShieldCheck size={15} /><span>Confidence indicates how strongly the observed relationship supports the stated finding. It is not a probability of criminal intent.</span></div>
  </>;
}

export function EvidenceModal({ item, onClose }: { item?: EvidenceRecord; onClose: () => void }) {
  return (
    <ModalShell title={item ? 'Evidence detail' : 'Evidence trail'} eyebrow="FR-2026-1042 · AUDITABLE SIGNALS" onClose={onClose} size="large">
      {item ? <EvidenceBody item={item} /> : <div className="evidence-modal-list">{evidence.map((row) => <article key={row.id} className="evidence-modal-row"><div className="evidence-modal-row-top"><span className="mono-id">{row.id}</span><span className="confidence-value">{row.confidence}% confidence</span></div><strong>{row.type}</strong><p>{row.summary}</p><div><span>{row.source}</span><span>{row.timestamp}</span></div></article>)}</div>}
      <div className="modal-footer-note"><BadgeCheck size={14} /> Evidence links resolve to the current synthetic case graph.</div>
    </ModalShell>
  );
}

export function ReportModal({ onClose, onDownload }: { onClose: () => void; onDownload: () => void }) {
  return (
    <ModalShell title="Investigation summary" eyebrow="REPORT PREVIEW · FR-2026-1042" onClose={onClose} size="large">
      <div className="report-preview-banner"><div className="report-preview-icon"><FileText size={18} /></div><div><span className="severity-label critical">CRITICAL · 94 / 100</span><h3>High-risk connected transaction network</h3><p>Provisional finding for investigator review. Generated from the current demo case snapshot.</p></div></div>
      <div className="report-preview-metrics"><div><span>Entities</span><b>18</b></div><div><span>Accounts</span><b>07</b></div><div><span>Transfers</span><b>27</b></div><div><span>Amount</span><b>₹18.4L</b></div><div><span>Confidence</span><b>93%</b></div></div>
      <div className="report-preview-body"><div><div className="eyebrow">EVIDENCE SUMMARY</div><ul><li>Shared device relationship on DV-88F1</li><li>Shared IP use observed at 103.91.44.18</li><li>Three-hop path completed in 10m 08s</li><li>High transaction velocity relative to recent baseline</li></ul></div><div className="report-preview-disclaimer"><ShieldCheck size={16} /><p><strong>Analyst review required.</strong> This report is illustrative and uses synthetic data. It is not a final determination.</p></div></div>
      <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>Continue review</button><button className="button button-primary" onClick={onDownload}><Download size={15} /> Download report</button></div>
    </ModalShell>
  );
}

export function NewInvestigationForm({ onClose, onCreate }: { onClose: () => void; onCreate: (value: { accountId: string; reason: string }) => void }) {
  const [accountId, setAccountId] = useState('ACC-849201');
  const [reason, setReason] = useState('Graph connection review');
  const [error, setError] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accounts.some((account) => account.id === accountId.trim().toUpperCase())) {
      setError('Choose an account from the current demo registry.');
      return;
    }
    onCreate({ accountId: accountId.trim().toUpperCase(), reason: reason.trim() || 'Analyst review' });
  };
  return (
    <ModalShell title="Start an investigation" eyebrow="NEW CASE · DEMO WORKSPACE" onClose={onClose}>
      <form className="new-case-form" onSubmit={handleSubmit}>
        <p>Create a local demo case from a known account. The new item is added to the investigation queue for this session.</p>
        <label>Primary account<select value={accountId} onChange={(event) => { setAccountId(event.target.value); setError(''); }}><option value="ACC-849201">ACC-849201 · Rahul Mehta</option><option value="ACC-928312">ACC-928312 · Nisha Kapoor</option><option value="ACC-113829">ACC-113829 · Dev Malhotra</option><option value="ACC-774201">ACC-774201 · Kavya Shah</option><option value="ACC-310442">ACC-310442 · Rahul Mehta</option><option value="ACC-572190">ACC-572190 · Nisha Kapoor</option><option value="ACC-220831">ACC-220831 · Dev Malhotra</option></select></label>
        <label>Investigation reason<input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={80} /></label>
        {error && <div className="form-error">{error}</div>}
        <div className="new-case-context"><span>Current queue</span><b>{investigations.length} demo cases</b><span>Environment</span><b>Frontend only · Synthetic data</b></div>
        <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Check size={15} /> Create local case</button></div>
      </form>
    </ModalShell>
  );
}

export function AlertDetail({ alert, onClose, onAcknowledge, onOpenAccount }: { alert: AlertRecord; onClose: () => void; onAcknowledge: (id: string) => void; onOpenAccount: (accountId: string) => void }) {
  return (
    <ModalShell title="Alert details" eyebrow={alert.id} onClose={onClose}>
      <div className="alert-detail-severity"><span className={`severity-label ${alert.severity.toLowerCase()}`}>{alert.severity}</span><span className={`status-pill status-${alert.status.toLowerCase()}`}>{alert.status}</span><span>{alert.time}</span></div>
      <h3 className="alert-detail-title">{alert.title}</h3><p className="alert-detail-copy">{alert.description}</p>
      <div className="modal-data-grid"><div><span>Related account</span><b>{alert.accountId}</b></div><div><span>Investigation</span><b>FR-2026-1042</b></div><div><span>Signal source</span><b>Graph monitoring</b></div><div><span>Severity basis</span><b>Risk threshold + relationship count</b></div></div>
      <div className="modal-actions"><button className="button button-secondary" onClick={() => onOpenAccount(alert.accountId)}>Open account graph</button><button className="button button-quiet" onClick={onClose}>Close</button>{alert.status === 'New' && <button className="button button-primary" onClick={() => { onAcknowledge(alert.id); onClose(); }}><Check size={15} /> Acknowledge alert</button>}</div>
    </ModalShell>
  );
}
