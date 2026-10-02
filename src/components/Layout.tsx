import { useEffect, useRef, useState } from 'react';
import {
  Activity, Archive, Bell, Blocks, BriefcaseBusiness,
  ChevronDown, CircleHelp, Command, FileCheck2, FileSearch, Fingerprint,
  Gauge, GitBranch, LayoutDashboard, Menu, Network, PanelLeftClose, Search,
  Settings, ShieldAlert, ShieldCheck, SlidersHorizontal, Sparkles, UserRound,
  WalletCards, X, type LucideIcon,
} from 'lucide-react';
import { investigations } from '../data/mockData';
import type { SearchItem, ViewId } from '../types';

const activeInvestigation = investigations[0];

interface LayoutProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  onCreateInvestigation: () => void;
  searchValue: string;
  searchResults: SearchItem[];
  onSearchChange: (value: string) => void;
  onSearchSelect: (item: SearchItem) => void;
  notificationCount: number;
  liveStatus: boolean;
  compactTables: boolean;
  children: React.ReactNode;
}

interface NavigationItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
}

const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  { label: 'Workspace', items: [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'investigations', label: 'Investigations', icon: BriefcaseBusiness },
    { id: 'rings', label: 'Fraud rings', icon: ShieldAlert },
    { id: 'graph', label: 'Graph explorer', icon: Network },
    { id: 'moneyPaths', label: 'Money paths', icon: GitBranch },
  ] },
  { label: 'Intelligence', items: [
    { id: 'transactions', label: 'Transactions', icon: WalletCards },
    { id: 'accounts', label: 'Accounts', icon: UserRound },
    { id: 'devices', label: 'Devices & IPs', icon: Fingerprint },
    { id: 'evidence', label: 'Evidence', icon: FileCheck2 },
    { id: 'risk', label: 'Risk analysis', icon: Gauge },
  ] },
  { label: 'Operations', items: [
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'activity', label: 'Activity timeline', icon: Activity },
    { id: 'reports', label: 'Reports', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] },
];

const iconForSearchKind: Record<SearchItem['kind'], LucideIcon> = {
  account: UserRound,
  person: UserRound,
  device: Fingerprint,
  ip: Network,
  transaction: WalletCards,
  investigation: FileSearch,
};

