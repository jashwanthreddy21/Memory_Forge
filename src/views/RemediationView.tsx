import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Plus,
  Filter,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { RemediationItem, RemediationStatus } from '../types';

interface RemediationViewProps {
  remediations: RemediationItem[];
  onUpdateStatus: (id: string, status: RemediationStatus) => void;
  onSelectIncident: (id: string) => void;
}

export const RemediationView: React.FC<RemediationViewProps> = ({
  remediations,
  onUpdateStatus,
  onSelectIncident
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = remediations.filter(r => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Remediation Tracking & Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified corrective actions derived from AI investigations and persistent Hindsight playbooks
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterStatus === s
                  ? 'bg-blue-600/30 text-cyan-300 font-semibold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Remediation Cards */}
      <div className="space-y-3">
        {filtered.map(rem => (
          <div
            key={rem.id}
            className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-3 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                  {rem.id}
                </span>
                <button
                  onClick={() => onSelectIncident(rem.incidentId)}
                  className="font-mono text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Incident: {rem.incidentId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-mono text-slate-400">Control: <strong className="text-cyan-400">{rem.control}</strong></span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  rem.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  rem.status === 'COMPLETED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  rem.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {rem.status.replace('_', ' ')}
                </span>

                <select
                  value={rem.status}
                  onChange={e => onUpdateStatus(rem.id, e.target.value as RemediationStatus)}
                  aria-label={`Change status for remediation item ${rem.id}`}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="OPEN">Mark Open</option>
                  <option value="IN_PROGRESS">Mark In Progress</option>
                  <option value="COMPLETED">Mark Completed</option>
                  <option value="VERIFIED">Mark Verified</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-medium text-slate-100 leading-relaxed font-sans">
              {rem.description}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Underlying Root Cause</span>
                <span className="text-slate-300">{rem.rootCause}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Evidence Artifact Linked</span>
                <span className="text-emerald-400">{rem.evidence}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Owner: <strong className="text-slate-200">{rem.owner}</strong></span>
              <span>Due: {rem.dueDate}</span>
              {rem.completedDate && (
                <span className="text-emerald-400">Completed: {rem.completedDate}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
