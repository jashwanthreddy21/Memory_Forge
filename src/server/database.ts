/**
 * Persistent Database Store for Memory Forge
 * Stores previous incidents, investigations, Hindsight memories, controls, and evidence
 * Path: data/memoryforge.db.json
 */

import fs from 'fs';
import path from 'path';
import {
  Incident,
  HindsightMemory,
  Finding,
  SecurityControl,
  RemediationItem,
  EvidenceRecord,
  TimelineEvent,
  PostMortem
} from '../types';
import {
  INITIAL_CONTROLS,
  INITIAL_INCIDENTS,
  INITIAL_MEMORIES,
  INITIAL_FINDINGS,
  INITIAL_REMEDIATIONS,
  INITIAL_EVIDENCE,
  INITIAL_TIMELINE,
  INITIAL_POSTMORTEMS
} from '../data/seedData';

interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  incidents: Incident[];
  memories: HindsightMemory[];
  findings: Finding[];
  controls: SecurityControl[];
  remediations: RemediationItem[];
  evidence: EvidenceRecord[];
  timeline: TimelineEvent[];
  postmortems: PostMortem[];
}

export class PersistentDatabase {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    const dataDir = path.resolve('data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.dbPath = path.join(dataDir, 'memoryforge.db.json');
    this.data = this.loadOrCreate();
  }

  private loadOrCreate(): DatabaseSchema {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const parsed = JSON.parse(raw);
        console.log(`[Database] Loaded persistent database from ${this.dbPath} with ${parsed.incidents?.length || 0} incidents`);
        return parsed;
      } catch (err) {
        console.warn('[Database] Corrupted database file, re-initializing from seed data:', err);
      }
    }

    const initialData: DatabaseSchema = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      memories: JSON.parse(JSON.stringify(INITIAL_MEMORIES)),
      findings: JSON.parse(JSON.stringify(INITIAL_FINDINGS)),
      controls: JSON.parse(JSON.stringify(INITIAL_CONTROLS)),
      remediations: JSON.parse(JSON.stringify(INITIAL_REMEDIATIONS)),
      evidence: JSON.parse(JSON.stringify(INITIAL_EVIDENCE)),
      timeline: JSON.parse(JSON.stringify(INITIAL_TIMELINE)),
      postmortems: JSON.parse(JSON.stringify(INITIAL_POSTMORTEMS))
    };

    this.save(initialData);
    console.log(`[Database] Initialized new persistent database at ${this.dbPath}`);
    return initialData;
  }

  private save(dataToSave?: DatabaseSchema) {
    const d = dataToSave || this.data;
    d.lastUpdated = new Date().toISOString();
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(d, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write database to disk:', err);
    }
  }

  // --- Incidents ---
  getIncidents(): Incident[] {
    return this.data.incidents;
  }

  getIncidentById(id: string): Incident | undefined {
    return this.data.incidents.find(i => i.id === id);
  }

  addIncident(incident: Incident): Incident {
    this.data.incidents.unshift(incident);
    this.save();
    return incident;
  }

  updateIncident(id: string, updates: Partial<Incident>): Incident | undefined {
    const inc = this.data.incidents.find(i => i.id === id);
    if (inc) {
      Object.assign(inc, updates);
      this.save();
      return inc;
    }
    return undefined;
  }

  // --- Memories ---
  getMemories(): HindsightMemory[] {
    return this.data.memories;
  }

  addMemory(memory: HindsightMemory): HindsightMemory {
    this.data.memories.unshift(memory);
    this.save();
    return memory;
  }

  // --- Findings ---
  getFindings(): Finding[] {
    return this.data.findings;
  }

  // --- Controls ---
  getControls(): SecurityControl[] {
    return this.data.controls;
  }

  // --- Remediations ---
  getRemediations(): RemediationItem[] {
    return this.data.remediations;
  }

  updateRemediation(id: string, updates: Partial<RemediationItem>): RemediationItem | undefined {
    const item = this.data.remediations.find(r => r.id === id);
    if (item) {
      Object.assign(item, updates);
      this.save();
      return item;
    }
    return undefined;
  }

  // --- Evidence ---
  getEvidence(): EvidenceRecord[] {
    return this.data.evidence;
  }

  addEvidence(ev: EvidenceRecord): EvidenceRecord {
    this.data.evidence.unshift(ev);
    this.save();
    return ev;
  }

  // --- Timeline ---
  getTimeline(): TimelineEvent[] {
    return this.data.timeline;
  }

  addTimelineEvent(event: TimelineEvent): TimelineEvent {
    this.data.timeline.unshift(event);
    this.save();
    return event;
  }

  // --- PostMortems ---
  getPostMortems(): PostMortem[] {
    return this.data.postmortems;
  }

  addPostMortem(pm: PostMortem): PostMortem {
    this.data.postmortems.unshift(pm);
    this.save();
    return pm;
  }

  // --- Database Stats ---
  getStats() {
    let sizeBytes = 0;
    try {
      if (fs.existsSync(this.dbPath)) {
        sizeBytes = fs.statSync(this.dbPath).size;
      }
    } catch (_) {}

    return {
      status: 'ONLINE',
      dbPath: this.dbPath,
      sizeBytes,
      sizeFormatted: `${(sizeBytes / 1024).toFixed(1)} KB`,
      totalIncidents: this.data.incidents.length,
      totalMemories: this.data.memories.length,
      totalRemediations: this.data.remediations.length,
      totalEvidence: this.data.evidence.length,
      lastUpdated: this.data.lastUpdated
    };
  }

  // --- Reset to Baseline ---
  resetBaseline() {
    this.data = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      memories: JSON.parse(JSON.stringify(INITIAL_MEMORIES)),
      findings: JSON.parse(JSON.stringify(INITIAL_FINDINGS)),
      controls: JSON.parse(JSON.stringify(INITIAL_CONTROLS)),
      remediations: JSON.parse(JSON.stringify(INITIAL_REMEDIATIONS)),
      evidence: JSON.parse(JSON.stringify(INITIAL_EVIDENCE)),
      timeline: JSON.parse(JSON.stringify(INITIAL_TIMELINE)),
      postmortems: JSON.parse(JSON.stringify(INITIAL_POSTMORTEMS))
    };
    this.save();
    return this.data;
  }

  exportJson(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

export const db = new PersistentDatabase();
