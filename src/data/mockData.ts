import type {
  AccountRecord,
  AlertRecord,
  EvidenceRecord,
  GraphEdge,
  GraphNode,
  InvestigationRecord,
  OverviewMetric,
  RiskFactor,
  TimelineEvent,
  TransactionRecord,
} from '../types';

export const investigationId = 'FR-2026-1042';

export const accounts: AccountRecord[] = [
  { id: 'ACC-849201', owner: 'Rahul Mehta', bank: 'Crescent Bank', opened: '19 Feb 2025', riskScore: 94, status: 'Critical', location: 'Mumbai, IN', deviceIds: ['DV-88F1', 'DV-2C91'], ipIds: ['103.91.44.18'], transactionCount: 27, suspiciousAmount: 1840000 },
  { id: 'ACC-928312', owner: 'Nisha Kapoor', bank: 'Crescent Bank', opened: '03 Mar 2025', riskScore: 89, status: 'High', location: 'Thane, IN', deviceIds: ['DV-88F1', 'DV-0A73'], ipIds: ['103.91.44.18'], transactionCount: 21, suspiciousAmount: 635000 },
  { id: 'ACC-113829', owner: 'Dev Malhotra', bank: 'Meridian Finance', opened: '11 Jan 2025', riskScore: 87, status: 'High', location: 'Pune, IN', deviceIds: ['DV-2C91', 'DV-9D04'], ipIds: ['49.36.118.204'], transactionCount: 18, suspiciousAmount: 725000 },
  { id: 'ACC-774201', owner: 'Kavya Shah', bank: 'Northline Bank', opened: '27 Apr 2025', riskScore: 82, status: 'High', location: 'Navi Mumbai, IN', deviceIds: ['DV-0A73', 'DV-9D04'], ipIds: ['49.36.118.204'], transactionCount: 16, suspiciousAmount: 215000 },
  { id: 'ACC-310442', owner: 'Rahul Mehta', bank: 'Meridian Finance', opened: '08 Aug 2024', riskScore: 68, status: 'Elevated', location: 'Mumbai, IN', deviceIds: [], ipIds: ['172.16.4.22'], transactionCount: 12, suspiciousAmount: 0 },
  { id: 'ACC-572190', owner: 'Nisha Kapoor', bank: 'Crescent Bank', opened: '14 May 2025', riskScore: 61, status: 'Elevated', location: 'Thane, IN', deviceIds: [], ipIds: ['172.16.4.22'], transactionCount: 9, suspiciousAmount: 0 },
  { id: 'ACC-220831', owner: 'Dev Malhotra', bank: 'Northline Bank', opened: '06 Dec 2024', riskScore: 56, status: 'Monitored', location: 'Pune, IN', deviceIds: [], ipIds: ['172.16.4.22'], transactionCount: 7, suspiciousAmount: 0 },
];

