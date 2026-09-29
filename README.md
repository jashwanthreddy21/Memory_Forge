# Memory Forge
> **"Turn Security Incidents Into Organizational Memory."**

Memory Forge is an AI Security Operations & Compliance Memory Agent powered by **Hindsight** as the persistent organizational memory layer.

Unlike generic SIEM, SOAR, or log platforms, Memory Forge closes the critical security learning loop:

```
SECURITY INCIDENT → AI INVESTIGATION → KNOWLEDGE → HINDSIGHT MEMORY
       ↓
FUTURE INCIDENT RECALL → BETTER INVESTIGATION → COMPLIANCE / AUDIT REUSE
```

Every incident makes the next investigation faster and more informed.

---

## 🏛️ System Architecture

```
                         ┌───────────────────────┐
                         │    MEMORY FORGE UI    │
                         │ React + TypeScript     │
                         │ (Dark SecOps Canvas)  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Full-Stack / FastAPI │
                         │     Service Layer     │
                         └───────────┬───────────┘
                                     │
                         ┌───────────┴───────────┐
                         │   Agent Orchestrator  │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
      Investigation Agent       Recall Agent         Compliance Agent
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     ▼
                         ┌───────────────────────┐
                         │   HINDSIGHT MEMORY    │
                         │                       │
                         │ Retain                │
                         │ Recall (Semantic)     │
                         │ Relationship Graph    │
                         │ Historical Context    │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      PostgreSQL       │
                         │ Structured App Data   │
                         └───────────────────────┘
```

### Architectural Principle: `PostgreSQL ≠ Hindsight`
- **PostgreSQL** holds structured application entities: users, incident state, tickets, remediation task rows, evidence hashes, and control definitions.
- **Hindsight** provides the long-term semantic, associative, and contextual organizational memory that agents query during investigations and audits.

---

## 🚀 Key Modules & Capabilities

1. **Command Center Dashboard**: Real-time SecOps visibility into open incidents, recurring patterns, memory records count (1,284+), and audit readiness score (84%).
2. **Incident Ingestion & AI Investigation**:
   - Ingest alerts from CSPM, CI/CD runners, network scanners.
   - **Spectacular Historical Recall Flow**:
     ```
     ANALYZING INCIDENT
            ↓
     SEARCHING ORGANIZATIONAL MEMORY
            ↓
     3 RELATED MEMORIES FOUND (e.g. 92% INC-1024 Public Cloud Storage Exposure)
            ↓
     HISTORICAL CONTEXT INJECTED
            ↓
     CURRENT INVESTIGATION GENERATED
     ```
3. **Hindsight Memory Explorer & Relationship Graph**: Interactive node-edge visualization (`INCIDENT` → `ROOT_CAUSE` → `CONTROL` → `REMEDIATION` → `EVIDENCE`).
4. **Recurring Pattern Detection**: Correlates repeated failure modes (e.g. Access Control IAM misconfigurations across 8 historical incidents).
5. **Remediation Tracking**: Full task lifecycle (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `VERIFIED`) with linked cryptographic evidence.
6. **Evidence Vault**: Real artifacts (configuration snapshots, audit logs, CSPM scans) with SHA-256 integrity verification.
7. **Compliance & Controls**: Live mapping across SOC 2 Type II, ISO 27001, and NIST CSF.
8. **Audit Assistant**: Natural language querying for auditor inquiries with verifiable evidence citations.
9. **Post-Mortem Engine**: Converts resolved incidents into structured post-mortems and permanently commits them to Hindsight.
10. **Security Knowledge Timeline**: Interactive timeline showing organizational learning and defensive hardening from Jan 2026 to present.
11. **Memory Forge AI**: Assistant chat grounded strictly in Hindsight memory without hallucination.

---

## 🎬 Live 5-Minute Demo Flow

1. **Scene 1 (Dashboard)**: Observe organizational memory size, recurring findings alert, and audit readiness.
2. **Scene 2 (Incident Creation)**: Click **Create Incident** and load **Preset: INC-1024** (Public Cloud Storage Exposure).
3. **Scene 3 (Investigation & Memory Commit)**: Run AI investigation, view root cause (Access Policy) and remediation steps. Click **Commit to Organizational Memory** to store in Hindsight.
4. **Scene 4 (The Big Recall Moment)**: Ingest **INC-1038** (Public Cloud Storage Exposure on Customer Reports). Watch the system search Hindsight and surface **INC-1024 with 92% similarity** before injecting that historical context into the new investigation.
5. **Scene 5 (Compliance & Audit)**: Open **Access Control** in the Compliance tab to see all historical findings. Open **Audit Assistant** and ask: *"Show historical access-control findings, remediation status, and available evidence"*.
6. **Scene 6 (Knowledge Timeline)**: View the organizational learning timeline proving that the company is getting smarter after every incident.

---

## 🛠️ Local Development & Docker

### Option A: Standard Full-Stack App
```bash
npm install
npm run dev
# App starts on http://localhost:3000 with live AI & Hindsight memory layer
```

### Option B: Python FastAPI Backend + Docker
```bash
# Run pytest verification
python3 -m pytest backend/tests/test_hindsight_loop.py

# Launch multi-container stack
docker-compose up --build
```
