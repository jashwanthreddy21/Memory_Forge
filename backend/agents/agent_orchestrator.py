"""
Recall Agent, Memory Agent, Compliance Agent & Audit Agent
"""

from typing import Dict, Any, List

class RecallAgent:
    def __init__(self, hindsight_service):
        self.hindsight_service = hindsight_service

    def recall_similar(self, incident: Dict[str, Any]) -> List[Dict[str, Any]]:
        return self.hindsight_service.recall(incident)


class MemoryAgent:
    def __init__(self, hindsight_service):
        self.hindsight_service = hindsight_service

    def commit_investigation(self, incident: Dict[str, Any], investigation: Dict[str, Any]) -> Dict[str, Any]:
        memory_record = {
            "sourceIncidentId": incident["id"],
            "title": incident["title"],
            "type": "INCIDENT",
            "summary": investigation.get("executiveSummary", incident["title"]),
            "rootCause": investigation.get("probableRootCause", "Unspecified root cause"),
            "securityControl": investigation.get("securityControl", "Access Control"),
            "affectedAsset": incident.get("affectedAsset", ""),
            "remediation": investigation.get("recommendedRemediation", []),
            "evidence": investigation.get("evidenceRequirements", []),
            "severity": incident.get("severity", "HIGH"),
            "tags": incident.get("tags", []) + ["Hindsight"]
        }
        return self.hindsight_service.remember(memory_record)


class ComplianceAgent:
    def map_findings_to_controls(self, findings: List[Dict[str, Any]], controls: List[Dict[str, Any]]) -> Dict[str, Any]:
        ctrl_map = {c["name"]: {**c, "findings": []} for c in controls}
        for f in findings:
            c_name = f.get("securityControl")
            if c_name in ctrl_map:
                ctrl_map[c_name]["findings"].append(f)
        return ctrl_map


class AuditAgent:
    def __init__(self, hindsight_service):
        self.hindsight_service = hindsight_service

    def answer_audit_request(self, query: str, controls: List[Dict[str, Any]], evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
        q = query.lower()
        matched = controls[0]
        for c in controls:
            if c["name"].lower() in q or c["code"].lower() in q:
                matched = c
                break

        ctrl_ev = [e for e in evidence if e.get("relatedControl") == matched["name"]]

        return {
            "query": query,
            "matchedControl": f"{matched['name']} ({matched['code']})",
            "frameworkReferences": matched.get("frameworks", ["SOC 2 CC6.1"]),
            "totalHistoricalFindings": matched.get("totalFindings", 8),
            "statusBreakdown": {
                "resolved": matched.get("resolvedFindings", 5),
                "inProgress": matched.get("inProgressFindings", 2),
                "open": matched.get("openFindings", 1)
            },
            "recurringRootCause": "IAM policy misconfiguration in deployment automation bypassing organization Block Public Access guardrails.",
            "availableEvidence": ctrl_ev,
            "executiveSummary": (
                f"Auditor inquiry processed for security control {matched['name']} ({matched['code']}). "
                f"Hindsight retrieved {matched['totalFindings']} historical findings and {len(ctrl_ev)} verified evidence artifacts."
            ),
            "complianceRating": "PARTIALLY_COMPLIANT" if matched.get("openFindings", 0) > 0 else "COMPLIANT"
        }
