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

  interface PresetItem {
    id: string;
    badge: string;
    title: string;
    description: string;
    severity: SeverityLevel;
    category: string;
    affectedAsset: string;
    environment: 'production' | 'staging' | 'development' | 'corporate';
    detectionSource: string;
    assignedAnalyst: string;
    evidence: string;
    tags: string;
    isSpecial?: boolean;
  }

  const DEMO_PRESETS: PresetItem[] = [
    {
      id: 'INC-1038',
      badge: '★ INC-1038 (Recall Test)',
      title: 'Public Cloud Storage Exposure on Customer Reports',
      description: 'A production storage bucket "customer-reports-bucket" was discovered with public read access enabled after deployment script execution.',
      severity: 'HIGH',
      category: 'Cloud Security',
      affectedAsset: 'customer-reports-bucket',
      environment: 'production',
      detectionSource: 'Cloud Security Scanner',
      assignedAnalyst: 'Alex Rivera, Incident Responder',
      evidence: 'Automated policy validator flagged AllUsers read permission on bucket root ACL.',
      tags: 'Cloud Storage, Public Exposure, IAM Policy, Production',
      isSpecial: true
    },
    {
      id: 'INC-1024',
      badge: 'INC-1024 (Storage Baseline)',
      title: 'Public Cloud Storage Exposure',
      description: 'A production storage bucket was discovered with public read access. Cloud security scanner flagged unauthenticated GET access.',
      severity: 'HIGH',
      category: 'Cloud Security',
      affectedAsset: 'customer-data-bucket',
      environment: 'production',
      detectionSource: 'Cloud Security Scanner',
      assignedAnalyst: 'Alex Rivera, Incident Responder',
      evidence: 'Configuration scan detected public read access. HTTP 200 returned on unauthenticated objects.',
      tags: 'Cloud Storage, Access Policy, S3/GCS, Public Access'
    },
    {
      id: 'INC-1042',
      badge: 'INC-1042 (K8s EKS Ingress)',
      title: 'Unrestricted Kubernetes API Server Ingress in Production EKS',
      description: 'EKS cluster control-plane endpoint public access was unexpectedly enabled without CIDR restrictions following an automated cluster upgrade script.',
      severity: 'CRITICAL',
      category: 'Kubernetes & Container Security',
      affectedAsset: 'k8s-prod-cluster-controlplane',
      environment: 'production',
      detectionSource: 'Cloud Security Scanner',
      assignedAnalyst: 'Devin Zhao, Principal Cloud Security Architect',
      evidence: 'AWS CloudTrail Event: UpdateClusterConfig with endpointPublicAccess=true and publicAccessCidrs=["0.0.0.0/0"].',
      tags: 'Kubernetes, EKS, API-Security, Public-Access, Cluster-Upgrade'
    },
    {
      id: 'INC-1045',
      badge: 'INC-1045 (Secret Leak)',
      title: 'Hardcoded API Secret in Public GitHub Repository Commit',
      description: 'GitGuardian secret detection triggered on commit to public mirror repository containing live Stripe production API secret key and AWS KMS HMAC token.',
      severity: 'CRITICAL',
      category: 'Secrets Management & CI/CD',
      affectedAsset: 'stripe-billing-webhook-service',
      environment: 'production',
      detectionSource: 'Secret Detection Engine',
      assignedAnalyst: 'Sarah Chen, Lead SecOps',
      evidence: 'Secret scanning alert #8412; GitHub commit SHA a79b2f with active production key entropy match.',
      tags: 'Secret-Leak, Git, API-Key, Credential-Exposure, Production'
    },
    {
      id: 'INC-1048',
      badge: 'INC-1048 (Egress Anomaly)',
      title: 'Anomalous Cross-Region Egress Spike on Customer Document Store',
      description: 'GuardDuty flagged exfiltration behavior: 42 GB of encrypted customer PDF documents downloaded within 12 minutes to an unrecognized IP range via compromised session token.',
      severity: 'HIGH',
      category: 'Data Loss Prevention & Network Security',
      affectedAsset: 'doc-archive-bucket-us-west-2',
      environment: 'production',
      detectionSource: 'GuardDuty Anomaly Detector',
      assignedAnalyst: 'Alex Rivera, Incident Responder',
      evidence: 'VPC Flow Logs, S3 Server Access Logs, and GuardDuty Finding ID: UnauthorizedAccess:S3/MaliciousIPCaller.',
      tags: 'Data-Exfiltration, GuardDuty, S3, Egress-Anomaly, Session-Hijack'
    },
    {
      id: 'INC-1051',
      badge: 'INC-1051 (IAM Privilege Escalation)',
      title: 'Privilege Escalation via Lambda IAM Role PassRole Misconfiguration',
      description: 'Security scanner identified that the invoice generator Lambda execution role contains iam:PassRole without resource boundary constraints, allowing escalation to AdministratorAccess.',
      severity: 'HIGH',
      category: 'Cloud Security & IAM',
      affectedAsset: 'invoice-generator-lambda-execution-role',
      environment: 'staging',
      detectionSource: 'IAM Access Analyzer',
      assignedAnalyst: 'Marcus Vance, Senior Security Engineer',
      evidence: 'IAM Access Analyzer evaluation report showing role passability to EC2 and Lambda resources.',
      tags: 'IAM, Lambda, Privilege-Escalation, PassRole, Least-Privilege'
    },
    {
      id: 'INC-1015',
      badge: 'INC-1015 (DB Ingress)',
      title: 'Public Database Exposure via Security Group Ingress',
      description: 'PostgreSQL read-replica security group was modified to allow 0.0.0.0/0 on port 5432 during staging debug session.',
      severity: 'CRITICAL',
      category: 'Infrastructure',
      affectedAsset: 'prod-replica-pg-01',
      environment: 'production',
      detectionSource: 'Network Flow Monitor',
      assignedAnalyst: 'Marcus Vance, Senior Security Engineer',
      evidence: 'VPC Flow logs and Terraform state drift delta.',
      tags: 'Network, PostgreSQL, Security-Group, Public-IP'
    }
  ];

  if (!isOpen) return null;

  const handleApplyPreset = (preset: PresetItem) => {
    setId(preset.id);
    setTitle(preset.title);
    setDescription(preset.description);
    setSeverity(preset.severity);
    setCategory(preset.category);
    setAffectedAsset(preset.affectedAsset);
    setEnvironment(preset.environment);
    setDetectionSource(preset.detectionSource);
    setAssignedAnalyst(preset.assignedAnalyst);
    setEvidence(preset.evidence);
    setTags(preset.tags);
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
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Demo Presets:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-click autofill</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  id === p.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-sm'
                    : p.isSpecial
                    ? 'bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-800/60'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {p.badge}
              </button>
            ))}
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
