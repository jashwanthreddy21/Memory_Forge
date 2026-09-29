import React, { useState } from 'react';
import {
  Brain,
  Search,
  Share2,
  List,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { HindsightMemory, RecalledMemory } from '../types';
import { MemoryRelationshipGraph } from '../components/MemoryRelationshipGraph';
import { HindsightService } from '../services/hindsightClient';

interface HindsightMemoryViewProps {
  memories: HindsightMemory[];
  onSelectMemory?: (memoryId: string) => void;
}

export const HindsightMemoryView: React.FC<HindsightMemoryViewProps> = ({
  memories,
  onSelectMemory
}) => {
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testRecallQuery, setTestRecallQuery] = useState<string>('Public storage bucket exposed with unauthenticated access');
  const [testRecallResults, setTestRecallResults] = useState<RecalledMemory[] | null>(null);

  const handleTestRecall = () => {
    const results = HindsightService.recallSimilar(
      { title: testRecallQuery, description: testRecallQuery },
      memories
    );
    setTestRecallResults(results);
  };

  const filteredMemories = memories.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.id.toLowerCase().includes(q) ||
      m.sourceIncidentId.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.rootCause.toLowerCase().includes(q) ||
      m.securityControl.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span>Hindsight Persistent Organizational Memory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            The semantic knowledge layer capturing incident root causes, remediation playbooks, and control relationships
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'graph'
                ? 'bg-blue-600/30 text-cyan-300 font-bold border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Relationship Graph</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-blue-600/30 text-cyan-300 font-bold border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Memory Records ({memories.length})</span>
          </button>
        </div>
      </div>

      {/* Memory Category Counters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 text-xs font-mono">
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 block uppercase">Total Nodes</span>
          <span className="text-lg font-bold text-cyan-300">1,284</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 block uppercase">Incident Memories</span>
          <span className="text-lg font-bold text-slate-200">412</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 block uppercase">Control Mappings</span>
          <span className="text-lg font-bold text-slate-200">188</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 block uppercase">Remediation Rules</span>
          <span className="text-lg font-bold text-emerald-400">324</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 block uppercase">Post-Mortems</span>
          <span className="text-lg font-bold text-slate-200">142</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 block uppercase">Audit Attestations</span>
          <span className="text-lg font-bold text-slate-200">218</span>
        </div>
      </div>

      {/* Live Semantic Recall Playground Console */}
      <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-4 shadow-lg bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
            Test Hindsight Semantic Recall
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Simulate how Hindsight retrieves historical memory given any security symptom or incident description:
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testRecallQuery}
            onChange={e => setTestRecallQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            placeholder="Type query e.g. 'bucket public read', 'IAM privilege drift'..."
          />
          <button
            onClick={handleTestRecall}
            className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Execute Recall
          </button>
        </div>

        {/* Test Recall Results */}
        {testRecallResults && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold block">
              Recalled {testRecallResults.length} Matching Historical Memories:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {testRecallResults.map(r => (
                <div key={r.memoryId} className="p-3 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">{r.sourceIncidentId}: {r.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                      {(r.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Root Cause: {r.rootCause}</div>
                  <div className="text-emerald-400 text-[11px]">Remediation: {r.previousRemediation[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main View: Graph or List */}
      {viewMode === 'graph' ? (
        <MemoryRelationshipGraph
          memories={memories}
          onSelectMemory={onSelectMemory}
        />
      ) : (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search memories by ID, root cause, control..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          {/* Memory Records List */}
          <div className="space-y-3">
            {filteredMemories.map(mem => (
              <div
                key={mem.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-3 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                      {mem.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Source: <strong className="text-slate-200">{mem.sourceIncidentId}</strong>
                    </span>
                    <span className="text-slate-500">·</span>
                    <h3 className="text-xs font-bold text-slate-100">{mem.title}</h3>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-cyan-300 font-semibold border border-blue-500/30">
                    {mem.securityControl}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Identified Root Cause
                    </span>
                    <p className="text-slate-200 leading-relaxed">{mem.rootCause}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Verified Remediation Playbook
                    </span>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
                      {mem.remediation.map((r, i) => (
                        <li key={i} className="truncate">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>Tags:</span>
                    {mem.tags.map(t => (
                      <span key={t} className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span>Retained: {mem.createdAt.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
