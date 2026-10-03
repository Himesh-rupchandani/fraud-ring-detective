import { useEffect, useMemo, useState } from 'react';
import { Check, Info, X } from 'lucide-react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WorkspacePages } from './components/WorkspacePages';
import { AlertDetail, AppModal, EvidenceModal, NewInvestigationForm, ReportModal, TransactionDetail } from './components/Modals';
import { accounts, alerts as initialAlerts, evidence, graphNodes, investigationId, investigations as initialInvestigations, timeline as initialTimeline, transactions } from './data/mockData';
import type { AlertRecord, EvidenceRecord, InvestigationRecord, SearchItem, TimelineEvent, TransactionRecord, ViewId, WorkspacePreferences } from './types';
import { formatMoney } from './utils';

interface ToastMessage {
  id: number;
  message: string;
  tone: 'success' | 'info';
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [viewHistory, setViewHistory] = useState<ViewId[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState('ACC-849201');
  const [traceActive, setTraceActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [pageSearchSeed, setPageSearchSeed] = useState('');
  const [savedView, setSavedView] = useState(false);
  const [preferences, setPreferences] = useState<WorkspacePreferences>({ liveStatus: true, showConfidence: true, compactTables: false });
  const [alertsData, setAlertsData] = useState<AlertRecord[]>(initialAlerts);
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>(initialTimeline);
  const [investigationsData, setInvestigationsData] = useState<InvestigationRecord[]>(initialInvestigations);
  const [modal, setModal] = useState<AppModal | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const searchItems = useMemo<SearchItem[]>(() => {
    const nodeItems: SearchItem[] = graphNodes.map((node) => ({
      id: node.id,
      title: node.type === 'person' ? node.label : node.id,
      subtitle: `${node.type === 'account' ? node.owner : node.label} · ${node.type === 'ip' ? 'IP address' : node.type}`,
      kind: node.type,
      view: 'graph',
    }));
    const transactionItems: SearchItem[] = transactions.map((transaction) => ({
      id: transaction.id,
      title: transaction.id,
      subtitle: `${transaction.from} → ${transaction.to} · ${formatMoney(transaction.amount)}`,
      kind: 'transaction',
      view: 'transactions',
    }));
    const investigationItems: SearchItem[] = investigationsData.map((investigation) => ({
      id: investigation.id,
      title: investigation.id,
      subtitle: `${investigation.title} · ${investigation.status}`,
      kind: 'investigation',
      view: 'investigations',
    }));
    return [...nodeItems, ...transactionItems, ...investigationItems];
  }, [investigationsData]);

  const searchResults = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return [];
    return searchItems.filter((item) => `${item.id} ${item.title} ${item.subtitle}`.toLowerCase().includes(term)).slice(0, 7);
  }, [searchItems, searchValue]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message: string, tone: ToastMessage['tone'] = 'success') => setToast({ id: Date.now(), message, tone });
  const navigateTo = (view: ViewId) => {
    if (view !== activeView) setViewHistory((history) => [...history, activeView]);
    setActiveView(view);
    setPageSearchSeed('');
    setSearchValue('');
  };

  const goBack = () => {
    if (!viewHistory.length) return;
    setActiveView(viewHistory[viewHistory.length - 1]);
    setViewHistory((history) => history.slice(0, -1));
    setPageSearchSeed('');
    setSearchValue('');
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (item.view !== activeView) setViewHistory((history) => [...history, activeView]);
    setActiveView(item.view);
    if (item.kind === 'account' || item.kind === 'person' || item.kind === 'device' || item.kind === 'ip') {
      setSelectedNodeId(item.id);
    } else {
      setPageSearchSeed(item.id);
    }
    setSearchValue('');
    setTraceActive(false);
  };

  const appendTimeline = (event: Omit<TimelineEvent, 'id'>) => {
    setTimelineData((current) => [...current, { ...event, id: `TL-${String(current.length + 1).padStart(2, '0')}` }]);
  };