export const graphNodes: GraphNode[] = [
  { id: 'ACC-849201', label: 'ACC-849201', type: 'account', x: 359, y: 198, riskScore: 94, status: 'Critical', owner: 'Rahul Mehta', location: 'Mumbai, IN', opened: '19 Feb 2025' },
  { id: 'ACC-928312', label: 'ACC-928312', type: 'account', x: 499, y: 126, riskScore: 89, status: 'High', owner: 'Nisha Kapoor', location: 'Thane, IN', opened: '03 Mar 2025' },
  { id: 'ACC-113829', label: 'ACC-113829', type: 'account', x: 525, y: 290, riskScore: 87, status: 'High', owner: 'Dev Malhotra', location: 'Pune, IN', opened: '11 Jan 2025' },
  { id: 'ACC-774201', label: 'ACC-774201', type: 'account', x: 680, y: 228, riskScore: 82, status: 'High', owner: 'Kavya Shah', location: 'Navi Mumbai, IN', opened: '27 Apr 2025' },
  { id: 'ACC-310442', label: 'ACC-310442', type: 'account', x: 355, y: 72, riskScore: 68, status: 'Elevated', owner: 'Rahul Mehta', location: 'Mumbai, IN', opened: '08 Aug 2024' },
  { id: 'ACC-572190', label: 'ACC-572190', type: 'account', x: 676, y: 69, riskScore: 61, status: 'Elevated', owner: 'Nisha Kapoor', location: 'Thane, IN', opened: '14 May 2025' },
  { id: 'ACC-220831', label: 'ACC-220831', type: 'account', x: 680, y: 393, riskScore: 56, status: 'Monitored', owner: 'Dev Malhotra', location: 'Pune, IN', opened: '06 Dec 2024' },
  { id: 'P-29101', label: 'Rahul Mehta', type: 'person', x: 180, y: 181, note: 'Beneficial owner of 2 linked accounts' },
  { id: 'P-33804', label: 'Nisha Kapoor', type: 'person', x: 437, y: 42, note: 'Beneficial owner of 2 linked accounts' },
  { id: 'P-77311', label: 'Dev Malhotra', type: 'person', x: 208, y: 356, note: 'Beneficial owner of 2 linked accounts' },
  { id: 'P-29182', label: 'Kavya Shah', type: 'person', x: 836, y: 230, note: 'Beneficial owner of 1 linked account' },
  { id: 'DV-88F1', label: 'DV-88F1', type: 'device', x: 128, y: 73, provider: 'Android · fingerprint match' },
  { id: 'DV-2C91', label: 'DV-2C91', type: 'device', x: 128, y: 282, provider: 'iOS · shared session token' },
  { id: 'DV-0A73', label: 'DV-0A73', type: 'device', x: 535, y: 454, provider: 'Android · emulator indicators' },
  { id: 'DV-9D04', label: 'DV-9D04', type: 'device', x: 838, y: 390, provider: 'Windows · browser fingerprint' },
  { id: '103.91.44.18', label: '103.91.44.18', type: 'ip', x: 85, y: 437, provider: 'Mumbai · residential proxy' },
  { id: '49.36.118.204', label: '49.36.118.204', type: 'ip', x: 842, y: 70, provider: 'Pune · mobile carrier' },
  { id: '172.16.4.22', label: '172.16.4.22', type: 'ip', x: 314, y: 474, provider: 'Private relay · 3 account links' },
];

export const transactions: TransactionRecord[] = [
  { id: 'TX-779421', from: 'ACC-849201', to: 'ACC-928312', amount: 480000, time: '10:31:08', date: '02 Oct 2026', riskScore: 96, status: 'Flagged', channel: 'IMPS', location: 'Mumbai → Thane' },
  { id: 'TX-779432', from: 'ACC-928312', to: 'ACC-113829', amount: 635000, time: '10:36:42', date: '02 Oct 2026', riskScore: 94, status: 'Flagged', channel: 'NEFT', location: 'Thane → Pune' },
  { id: 'TX-779440', from: 'ACC-113829', to: 'ACC-774201', amount: 725000, time: '10:41:16', date: '02 Oct 2026', riskScore: 92, status: 'Flagged', channel: 'IMPS', location: 'Pune → Navi Mumbai' },
  { id: 'TX-779417', from: 'ACC-310442', to: 'ACC-849201', amount: 225000, time: '09:58:53', date: '02 Oct 2026', riskScore: 77, status: 'Reviewed', channel: 'UPI', location: 'Mumbai → Mumbai' },
  { id: 'TX-779451', from: 'ACC-774201', to: 'ACC-572190', amount: 205000, time: '10:47:20', date: '02 Oct 2026', riskScore: 81, status: 'Reviewed', channel: 'IMPS', location: 'Navi Mumbai → Thane' },
  ...Array.from({ length: 22 }, (_, index) => {
    const ids = accounts.map((account) => account.id);
    const fromIndex = (index * 3 + 1) % ids.length;
    const toIndex = (fromIndex + 1 + (index % 3)) % ids.length;
    const amount = 18500 + ((index * 37913 + 27300) % 318000);
    const minute = String(5 + index).padStart(2, '0');
    return {
      id: `TX-${779500 + index}`,
      from: ids[fromIndex],
      to: ids[toIndex],
      amount,
      time: `09:${minute}:${String((index * 17) % 60).padStart(2, '0')}`,
      date: '02 Oct 2026',
      riskScore: 32 + ((index * 13) % 59),
      status: index % 4 === 0 ? 'Reviewed' as const : 'Cleared' as const,
      channel: ['UPI', 'IMPS', 'NEFT', 'RTGS'][index % 4],
      location: ['Mumbai → Thane', 'Pune → Mumbai', 'Navi Mumbai → Pune', 'Thane → Mumbai'][index % 4],
    };
  }),
];

