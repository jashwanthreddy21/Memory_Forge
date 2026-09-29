import React from 'react';
import {
  Clock,
  Brain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface KnowledgeTimelineViewProps {
  timeline: TimelineEvent[];
  onSelectIncident: (id: string) => void;
}

export const KnowledgeTimelineView: React.FC<KnowledgeTimelineViewProps> = ({
  timeline,
  onSelectIncident
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Organizational Security Knowledge Timeline</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Visualizing how every incident, remediation, and memory recall builds compounding institutional security intelligence
        </p>
      </div>

      {/* Philosophy Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/30 border border-cyan-500/40 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider block mb-1">
            Continuous Security Evolution
          </span>
          <h2 className="text-base font-black text-slate-100">
            "THE ORGANIZATION IS LEARNING."
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Traditional SecOps treats tickets as isolated silos that close and are forgotten. Memory Forge permanently preserves root causes, remediation playbooks, and evidence to harden defenses before the next alert arrives.
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end font-mono text-xs text-cyan-300">
          <span className="text-2xl font-bold">84%</span>
          <span className="text-[10px] text-slate-400">Mean Time To Diagnose Reduction</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 pl-6 space-y-6 py-2">
        {timeline.map((event, idx) => {
          const isIncident = event.type === 'INCIDENT';
          const isRemediation = event.type === 'REMEDIATION';
          const isPattern = event.type === 'PATTERN_DETECTED';
          const isControl = event.type === 'CONTROL_ADDED';

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                isPattern
                  ? 'bg-amber-500 border-amber-300 shadow-md shadow-amber-500/50 scale-125'
                  : isControl
                  ? 'bg-cyan-500 border-cyan-300 shadow-md shadow-cyan-500/40'
                  : isRemediation
                  ? 'bg-emerald-500 border-emerald-300'
                  : 'bg-slate-800 border-blue-400'
              }`} />

              {/* Event Card */}
              <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-sm space-y-2 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold">{event.date}</span>
                    <span className="text-slate-500">·</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isPattern ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      isControl ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      isRemediation ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>

                  {event.relatedId && (
                    <button
                      onClick={() => onSelectIncident(event.relatedId!)}
                      className="text-xs font-mono text-slate-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Ref: {event.relatedId}
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-100">{event.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{event.description}</p>

                {event.highlightText && (
                  <div className="pt-2 text-xs font-mono text-cyan-300 flex items-center gap-1.5 border-t border-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{event.highlightText}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Demo Callout */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center text-xs text-slate-400">
        <span className="font-bold text-slate-200">Memory Forge Guarantee: </span>
        Every incident makes the next investigation smarter, faster, and audit-ready.
      </div>
    </div>
  );
};
