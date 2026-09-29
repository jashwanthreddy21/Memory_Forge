/**
 * Memory Forge - Enterprise Security Operations & Compliance Memory Agent
 * Core Data Models & Type Definitions
 */

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'REMEDIATION_PENDING' | 'RESOLVED' | 'CLOSED';
export type RemediationStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
export type MemoryType = 'INCIDENT' | 'ROOT_CAUSE' | 'CONTROL' | 'REMEDIATION' | 'POST_MORTEM' | 'AUDIT';
export type EvidenceType = 
  | 'CONFIGURATION_SNAPSHOT'
  | 'SECURITY_SCAN'
  | 'LOG_EXTRACT'
  | 'SCREENSHOT'
  | 'TICKET'
  | 'AUDIT_REPORT'
  | 'POST_MORTEM'
  | 'REMEDIATION_PROOF';

export interface Incident {
  id: string; // e.g., 'INC-1024'
  title: string;
  description: string;
  severity: SeverityLevel;
  category: string;
  affectedAsset: string;
  environment: 'production' | 'staging' | 'development' | 'corporate';
  detectionSource: string;
  detectedAt: string;
  assignedAnalyst: string;
  status: IncidentStatus;
  evidence: string;
  tags: string[];
  investigationId?: string;
  memoryCommitted?: boolean;
  recalledMemoryIds?: string[];
}

export interface RecalledMemory {
  memoryId: string;
  sourceIncidentId: string;
  title: string;
  similarity: number; // e.g. 0.92 for 92%
  rootCause: string;
  control: string;
  previousRemediation: string[];
  evidenceSummary: string;
  whyItMatters: string;
  date: string;
  cloudSource?: boolean;
  cloudScores?: {
    semantic?: number;
    keyword?: number;
    final?: number;
  };
  cloudEntities?: string[];
}

export interface InvestigationResult {
  id: string;
  incidentId: string;
  executiveSummary: string;
  probableRootCause: string;
  attackFailurePath: string[];
  affectedAsset: string;
  securityImpact: string;
  securityControl: string;
  relatedControls: string[];
  recommendedRemediation: string[];
  evidenceRequirements: string[];
  confidence: number; // e.g. 87 for 87%
  similarHistoricalIncidents: RecalledMemory[];
  recurringPattern?: {
    detected: boolean;
    patternDescription: string;
    incidentCount: number;
    firstSeen: string;
    riskScore: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  };
  recommendedNextSteps: string[];
  aiGeneratedBadge: boolean;
  historicalContextInjected: boolean;
  createdAt: string;
}

export interface HindsightMemory {
  id: string; // e.g., 'MEM-2041'
  sourceIncidentId: string;
  title: string;
  type: MemoryType;
  summary: string;
  rootCause: string;
  securityControl: string;
  affectedAsset: string;
  remediation: string[];
  evidence: string[];
  severity: SeverityLevel;
  status: 'ACTIVE' | 'ARCHIVED';
  lessonsLearned: string[];
  tags: string[];
  createdAt: string;
  relationships: {
    targetId: string;
    targetType: string;
    relation: 'CAUSED_BY' | 'MAPS_TO' | 'REMEDIATED_BY' | 'SUPPORTED_BY' | 'RELATED_TO' | 'RESOLVES';
  }[];
}

export interface Finding {
  id: string;
  incidentId: string;
  title: string;
  rootCause: string;
  securityControl: string;
  severity: SeverityLevel;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  firstSeen: string;
  lastSeen: string;
  occurrenceCount: number;
  isRecurring: boolean;
  remediationIds: string[];
}

export interface SecurityControl {
  id: string;
  code: string; // e.g., 'AC-01'
  name: string; // e.g., 'Access Control'
  category: string;
  description: string;
  frameworks: string[]; // e.g., ['SOC 2 CC6.1', 'ISO 27001 A.9.1', 'NIST CSF PR.AC-1']
  totalFindings: number;
  resolvedFindings: number;
  inProgressFindings: number;
  openFindings: number;
  evidenceCount: number;
  lastOccurrence: string;
  healthStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL_DRIFT';
  relatedIncidentIds: string[];
}

export interface RemediationItem {
  id: string; // e.g., 'REM-0042'
  description: string;
  incidentId: string;
  rootCause: string;
  control: string;
  owner: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: RemediationStatus;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  evidence: string;
  verificationNotes?: string;
}

export interface EvidenceRecord {
  id: string; // e.g., 'EVD-901'
  type: EvidenceType;
  title: string;
  source: string;
  relatedIncidentId: string;
  relatedControl: string;
  relatedFindingId?: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'FLAGGED';
  sha256Hash: string;
  description: string;
  size: string;
}

export interface PostMortem {
  id: string;
  incidentId: string;
  title: string;
  summary: string;
  timeline: { time: string; event: string }[];
  rootCause: string;
  impact: string;
  detection: string;
  response: string;
  remediation: string[];
  lessonsLearned: string[];
  preventiveActions: string[];
  evidenceIds: string[];
  relatedHistoricalIncidents: string[];
  committedToHindsight: boolean;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: 'INCIDENT' | 'REMEDIATION' | 'PATTERN_DETECTED' | 'CONTROL_ADDED' | 'AUDIT_VERIFIED';
  description: string;
  relatedId?: string;
  severity?: SeverityLevel;
  highlightText?: string;
}

export interface AuditQueryResponse {
  query: string;
  matchedControl: string;
  frameworkReferences: string[];
  totalHistoricalFindings: number;
  statusBreakdown: {
    resolved: number;
    inProgress: number;
    open: number;
  };
  recurringRootCause: string;
  availableEvidence: {
    id: string;
    title: string;
    type: string;
    hash: string;
    date: string;
  }[];
  recentIncidents: {
    id: string;
    title: string;
    date: string;
    status: string;
  }[];
  executiveSummary: string;
  complianceRating: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'AT_RISK';
}