export const overviewMetrics: OverviewMetric[] = [
  { label: 'Active investigations', value: '14', detail: '+2 this week', foot: '3 require review', icon: 'cases', tone: 'blue' },
  { label: 'Fraud rings detected', value: '06', detail: '+1 today', foot: '2 new this week', icon: 'rings', tone: 'amber' },
  { label: 'High-risk accounts', value: '23', detail: '+8.2%', foot: 'Across 4 corridors', icon: 'accounts', tone: 'red' },
  { label: 'Exposure under review', value: '₹2.84Cr', detail: '184 flagged transfers', foot: '₹41.2L this week · 16 new today', icon: 'exposure', tone: 'amber' },
];

export const evidencePortfolio = { totalItems: 316, averageConfidence: 93, addedToday: 12 };

export const graphEdges: GraphEdge[] = [
  { id: 'own-rahul-1', source: 'P-29101', target: 'ACC-849201', type: 'owns', label: 'owns' },
  { id: 'own-rahul-2', source: 'P-29101', target: 'ACC-310442', type: 'owns', label: 'owns' },
  { id: 'own-nisha-1', source: 'P-33804', target: 'ACC-928312', type: 'owns', label: 'owns' },
  { id: 'own-nisha-2', source: 'P-33804', target: 'ACC-572190', type: 'owns', label: 'owns' },
  { id: 'own-dev-1', source: 'P-77311', target: 'ACC-113829', type: 'owns', label: 'owns' },
  { id: 'own-dev-2', source: 'P-77311', target: 'ACC-220831', type: 'owns', label: 'owns' },
  { id: 'own-kavya-1', source: 'P-29182', target: 'ACC-774201', type: 'owns', label: 'owns' },
  { id: 'tx-edge-779417', source: 'ACC-310442', target: 'ACC-849201', type: 'transfer', label: '₹2.25L', transactionId: 'TX-779417', amount: 225000, time: '09:58:53' },
  { id: 'tx-edge-779421', source: 'ACC-849201', target: 'ACC-928312', type: 'transfer', label: '₹4.80L', transactionId: 'TX-779421', amount: 480000, time: '10:31:08', suspicious: true },
  { id: 'tx-edge-779432', source: 'ACC-928312', target: 'ACC-113829', type: 'transfer', label: '₹6.35L', transactionId: 'TX-779432', amount: 635000, time: '10:36:42', suspicious: true },
  { id: 'tx-edge-779440', source: 'ACC-113829', target: 'ACC-774201', type: 'transfer', label: '₹7.25L', transactionId: 'TX-779440', amount: 725000, time: '10:41:16', suspicious: true },
  { id: 'tx-edge-779451', source: 'ACC-774201', target: 'ACC-572190', type: 'transfer', label: '₹2.05L', transactionId: 'TX-779451', amount: 205000, time: '10:47:20' },
  { id: 'dev-849-88', source: 'ACC-849201', target: 'DV-88F1', type: 'device', label: 'used device' },
  { id: 'dev-928-88', source: 'ACC-928312', target: 'DV-88F1', type: 'device', label: 'used device' },
  { id: 'dev-849-2c', source: 'ACC-849201', target: 'DV-2C91', type: 'device', label: 'used device' },
  { id: 'dev-113-2c', source: 'ACC-113829', target: 'DV-2C91', type: 'device', label: 'used device' },
  { id: 'dev-928-0a', source: 'ACC-928312', target: 'DV-0A73', type: 'device', label: 'used device' },
  { id: 'dev-774-0a', source: 'ACC-774201', target: 'DV-0A73', type: 'device', label: 'used device' },
  { id: 'dev-113-9d', source: 'ACC-113829', target: 'DV-9D04', type: 'device', label: 'used device' },
  { id: 'dev-774-9d', source: 'ACC-774201', target: 'DV-9D04', type: 'device', label: 'used device' },
  { id: 'ip-849', source: 'ACC-849201', target: '103.91.44.18', type: 'ip', label: 'logged from' },
  { id: 'ip-928', source: 'ACC-928312', target: '103.91.44.18', type: 'ip', label: 'logged from' },
  { id: 'ip-113', source: 'ACC-113829', target: '49.36.118.204', type: 'ip', label: 'logged from' },
  { id: 'ip-774', source: 'ACC-774201', target: '49.36.118.204', type: 'ip', label: 'logged from' },
  { id: 'ip-310', source: 'ACC-310442', target: '172.16.4.22', type: 'ip', label: 'logged from' },
  { id: 'ip-572', source: 'ACC-572190', target: '172.16.4.22', type: 'ip', label: 'logged from' },
  { id: 'ip-220', source: 'ACC-220831', target: '172.16.4.22', type: 'ip', label: 'logged from' },
];

