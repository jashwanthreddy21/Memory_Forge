"""
Memory Forge - FastAPI Application
Turn Security Incidents Into Organizational Memory
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime

from backend.models.schemas import (
    IncidentBase, IncidentCreate, InvestigationResponse,
    MemoryCommitRequest, AuditQueryRequest, AuditQueryResponse, ChatRequest
)
from backend.services.hindsight_service import HindsightService
from backend.agents.investigation_agent import InvestigationAgent
from backend.agents.agent_orchestrator import RecallAgent, MemoryAgent, ComplianceAgent, AuditAgent

app = FastAPI(
    title="Memory Forge API",
    description="AI Security Operations & Compliance Memory Agent powered by Hindsight",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services and Agents
hindsight_service = HindsightService()
investigation_agent = InvestigationAgent(hindsight_service)
recall_agent = RecallAgent(hindsight_service)
memory_agent = MemoryAgent(hindsight_service)
compliance_agent = ComplianceAgent()
audit_agent = AuditAgent(hindsight_service)

# In-memory incident store for FastAPI demo
incidents_db: List[Dict[str, Any]] = [
    {
        "id": "INC-1024",
        "title": "Public Cloud Storage Exposure",
        "description": "A production storage bucket was discovered with public read access.",
        "severity": "HIGH",
        "category": "Cloud Security",
        "affectedAsset": "customer-data-bucket",
        "environment": "production",
        "detectionSource": "Cloud Security Scanner",
        "detectedAt": "2026-02-18T11:45:00Z",
        "assignedAnalyst": "Alex Rivera, Incident Responder",
        "evidence": "Configuration scan detected public access.",
        "tags": ["Cloud Storage", "Access Policy", "Public Access"],
        "status": "RESOLVED",
        "memoryCommitted": True
    },
    {
        "id": "INC-1038",
        "title": "Public Cloud Storage Exposure on Customer Reports",
        "description": "A production storage bucket customer-reports-bucket was discovered with public read access enabled after deployment script execution.",
        "severity": "HIGH",
        "category": "Cloud Security",
        "affectedAsset": "customer-reports-bucket",
        "environment": "production",
        "detectionSource": "Cloud Security Scanner",
        "detectedAt": "2026-09-28T21:10:00Z",
        "assignedAnalyst": "Alex Rivera, Incident Responder",
        "evidence": "Automated policy validator flagged AllUsers read permission on bucket root ACL.",
        "tags": ["Cloud Storage", "Public Exposure", "IAM Policy"],
        "status": "OPEN",
        "memoryCommitted": False
    }
]

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {
            "api": "ONLINE",
            "database": "ONLINE",
            "hindsight": "ONLINE",
            "aiEngine": "ONLINE"
        }
    }

@app.get("/api/incidents")
def list_incidents():
    return incidents_db

@app.get("/api/incidents/{incident_id}")
def get_incident(incident_id: str):
    for inc in incidents_db:
        if inc["id"] == incident_id:
            recalled = hindsight_service.recall(inc)
            return {"incident": inc, "recalledMemories": recalled}
    raise HTTPException(status_code=404, detail="Incident not found")

@app.post("/api/incidents")
def create_incident(incident: IncidentCreate):
    new_inc = incident.dict()
    new_inc["status"] = "OPEN"
    new_inc["memoryCommitted"] = False
    incidents_db.insert(0, new_inc)
    return new_inc

@app.post("/api/incidents/{incident_id}/investigate")
def investigate_incident(incident_id: str):
    for inc in incidents_db:
        if inc["id"] == incident_id:
            result = investigation_agent.investigate(inc)
            inc["status"] = "INVESTIGATING"
            return result
    raise HTTPException(status_code=404, detail="Incident not found")

@app.post("/api/incidents/{incident_id}/commit-memory")
def commit_memory(incident_id: str, body: MemoryCommitRequest):
    for inc in incidents_db:
        if inc["id"] == incident_id:
            mem = memory_agent.commit_investigation(inc, body.dict())
            inc["memoryCommitted"] = True
            inc["status"] = "RESOLVED"
            return {"success": True, "memory": mem}
    raise HTTPException(status_code=404, detail="Incident not found")

@app.get("/api/memories")
def get_memories():
    return hindsight_service.memories

@app.post("/api/audit/query")
def audit_query(request: AuditQueryRequest):
    controls = [
        {"name": "Access Control", "code": "AC-01", "totalFindings": 8, "resolvedFindings": 5, "inProgressFindings": 2, "openFindings": 1, "frameworks": ["SOC 2 CC6.1", "ISO 27001 A.9.1"]}
    ]
    evidence = [
        {"id": "EVD-301", "title": "Storage Bucket ACL Snapshot", "relatedControl": "Access Control", "uploadedAt": "2026-02-18"}
    ]
    return audit_agent.answer_audit_request(request.query, controls, evidence)
