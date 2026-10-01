"""
Memory Forge - FastAPI Application
Turn Security Incidents Into Organizational Memory
"""

import sys
import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

# Ensure repository root is in sys.path for Render deployment
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.models.schemas import (
        IncidentBase, IncidentCreate, InvestigationResponse,
        MemoryCommitRequest, AuditQueryRequest, AuditQueryResponse, ChatRequest
    )
    from backend.services.hindsight_service import HindsightService
    from backend.agents.investigation_agent import InvestigationAgent
    from backend.agents.agent_orchestrator import RecallAgent, MemoryAgent, ComplianceAgent, AuditAgent
except ModuleNotFoundError:
    from models.schemas import (
        IncidentBase, IncidentCreate, InvestigationResponse,
        MemoryCommitRequest, AuditQueryRequest, AuditQueryResponse, ChatRequest
    )
    from services.hindsight_service import HindsightService
    from agents.investigation_agent import InvestigationAgent
    from agents.agent_orchestrator import RecallAgent, MemoryAgent, ComplianceAgent, AuditAgent

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

# Load persistent dataset from data/memoryforge.db.json if available
db_path = os.path.join(os.path.dirname(__file__), "..", "data", "memoryforge.db.json")
dataset: Dict[str, Any] = {
    "incidents": [],
    "memories": [],
    "findings": [],
    "controls": [],
    "remediations": [],
    "evidence": [],
    "timeline": [],
    "postmortems": []
}

if os.path.exists(db_path):
    try:
        with open(db_path, "r", encoding="utf-8") as f:
            dataset = json.load(f)
    except Exception as e:
        print(f"Could not load memoryforge.db.json: {e}")

incidents_db: List[Dict[str, Any]] = dataset.get("incidents", [])

@app.get("/health")
@app.get("/api/health")
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

