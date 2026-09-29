import React, { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { Incident, RecalledMemory, InvestigationResult } from '../types';

interface HistoricalRecallTransitionProps {
  incident: Incident;
  investigation: InvestigationResult | null;
  onComplete: () => void;
  onViewMemoryDetails: (memoryId: string) => void;
}

export const HistoricalRecallTransition: React.FC<HistoricalRecallTransitionProps> = ({
  incident,
  investigation,
  onComplete,
  onViewMemoryDetails
}) => {
  // Step progression: 1 = ANALYZING, 2 = SEARCHING MEMORY, 3 = FOUND MEMORIES, 4 = CONTEXT INJECTED, 5 = CURRENT INVESTIGATION
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedMemory, setSelectedMemory] = useState<RecalledMemory | null>(null);

  useEffect(() => {
    // Automatically transition through the demonstration sequence
    const t1 = setTimeout(() => setCurrentStep(2), 1200);
    const t2 = setTimeout(() => setCurrentStep(3), 2600);
    const t3 = setTimeout(() => setCurrentStep(4), 4800);
    const t4 = setTimeout(() => {
      setCurrentStep(5);
      onComplete();
    }, 6400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const topMemory = investigation?.similarHistoricalIncidents?.[0] || {
    memoryId: 'MEM-1024',
    sourceIncidentId: 'INC-1024',
    title: 'Public Cloud Storage Exposure',
    similarity: 0.92,
    rootCause: 'Incorrect access policy configuration exposed storage bucket.',
    control: 'Access Control',
    previousRemediation: [
      'IAM policy review',
      'Public access removal',
      'Organization Block Public Access baseline enforcement'
    ],
    evidenceSummary: 'Configuration snapshot + PutBucketAcl API audit log',
    whyItMatters: 'Shares identical storage bucket archetype and access control misconfiguration model.',
    date: '2026-02-20'
  };

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden my-6">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Tracker */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Hindsight Historical Recall Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Querying persistent organizational security memory for <span className="font-mono text-cyan-300">{incident.id}</span>
          </p>
        </div>

        {/* Visual Progress Steps */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          {[
            { num: 1, label: 'Analyze' },
            { num: 2, label: 'Search Hindsight' },
            { num: 3, label: 'Recall' },
            { num: 4, label: 'Inject Context' },
            { num: 5, label: 'Ready' }
          ].map((s) => (
            <div
              key={s.num}
              className={`px-2 py-0.5 rounded text-xs transition-all ${
                currentStep >= s.num
                  ? currentStep === s.num
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Centerpiece Flow Visualizer */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* STAGE 1: ANALYZING INCIDENT */}
        <div
          className={`p-3.5 rounded-lg border transition-all duration-300 flex items-center justify-between ${
            currentStep >= 1
              ? 'bg-slate-900 border-slate-700 text-slate-200'
              : 'opacity-40 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono text-xs">
              01
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Analyzing Incident
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {incident.id}: {incident.title} ({incident.affectedAsset})
              </div>
            </div>
          </div>
          {currentStep > 1 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className="text-[11px] font-mono text-cyan-400 animate-pulse">Scanning attributes...</span>
          )}
        </div>

        {/* Transition Arrow */}
        <div className="flex justify-center text-slate-400">
          <ArrowDown className={`w-4 h-4 transition-colors ${currentStep >= 2 ? 'text-cyan-400' : 'text-slate-700'}`} />
        </div>

        {/* STAGE 2: SEARCHING ORGANIZATIONAL MEMORY */}
        <div
          className={`p-3.5 rounded-lg border transition-all duration-300 flex items-center justify-between ${
            currentStep >= 2
              ? 'bg-slate-900 border-cyan-500/40 text-slate-200 shadow-sm shadow-cyan-500/10'
              : 'opacity-40 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs">
              02
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Searching Organizational Memory
              </div>
              <div className="text-xs text-slate-400">
                Vectorizing incident signature against 1,284 persistent Hindsight memory nodes
              </div>
            </div>
          </div>
          {currentStep > 2 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : currentStep === 2 ? (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Scanning Hindsight...</span>
            </div>
          ) : null}
        </div>

        {/* Transition Arrow */}
        <div className="flex justify-center text-slate-400">
          <ArrowDown className={`w-4 h-4 transition-colors ${currentStep >= 3 ? 'text-cyan-400' : 'text-slate-700'}`} />
        </div>

        {/* STAGE 3: THE MEMORY MATCH CARD */}
        {currentStep >= 3 && (
          <div className="space-y-2">
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
                3 RELATED MEMORIES FOUND IN HINDSIGHT
              </span>
            </div>

            {/* The Featured Spectacular Recall Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-xl p-5 shadow-xl shadow-cyan-950/40 relative">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/40">
                    {(topMemory.similarity * 100).toFixed(0)}% Match
                  </div>
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-semibold">{topMemory.sourceIncidentId}</span>
                    <h3 className="text-sm font-bold text-slate-100">{topMemory.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => onViewMemoryDetails(topMemory.memoryId)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>VIEW MEMORY</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </button>
              </div>

              {/* Memory Data Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 rounded-lg p-3 border border-slate-800/80 text-xs font-mono mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Root Cause</div>
                  <div className="text-slate-200 mt-0.5">{topMemory.rootCause}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Control</div>
                  <div className="text-cyan-400 mt-0.5 font-semibold">{topMemory.control}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Previous Remediation</div>
                  <ul className="text-slate-300 mt-0.5 space-y-0.5 list-disc list-inside">
                    {topMemory.previousRemediation.slice(0, 2).map((r, i) => (
                      <li key={i} className="truncate">{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Why This Memory Matters */}
              <div className="text-xs text-slate-400 bg-cyan-950/20 border border-cyan-900/40 rounded p-2.5 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold">Why this memory matters: </span>
                  {topMemory.whyItMatters}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transition Arrow */}
        {currentStep >= 4 && (
          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4 text-cyan-400" />
          </div>
        )}

        {/* STAGE 4: HISTORICAL CONTEXT INJECTED */}
        {currentStep >= 4 && (
          <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>HISTORICAL CONTEXT INJECTED INTO INVESTIGATION ENGINE</span>
            </div>
            <span className="text-[11px] text-emerald-400">Knowledge Seeded</span>
          </div>
        )}

        {/* Transition Arrow */}
        {currentStep >= 5 && (
          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4 text-cyan-400" />
          </div>
        )}

        {/* STAGE 5: CURRENT INVESTIGATION READY */}
        {currentStep >= 5 && (
          <div className="p-4 rounded-lg border border-blue-500/40 bg-blue-950/20 text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Current Investigation Synthesized
                </div>
                <div className="text-xs text-slate-400">
                  Root cause confirmed via INC-1024 precedence. Recommended remediation ready.
                </div>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Examine Investigation
            </button>
          </div>
        )}
      </div>

      {/* Footer Differentiator Copy */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Memory Forge Loop: </span>
        Incident <span className="text-cyan-400">→</span> Investigation <span className="text-cyan-400">→</span> Memory <span className="text-cyan-400">→</span> Recall <span className="text-cyan-400">→</span> Learning <span className="text-cyan-400">→</span> Better Investigation
      </div>
    </div>
  );
};
