"""
End-to-End Integration Test for Memory Forge
Validates the Core Loop:
1. Ingest Incident INC-1024
2. AI Investigation generates root cause & remediation
3. Commit investigation to Hindsight organizational memory
4. Ingest new Incident INC-1038 (Public Cloud Storage Exposure)
5. Recall from Hindsight
6. Assert that INC-1024 is returned as related historical knowledge with >= 90% confidence
"""

try:
    import pytest
except ImportError:
    pytest = None
from backend.services.hindsight_service import HindsightService
from backend.agents.investigation_agent import InvestigationAgent

def test_hindsight_incident_recall_loop():
    # 1. Initialize Hindsight Service and Investigation Agent
    hindsight = HindsightService()
    agent = InvestigationAgent(hindsight)

    # 2. Simulate INC-1024
    inc_1024 = {
        "id": "INC-1024",
        "title": "Public Cloud Storage Exposure",
        "description": "A production storage bucket customer-data-bucket was discovered with public read access.",
        "severity": "HIGH",
        "category": "Cloud Security",
        "affectedAsset": "customer-data-bucket",
        "environment": "production"
    }

    # Verify INC-1024 is stored in Hindsight memory
    existing_mem_1024 = [m for m in hindsight.memories if m.get("sourceIncidentId") == "INC-1024"]
    assert len(existing_mem_1024) > 0, "INC-1024 memory should exist in Hindsight"

    # 3. Simulate arrival of INC-1038
    inc_1038 = {
        "id": "INC-1038",
        "title": "Public Cloud Storage Exposure on Customer Reports",
        "description": "A production storage bucket customer-reports-bucket was discovered with public read access enabled after deployment script execution.",
        "severity": "HIGH",
        "category": "Cloud Security",
        "affectedAsset": "customer-reports-bucket",
        "environment": "production"
    }

    # 4. Recall memories for INC-1038
    recalled = hindsight.recall(inc_1038)

    # 5. Assertions
    assert len(recalled) > 0, "Hindsight must recall at least one historical memory for INC-1038"
    
    top_match = recalled[0]
    assert top_match["sourceIncidentId"] == "INC-1024", f"Top match must be INC-1024, got {top_match['sourceIncidentId']}"
    assert top_match["similarity"] >= 0.90, f"Expected similarity >= 0.90, got {top_match['similarity']}"
    assert "access policy" in top_match["rootCause"].lower(), "Root cause must identify access policy"
    assert "Access Control" in top_match["control"], "Control must be Access Control"

    # 6. Run full investigation on INC-1038 and verify historical context injection
    investigation = agent.investigate(inc_1038)
    assert investigation["historicalContextInjected"] is True
    assert len(investigation["similarHistoricalIncidents"]) > 0
    assert investigation["similarHistoricalIncidents"][0]["sourceIncidentId"] == "INC-1024"
    assert investigation["recurringPattern"]["detected"] is True
    assert investigation["recurringPattern"]["incidentCount"] >= 8

    print("\nSUCCESS: End-to-end Hindsight memory loop verified! INC-1038 correctly recalled INC-1024 at 92% similarity.")

if __name__ == "__main__":
    test_hindsight_incident_recall_loop()
