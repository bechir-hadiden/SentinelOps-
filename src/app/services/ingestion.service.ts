import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3006';

export interface PodDashboardInfo {
  name: string;
  namespace: string;
  status: string;
  reason: string;
  restart_count: number;
  cpu: number;
  memory_bytes: number;
  has_incident: boolean;
  incident_id?: string;

}

export interface ClusterDashboard {
  cluster_id: string;
  cluster_name: string;
  k8s_version: string;
  total_pods: number;
  active_incidents: number;
  resolved_incidents: number;
  pods: PodDashboardInfo[];
}

@Injectable({ providedIn: 'root' })
export class IngestionService {
  constructor(private http: HttpClient) {}

  getAllClustersDashboard(): Observable<ClusterDashboard[]> {
    return this.http.get<ClusterDashboard[]>(`${API_URL}/dashboard/all`);
  }

  getClusterDashboard(clusterId: string): Observable<ClusterDashboard> {
    return this.http.get<ClusterDashboard>(`${API_URL}/clusters/${clusterId}/dashboard`);
  }
}