  const handleTraceToggle = () => {
    const next = !traceActive;
    setTraceActive(next);
    if (next) appendTimeline({ time: '10:54:02', title: 'Money path highlighted', description: 'Analyst traced the three-hop route from ACC-849201 to ACC-774201.', kind: 'path' });
  };

  const handlePreferenceToggle = (key: keyof WorkspacePreferences) => {
    const next = { ...preferences, [key]: !preferences[key] };
    const settingLabels: Record<keyof WorkspacePreferences, string> = {
      liveStatus: 'System status indicators',
      showConfidence: 'Evidence confidence labels',
      compactTables: 'Compact table density',
    };
    setPreferences(next);
    notify(`${settingLabels[key]} ${next[key] ? 'enabled' : 'disabled'}.`, 'info');
  };

  const handleSaveView = () => {
    const next = !savedView;
    setSavedView(next);
    notify(next ? 'Investigation view saved to this workspace.' : 'Saved view removed.', 'success');
  };

  const acknowledgeAlert = (id: string) => {
    setAlertsData((current) => current.map((alert) => alert.id === id ? { ...alert, status: 'Acknowledged' } : alert));
    const alert = alertsData.find((item) => item.id === id);
    if (alert?.status === 'New') appendTimeline({ time: '10:54:24', title: 'Alert acknowledged', description: `${alert.id} was acknowledged by Anjali Deshmukh.`, kind: 'review' });
    notify('Alert acknowledged. The case audit trail was updated.');
  };

  const dismissAlert = (id: string) => {
    setAlertsData((current) => current.map((alert) => alert.id === id ? { ...alert, status: 'Resolved' } : alert));
    appendTimeline({ time: '10:54:38', title: 'Alert resolved', description: `${id} was moved to resolved signals by Anjali Deshmukh.`, kind: 'review' });
    notify('Alert moved to resolved signals.', 'info');
  };

  const openAlert = (alert: AlertRecord) => setModal({ type: 'alert', item: alert });
  const openEvidence = (item?: EvidenceRecord) => setModal({ type: 'evidence', item });
  const openTransaction = (item: TransactionRecord) => setModal({ type: 'transaction', item });

  const handleCreateInvestigation = ({ accountId, reason }: { accountId: string; reason: string }) => {
    const sequence = 1042 + (investigationsData.length - initialInvestigations.length) + 1;
    const newCase: InvestigationRecord = {
      id: `FR-2026-${sequence}`,
      title: reason,
      status: 'Under investigation',
      risk: 'Medium',
      score: 64,
      primaryAccount: accountId,
      investigator: 'Anjali Deshmukh',
      updated: 'Just now',
      entities: 1,
      transactions: 0,
      amount: accounts.find((account) => account.id === accountId)?.suspiciousAmount ?? 0,
    };
    setInvestigationsData((current) => [newCase, ...current]);
    setModal(null);
    navigateTo('investigations');
    setPageSearchSeed(newCase.id);
    appendTimeline({ time: '10:55:03', title: 'Investigation created', description: `${newCase.id} opened for ${accountId}: ${reason}.`, kind: 'review' });
    notify(`${newCase.id} added to the investigation queue.`);
  };

  const downloadReport = () => {
    const reportText = [
      'FRAUD SHIELD DETECTIVE · INVESTIGATION SUMMARY',
      `${investigationId} · 02 October 2026`,
      '',
      'PROVISIONAL VERDICT: High-risk connected transaction network',
      'Risk score: 94 / 100 · Evidence confidence: 93%',
      'Entities: 18 · Accounts: 7 · Devices: 4 · IP addresses: 3 · Transactions: 27',
      'Suspicious amount: ₹18.4L',
      '',
      'Evidence basis:',
      ...evidence.slice(0, 4).map((item) => `- ${item.type} (${item.confidence}%): ${item.summary}`),
      '',
      'Analyst review required. Synthetic demo data; not a real-world finding or legal conclusion.',
    ].join('\n');
    downloadTextFile(reportText, `fraud-shield-${investigationId}-report.txt`, 'text/plain');
    notify('Case report downloaded as a text file.');
  };