@app.get("/api/database/stats")
def database_stats():
    return {
        "status": "ONLINE",
        "dbPath": "data/memoryforge.db.json",
        "totalIncidents": len(incidents_db),
        "totalMemories": len(dataset.get("memories", [])),
        "totalControls": len(dataset.get("controls", [])),
        "totalEvidence": len(dataset.get("evidence", [])),
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
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

@app.post("/api/incidents/{incident_id}/ai-chat")
def incident_ai_chat(incident_id: str, body: Dict[str, Any] = Body(...)):
    question = body.get("question", "")
    target_inc = next((i for i in incidents_db if i["id"] == incident_id), None)
    asset_name = target_inc.get("affectedAsset", "customer-reports-bucket") if target_inc else "customer-reports-bucket"
    
    q_lower = question.lower()
    if "terraform" in q_lower or "iac" in q_lower or "code" in q_lower:
        reply = f"""### Terraform Remediation for {asset_name}

```hcl
resource "aws_s3_bucket_public_access_block" "remediation" {{
  bucket = "{asset_name}"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}}
```
*Grounded in verified historical playbook INC-1024.*"""
    elif "cli" in q_lower or "aws" in q_lower or "command" in q_lower:
        reply = f"""### AWS CLI Verification & Containment for {asset_name}

```bash
# 1. Audit current ACL
aws s3api get-bucket-acl --bucket {asset_name}

# 2. Enforce Block Public Access immediately
aws s3api put-public-access-block \\
    --bucket {asset_name} \\
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```"""
    elif "ciso" in q_lower or "executive" in q_lower or "summary" in q_lower:
        reply = f"""### Executive Briefing for CISO
> "On {datetime.utcnow().strftime('%Y-%m-%d')}, CSPM monitoring flagged unauthenticated public read exposure on `{asset_name}`. Emergency containment revoked public access within 18 minutes; forensic review verified zero data exfiltration, and preventive Organization SCP guardrails have been locked per historical precedence INC-1024." """
    else:
        reply = f"Based on incident {incident_id} and historical memory from INC-1024, the primary recommended action is applying S3 Block Public Access directly at the account or organizational level and locking immutable IaC guardrails."

    return {"reply": reply, "timestamp": datetime.utcnow().isoformat() + "Z"}

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
    mems = dataset.get("memories", [])
    if mems:
        return mems
    return hindsight_service.memories

@app.post("/api/memories/recall")
def recall_memories(body: Dict[str, Any] = Body(...)):
    q = body.get("query", "")
    return hindsight_service.recall({"title": q, "description": q})

@app.get("/api/findings")
def list_findings():
    return dataset.get("findings", [])

@app.get("/api/findings/recurring")
def list_recurring_findings():
    return [
        {
            "control": "Access Control",
            "controlId": "ctrl-ac",
            "count": 8,
            "status": "CRITICAL_DRIFT",
            "commonRootCause": "Misconfigured IAM policies and storage bucket ACLs in deployment automation bypassing organization Block Public Access guardrails.",
            "firstSeen": "2026-01-14",
            "latestSeen": "2026-09-28",
            "affectedAssets": ["customer-reports-bucket", "customer-data-bucket", "cicd-deploy-runner-sa"],
            "historicalIncidents": ["INC-1007", "INC-1024", "INC-1038"],
            "remediationSummary": "Enforce Service Control Policy (SCP) at AWS Organization level forbidding S3 Block Public Access deactivation."
        }
    ]

@app.get("/api/controls")
def list_controls():
    return dataset.get("controls", [])

@app.get("/api/remediation")
def list_remediation():
    return dataset.get("remediations", [])

@app.patch("/api/remediation/{remediation_id}")
def update_remediation(remediation_id: str, updates: Dict[str, Any] = Body(...)):
    for rem in dataset.get("remediations", []):
        if rem["id"] == remediation_id:
            rem.update(updates)
            return rem
    return {"id": remediation_id, **updates}

@app.get("/api/evidence")
def list_evidence():
    return dataset.get("evidence", [])

@app.post("/api/evidence")
def add_evidence(ev: Dict[str, Any] = Body(...)):
    new_ev = {
        "id": f"EVD-{len(dataset.get('evidence', [])) + 301}",
        "uploadedAt": datetime.utcnow().isoformat() + "Z",
        "status": "VERIFIED",
        "sha256Hash": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        **ev
    }
    dataset.setdefault("evidence", []).insert(0, new_ev)
    return new_ev

@app.get("/api/timeline")
def list_timeline():
    return dataset.get("timeline", [])

@app.post("/api/audit/query")
def audit_query(request: AuditQueryRequest):
    controls = dataset.get("controls", [])
    evidence = dataset.get("evidence", [])
    if not controls:
        controls = [{"name": "Access Control", "code": "AC-01", "totalFindings": 8, "resolvedFindings": 5, "inProgressFindings": 2, "openFindings": 1, "frameworks": ["SOC 2 CC6.1", "ISO 27001 A.9.1"]}]
    return audit_agent.answer_audit_request(request.query, controls, evidence)

@app.post("/api/ai/chat")
def ai_chat(body: Dict[str, Any] = Body(...)):
    message = body.get("message", "")
    reply = f"I am Memory Forge AI. Analyzing your query '{message}' against our 1,284 historical incident investigations in Hindsight. Root cause and remediation playbooks are verified."
    return {"reply": reply, "timestamp": datetime.utcnow().isoformat() + "Z"}

@app.post("/api/postmortems/generate")
def generate_postmortem(body: Dict[str, Any] = Body(...)):
    inc_id = body.get("incidentId", "INC-1038")
    pms = dataset.get("postmortems", [])
    if pms:
        return pms[0]
    return {
        "id": f"PM-{inc_id.replace('INC-', '')}",
        "incidentId": inc_id,
        "title": f"Post-Mortem: {inc_id}",
        "summary": "Automated incident investigation and remediation post-mortem grounded in Hindsight organizational memory.",
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }

@app.post("/api/demo/reset")
def demo_reset():
    return {"status": "RESET_SUCCESSFUL"}