export const investigations: InvestigationRecord[] = [
  { id: investigationId, title: 'Layered transfer network', status: 'Under investigation', risk: 'Critical', score: 94, primaryAccount: 'ACC-849201', investigator: 'Anjali Deshmukh', updated: '10:53 IST', entities: 18, transactions: 27, amount: 1840000 },
  { id: 'FR-2026-1038', title: 'Shared-device account cluster', status: 'Review pending', risk: 'High', score: 82, primaryAccount: 'ACC-774201', investigator: 'R. Iyer', updated: '09:41 IST', entities: 11, transactions: 19, amount: 820000 },
  { id: 'FR-2026-1034', title: 'Rapid beneficiary rotation', status: 'Monitoring', risk: 'Medium', score: 67, primaryAccount: 'ACC-310442', investigator: 'M. Shah', updated: 'Yesterday', entities: 8, transactions: 13, amount: 410000 },
  { id: 'FR-2026-1029', title: 'Dormant account reactivation', status: 'Closed', risk: 'Low', score: 38, primaryAccount: 'ACC-572190', investigator: 'K. Rao', updated: '30 Sep 2026', entities: 6, transactions: 8, amount: 165000 },
];

export const fraudRings = [
  { id: investigationId, label: 'Ring 01 · Mumbai–Pune corridor', risk: 'Critical' as const, score: 94, accounts: 7, devices: 4, ips: 3, transactions: 27, amount: 1840000, confidence: 93, status: 'Under investigation' },
  { id: 'FR-2026-1038', label: 'Ring 02 · Shared-device cluster', risk: 'High' as const, score: 82, accounts: 4, devices: 3, ips: 2, transactions: 19, amount: 820000, confidence: 89, status: 'Review pending' },
  { id: 'FR-2026-1034', label: 'Ring 03 · Beneficiary rotation', risk: 'Medium' as const, score: 67, accounts: 3, devices: 2, ips: 1, transactions: 13, amount: 410000, confidence: 78, status: 'Monitoring' },
];

export const alerts: AlertRecord[] = [
  { id: 'AL-2084', severity: 'Critical', title: 'High-confidence ring detected', description: 'Four accounts moved ₹18.4L through three hops in 11 minutes.', time: '2 min ago', accountId: 'ACC-849201', status: 'New' },
  { id: 'AL-2081', severity: 'High', title: 'Shared device across accounts', description: 'Fingerprint DV-88F1 appears on two independently verified profiles.', time: '14 min ago', accountId: 'ACC-928312', status: 'New' },
  { id: 'AL-2076', severity: 'Medium', title: 'Unusual transfer velocity', description: 'Six outgoing payments exceeded the account’s 30-day baseline.', time: '38 min ago', accountId: 'ACC-113829', status: 'Acknowledged' },
  { id: 'AL-2069', severity: 'High', title: 'IP overlap identified', description: 'Two high-risk beneficiaries authenticated from the same address.', time: '1 hr ago', accountId: 'ACC-774201', status: 'New' },
];

