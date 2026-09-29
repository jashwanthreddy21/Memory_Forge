import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Sparkles,
  Download,
  Lock,
  ExternalLink,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu
} from 'lucide-react';
import { AuditQueryResponse } from '../types';
import { api } from '../services/api';
import { AuditSummaryReportModal } from '../components/AuditSummaryReportModal';

interface AuditAssistantViewProps {
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const AuditAssistantView: React.FC<AuditAssistantViewProps> = ({
  onSelectIncident,
  onNavigateTab
}) => {
  const [query, setQuery] = useState<string>(
    'Show historical access-control findings, remediation status, and available evidence.'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditQueryResponse | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const sampleAuditorQuestions = [
    'Show historical access-control findings, remediation status, and available evidence.',
    'Which access-control findings remain unresolved?',
    'What evidence exists for access-control remediation?',
    'Show recurring security findings across cloud storage.',
    'What incidents affected identity management?'
  ];

  const handleExecuteQuery = async (queryText: string) => {
    setLoading(true);
    setQuery(queryText);
    try {
      const res = await api.queryAudit(queryText);
      setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <span>AI-Powered Audit Assistant</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Query organizational memory for auditor inquiries, control attestations, and cryptographic evidence chains
          </p>
        </div>

        {auditResult && (
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Formal Audit Package</span>
          </button>
        )}
      </div>

      {/* Query Bar & Presets */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Auditor Natural Language Inquiry
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleExecuteQuery(query)}
            placeholder="e.g. Show historical findings related to access control..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={() => handleExecuteQuery(query)}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loading ? 'Synthesizing...' : 'Query Memory'}
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">Suggested Auditor Queries:</span>
          {sampleAuditorQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteQuery(q)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Query Result View */}
      {auditResult && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          {/* Header Result Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Audited Security Control
              </span>
              <h2 className="text-base font-bold text-slate-100">{auditResult.matchedControl}</h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Frameworks: {auditResult.frameworkReferences.join(' · ')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {auditResult.complianceRating}
              </span>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
              >
                Export MD
              </button>
            </div>
          </div>

          {/* Attestation Executive Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Auditor Attestation Statement</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{auditResult.executiveSummary}</p>
          </div>

          {/* 4 Quantitative Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Total Findings</span>
              <span className="text-base font-bold text-cyan-400">{auditResult.totalHistoricalFindings}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Remediated</span>
              <span className="text-base font-bold text-emerald-400">{auditResult.statusBreakdown.resolved} Resolved</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">In Progress</span>
              <span className="text-base font-bold text-amber-400">{auditResult.statusBreakdown.inProgress} Pending</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Verified Evidence</span>
              <span className="text-base font-bold text-emerald-400">{auditResult.availableEvidence.length} Artifacts</span>
            </div>
          </div>

          {/* Recurring Root Cause */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs font-mono space-y-1">
            <span className="text-amber-300 font-bold uppercase tracking-wider block">
              Recurring Root Cause Documented in Memory:
            </span>
            <p className="text-slate-300">{auditResult.recurringRootCause}</p>
          </div>

          {/* Verified Evidence Artifacts Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Cryptographic Evidence Artifacts (SHA-256)</span>
              </h4>
              <button
                onClick={() => onNavigateTab('evidence')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Evidence Vault →
              </button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Evidence ID</th>
                    <th className="py-2.5 px-3">Artifact Title</th>
                    <th className="py-2.5 px-3">SHA-256 Digest</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditResult.availableEvidence.map(e => (
                    <tr key={e.id} className="hover:bg-slate-900/70">
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">{e.id}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-sans">{e.title}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[10px] truncate max-w-xs">{e.hash}</td>
                      <td className="py-2.5 px-3 text-slate-400">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Associated Incidents */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Historical Incidents Correlated Under Control
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {auditResult.recentIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="p-3 rounded bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono text-cyan-400 font-bold text-xs">{inc.id}</span>
                    <h5 className="text-xs text-slate-300 truncate">{inc.title}</h5>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                    inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-300'
                  }`}>
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <AuditSummaryReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        report={auditResult}
      />
    </div>
  );
};