  const exportTransactions = () => {
    const headers = ['Transaction ID', 'From', 'To', 'Amount INR', 'Date', 'Time IST', 'Channel', 'Risk score', 'Status'];
    const lines = transactions.map((row) => [row.id, row.from, row.to, String(row.amount), row.date, row.time, row.channel, String(row.riskScore), row.status].map(csvCell).join(','));
    downloadTextFile([headers.join(','), ...lines].join('\n'), 'fraud-shield-transactions.csv', 'text/csv');
    notify('Transaction register exported as CSV.');
  };

  return (
    <Layout
      activeView={activeView}
      onNavigate={navigateTo}
      onCreateInvestigation={() => setModal({ type: 'new-investigation' })}
      onBack={goBack}
      canGoBack={viewHistory.length > 0}
      searchValue={searchValue}
      searchResults={searchResults}
      onSearchChange={setSearchValue}
      onSearchSelect={handleSearchSelect}
      notificationCount={alertsData.filter((alert) => alert.status === 'New').length}
      liveStatus={preferences.liveStatus}
      compactTables={preferences.compactTables}
    >
      {activeView === 'dashboard' ? (
        <Dashboard
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          traceActive={traceActive}
          onToggleTrace={handleTraceToggle}
          onNavigate={navigateTo}
          onOpenEvidence={openEvidence}
          onOpenTransaction={openTransaction}
          onAcknowledgeAlert={acknowledgeAlert}
          onDismissAlert={dismissAlert}
          onOpenAlert={openAlert}
          onSaveView={handleSaveView}
          savedView={savedView}
          showConfidence={preferences.showConfidence}
          onNewInvestigation={() => setModal({ type: 'new-investigation' })}
          onGenerateReport={() => setModal({ type: 'report' })}
          alertsData={alertsData}
          timelineData={timelineData}
        />
      ) : (
        <WorkspacePages
          view={activeView}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          traceActive={traceActive}
          onToggleTrace={handleTraceToggle}
          onNavigate={navigateTo}
          onOpenEvidence={openEvidence}
          onOpenTransaction={openTransaction}
          onAcknowledgeAlert={acknowledgeAlert}
          onDismissAlert={dismissAlert}
          onOpenAlert={openAlert}
          onGenerateReport={() => setModal({ type: 'report' })}
          onCreateInvestigation={() => setModal({ type: 'new-investigation' })}
          onExportTransactions={exportTransactions}
          preferences={preferences}
          onPreferenceToggle={handlePreferenceToggle}
          alertsData={alertsData}
          timelineData={timelineData}
          investigationsData={investigationsData}
          searchSeed={pageSearchSeed}
        />
      )}

      {modal?.type === 'report' && <ReportModal onClose={() => setModal(null)} onDownload={downloadReport} />}
      {modal?.type === 'new-investigation' && <NewInvestigationForm onClose={() => setModal(null)} onCreate={handleCreateInvestigation} />}
      {modal?.type === 'evidence' && <EvidenceModal item={modal.item} onClose={() => setModal(null)} />}
      {modal?.type === 'transaction' && <TransactionDetail transaction={modal.item} onClose={() => setModal(null)} />}
      {modal?.type === 'alert' && <AlertDetail alert={modal.item} onClose={() => setModal(null)} onAcknowledge={acknowledgeAlert} onOpenAccount={(accountId) => { setSelectedNodeId(accountId); navigateTo('graph'); setModal(null); }} />}
      {toast && <div className={`toast toast-${toast.tone}`} role="status" key={toast.id}><span className="toast-icon">{toast.tone === 'success' ? <Check size={15} /> : <Info size={15} />}</span><span>{toast.message}</span><button onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={14} /></button></div>}
    </Layout>
  );
}

function downloadTextFile(contents: string, filename: string, mimeType: string) {
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}
