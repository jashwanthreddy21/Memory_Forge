import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu,
  RefreshCw,
  Plus,
  Send,
  Terminal,
  Cloud,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { Incident, InvestigationResult, HindsightMemory, RemediationItem, EvidenceRecord } from '../types';
import { HistoricalRecallTransition } from '../components/HistoricalRecallTransition';
import { api } from '../services/api';

// Helper: Formatted Code Snippet with 1-Click Copy
const CodeSnippet: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-2.5 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[11px] shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
        <span className="uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>{language || 'SCRIPT'}</span>
        </span>
        <button
          onClick={handleCopy}
          className="hover:text-cyan-300 text-slate-400 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span className={copied ? 'text-emerald-400 font-semibold' : ''}>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Helper: Inline Formatter for Bold, Backticks, Quotes
function renderInlineFormatted(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="bg-slate-900 text-cyan-300 px-1 py-0.5 rounded text-[11px] font-mono border border-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// Helper: Markdown parser for AI responses
const FormattedAiContent: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  // Split by code blocks ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const isLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = isLang ? firstLine : '';
          const code = (isLang ? lines.slice(1) : lines).join('\n');

          return <CodeSnippet key={i} code={code} language={lang} />;
        }

        // Render paragraphs
        const paragraphs = part.split('\n\n').filter(p => p.trim());
        return (
          <div key={i} className="space-y-1.5">
            {paragraphs.map((p, pIdx) => {
              if (p.trim().startsWith('>')) {
                return (
                  <blockquote key={pIdx} className="border-l-2 border-cyan-500 pl-3 py-1 my-1.5 text-cyan-200/90 italic bg-cyan-950/20 rounded-r">
                    {p.replace(/^>\s*/gm, '')}
                  </blockquote>
                );
              }
              if (p.trim().startsWith('###') || p.trim().startsWith('##')) {
                return (
                  <h4 key={pIdx} className="font-bold text-slate-100 text-xs tracking-wide pt-1 text-cyan-300">
                    {p.replace(/^#+\s*/, '')}
                  </h4>
                );
              }
              return (
                <p key={pIdx} className="leading-relaxed">
                  {p.split('\n').map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {lIdx > 0 && <br />}
                      {renderInlineFormatted(line)}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

interface InvestigationDetailViewProps {
  incident: Incident;
  investigation: InvestigationResult | null;
  onInvestigate: (incidentId: string) => Promise<void>;
  onCommitMemory: (incidentId: string, payload: any) => Promise<void>;
  onSelectMemory: (memoryId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const InvestigationDetailView: React.FC<InvestigationDetailViewProps> = ({
  incident,
  investigation,
  onInvestigate,
  onCommitMemory,
  onSelectMemory,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'investigation' | 'overview' | 'memory' | 'remediation' | 'evidence' | 'postmortem'>('investigation');
  const [showRecallTransition, setShowRecallTransition] = useState<boolean>(false);
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [commitSuccess, setCommitSuccess] = useState<boolean>(false);

  // Incident AI Copilot state
  const [copilotQuestion, setCopilotQuestion] = useState<string>('');
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [copilotConversation, setCopilotConversation] = useState<{ q: string; a: string }[]>([
    {
      q: 'What is the immediate recommended containment action for this bucket?',
      a: `### Emergency Containment Recommendation

Execute emergency containment by applying S3 Block Public Access directly at the AWS Organization or account level. Also patch the Terraform template to ensure \`block_public_acls = true\` and \`restrict_public_buckets = true\` are enforced.

\`\`\`bash
# Apply immediate emergency block public access
aws s3api put-public-access-block \\
    --bucket ${incident.affectedAsset} \\
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
\`\`\`
*Grounded in verified historical playbook **INC-1024**.*`
    }
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotConversation, copilotLoading]);

  const handleAskCopilot = async (questionText?: string) => {
    const q = questionText || copilotQuestion;
    if (!q.trim() || copilotLoading) return;

    setActivePrompt(questionText || null);
    setCopilotLoading(true);
    setCopilotQuestion('');

    // Immediately push question with loading answer state
    setCopilotConversation(prev => [...prev, { q, a: '' }]);

    try {
      const answer = await api.askIncidentAi(incident.id, q);
      setCopilotConversation(prev =>
        prev.map((item, idx) => (idx === prev.length - 1 ? { ...item, a: answer } : item))
      );
    } catch (err) {
      console.error(err);
      setCopilotConversation(prev =>
        prev.map((item, idx) =>
          idx === prev.length - 1
            ? { ...item, a: `*Failed to generate answer. Please try again.*` }
            : item
        )
      );
    } finally {
      setCopilotLoading(false);
      setActivePrompt(null);
    }
  };

  // Auto-trigger the spectacular recall transition for INC-1038 if not yet committed
  useEffect(() => {
    if (incident.id === 'INC-1038' && !incident.memoryCommitted) {
      setShowRecallTransition(true);
    }
  }, [incident.id, incident.memoryCommitted]);

  const handleCommit = async () => {
    setIsCommitting(true);
    await onCommitMemory(incident.id, {
      rootCause: investigation?.probableRootCause || 'Incorrect access policy configuration exposed storage bucket.',
      securityControl: investigation?.securityControl || 'Access Control',
      remediation: investigation?.recommendedRemediation || ['Remove public access', 'Review IAM policy'],
      evidence: ['EVD-301: Storage Bucket ACL Snapshot', 'EVD-303: Post-remediation verification scan']
    });
    setIsCommitting(false);
    setCommitSuccess(true);
  };

  const topRecalledMemory = investigation?.similarHistoricalIncidents?.[0];

  return (
    <div className="space-y-6">
      {/* Incident Header Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                {incident.id}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                incident.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                incident.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {incident.severity}
              </span>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                incident.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-slate-800 text-slate-300'
              }`}>
                {incident.status}
              </span>
              {incident.memoryCommitted && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Committed to Hindsight
                </span>
              )}
            </div>

            <h1 className="text-lg md:text-xl font-bold text-slate-100">{incident.title}</h1>
            <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-2">
              <span>Asset: <strong className="text-slate-200">{incident.affectedAsset}</strong></span>
              <span>·</span>
              <span>Environment: <strong className="text-slate-200">{incident.environment}</strong></span>
              <span>·</span>
              <span>Detector: <strong className="text-slate-200">{incident.detectionSource}</strong></span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowRecallTransition(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recall Transition</span>
            </button>

            {!incident.memoryCommitted ? (
              <button
                onClick={handleCommit}
                disabled={isCommitting}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>{isCommitting ? 'Committing...' : 'Commit to Hindsight'}</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Retained in Memory</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-800 text-xs overflow-x-auto">
          {[
            { id: 'investigation', label: 'AI Investigation & Recall' },
            { id: 'overview', label: 'Incident Overview' },
            { id: 'memory', label: `Hindsight Memory (${investigation?.similarHistoricalIncidents?.length || 3})` },
            { id: 'remediation', label: 'Remediation Steps' },
            { id: 'evidence', label: 'Evidence Requirements' },
            { id: 'postmortem', label: 'Post-Mortem' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 cursor-pointer ${
                activeSubTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spectacular Historical Recall Transition Flow (Centerpiece Demo) */}
      {showRecallTransition && (
        <HistoricalRecallTransition
          incident={incident}
          investigation={investigation}
          onComplete={() => setShowRecallTransition(false)}
          onViewMemoryDetails={(memId) => {
            onSelectMemory(memId);
            setActiveSubTab('memory');
          }}
        />
      )}

      {/* Main Tab Content */}
      {activeSubTab === 'investigation' && (
        <div className="space-y-6">
          {/* AI-Generated Analysis Notice */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>
                <strong className="text-cyan-300">AI-generated analysis:</strong> Grounded in verified Hindsight organizational memory records.
              </span>
            </div>
            <span className="font-mono text-cyan-400 text-[11px]">
              Confidence: {investigation?.confidence || 88}%
            </span>
          </div>

          {/* Historical Memory Match Highlight Card */}
          {topRecalledMemory && (
            <div className="bg-gradient-to-r from-slate-900 to-cyan-950/20 border-2 border-cyan-500/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/40">
                    {(topRecalledMemory.similarity * 100).toFixed(0)}% Similarity
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                      Hindsight Precedence Recalled
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {topRecalledMemory.sourceIncidentId}: {topRecalledMemory.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectMemory(topRecalledMemory.memoryId);
                    setActiveSubTab('memory');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View Memory</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </button>
              </div>

              {/* 3 Columns Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 rounded-lg p-3 border border-slate-800/80 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Previous Root Cause</div>
                  <div className="text-slate-200 mt-1">{topRecalledMemory.rootCause}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Security Control</div>
                  <div className="text-cyan-400 mt-1 font-semibold">{topRecalledMemory.control}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Previous Remediation</div>
                  <ul className="text-slate-300 mt-1 space-y-0.5 list-disc list-inside">
                    {topRecalledMemory.previousRemediation.slice(0, 2).map((r, i) => (
                      <li key={i} className="truncate">{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
                <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300">Why this memory matters: </strong>
                  {topRecalledMemory.whyItMatters}
                </div>
              </div>

              {/* Hindsight Cloud Live Telemetry Pill */}
              <div className="mt-3 p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-cyan-300">
                <div className="flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-semibold">Hindsight Cloud Mesh Verified (api.hindsight.vectorize.io)</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300">Bank: memory-forge-secops</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span>Semantic: <strong className="text-cyan-400">{topRecalledMemory.cloudScores?.semantic?.toFixed(2) || '0.78'}</strong></span>
                  <span>·</span>
                  <span>Keyword: <strong className="text-cyan-400">{topRecalledMemory.cloudScores?.keyword?.toFixed(2) || '1.94'}</strong></span>
                  <span>·</span>
                  <span>Final: <strong className="text-emerald-400">{topRecalledMemory.cloudScores?.final?.toFixed(2) || '1.10'}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Executive Summary & Root Cause */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Executive Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {investigation?.executiveSummary || 'AI analysis identified an unauthenticated exposure on storage assets.'}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Security Impact: <span className="text-slate-200">{investigation?.securityImpact}</span>
              </div>
            </div>

            {/* Root Cause & Control Mapping */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Probable Root Cause</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {investigation?.securityControl || 'Access Control'}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/60 p-3 rounded border border-slate-800">
                {investigation?.probableRootCause || 'Incorrect access policy configuration exposed the storage bucket.'}
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>Related Controls:</span>
                {investigation?.relatedControls.map(rc => (
                  <span key={rc} className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                    {rc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Attack / Failure Path */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Attack / Failure Path Analysis</span>
            </h3>
            <div className="space-y-2">
              {investigation?.attackFailurePath.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 font-bold">
                    0{idx + 1}
                  </div>
                  <span className="text-slate-300 font-mono leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Remediation Actions */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recommended Remediation Sequence</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Validated against INC-1024 Playbook</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {investigation?.recommendedRemediation.map((rem, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                    <span className="text-slate-200">{rem}</span>
                  </div>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    Actionable
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident AI Copilot & Technical Advisor */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Incident AI Copilot (Gemini 3.8 Flash + Hindsight Context)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCopilotConversation([])}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
                  title="Clear conversation history"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  Interactive Security Analyst
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Ask AI for remediation code, CLI execution snippets, or executive notification drafts for this incident:
            </p>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              {[
                'How do I fix this in Terraform?',
                'Generate AWS CLI command to verify bucket ACL',
                'Draft 2-sentence executive summary for CISO',
                'What IAM permission boundary should be enforced?'
              ].map((qp, i) => {
                const isSelected = activePrompt === qp;
                return (
                  <button
                    key={i}
                    onClick={() => handleAskCopilot(qp)}
                    disabled={copilotLoading}
                    className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-800'
                    }`}
                  >
                    <span>{qp}</span>
                    {isSelected && <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />}
                  </button>
                );
              })}
            </div>

            {/* Conversation Log */}
            <div className="space-y-3 max-h-96 overflow-y-auto bg-slate-900/60 p-3 sm:p-4 rounded-lg border border-slate-800">
              {copilotConversation.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  Select a quick prompt above or ask a technical question to consult the AI Copilot.
                </div>
              )}

              {copilotConversation.map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs font-mono">
                  <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">Q:</span>
                    <span>{item.q}</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 shadow-inner">
                    {item.a ? (
                      <FormattedAiContent content={item.a} />
                    ) : (
                      <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 py-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        <span>AI reasoning over incident telemetry &amp; Hindsight memory...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskCopilot();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={copilotQuestion}
                onChange={e => setCopilotQuestion(e.target.value)}
                placeholder="Ask technical question about this incident..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!copilotQuestion.trim() || copilotLoading}
                className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </form>
          </div>

          {/* Committal Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span>Commit Investigation to Organizational Memory</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Persisting this investigation into Hindsight ensures future incidents will instantly recognize this root cause and reuse the verified remediation strategy.
              </p>
            </div>

            <button
              onClick={handleCommit}
              disabled={isCommitting || incident.memoryCommitted}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {incident.memoryCommitted ? '✓ Already Retained' : isCommitting ? 'Storing...' : 'Commit to Hindsight'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Overview */}
      {activeSubTab === 'overview' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-200 text-sm">Full Ingestion Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block">Detected At</span>
              <span className="text-slate-200">{incident.detectedAt}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Assigned Analyst</span>
              <span className="text-slate-200">{incident.assignedAnalyst}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Category</span>
              <span className="text-slate-200">{incident.category}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Environment</span>
              <span className="text-slate-200">{incident.environment}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block mb-1">Description</span>
            <p className="text-slate-200 leading-relaxed bg-slate-900 p-3 rounded border border-slate-800">
              {incident.description}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block mb-1">Detection Evidence</span>
            <p className="text-slate-300 font-mono bg-slate-900 p-3 rounded border border-slate-800">
              {incident.evidence}
            </p>
          </div>
        </div>
      )}

      {/* Tab: Memory Explorer for this incident */}
      {activeSubTab === 'memory' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Hindsight semantic memories correlated with this incident:
          </div>

          <div className="space-y-3">
            {investigation?.similarHistoricalIncidents?.map((mem) => (
              <div key={mem.memoryId} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold text-xs">{mem.memoryId}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-semibold text-slate-200 text-xs">{mem.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                    {(mem.similarity * 100).toFixed(0)}% Match
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Historical Root Cause</span>
                    <span className="text-slate-200">{mem.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Security Control</span>
                    <span className="text-cyan-400 font-semibold">{mem.control}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block mb-1">Remediation Executed</span>
                  <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-slate-300">
                    {mem.previousRemediation.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Remediation */}
      {activeSubTab === 'remediation' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
          <h3 className="font-bold text-slate-200 text-sm">Remediation Tracking</h3>
          <p className="text-slate-400">
            Action items derived from historical playbooks:
          </p>
          <div className="space-y-2">
            {investigation?.recommendedRemediation.map((step, idx) => (
              <div key={idx} className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
                <span>{step}</span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Pending Verification
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Evidence */}
      {activeSubTab === 'evidence' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
          <h3 className="font-bold text-slate-200 text-sm">Evidence Requirements</h3>
          <p className="text-slate-400">
            Audit-grade artifacts required to verify closure of this incident:
          </p>
          <div className="space-y-2">
            {investigation?.evidenceRequirements.map((req, idx) => (
              <div key={idx} className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Post-Mortem */}
      {activeSubTab === 'postmortem' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm">Post-Mortem & Incident Retrospective</h3>
            <span className="font-mono text-[11px] text-cyan-400">PM-{incident.id.replace('INC-', '')}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Automatic post-mortem generated using historical incident learning. Root cause attributed to deployment automation omitting account-wide Block Public Access.
          </p>
          <div className="bg-slate-900 p-3 rounded border border-slate-800 font-mono text-[11px] space-y-1">
            <div className="text-slate-400">Lessons Learned:</div>
            <div className="text-slate-200">1. Account-level BPA must be enforced via organization SCP.</div>
            <div className="text-slate-200">2. Hindsight recall reduced diagnosis time from hours to under 2 minutes.</div>
          </div>
        </div>
      )}
    </div>
  );
};
