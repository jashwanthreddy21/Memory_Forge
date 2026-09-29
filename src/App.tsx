/**
 * Memory Forge - Main Application Component
 * AI Security Operations & Compliance Memory Agent
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { DashboardView } from './views/DashboardView';
import { IncidentsView } from './views/IncidentsView';
import { InvestigationDetailView } from './views/InvestigationDetailView';
import { HindsightMemoryView } from './views/HindsightMemoryView';
import { FindingsView } from './views/FindingsView';
import { RemediationView } from './views/RemediationView';
import { EvidenceView } from './views/EvidenceView';
import { ComplianceView } from './views/ComplianceView';
import { AuditAssistantView } from './views/AuditAssistantView';
import { KnowledgeTimelineView } from './views/KnowledgeTimelineView';
import { AIAssistantView } from './views/AIAssistantView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { api } from './services/api';
import {
  Incident,
  HindsightMemory,
  Finding,
  SecurityControl,
  RemediationItem,
  EvidenceRecord,
  TimelineEvent,
  InvestigationResult,
  RemediationStatus
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [memories, setMemories] = useState<HindsightMemory[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [recurringFindings, setRecurringFindings] = useState<any[]>([]);
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [remediations, setRemediations] = useState<RemediationItem[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-1038');
  const [currentInvestigation, setCurrentInvestigation] = useState<InvestigationResult | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>('Security Analyst');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial datasets
  const loadData = async () => {
    try {
      const [
        incList,
        memList,
        fndList,
        recList,
        ctrlList,
        remList,
        evList,
        tlList
      ] = await Promise.all([
        api.getIncidents(),
        api.getMemories(),
        api.getFindings(),
        api.getRecurringFindings(),
        api.getControls(),
        api.getRemediations(),
        api.getEvidence(),
        api.getTimeline()
      ]);

      setIncidents(incList);
      setMemories(memList);
      setFindings(fndList);
      setRecurringFindings(recList);
      setControls(ctrlList);
      setRemediations(remList);
      setEvidence(evList);
      setTimeline(tlList);

      // Initialize investigation for INC-1038
      const inv = await api.investigateIncident('INC-1038');
      setCurrentInvestigation(inv);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select incident for detailed investigation
  const handleSelectIncident = async (id: string) => {
    setSelectedIncidentId(id);
    setActiveTab('investigations');
    try {
      const inv = await api.investigateIncident(id);
      setCurrentInvestigation(inv);
    } catch (e) {
      console.error(e);
    }
  };

  // Create & Ingest New Incident
  const handleCreateIncident = async (data: Partial<Incident>) => {
    const created = await api.createIncident(data);
    setIncidents(prev => [created, ...prev]);
    setSelectedIncidentId(created.id);
    setActiveTab('investigations');
    const inv = await api.investigateIncident(created.id);
    setCurrentInvestigation(inv);
    showToast(`Incident ${created.id} ingested. Searching Hindsight organizational memory...`);
  };

  // Commit Investigation to Hindsight
  const handleCommitMemory = async (incidentId: string, payload: any) => {
    try {
      const newMem = await api.commitToMemory(incidentId, payload);
      setMemories(prev => [newMem, ...prev]);
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'RESOLVED', memoryCommitted: true } : i));
      const tl = await api.getTimeline();
      setTimeline(tl);
      showToast(`Investigation committed to Hindsight as ${newMem.id}. Future incidents will recall this knowledge!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Update remediation task status
  const handleUpdateRemediationStatus = async (id: string, status: RemediationStatus) => {
    try {
      const updated = await api.updateRemediation(id, { status });
      setRemediations(prev => prev.map(r => r.id === id ? updated : r));
      showToast(`Remediation ${id} updated to ${status}.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Add evidence record
  const handleAddEvidence = async (record: Partial<EvidenceRecord>) => {
    const created = await api.addEvidence(record);
    setEvidence(prev => [created, ...prev]);
    showToast(`Forensic evidence ${created.id} attached with SHA-256 integrity hash.`);
  };

  // Reset Demo to Baseline
  const handleResetDemo = async () => {
    await api.resetDemo();
    await loadData();
    setSelectedIncidentId('INC-1038');
    setActiveTab('dashboard');
    showToast('Demo environment reset to pristine baseline state.');
  };

  // Execute 5-Minute Live Showcase Demo Script
  const handleRunDemoLoop = async () => {
    showToast('Executing Showcase Script: Ingesting INC-1038 to test Hindsight historical recall...');
    setSelectedIncidentId('INC-1038');
    setActiveTab('investigations');
    const inv = await api.investigateIncident('INC-1038');
    setCurrentInvestigation(inv);
  };

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || {
    id: 'INC-1038',
    title: 'Public Cloud Storage Exposure on Customer Reports',
    description: 'A production storage bucket customer-reports-bucket was discovered with public read access enabled.',
    severity: 'HIGH',
    category: 'Cloud Security',
    affectedAsset: 'customer-reports-bucket',
    environment: 'production',
    detectionSource: 'Cloud Security Scanner',
    detectedAt: '2026-09-28T21:10:00Z',
    assignedAnalyst: 'Alex Rivera, Incident Responder',
    status: 'OPEN',
    evidence: 'Automated policy validator flagged AllUsers read permission on bucket root ACL.',
    tags: ['Cloud Storage', 'Public Exposure'],
    memoryCommitted: false
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-slate-900 to-cyan-950 border border-cyan-500/50 rounded-lg px-4 py-3 shadow-2xl text-xs font-mono text-cyan-300 flex items-center gap-2.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        openIncidentsCount={incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length}
        recurringFindingsCount={recurringFindings.length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header
          onOpenCreate={() => setIsCreateModalOpen(true)}
          onRunDemoLoop={handleRunDemoLoop}
          onResetDemo={handleResetDemo}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                incidents={incidents}
                memories={memories}
                remediations={remediations}
                controls={controls}
                onSelectIncident={handleSelectIncident}
                onNavigateTab={setActiveTab}
                onOpenCreate={() => setIsCreateModalOpen(true)}
              />
            )}

            {activeTab === 'incidents' && (
              <IncidentsView
                incidents={incidents}
                onSelectIncident={handleSelectIncident}
                onOpenCreate={() => setIsCreateModalOpen(true)}
              />
            )}

            {activeTab === 'investigations' && (
              <InvestigationDetailView
                incident={currentIncident}
                investigation={currentInvestigation}
                onInvestigate={async (id) => {
                  const inv = await api.investigateIncident(id);
                  setCurrentInvestigation(inv);
                }}
                onCommitMemory={handleCommitMemory}
                onSelectMemory={(memId) => {
                  setActiveTab('memories');
                }}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'memories' && (
              <HindsightMemoryView
                memories={memories}
                onSelectMemory={(memId) => {
                  // Can filter or view memory
                }}
              />
            )}

            {activeTab === 'findings' && (
              <FindingsView
                findings={findings}
                recurringFindings={recurringFindings}
                onSelectIncident={handleSelectIncident}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'remediation' && (
              <RemediationView
                remediations={remediations}
                onUpdateStatus={handleUpdateRemediationStatus}
                onSelectIncident={handleSelectIncident}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceView
                evidence={evidence}
                onAddEvidence={handleAddEvidence}
                onSelectIncident={handleSelectIncident}
              />
            )}

            {activeTab === 'compliance' && (
              <ComplianceView
                controls={controls}
                onSelectIncident={handleSelectIncident}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'audit' && (
              <AuditAssistantView
                onSelectIncident={handleSelectIncident}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'timeline' && (
              <KnowledgeTimelineView
                timeline={timeline}
                onSelectIncident={handleSelectIncident}
              />
            )}

            {activeTab === 'assistant' && (
              <AIAssistantView />
            )}

            {activeTab === 'settings' && (
              <SystemSettingsView
                onResetDemo={handleResetDemo}
              />
            )}
          </div>
        </main>
      </div>

      {/* Ingestion Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIncident}
      />
    </div>
  );
}
