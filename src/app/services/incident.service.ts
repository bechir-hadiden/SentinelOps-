// src/app/services/incident.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActionDecisionPayload,
  DashboardMetrics,
  Incident,
  IncidentDetail,
} from '../models/incident.model';

/**
 * Raw HTTP access layer. No caching, no state — that responsibility
 * belongs to the query wrappers in `queries/`. This service only knows
 * how to talk to the Go/FastAPI backend.
 */
@Injectable({ providedIn: 'root' })
export class IncidentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.baseUrl}/metrics/dashboard`);
  }

  getRecentIncidents(limit = 10): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.baseUrl}/incidents`, {
      params: { limit, sort: '-detectedAt' },
    });
  }

  getActiveIncident(): Observable<Incident | null> {
    return this.http.get<Incident | null>(`${this.baseUrl}/incidents/active`);
  }

  getIncidentDetail(id: string): Observable<IncidentDetail> {
    return this.http.get<IncidentDetail>(`${this.baseUrl}/incidents/${id}`);
  }

  submitActionDecision(payload: ActionDecisionPayload): Observable<IncidentDetail> {
    return this.http.post<IncidentDetail>(
      `${this.baseUrl}/incidents/${payload.incidentId}/steps/${payload.stepId}/decision`,
      { decision: payload.decision },
    );
  }
}
