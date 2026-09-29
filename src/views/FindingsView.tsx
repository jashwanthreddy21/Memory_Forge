import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Server
} from 'lucide-react';
import { Finding } from '../types';

interface FindingsViewProps {
  findings: Finding[];
  recurringFindings: any[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({
  findings,
  recurringFindings,
  onSelectIncident,
  onNavigateTab
}) => {
  const [selectedControl, setSelectedControl] = useState<string>('Access Control');

  const topPattern = recurringFindings.find(r => r.control === 'Access Control') || recurringFindings[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>Findings & Recurring Security Pattern Detection</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Hindsight analyzes historical incident memory to detect persistent failure modes across organizational infrastructure
        </p>
      </div>

      {/* Featured Recurring Pattern Alert Banner */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Critical Recurring Security Pattern
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  8 Historical Incidents
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                Access Control: Misconfigured IAM & Public Storage ACL Drift
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('compliance')}
              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Inspect Control AC-01
            </button>
          </div>
        </div>

        {/* Pattern Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs mb-4">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">First Occurrence</span>
            <span className="text-slate-200 font-bold">{topPattern.firstSeen}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">INC-1007 (Pipeline SA)</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Latest Occurrence</span>
            <span className="text-amber-300 font-bold">{topPattern.latestSeen}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">INC-1038 (Reports Bucket)</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Affected Assets Count</span>
            <span className="text-slate-100 font-bold">{topPattern.affectedAssets?.length || 4} Cloud Targets</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Storage & CI/CD</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Systemic Status</span>
            <span className="text-rose-400 font-bold">RECURRING DRIFT</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Preventive SCP Mandated</span>
          </div>
        </div>

        {/* Common Root Cause & Remediation Strategy */}
        <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 text-xs space-y-2 font-mono">
          <div className="text-slate-300">
            <strong className="text-amber-300">Repeated Root Cause: </strong>
            {topPattern.commonRootCause}
          </div>
          <div className="text-slate-300">
            <strong className="text-emerald-400">Organizational Remediation: </strong>
            {topPattern.remediationSummary}
          </div>
        </div>

        {/* Related Incident Badges */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Associated Historical Incidents:</span>
          {topPattern.historicalIncidents?.map((incId: string) => (
            <button
              key={incId}
              onClick={() => onSelectIncident(incId)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-slate-700 transition-colors text-[11px] cursor-pointer"
            >
              {incId}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Registry Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Active Organizational Findings Registry
          </h3>
          <span className="text-xs text-slate-400 font-mono">{findings.length} Total Findings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Finding ID</th>
                <th className="py-3 px-4">Finding Title & Root Cause</th>
                <th className="py-3 px-4">Control</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {findings.map(f => (
                <tr key={f.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{f.id}</td>
                  <td className="py-3 px-4 max-w-md">
                    <div className="font-semibold text-slate-200">{f.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">{f.rootCause}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-[10px]">
                      {f.securityControl}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {f.isRecurring ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        Recurring ({f.occurrenceCount}x)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">{f.occurrenceCount}x</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      f.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' :
                      f.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-300' :
                      'bg-rose-500/10 text-rose-300'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    <button
                      onClick={() => onSelectIncident(f.incidentId)}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      {f.incidentId}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
