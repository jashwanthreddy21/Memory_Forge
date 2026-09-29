import React from 'react';
import {
  Settings,
  Server,
  Database,
  Brain,
  Cpu,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowRight,
  GitBranch
} from 'lucide-react';

interface SystemSettingsViewProps {
  onResetDemo: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  onResetDemo
}) => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>Architecture & System Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Production architectural topology, health metrics, and DevSecOps verification pipelines
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Baseline</span>
        </button>
      </div>

      {/* 4 Health Service Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Service 1: API */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-xs font-bold text-slate-100">API Gateway</div>
          <div className="text-[11px] font-mono text-slate-400">FastAPI & Express</div>
          <div className="text-[10px] font-mono text-emerald-400">ONLINE (3ms latency)</div>
        </div>

        {/* Service 2: Database */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-xs font-bold text-slate-100">Persistent Database</div>
          <div className="text-[11px] font-mono text-slate-400">data/memoryforge.db.json</div>
          <div className="text-[10px] font-mono text-emerald-400">STORED & PERSISTED</div>
        </div>

        {/* Service 3: Hindsight Cloud */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <div className="text-xs font-bold text-slate-100">Hindsight Cloud Mesh</div>
          <div className="text-[11px] font-mono text-slate-400">api.hindsight.vectorize.io</div>
          <div className="text-[10px] font-mono text-cyan-300">Bank: memory-forge-secops</div>
        </div>

        {/* Service 4: AI Model */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-xs font-bold text-slate-100">AI Analysis Engine</div>
          <div className="text-[11px] font-mono text-slate-400">gemini-3.8-flash</div>
          <div className="text-[10px] font-mono text-emerald-400">ACTIVE (Server-side)</div>
        </div>
      </div>

      {/* Database Controls Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Persistent Incident Database (data/memoryforge.db.json)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            All ingested security incidents, investigations, committed memories, and evidence artifacts are automatically written to disk. They persist across server reboots and browser refreshes.
          </p>
        </div>

        <a
          href="/api/database/export"
          download="memoryforge_database.json"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Export Database JSON</span>
        </a>
      </div>

      {/* Architectural Differentiation Callout (PostgreSQL ≠ Hindsight) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Architectural Distinction: PostgreSQL ≠ Hindsight</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          A fundamental design principle of Memory Forge is separating transactional relational application data from contextual semantic organizational memory:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
          <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-blue-400 font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL (Structured State)</span>
            </div>
            <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
              <li>Incident rows & status state machine</li>
              <li>User accounts, roles, and assignments</li>
              <li>Remediation tasks and due dates</li>
              <li>Evidence metadata & SHA-256 digests</li>
              <li>Compliance control frameworks</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-lg border border-cyan-500/30 space-y-1.5">
            <div className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Hindsight (Organizational Memory)</span>
            </div>
            <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
              <li>Semantic incident vector recall (92% similarity)</li>
              <li>Historical root cause & failure mode linking</li>
              <li>Remediation playbook precedent association</li>
              <li>Cross-incident recurring pattern detection</li>
              <li>Audit context synthesis without manual queries</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DevSecOps Pipeline Visualizer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <span>Automated DevSecOps Pipeline</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Every deployment undergoes automated static analysis, secret detection, and policy-as-code linting:
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
          {[
            'Code Commit',
            'TypeScript Lint',
            'Unit Tests',
            'Integration Tests',
            'SAST Scan',
            'Secret Detection',
            'Docker Build',
            'Container Scan',
            'Zero-Downtime Deploy'
          ].map((stage, idx) => (
            <React.Fragment key={stage}>
              <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{stage}</span>
              </div>
              {idx < 8 && <span className="text-slate-600">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
