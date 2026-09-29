import React from 'react';
import {
  ShieldAlert,
  Brain,
  Layers,
  CheckCircle2,
  Scale,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Clock,
  Lock,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Incident, HindsightMemory, RemediationItem, SecurityControl } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  memories: HindsightMemory[];
  remediations: RemediationItem[];
  controls: SecurityControl[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenCreate: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  memories,
  remediations,
  controls,
  onSelectIncident,
  onNavigateTab,
  onOpenCreate
}) => {
  const openIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL');
  const pendingRemediations = remediations.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* Hero Welcome / Memory Orientation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                Enterprise Memory Mesh Active
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400 font-mono">1,284 Knowledge Nodes Indexed</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Organizational Security Memory
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every security incident is systematically investigated, contextualized, and permanently committed to Hindsight. When new incidents occur, historical knowledge is automatically recalled to accelerate root cause determination and audit readiness.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('timeline')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Learning Timeline</span>
            </button>
            <button
              onClick={onOpenCreate}
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Incident</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Security Operations Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Card 1: Open Incidents */}
        <div
          onClick={() => onNavigateTab('incidents')}
          className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Open Incidents</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {openIncidents.length > 0 ? openIncidents.length : 4}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-rose-400 font-medium">{criticalIncidents.length} Critical</span>
            <span>· Active Triage</span>
          </div>
        </div>

        {/* Card 2: Recurring Findings */}
        <div
          onClick={() => onNavigateTab('findings')}
          className="bg-slate-950 border border-amber-900/40 hover:border-amber-700/60 rounded-xl p-4 transition-all cursor-pointer group bg-gradient-to-b from-amber-950/10 to-transparent"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recurring Findings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">7</div>
          <div className="text-[11px] text-amber-400/80 mt-1 truncate">
            Access Control Drift
          </div>
        </div>

        {/* Card 3: Remediation Items */}
        <div
          onClick={() => onNavigateTab('remediation')}
          className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Remediation Items</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">18</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-cyan-400">{pendingRemediations.length} Pending</span> · 14 Closed
          </div>
        </div>

        {/* Card 4: Memory Records */}
        <div
          onClick={() => onNavigateTab('memories')}
          className="bg-slate-950 border border-cyan-900/40 hover:border-cyan-700/60 rounded-xl p-4 transition-all cursor-pointer group bg-gradient-to-b from-cyan-950/10 to-transparent"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Memory Records</span>
            <Brain className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">1,284</div>
          <div className="text-[11px] text-cyan-400/80 mt-1">
            Hindsight Semantic Core
          </div>
        </div>

        {/* Card 5: Audit Readiness */}
        <div
          onClick={() => onNavigateTab('audit')}
          className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Audit Readiness</span>
            <Scale className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">84%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            SOC 2 & ISO 27001
          </div>
        </div>
      </div>

      {/* High-Risk Recurring Pattern Warning */}
      <div className="bg-amber-950/20 border-l-4 border-amber-500 border-y border-r border-amber-900/40 rounded-r-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Recurring Security Pattern Detected by Memory Engine
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                HIGH FREQUENCY
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              "Access-control misconfiguration has appeared in 8 historical incidents. Common root cause: Deployment automation omitting account-wide Block Public Access."
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('findings')}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer"
        >
          <span>Examine Pattern</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Incidents & Memory Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Incidents Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Recent Incidents
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('incidents')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {incidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{inc.id}</span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                        inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-xs text-slate-400 truncate">{inc.affectedAsset}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                      {inc.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {inc.memoryCommitted && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        In Hindsight
                      </span>
                    )}
                    <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Recalled Memories */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Recently Recalled Hindsight Memories
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Semantic Precedence</span>
            </div>

            <div className="space-y-3">
              {memories.slice(0, 3).map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => onNavigateTab('memories')}
                  className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{mem.id}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-300 font-semibold">{mem.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{mem.securityControl}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{mem.rootCause}</p>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Source: {mem.sourceIncidentId}</span>
                    <span className="text-cyan-400">Remediation: {mem.remediation.length} Steps</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Remediation & Audit Overview */}
        <div className="space-y-6">
          {/* Pending Remediation Items */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Pending Remediation
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('remediation')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Track
              </button>
            </div>

            <div className="space-y-2.5">
              {remediations.slice(0, 3).map((rem) => (
                <div key={rem.id} className="p-2.5 rounded bg-slate-900/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold text-[11px]">{rem.id}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      rem.status === 'COMPLETED' || rem.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rem.status}
                    </span>
                  </div>
                  <p className="text-slate-300 line-clamp-2 leading-relaxed">{rem.description}</p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{rem.control}</span>
                    <span className="font-mono">Due: {rem.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Requests Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Audit Readiness
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">84% Validated</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Auditors can query historical controls and receive cryptographic SHA-256 evidence proof without manual collection.
            </p>

            <button
              onClick={() => onNavigateTab('audit')}
              className="w-full py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Open Audit Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
