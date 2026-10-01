/**
 * Hindsight Cloud API Client
 * Connects to https://api.hindsight.vectorize.io
 * Bank ID: memory-forge-secops
 */

export interface HindsightCloudRecallResult {
  id: string;
  text: string;
  type: string;
  entities: string[];
  document_id: string | null;
  tags: string[];
  scores: {
    final: number;
    semantic?: number;
    keyword?: number;
    reranker?: number;
  };
}

export interface HindsightCloudRecallResponse {
  results: HindsightCloudRecallResult[];
  entities: Record<string, any>;
}

export class HindsightCloudClient {
  private apiUrl: string;
  private apiKey: string;
  private bankId: string = 'memory-forge-secops';
  private initialized: boolean = false;

  constructor() {
    this.apiUrl = (process.env.HINDSIGHT_API_URL || 'https://api.hindsight.vectorize.io').replace(/\/$/, '');
    this.apiKey = process.env.HINDSIGHT_API_KEY || 'hsk_5ce80f94e1632d56a5b7cd9872581de1_62d85853284619ca';
  }

  getBankId(): string {
    return this.bankId;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Ensure memory bank exists on Hindsight Cloud
   */
  async ensureBank(): Promise<boolean> {
    if (this.initialized) return true;
    try {
      const res = await fetch(`${this.apiUrl}/v1/default/banks/${this.bankId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Memory Forge SecOps Bank',
          retain_mission: 'Retain security incidents, root causes, IAM permissions, cloud storage access policies, affected assets, and remediation steps.'
        })
      });

      if (res.ok) {
        this.initialized = true;
        console.log(`[Hindsight Cloud] Bank "${this.bankId}" connected successfully at ${this.apiUrl}`);
        return true;
      } else {
        const errText = await res.text();
        console.warn(`[Hindsight Cloud] Bank ensure returned status ${res.status}:`, errText);
      }
    } catch (err) {
      console.warn('[Hindsight Cloud] Could not connect to remote Hindsight endpoint, using local fallback:', err);
    }
    return false;
  }

  /**
   * Retain an incident memory into Hindsight Cloud
   */
  async retainMemory(params: {
    incidentId: string;
    title: string;
    summary: string;
    rootCause: string;
    securityControl: string;
    affectedAsset: string;
    remediation: string[];
    tags: string[];
  }): Promise<{ success: boolean; data?: any }> {
    await this.ensureBank();
    try {
      const content = `${params.incidentId}: ${params.title}. Asset: ${params.affectedAsset}. Root Cause: ${params.rootCause}. Control: ${params.securityControl}. Remediation: ${params.remediation.join('; ')}. Summary: ${params.summary}`;

      const res = await fetch(`${this.apiUrl}/v1/default/banks/${this.bankId}/memories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          async: false,
          items: [
            {
              content,
              context: 'incident_investigation',
              document_id: params.incidentId,
              tags: [...params.tags, params.securityControl, params.incidentId]
            }
          ]
        })
      });

      if (res.ok) {
        const json = await res.json();
        console.log(`[Hindsight Cloud] Retained memory for ${params.incidentId}:`, json);
        return { success: true, data: json };
      } else {
        const errText = await res.text();
        console.warn(`[Hindsight Cloud] Retain returned status ${res.status}:`, errText);
      }
    } catch (err) {
      console.warn(`[Hindsight Cloud] Retain failed:`, err);
    }
    return { success: false };
  }

  private recallCache: Map<string, { data: HindsightCloudRecallResponse; ts: number }> = new Map();

  /**
   * Recall memories from Hindsight Cloud (with fast timeout and in-memory cache)
   */
  async recallMemories(query: string): Promise<HindsightCloudRecallResponse | null> {
    const cacheKey = query.trim().toLowerCase();
    const cached = this.recallCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < 300000) { // 5-minute cache
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second fast timeout

      const res = await fetch(`${this.apiUrl}/v1/default/banks/${this.bankId}/memories/recall`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          budget: 'mid'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json: HindsightCloudRecallResponse = await res.json();
        console.log(`[Hindsight Cloud] Recalled ${json.results?.length || 0} memories for query: "${query.slice(0, 40)}..."`);
        this.recallCache.set(cacheKey, { data: json, ts: Date.now() });
        return json;
      } else {
        const errText = await res.text();
        console.warn(`[Hindsight Cloud] Recall returned status ${res.status}:`, errText);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`[Hindsight Cloud] Recall timed out after 2000ms, using fast local memory engine.`);
      } else {
        console.warn(`[Hindsight Cloud] Recall request failed:`, err);
      }
    }
    return null;
  }
}

export const hindsightCloud = new HindsightCloudClient();
