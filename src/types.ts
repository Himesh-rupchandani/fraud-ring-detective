export type ViewId =
  | 'dashboard'
  | 'investigations'
  | 'rings'
  | 'graph'
  | 'moneyPaths'
  | 'transactions'
  | 'accounts'
  | 'devices'
  | 'evidence'
  | 'alerts'
  | 'reports'
  | 'risk'
  | 'activity'
  | 'settings';

export type NodeType = 'account' | 'person' | 'device' | 'ip';
export type EdgeType = 'owns' | 'transfer' | 'device' | 'ip';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  riskScore?: number;
  status?: string;
  owner?: string;
  location?: string;
  opened?: string;
  provider?: string;
  note?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  transactionId?: string;
  amount?: number;
  time?: string;
  suspicious?: boolean;
}

export interface AccountRecord {
  id: string;
  owner: string;
  bank: string;
  opened: string;
  riskScore: number;
  status: 'Critical' | 'High' | 'Elevated' | 'Monitored';
  location: string;
  deviceIds: string[];
  ipIds: string[];
  transactionCount: number;
  suspiciousAmount: number;
}

export interface TransactionRecord {
  id: string;
  from: string;
  to: string;
  amount: number;
  time: string;
  date: string;
  riskScore: number;
  status: 'Flagged' | 'Reviewed' | 'Cleared';
  channel: string;
  location: string;
}

export interface InvestigationRecord {
  id: string;
  title: string;
  status: 'Under investigation' | 'Review pending' | 'Monitoring' | 'Closed';
  risk: Severity;
  score: number;
  primaryAccount: string;
  investigator: string;
  updated: string;
  entities: number;
  transactions: number;
  amount: number;
}

export interface AlertRecord {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  time: string;
  accountId: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
}

export interface EvidenceRecord {
  id: string;
  type: string;
  source: string;
  confidence: number;
  timestamp: string;
  relatedEntity: string;
  summary: string;
  finding: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  kind: 'detection' | 'analysis' | 'path' | 'evidence' | 'review';
}

export interface RiskFactor {
  label: string;
  points: number;
  explanation: string;
}

export interface WorkspacePreferences {
  liveStatus: boolean;
  showConfidence: boolean;
  compactTables: boolean;
}

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  kind: 'account' | 'person' | 'device' | 'ip' | 'transaction' | 'investigation';
  view: ViewId;
}
