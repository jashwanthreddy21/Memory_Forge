import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Brain,
  Cpu
} from 'lucide-react';
import { Incident, IncidentStatus, SeverityLevel } from '../types';

interface IncidentsViewProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onOpenCreate: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onSelectIncident,
  onOpenCreate
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filtered = incidents.filter(inc => {
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.affectedAsset.toLowerCase().includes(q) ||
        inc.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Incident Management & Ingestion</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active security incidents scheduled for AI investigation and Hindsight organizational memory recall
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by ID (e.g. INC-1038), asset, title, tag..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 text-xs">
          {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600/30 text-cyan-300 font-semibold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table for Desktop / Cards for Mobile */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Mobile View: High-density interactive cards */}
        <div className="md:hidden divide-y divide-slate-800/80">
          {filtered.map(inc => {
            const isSpecialDemo = inc.id === 'INC-1038' || inc.id === 'INC-1024';

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className="p-3.5 hover:bg-slate-900/60 active:bg-slate-900 transition-colors cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{inc.id}</span>
                    {isSpecialDemo && (
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Demo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      inc.severity === 'MEDIUM' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      inc.status === 'INVESTIGATING' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 animate-pulse' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 text-xs leading-snug">
                    {inc.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-cyan-400/90">{inc.affectedAsset}</span>
                    <span>·</span>
                    <span className="text-slate-500">{inc.environment}</span>
                    <span>·</span>
                    <span className="text-slate-500">{inc.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
                  <div>
                    {inc.memoryCommitted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Hindsight Retained</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Uncommitted</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIncident(inc.id);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-600/30 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-semibold text-xs border border-blue-500/40 transition-all cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Comprehensive Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title & Affected Asset</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Hindsight Memory</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map(inc => {
                const isSpecialDemo = inc.id === 'INC-1038' || inc.id === 'INC-1024';

                return (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc.id)}
                    className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 text-xs">
                      {inc.id}
                      {isSpecialDemo && (
                        <span className="block text-[9px] text-amber-400 uppercase font-semibold">
                          Demo Target
                        </span>
                      )}
                    </td>

                    {/* Title & Asset */}
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{inc.affectedAsset}</span>
                        <span>·</span>
                        <span className="text-slate-500">{inc.environment}</span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        inc.severity === 'MEDIUM' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' :
                        inc.status === 'INVESTIGATING' ? 'bg-cyan-500/10 text-cyan-300 animate-pulse' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {inc.status}
                      </span>
                    </td>

                    {/* Memory Committal Status */}
                    <td className="py-3 px-4">
                      {inc.memoryCommitted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Committed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Uncommitted</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-medium transition-all cursor-pointer"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>Investigate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
