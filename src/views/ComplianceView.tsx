import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Search,
  Filter
} from 'lucide-react';
import { SecurityControl } from '../types';

interface ComplianceViewProps {
  controls: SecurityControl[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  controls,
  onSelectIncident,
  onNavigateTab
}) => {
  const [selectedControl, setSelectedControl] = useState<SecurityControl | null>(controls[0]);
  const [search, setSearch] = useState<string>('');

  const filtered = controls.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.frameworks.some(f => f.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span>Compliance & Security Controls Architecture</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance posture mapped to SOC 2 Type II, ISO 27001, and NIST CSF via Hindsight memory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('audit')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Audit Assistant</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Controls List, Right Control Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Controls Table / Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter controls by name, code, or framework (e.g. SOC 2)..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-2.5">
            {filtered.map(ctrl => {
              const isSelected = selectedControl?.id === ctrl.id;
              const isAccessControl = ctrl.code === 'AC-01';

              return (
                <div
                  key={ctrl.id}
                  onClick={() => setSelectedControl(ctrl)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                        {ctrl.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">{ctrl.name}</h3>
                      {isAccessControl && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          8 Historical Findings
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      ctrl.healthStatus === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400' :
                      ctrl.healthStatus === 'CRITICAL_DRIFT' ? 'bg-rose-500/10 text-rose-300' :
                      'bg-amber-500/10 text-amber-300'
                    }`}>
                      {ctrl.healthStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{ctrl.description}</p>

                  {/* Quantitative Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Findings Breakdown</span>
                      <span className="text-slate-200">
                        <strong className="text-emerald-400">{ctrl.resolvedFindings}</strong> Res · <strong className="text-amber-400">{ctrl.inProgressFindings}</strong> Prog · <strong className="text-rose-400">{ctrl.openFindings}</strong> Open
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Evidence Chain</span>
                      <span className="text-emerald-400 font-bold">{ctrl.evidenceCount} Artifacts</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Last Observed</span>
                      <span className="text-slate-300">{ctrl.lastOccurrence}</span>
                    </div>

                    <div className="text-right flex items-center justify-end">
                      <span className="text-cyan-400 flex items-center gap-1 font-sans text-xs">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Control Detail Inspection Drawer */}
        <div>
          {selectedControl ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5 sticky top-20">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-cyan-400">{selectedControl.code}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{selectedControl.category}</span>
                </div>
                <h2 className="text-base font-bold text-slate-100">{selectedControl.name}</h2>
              </div>

              {/* Framework Compliance Badges */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                  Framework Requirements Mapped
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedControl.frameworks.map(f => (
                    <span key={f} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Associated Incidents In Hindsight */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                  Associated Incidents in Memory
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedControl.relatedIncidentIds.map(incId => (
                    <button
                      key={incId}
                      onClick={() => onSelectIncident(incId)}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
                    >
                      {incId}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Vault Artifacts Count */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Linked Cryptographic Evidence:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedControl.evidenceCount} Records</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Configuration snapshots, CloudTrail API traces, and CSPM audit logs verified with SHA-256 digests.
                </p>
              </div>

              {/* Audit Query CTA */}
              <button
                onClick={() => onNavigateTab('audit')}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Generate Audit Package for {selectedControl.code}</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a control to view compliance mapping and associated incidents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
