import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Sparkles,
  Database,
  Server,
  FileText
} from 'lucide-react';
import { Incident, SeverityLevel } from '../types';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Partial<Incident>) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [id, setId] = useState<string>('INC-1038');
  const [title, setTitle] = useState<string>('Public Cloud Storage Exposure on Customer Reports');
  const [description, setDescription] = useState<string>(
    'A production storage bucket customer-reports-bucket was discovered with public read access enabled after deployment script execution.'
  );
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [category, setCategory] = useState<string>('Cloud Security');
  const [affectedAsset, setAffectedAsset] = useState<string>('customer-reports-bucket');
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'development' | 'corporate'>('production');
  const [detectionSource, setDetectionSource] = useState<string>('Cloud Security Scanner');
  const [assignedAnalyst, setAssignedAnalyst] = useState<string>('Alex Rivera, Incident Responder');
  const [evidence, setEvidence] = useState<string>('Automated policy validator flagged AllUsers read permission on bucket root ACL.');
  const [tags, setTags] = useState<string>('Cloud Storage, Public Exposure, IAM Policy, Production');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: 'INC-1024' | 'INC-1038' | 'INC-1045') => {
    if (preset === 'INC-1024') {
      setId('INC-1024');
      setTitle('Public Cloud Storage Exposure');
      setDescription('A production storage bucket was discovered with public read access. Cloud security scanner flagged unauthenticated GET access.');
      setSeverity('HIGH');
      setCategory('Cloud Security');
      setAffectedAsset('customer-data-bucket');
      setEnvironment('production');
      setDetectionSource('Cloud Security Scanner');
      setEvidence('Configuration scan detected public read access. HTTP 200 returned on unauthenticated objects.');
      setTags('Cloud Storage, Access Policy, S3/GCS, Public Access');
    } else if (preset === 'INC-1038') {
      setId('INC-1038');
      setTitle('Public Cloud Storage Exposure on Customer Reports');
      setDescription('A production storage bucket "customer-reports-bucket" was discovered with public read access enabled after deployment script execution.');
      setSeverity('HIGH');
      setCategory('Cloud Security');
      setAffectedAsset('customer-reports-bucket');
      setEnvironment('production');
      setDetectionSource('Cloud Security Scanner');
      setEvidence('Automated policy validator flagged AllUsers read permission on bucket root ACL.');
      setTags('Cloud Storage, Public Exposure, IAM Policy, Production');
    } else if (preset === 'INC-1045') {
      setId('INC-1045');
      setTitle('Over-Privileged Service Account in Deployment Runner');
      setDescription('CI/CD runner token detected with roles/owner on production cloud projects.');
      setSeverity('CRITICAL');
      setCategory('Cloud Security');
      setAffectedAsset('github-deployer-sa');
      setEnvironment('production');
      setDetectionSource('IAM Privilege Scanner');
      setEvidence('IAM audit log exported broad wildcard mutations on compute and storage assets.');
      setTags('IAM, CI/CD, Least Privilege, Runner');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id,
      title,
      description,
      severity,
      category,
      affectedAsset,
      environment,
      detectionSource,
      assignedAnalyst,
      evidence,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">Create / Ingest Security Incident</h2>
              <p className="text-xs text-slate-400">Initiates automated Hindsight memory recall & AI investigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Demo Presets:</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset('INC-1024')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
            >
              INC-1024 (Baseline)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('INC-1038')}
              className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 transition-colors cursor-pointer"
            >
              ★ INC-1038 (Recall Test)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('INC-1045')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
            >
              INC-1045 (IAM Drift)
            </button>
          </div>
        </div>

        {/* Ingestion Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Incident ID</label>
              <input
                type="text"
                required
                value={id}
                onChange={e => setId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as SeverityLevel)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
                <option value="INFORMATIONAL">INFORMATIONAL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Environment</label>
              <select
                value={environment}
                onChange={e => setEnvironment(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Incident Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Affected Asset</label>
              <input
                type="text"
                required
                value={affectedAsset}
                onChange={e => setAffectedAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Detection Source</label>
              <input
                type="text"
                value={detectionSource}
                onChange={e => setDetectionSource(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Evidence / Observation Note</label>
            <input
              type="text"
              value={evidence}
              onChange={e => setEvidence(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-mono">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
            >
              Ingest & Run AI Investigation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
