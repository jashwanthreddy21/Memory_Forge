import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Download,
  Copy,
  Check,
  Shield,
  Lock,
  ExternalLink
} from 'lucide-react';
import { AuditQueryResponse } from '../types';

interface AuditSummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditQueryResponse | null;
}

export const AuditSummaryReportModal: React.FC<AuditSummaryReportModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const markdownText = `
# MEMORY FORGE - FORMAL AUDIT ATTESTATION REPORT
**Generated**: ${new Date().toUTCString()}
**Security Control**: ${report.matchedControl}
**Auditor Query**: "${report.query}"
**Compliance Rating**: ${report.complianceRating}

---

## 1. Executive Summary & Attestation
${report.executiveSummary}

## 2. Control Standards Mapping
${report.frameworkReferences.map(f => `- ${f}`).join('\n')}

## 3. Historical Findings Status
- **Total Findings**: ${report.totalHistoricalFindings}
- **Resolved**: ${report.statusBreakdown.resolved}
- **In Progress**: ${report.statusBreakdown.inProgress}
- **Open**: ${report.statusBreakdown.open}

## 4. Recurring Root Cause Analysis
${report.recurringRootCause}

## 5. Verified Cryptographic Evidence Chain (SHA-256)
${report.availableEvidence.map(e => `- [${e.id}] ${e.title} (${e.type}) | Hash: \`${e.hash}\` | Date: ${e.date}`).join('\n')}

## 6. Associated Incident Records
${report.recentIncidents.map(i => `- [${i.id}] ${i.title} (${i.status}) - ${i.date}`).join('\n')}

---
*Verified via Hindsight Organizational Memory Architecture - Memory Forge*
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Attestation_${report.matchedControl.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">Audit-Ready Attestation Summary</h2>
              <p className="text-xs text-slate-400">Formal compliance package generated from Hindsight organizational memory</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-300 font-sans leading-relaxed">
          {/* Executive Block */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Control Attestation Statement
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                {report.complianceRating}
              </span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">{report.executiveSummary}</p>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded p-3 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Target Control</div>
              <div className="text-xs font-bold text-slate-100 mt-1">{report.matchedControl}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded p-3 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Total Findings</div>
              <div className="text-xs font-bold text-cyan-400 mt-1">{report.totalHistoricalFindings}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded p-3 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Remediation Status</div>
              <div className="text-xs text-slate-200 mt-1">
                <span className="text-emerald-400">{report.statusBreakdown.resolved} Res</span> · <span className="text-amber-400">{report.statusBreakdown.inProgress} Prog</span> · <span className="text-rose-400">{report.statusBreakdown.open} Open</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded p-3 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Verified Evidence</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">{report.availableEvidence.length} Artifacts</div>
            </div>
          </div>

          {/* Evidence Chain Table */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Verified Cryptographic Evidence Chain
              </h4>
            </div>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Artifact Title</th>
                    <th className="py-2 px-3">SHA-256 Digest</th>
                    <th className="py-2 px-3">Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {report.availableEvidence.map(e => (
                    <tr key={e.id} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 text-cyan-300 font-semibold">{e.id}</td>
                      <td className="py-2 px-3 text-slate-200">{e.title}</td>
                      <td className="py-2 px-3 text-slate-400 text-[10px] font-mono truncate max-w-xs">{e.hash}</td>
                      <td className="py-2 px-3 text-slate-400">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Associated Incidents */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono mb-2">
              Related Historical Incidents in Hindsight
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {report.recentIncidents.map(inc => (
                <div key={inc.id} className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-cyan-400 font-semibold">{inc.id}</div>
                    <div className="text-[11px] text-slate-300 truncate max-w-[160px]">{inc.title}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-300'
                  }`}>
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Attestation ready for external SOC 2 Type II or ISO 27001 submission</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
