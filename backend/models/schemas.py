"""
Memory Forge - Pydantic Schemas
Enterprise Security Operations & Compliance Memory Models
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class IncidentBase(BaseModel):
    id: str
    title: str
    description: str
    severity: str = "HIGH"
    category: str = "Cloud Security"
    affectedAsset: str
    environment: str = "production"
    detectionSource: str = "Cloud Security Scanner"
    detectedAt: Optional[str] = None
    assignedAnalyst: str = "Alex Rivera, Incident Responder"
    evidence: str = ""
    tags: List[str] = []

class IncidentCreate(IncidentBase):
    pass

class RecalledMemoryItem(BaseModel):
    memoryId: str
    sourceIncidentId: str
    title: str
    similarity: float
    rootCause: str
    control: str
    previousRemediation: List[str]
    evidenceSummary: str
    whyItMatters: str
    date: str

class InvestigationResponse(BaseModel):
    id: str
    incidentId: str
    executiveSummary: str
    probableRootCause: str
    attackFailurePath: List[str]
    affectedAsset: str
    securityImpact: str
    securityControl: str
    relatedControls: List[str]
    recommendedRemediation: List[str]
    evidenceRequirements: List[str]
    confidence: int
    similarHistoricalIncidents: List[RecalledMemoryItem]
    recurringPattern: Optional[Dict[str, Any]] = None
    recommendedNextSteps: List[str]
    aiGeneratedBadge: bool = True
    historicalContextInjected: bool = True
    createdAt: str

class MemoryCommitRequest(BaseModel):
    summary: Optional[str] = None
    rootCause: Optional[str] = None
    securityControl: Optional[str] = None
    remediation: Optional[List[str]] = None
    evidence: Optional[List[str]] = None
    lessonsLearned: Optional[List[str]] = None

class AuditQueryRequest(BaseModel):
    query: str

class AuditQueryResponse(BaseModel):
    query: str
    matchedControl: str
    frameworkReferences: List[str]
    totalHistoricalFindings: int
    statusBreakdown: Dict[str, int]
    recurringRootCause: str
    availableEvidence: List[Dict[str, str]]
    recentIncidents: List[Dict[str, str]]
    executiveSummary: str
    complianceRating: str

class ChatRequest(BaseModel):
    message: str
    conversationHistory: Optional[List[Dict[str, str]]] = []