export const evidence: EvidenceRecord[] = [
  { id: 'EV-10482', type: 'Shared device', source: 'ACC-849201 ↔ ACC-928312', confidence: 96, timestamp: '02 Oct · 10:48 IST', relatedEntity: 'DV-88F1', summary: 'Stable device fingerprint across separate account profiles.', finding: 'The same Android device fingerprint, including a matching app install signature and session token, authenticated to both accounts within a 36-hour window.' },
  { id: 'EV-10483', type: 'Shared IP address', source: 'ACC-849201 ↔ ACC-928312', confidence: 91, timestamp: '02 Oct · 10:46 IST', relatedEntity: '103.91.44.18', summary: 'Repeated access from a shared residential proxy.', finding: 'Both accounts used this address before outgoing transfers. Geolocation resolves to the Mumbai metropolitan area; proxy classification is medium confidence.' },
  { id: 'EV-10484', type: 'Transfer sequence', source: 'ACC-849201 → ACC-928312 → ACC-113829 → ACC-774201', confidence: 93, timestamp: '02 Oct · 10:43 IST', relatedEntity: 'TX-779421 · TX-779432 · TX-779440', summary: 'Funds passed through three linked accounts in under eleven minutes.', finding: 'The transfers total ₹18.4L. Amounts and timing align with a rapid layering pattern and exceed the sender accounts’ 30-day activity baseline.' },
  { id: 'EV-10486', type: 'Transaction velocity', source: 'ACC-113829', confidence: 89, timestamp: '02 Oct · 10:42 IST', relatedEntity: 'ACC-113829', summary: 'Short-interval outgoing activity after a large inbound transfer.', finding: 'Three outgoing transfers occurred within six minutes of a high-value credit, consistent with pass-through account behavior.' },
  { id: 'EV-10489', type: 'Identity relationship', source: 'P-29101 · P-33804', confidence: 78, timestamp: '02 Oct · 10:39 IST', relatedEntity: 'ACC-849201 · ACC-928312', summary: 'Beneficial-owner and access relationships increase ring connectivity.', finding: 'Owner data is synthetic demo data. Relationship confidence is based on the supplied graph links and should be independently verified.' },
];

export const riskFactors: RiskFactor[] = [
  { label: 'Multi-hop transfer pattern', points: 19, explanation: 'Three linked transfers moved ₹18.4L across the network in 10m 08s.' },
  { label: 'Transaction velocity', points: 18, explanation: 'Outbound activity is 4.2× the account’s trailing 30-day baseline.' },
  { label: 'Shared device', points: 17, explanation: 'Device DV-88F1 is linked to two accounts in the ring.' },
  { label: 'Ring connectivity', points: 14, explanation: 'Seven accounts resolve into one connected component with multiple bridges.' },
  { label: 'Shared IP address', points: 12, explanation: 'Two beneficiary accounts authenticated from 103.91.44.18.' },
  { label: 'Account age', points: 8, explanation: 'Primary account was opened 19 Feb 2025 and has a short verified history.' },
  { label: 'Geographic anomaly', points: 6, explanation: 'Access and transfer locations diverge from the normal Mumbai-only profile.' },
];

export const timeline: TimelineEvent[] = [
  { id: 'TL-01', time: '10:42:06', title: 'Fraud ring detected', description: `Connected-component scan grouped 18 entities into ${investigationId}.`, kind: 'detection' },
  { id: 'TL-02', time: '10:44:19', title: 'Graph analysis completed', description: 'Shared-device and shared-IP links raised the cluster above review threshold.', kind: 'analysis' },
  { id: 'TL-03', time: '10:46:02', title: 'Money path traced', description: 'Three-hop route found from ACC-849201 to ACC-774201.', kind: 'path' },
  { id: 'TL-04', time: '10:48:31', title: 'Shared device identified', description: 'DV-88F1 linked two independent account profiles.', kind: 'evidence' },
  { id: 'TL-05', time: '10:51:08', title: 'Risk score updated', description: 'Explainable feature contributions raised account score to 94 / 100.', kind: 'analysis' },
  { id: 'TL-06', time: '10:53:24', title: 'Evidence reviewed', description: 'Anjali Deshmukh acknowledged the shared-device evidence item.', kind: 'review' },
];

export const primaryPath = ['ACC-849201', 'ACC-928312', 'ACC-113829', 'ACC-774201'];
export const primaryPathTransactions = transactions.slice(0, 3);
export const totalSuspiciousAmount = 1840000;