function Topbar({
  onNavigate,
  searchValue,
  searchResults,
  onSearchChange,
  onSearchSelect,
  notificationCount,
  liveStatus,
  onMenuClick,
}: {
  onNavigate: (view: ViewId) => void;
  searchValue: string;
  searchResults: SearchItem[];
  onSearchChange: (value: string) => void;
  onSearchSelect: (item: SearchItem) => void;
  notificationCount: number;
  liveStatus: boolean;
  onMenuClick: () => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setStatusOpen(false);
        setProfileOpen(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <header className="topbar">
      <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={onMenuClick}>
        <Menu size={18} />
      </button>

      <div className="topbar-search-wrap">
        <div className="topbar-search">
          <Search size={15} aria-hidden="true" />
          <input
            ref={searchRef}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && searchResults[0]) onSearchSelect(searchResults[0]);
              if (event.key === 'Escape') {
                onSearchChange('');
                searchRef.current?.blur();
              }
            }}
            placeholder="Search accounts, entities, transactions, or cases…"
            aria-label="Search the investigation workspace"
          />
          {searchValue ? (
            <button className="search-clear" aria-label="Clear search" onClick={() => onSearchChange('')}>
              <X size={14} />
            </button>
          ) : (
            <span className="keyboard-shortcut"><Command size={10} /> K</span>
          )}
        </div>
        {searchValue.trim() && (
          <div className="search-results" role="listbox" aria-label="Search results">
            <div className="search-results-heading">{searchResults.length ? 'MATCHING ENTITIES & RECORDS' : 'NO MATCHES FOUND'}</div>
            {searchResults.map((item) => {
              const Icon = iconForSearchKind[item.kind];
              return (
                <button
                  className="search-result"
                  key={`${item.kind}-${item.id}`}
                  role="option"
                  aria-selected="false"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSearchSelect(item)}
                >
                  <span className={`search-result-icon ${item.kind}`}><Icon size={14} /></span>
                  <span className="search-result-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                  <span className="search-kind">{item.kind}</span>
                </button>
              );
            })}
            {!!searchResults.length && <div className="search-results-footer">Press Enter to open top match · Esc to close</div>}
          </div>
        )}
      </div>

      <div className="topbar-crumb" aria-label={`Active case ${activeInvestigation.id}`}>
        <span className="crumb-label">ACTIVE CASE</span>
        <button className="crumb-context crumb-case-id" onClick={() => onNavigate('investigations')} title="View investigation queue">
          {activeInvestigation.id}
        </button>
        <span className={`topbar-case-risk ${activeInvestigation.risk.toLowerCase()}`}>
          <i />{activeInvestigation.risk} · {activeInvestigation.score}
        </span>
      </div>

      <div className="topbar-actions">
        {liveStatus && (
          <div className="status-popover-wrap">
            <button
              className="system-status demo-status"
              onClick={() => { setStatusOpen((open) => !open); setProfileOpen(false); }}
              aria-expanded={statusOpen}
              aria-label="Demo data status"
            >
              <span className="status-dot demo-status-dot" />
              <span>Engine Online · Demo Data</span>
            </button>
            {statusOpen && (
              <div className="mini-popover status-popover">
                <div className="popover-heading"><Sparkles size={14} /> Demonstration environment</div>
                <div className="status-row"><span>Graph source</span><b>Local sample data</b></div>
                <div className="status-row"><span>Risk method</span><b>Explainable rules</b></div>
                <div className="status-row"><span>Live services</span><b>Not connected</b></div>
                <small>Synthetic records only. This workspace operates on deterministic client-side data.</small>
              </div>
            )}
          </div>
        )}
        <button
          className="icon-button notification-button"
          aria-label={`Open alerts, ${notificationCount} new`}
          onClick={() => onNavigate('alerts')}
          title="Operational alerts"
        >
          <Bell size={16} />
          {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
        </button>
        <span className="topbar-divider" />
        <div className="profile-popover-wrap">
          <button
            className="profile-button"
            onClick={() => { setProfileOpen((open) => !open); setStatusOpen(false); }}
            aria-expanded={profileOpen}
          >
            <span className="profile-avatar">AD</span>
            <span className="profile-text">
              <strong>Anjali Deshmukh</strong>
              <small>Senior Investigator</small>
            </span>
            <ChevronDown size={13} />
          </button>
          {profileOpen && (
            <div className="mini-popover profile-popover">
              <div className="profile-card-head">
                <span className="profile-avatar large">AD</span>
                <span><strong>Anjali Deshmukh</strong><small>Senior Investigator · IN-West</small></span>
              </div>
              <button onClick={() => { setProfileOpen(false); onNavigate('settings'); }}>
                <SlidersHorizontal size={14} /> Workspace preferences
              </button>
              <button onClick={() => { setProfileOpen(false); searchRef.current?.focus(); }}>
                <CircleHelp size={14} /> Focus workspace search <kbd>Ctrl K</kbd>
              </button>
              <div className="profile-workspace"><span className="status-dot" /> Demo environment · IN-West</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Layout({
  activeView,
  onNavigate,
  onCreateInvestigation,
  searchValue,
  searchResults,
  onSearchChange,
  onSearchSelect,
  notificationCount,
  liveStatus,
  compactTables,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (view: ViewId) => {
    onNavigate(view);
    setSidebarOpen(false);
  };

  return (
    <div className={`app-shell ${compactTables ? 'compact-tables' : ''}`}>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><Blocks size={18} strokeWidth={2} /><span /></div>
          <div>
            <strong>RINGTRACE</strong>
            <small>FRAUD INTELLIGENCE</small>
          </div>
          <button className="sidebar-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
            <PanelLeftClose size={16} />
          </button>
        </div>

        <div className="workspace-switcher" aria-label="Current workspace">
          <span className="workspace-mark"><ShieldCheck size={14} /></span>
          <span>
            <b>Investigation Desk</b>
            <small>IN-WEST · CASE {activeInvestigation.id}</small>
          </span>
          <ChevronDown size={13} aria-hidden="true" />
        </div>

        <nav className="side-navigation" aria-label="Main navigation">
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`nav-item ${activeView === id ? 'active' : ''}`}
                  onClick={() => navigate(id)}
                  aria-current={activeView === id ? 'page' : undefined}
                >
                  <Icon size={15} strokeWidth={1.85} />
                  <span>{label}</span>
                  {id === 'alerts' && notificationCount > 0 && <i className="nav-count">{notificationCount}</i>}
                  {id === 'graph' && <span className="nav-live-dot" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-new-case" onClick={onCreateInvestigation}>
            <span>+</span> New investigation
          </button>
          <div className="sidebar-footer">
            <div className="sidebar-footer-mark"><ShieldCheck size={13} /></div>
            <span>
              <b>Synthetic workspace</b>
              <small>v1.0.4 · 02 Oct 2026</small>
            </span>
            <button className="icon-button" title="Settings" aria-label="Settings" onClick={() => navigate('settings')}>
              <Settings size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <Topbar
          onNavigate={navigate}
          searchValue={searchValue}
          searchResults={searchResults}
          onSearchChange={onSearchChange}
          onSearchSelect={onSearchSelect}
          notificationCount={notificationCount}
          liveStatus={liveStatus}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content">{children}</main>
        <footer className="app-footer">
          <span>RINGTRACE · FINANCIAL CRIME &amp; FRAUD RING INTELLIGENCE</span>
          <span><span className="status-dot" /> Synthetic case workspace · Snapshot 02 Oct 2026 10:53 IST</span>
        </footer>
      </div>
    </div>
  );
}
