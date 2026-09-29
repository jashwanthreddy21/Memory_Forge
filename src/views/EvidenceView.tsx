import React, { useState } from 'react';
import {
  Lock,
  Search,
  Plus,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { EvidenceRecord, EvidenceType } from '../types';

interface EvidenceViewProps {
  evidence: EvidenceRecord[];
  onAddEvidence: (record: Partial<EvidenceRecord>) => void;
  onSelectIncident: (id: string) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  evidence,
  onAddEvidence,
  onSelectIncident
}) => {
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New evidence form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EvidenceType>('CONFIGURATION_SNAPSHOT');
  const [source, setSource] = useState('AWS CLI / S3 API');
  const [relatedIncidentId, setRelatedIncidentId] = useState('INC-1038');
  const [relatedControl, setRelatedControl] = useState('Access Control');
  const [description, setDescription] = useState('Configuration audit log demonstrating public access block verification.');

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvidence({
      title,
      type,
      source,
      relatedIncidentId,
      relatedControl,
      description
    });
    setShowAddModal(false);
  };

  const filtered = evidence.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.relatedControl.toLowerCase().includes(q) ||
      e.relatedIncidentId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Cryptographic Evidence Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable forensic artifacts with SHA-256 digest chains backing incident investigations and audit attestations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Artifact</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search evidence by ID, artifact title, control, or incident..."
          className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
        />
      </div>

      {/* Evidence Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Evidence ID</th>
                <th className="py-3 px-4">Artifact Title & Source</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Control Mapped</th>
                <th className="py-3 px-4">SHA-256 Digest</th>
                <th className="py-3 px-4 text-right">Associated Incident</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{ev.id}</td>
                  <td className="py-3 px-4 max-w-sm">
                    <div className="font-semibold text-slate-100">{ev.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      Source: {ev.source} · {ev.size}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {ev.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{ev.relatedControl}</td>
                  <td className="py-3 px-4 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="truncate max-w-[140px]">{ev.sha256Hash}</span>
                      <button
                        onClick={() => handleCopyHash(ev.sha256Hash, ev.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                        title="Copy SHA-256 hash"
                      >
                        {copiedId === ev.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    <button
                      onClick={() => onSelectIncident(ev.relatedIncidentId)}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      {ev.relatedIncidentId}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Evidence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Attach Verified Evidence Record</span>
            </h2>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Artifact Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. S3 Bucket Public Access Block Verification Scan"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Evidence Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CONFIGURATION_SNAPSHOT">CONFIGURATION_SNAPSHOT</option>
                    <option value="SECURITY_SCAN">SECURITY_SCAN</option>
                    <option value="LOG_EXTRACT">LOG_EXTRACT</option>
                    <option value="REMEDIATION_PROOF">REMEDIATION_PROOF</option>
                    <option value="AUDIT_REPORT">AUDIT_REPORT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Source Tool / API</label>
                  <input
                    type="text"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Related Incident</label>
                  <input
                    type="text"
                    value={relatedIncidentId}
                    onChange={e => setRelatedIncidentId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Related Control</label>
                  <input
                    type="text"
                    value={relatedControl}
                    onChange={e => setRelatedControl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Observation / Cryptographic Verification</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
                >
                  Compute Hash & Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
