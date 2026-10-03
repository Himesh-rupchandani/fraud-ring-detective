import { useEffect, useRef, useState } from 'react';
import {
  Activity, Archive, ArrowRight, Bell,
  ChevronDown, CircleHelp, Command, FileSearch, Fingerprint,
  Home, LayoutDashboard, LayoutGrid, Menu, Network, PanelLeftClose, Search,
  Settings, ShieldAlert, ShieldCheck, SlidersHorizontal, Sparkles, TrendingUp, UserRound,
  WalletCards, X, type LucideIcon,
} from 'lucide-react';
import type { SearchItem, ViewId } from '../types';

interface LayoutProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  onCreateInvestigation: () => void;
  onBack: () => void;
  canGoBack: boolean;
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
  { label: 'Monitor', items: [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Transaction Monitor', icon: WalletCards },
    { id: 'accounts', label: 'Watchlist', icon: UserRound },
    { id: 'alerts', label: 'Fraud Alerts', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] },
  { label: 'Dashboards', items: [
    { id: 'investigations', label: 'Overview', icon: LayoutDashboard },
    { id: 'rings', label: 'Patterns', icon: TrendingUp },
    { id: 'graph', label: 'Trends', icon: Activity },
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
  onBack,
  canGoBack,
  searchValue,
  searchResults,
  onSearchChange,
  onSearchSelect,
  notificationCount,
  liveStatus,
  onMenuClick,
}: {
  onNavigate: (view: ViewId) => void;
  onBack: () => void;
  canGoBack: boolean;
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
      if (event.altKey && event.key === 'ArrowLeft' && canGoBack) {
        event.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [canGoBack, onBack]);

  return (
    <header className="topbar">
      <button
        className="topbar-back"
        onClick={onBack}
        disabled={!canGoBack}
        title={canGoBack ? 'Back to previous view (Alt + ←)' : 'No previous view to return to'}
        aria-label="Go back to the previous view"
      >
        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} aria-hidden="true" />
        <span>Back</span>
      </button>
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
            onKeyDown={(event) => { if (event.key === 'Enter' && searchResults[0]) onSearchSelect(searchResults[0]); if (event.key === 'Escape') { onSearchChange(''); searchRef.current?.blur(); } }}
            placeholder="Search by Transaction ID, Phone Number, Account No, or City..."
            aria-label="Search the investigation workspace"
          />
          {searchValue ? (
            <button className="search-clear" aria-label="Clear search" onClick={() => onSearchChange('')}><X size={14} /></button>
          ) : (
            <span className="keyboard-shortcut"><Command size={10} /> K</span>
          )}
        </div>
        {searchValue.trim() && (
          <div className="search-results" role="listbox" aria-label="Search results">
            <div className="search-results-heading">{searchResults.length ? 'MATCHING ENTITIES' : 'NO MATCHES FOUND'}</div>
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
            {!!searchResults.length && <div className="search-results-footer">Enter to open top result · Esc to close</div>}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {liveStatus && <div className="system-status" aria-label="System Online">
          <span className="status-dot" />
          <span>System Online</span>
        </div>}
        {!liveStatus && <div className="status-popover-wrap">
          <button className="system-status demo-status" onClick={() => { setStatusOpen((open) => !open); setProfileOpen(false); }} aria-expanded={statusOpen} aria-label="Demo data status">
            <span className="status-dot demo-status-dot" />
            <span>Static demo data</span>
          </button>
          {statusOpen && (
            <div className="mini-popover status-popover">
              <div className="popover-heading"><Sparkles size={15} /> Demonstration mode</div>
              <div className="status-row"><span>Graph source</span><b>Local sample data</b></div>
              <div className="status-row"><span>Risk method</span><b>Illustrative rules</b></div>
              <div className="status-row"><span>Live services</span><b>Not connected</b></div>
              <small>Fictional records only. This prototype has no live feed or model inference.</small>
            </div>
          )}
        </div>}
        <button className="icon-button notification-button" aria-label={`Open alerts, ${notificationCount} new`} onClick={() => onNavigate('alerts')} title="Alerts">
          <Bell size={17} />
          {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
        </button>
        <span className="topbar-divider" />
        <div className="profile-popover-wrap">
          <button className="profile-button" onClick={() => { setProfileOpen((open) => !open); setStatusOpen(false); }} aria-expanded={profileOpen} aria-label="Open profile menu">
            <span className="profile-avatar">
              <span style={{ fontSize: '10px', fontWeight: 700 }}>HR</span>
              <i className="profile-presence" aria-hidden="true" />
            </span>
            <span className="profile-text"><strong>HIMESH R</strong><small>Analyst</small></span>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {profileOpen && (
            <div className="mini-popover profile-popover">
              <div className="profile-card-head"><span className="profile-avatar large"><span style={{ fontSize: '13px', fontWeight: 700 }}>HR</span></span><span><strong>HIMESH R</strong><small>Analyst · Fraud Intelligence</small></span></div>
              <button onClick={() => { setProfileOpen(false); onNavigate('settings'); }}><SlidersHorizontal size={14} /> Workspace preferences</button>
              <button onClick={() => { setProfileOpen(false); searchRef.current?.focus(); }}><CircleHelp size={14} /> Focus workspace search <kbd>Ctrl K</kbd></button>
              <div className="profile-workspace"><span className="status-dot" /> Live environment</div>
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
  onBack,
  canGoBack,
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
  /* Existing group labels are unchanged; the "Dashboards" group keeps the same
     items and is simply rendered as a collapsible section (open by default). */
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({});

  const navigate = (view: ViewId) => {
    onNavigate(view);
    setSidebarOpen(false);
  };

  return (
    <div className={`app-shell ${compactTables ? 'compact-tables' : ''}`}>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><ShieldCheck size={25} strokeWidth={2} /><span /></div>
          <div><strong>Fraud Shield Detective</strong><small>Investigation workspace</small></div>
          <button className="sidebar-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><PanelLeftClose size={17} /></button>
        </div>
        <div className="workspace-switcher" aria-label="Current workspace">
          <span className="workspace-mark"><ShieldCheck size={15} /></span>
          <span><b>Investigation desk</b><small>WEST · DEMO TENANT</small></span>
          <ChevronDown size={13} aria-hidden="true" />
        </div>

        <nav className="side-navigation" aria-label="Main navigation">
          {navigationGroups.map((group, groupIndex) => {
            const collapsible = group.label === 'Dashboards';
            const open = sectionOpen[group.label] !== false;
            return (
              <div className={`nav-group ${collapsible ? 'nav-group-section' : ''}`} key={group.label}>
                {groupIndex > 0 && <div className="nav-separator" aria-hidden="true" />}
                {collapsible && (
                  <button
                    className={`nav-parent ${open ? 'is-open' : ''}`}
                    onClick={() => setSectionOpen((state) => ({ ...state, [group.label]: !open }))}
                    aria-expanded={open}
                  >
                    <span className="nav-icon"><LayoutGrid size={16} strokeWidth={1.9} /></span>
                    <span className="nav-label">{group.label}</span>
                    <ChevronDown className="nav-caret" size={14} aria-hidden="true" />
                  </button>
                )}
                <div className={`nav-items ${collapsible && !open ? 'is-collapsed' : ''}`}>
                  {group.items.map(({ id, label, icon: Icon }) => (
                    <button key={id} className={`nav-item nav-item-${id} ${collapsible ? 'nav-item-sub' : ''}`} onClick={() => navigate(id)} aria-current={activeView === id ? 'page' : undefined}>
                      <span className="nav-icon"><Icon size={16} strokeWidth={1.9} /></span>
                      <span className="nav-label">{label}</span>
                      {id === 'alerts' && notificationCount > 0 && <i className="nav-count">{notificationCount}</i>}
                      {id === 'graph' && <span className="nav-live-dot" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-support">
            <span className="sidebar-support-mark"><ShieldCheck size={18} /></span>
            <span className="sidebar-support-copy"><strong>Safer Banking.<br />Stronger Tomorrow.</strong><small>AI for a Fraud Free World</small></span>
            <span className="sidebar-support-arrow" aria-hidden="true"><ArrowRight size={12} /></span>
          </div>
          <button className="sidebar-new-case" onClick={onCreateInvestigation}><span>+</span> New investigation</button>
          <div className="sidebar-footer">
            <div className="sidebar-footer-mark"><Sparkles size={14} /></div>
            <span><b>Demo environment</b><small>Synthetic records · v1.0.4</small></span>
            <button className="icon-button" title="Settings" aria-label="Settings" onClick={() => navigate('settings')}><Settings size={15} /></button>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <Topbar
          onNavigate={navigate}
          onBack={onBack}
          canGoBack={canGoBack}
          searchValue={searchValue}
          searchResults={searchResults}
          onSearchChange={onSearchChange}
          onSearchSelect={onSearchSelect}
          notificationCount={notificationCount}
          liveStatus={liveStatus}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content">{children}</main>
        <footer className="app-footer"><span>FRAUD SHIELD DETECTIVE · FINANCIAL CRIME INTELLIGENCE</span><span><span className="status-dot" /> Demo workspace · Data as of 02 Oct 2026</span></footer>
      </div>
    </div>
  );
}
