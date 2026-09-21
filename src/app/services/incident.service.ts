import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  cluster_name?: string;
  service_name?: string;
  resource_name?: string;
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
  container?: string;
}

export interface ConfigMapOperation {
  key: string;
  value: string;
}

export interface DeploymentRevision {
  revision: number;
  replica_set: string;
  image: string;
  created_at: string;
  replicas: number;
  is_current: boolean;
}

export interface DeploymentRevisionsResponse {
  deployment_name: string;
  namespace: string;
  revisions: DeploymentRevision[];
}

export interface CandidateRecommendation {
  id: string;
  incident_id?: string;
  root_cause_id?: string;
  candidate_index: number;
  title: string;
  action_type: string;
  action_command: string;
  confidence_score: number;
  risk_level: string;
  final_score: number;
  justification: string;
  patch_operations?: PatchOperation[];
  configmap_name?: string;
  configmap_operations?: ConfigMapOperation[];
  deployment_name?: string;
  namespace?: string;
  is_selected: boolean;
}

export interface Recommendation {
  namespace?: string;
  deployment_name?: string;
  id: string;
  incident_id: string;
  action_type: string;
  action_command: string;
  risk_level: string;
  status: string;
  patch_operations?: PatchOperation[];
  configmap_name?: string;
  configmap_operations?: ConfigMapOperation[];
  message?: string;
  hint?: string;
  candidates?: CandidateRecommendation[];
}

export interface CandidatesResponse {
  incident_id: string;
  candidates: CandidateRecommendation[];
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

  getIncidents(limit = 50, status = ''): Observable<Incident[]> {
    const params: Record<string, string> = { limit: String(limit) };
    if (status) {
      params['status'] = status;
    }
    return this.http.get<Incident[]>(`${API_URL}/incidents`, { params });
  }

  // OPTIMISÉ: appel direct /incidents/:id au lieu de fetch all + filter
  getIncident(incidentId: string): Observable<Incident | undefined> {
    return this.http.get<Incident>(`${API_URL}/incidents/${incidentId}`);
  }

  diagnoseIncident(incidentId: string): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(`${DIAGNOSIS_API_URL}/incidents/${incidentId}/diagnose`, {});
  }

  recommendAction(incidentId: string): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/incidents/${incidentId}/recommend`, {});
  }

  getCandidates(incidentId: string): Observable<CandidatesResponse> {
    return this.http.get<CandidatesResponse>(`${REMEDIATION_API_URL}/incidents/${incidentId}/candidates`);
  }

  getDeploymentRevisions(incidentId: string, deploymentName: string, namespace: string): Observable<DeploymentRevisionsResponse> {
    const params = new HttpParams()
      .set('deployment_name', deploymentName)
      .set('namespace', namespace);
    return this.http.get<DeploymentRevisionsResponse>(
      `${REMEDIATION_API_URL}/incidents/${incidentId}/deployment-revisions`,
      { params }
    );
  }

  selectCandidate(candidateId: string): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/candidates/${candidateId}/select`, {});
  }

  decideRecommendation(recommendationId: string, decision: 'approved' | 'rejected'): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/recommendations/${recommendationId}/decide`, { decision });
  }

  executeRecommendation(recommendationId: string): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${REMEDIATION_API_URL}/recommendations/${recommendationId}/execute`, {});
  }

  updatePatchOperations(recommendationId: string, patchOperations: PatchOperation[]): Observable<Recommendation> {
    return this.http.post<Recommendation>(
      `${REMEDIATION_API_URL}/recommendations/${recommendationId}/patch-operations`,
      { patch_operations: patchOperations }
    );
  }

  updateConfigMapOperations(recommendationId: string, configMapOperations: ConfigMapOperation[]): Observable<Recommendation> {
    return this.http.post<Recommendation>(
      `${REMEDIATION_API_URL}/recommendations/${recommendationId}/configmap-operations`,
      { configmap_operations: configMapOperations }
    );
  }

  generatePostmortem(incidentId: string): Observable<Postmortem> {
    return this.http.post<Postmortem>(`${DIAGNOSIS_API_URL}/incidents/${incidentId}/postmortem`, {});
  }
}