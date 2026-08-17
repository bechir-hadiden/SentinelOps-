import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3003';
const DIAGNOSIS_API_URL = 'http://localhost:3004';
const REMEDIATION_API_URL = 'http://localhost:3005';

export interface Incident {
  id: string;
  cluster_id: string;
  title: string;
  status: string;
  severity: string;
  detected_at: string;
  resolved_at?: string;
}

export interface Diagnosis {
  id: string;
  incident_id: string;
  hypothesis: string;
  confidence: number;
  evidence: string;
}

export interface PatchOperation {
  field: string;
  key?: string;
  value: string;
}

export interface Recommendation {
  id: string;
  incident_id: string;
  action_type: string;
  action_command: string;
  risk_level: string;
  status: string; // 'pending' | 'approved' | 'rejected' | 'executed' | 'manual_action_required' | 'execution_failed'
  patch_operations?: PatchOperation[];
  message?: string; // présent uniquement sur une réponse manual_action_required
  hint?: string;
}

export interface Postmortem {
  id: string;
  incident_id: string;
  content_markdown: string;
  generated_at: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentService {
  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${API_URL}/incidents`);
  }

  diagnoseIncident(incidentId: string): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(`${DIAGNOSIS_API_URL}/incidents/${incidentId}/diagnose`, {});
  }

  recommendAction(incidentId: string): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/incidents/${incidentId}/recommend`, {});
  }

  decideRecommendation(recommendationId: string, decision: 'approved' | 'rejected'): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/recommendations/${recommendationId}/decide`, { decision });
  }

  executeRecommendation(recommendationId: string): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/recommendations/${recommendationId}/execute`, {});
  }

  // Nouveau : corrige les patch_operations (ex: remplace un placeholder par la vraie valeur)
  updatePatchOperations(recommendationId: string, patchOperations: PatchOperation[]): Observable<Recommendation> {
    return this.http.post<Recommendation>(
      `${REMEDIATION_API_URL}/recommendations/${recommendationId}/patch-operations`,
      { patch_operations: patchOperations }
    );
  }

  generatePostmortem(incidentId: string): Observable<Postmortem> {
    return this.http.post<Postmortem>(`${DIAGNOSIS_API_URL}/incidents/${incidentId}/postmortem`, {});
  }
}