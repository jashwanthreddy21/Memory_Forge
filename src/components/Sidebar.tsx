import React from 'react';
import {
  ShieldAlert,
  Search,
  Brain,
  Layers,
  FileCheck,
  CheckCircle2,
  Lock,
  Scale,
  FileText,
  Clock,
  Sparkles,
  Settings,
  Server,
  Database,
  Cpu,
  X
} from 'lucide-react';

export type NavItem = 
  | 'dashboard'
  | 'incidents'
  | 'investigations'
  | 'memories'
  | 'findings'
  | 'remediation'
  | 'evidence'
  | 'compliance'
  | 'audit'
  | 'timeline'
  | 'assistant'
  | 'settings';

interface SidebarProps {
  activeTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  openIncidentsCount: number;
  recurringFindingsCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  openIncidentsCount,
  recurringFindingsCount,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: ShieldAlert },
    { id: 'incidents', label: 'Incidents', icon: Search, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined },
    { id: 'investigations', label: 'Investigations', icon: Cpu, highlight: true },
    { id: 'memories', label: 'Hindsight Memory', icon: Brain, isMemoryCore: true },
    { id: 'findings', label: 'Findings & Patterns', icon: Layers, badge: recurringFindingsCount > 0 ? `${recurringFindingsCount} Rec` : undefined },
    { id: 'remediation', label: 'Remediation', icon: CheckCircle2 },
    { id: 'evidence', label: 'Evidence Vault', icon: Lock },
    { id: 'compliance', label: 'Compliance & Controls', icon: Scale },
    { id: 'audit', label: 'Audit Assistant', icon: FileCheck },
    { id: 'timeline', label: 'Knowledge Timeline', icon: Clock },
    { id: 'assistant', label: 'Memory Forge AI', icon: Sparkles },
    { id: 'settings', label: 'Architecture & Status', icon: Settings },
  ];

  const handleItemClick = (id: NavItem) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="w-72 sm:w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-full select-none shrink-0 shadow-2xl md:shadow-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-lg">
            MF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-wider text-sm">MEMORY FORGE</span>
            </div>
            <p className="text-[11px] text-cyan-400/90 font-medium">Hindsight SecOps Agent</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id as NavItem)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.isMemoryCore && (
                <span className="text-[10px] text-cyan-400 font-mono">CORE</span>
              )}

              {item.badge && !item.isMemoryCore && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Memory Loop Banner */}
      <div className="mx-2 mb-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <Brain className="w-3 h-3 text-cyan-400" />
          <span>Organizational Loop</span>
        </div>
        <div className="text-[10px] text-slate-300 leading-tight font-mono">
          Incident <span className="text-cyan-400">→</span> Investigate <span className="text-cyan-400">→</span> Memory <span className="text-cyan-400">→</span> Recall
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1">
          <span>Hackathon Engine</span>
          <span className="text-emerald-400 font-mono text-[9px]">LIVE CLOUD</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono px-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Hindsight Cloud
            </span>
            <span className="text-cyan-400 text-[10px] truncate max-w-[90px]" title="memory-forge-secops">vectorize.io</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Gemini AI Engine
            </span>
            <span className="text-emerald-400 text-[10px]">3.8 Flash</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Incident Database
            </span>
            <span className="text-emerald-400 text-[10px]">Persistent</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex h-screen shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-over with Backdrop) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full bg-slate-950 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
