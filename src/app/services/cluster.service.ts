import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:3002';
const INGESTION_API_URL = 'http://localhost:3006';
const REMEDIATION_API_URL = 'http://localhost:3005';

export interface Cluster {
  id: string;
  name: string;
  k8s_version: string;
  connected_at?: string;
}

export interface ClusterCredentials {
  api_server: string;
  ca_cert: string;
  token: string;
}
export interface ServiceWithoutIngress {
  name: string;
  namespace: string;
  port: number;
  likely_http: boolean;
  protocol_hint: string;
}

export interface MetricPoint {
  timestamp: number; // unix seconds
  value: number;
}

export interface PodTimeSeries {
  pod: string;
  points: MetricPoint[];
}

export interface MetricsTimeseriesResponse {
  cluster_id: string;
  range: string;
  cpu: PodTimeSeries[];
  memory: PodTimeSeries[];
}

export type MetricsRange = '1h' | '6h' | '24h';
export interface CreateClusterRequest {
  name: string;
  k8s_version: string;
  credentials: ClusterCredentials;
}


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
  deployment_name?: string;
}

export interface ClusterDashboardResponse {
  cluster_id: string;
  cluster_name: string;
  k8s_version: string;
  total_pods: number;
  active_incidents: number;
  resolved_incidents: number;
  pods: PodDashboardInfo[];
}


export interface IngressPathEdit {
  path: string;
  path_type: string;
  service_name: string;
  service_port: number;
}

export interface IngressRuleEdit {
  host: string;
  paths: IngressPathEdit[];
}

export interface IngressDetail {
  name: string;
  namespace: string;
  rules: IngressRuleEdit[];
}




@Injectable({ providedIn: 'root' })
export class ClusterService {
  constructor(private http: HttpClient) {}

  getClusters(): Observable<Cluster[]> {
    return this.http.get<Cluster[]>(`${API_URL}/clusters`);
  }

  createCluster(request: CreateClusterRequest): Observable<Cluster> {
    return this.http.post<Cluster>(`${API_URL}/clusters`, request);
  }

  getClusterDashboard(clusterId: string): Observable<ClusterDashboardResponse> {
    return this.http.get<ClusterDashboardResponse>(`${INGESTION_API_URL}/clusters/${clusterId}/dashboard`);
  }

  getIngressDetail(clusterId: string, ingressName: string, namespace: string): Observable<IngressDetail> {
  return this.http.get<IngressDetail>(
    `${REMEDIATION_API_URL}/clusters/${clusterId}/ingresses/${ingressName}?namespace=${namespace}`
  );
}



updateIngress(clusterId: string, ingressName: string, namespace: string, incidentId: string, rules: IngressRuleEdit[]): Observable<IngressDetail> {
  return this.http.put<IngressDetail>(
    `${REMEDIATION_API_URL}/clusters/${clusterId}/ingresses/${ingressName}?namespace=${namespace}`,
    { incident_id: incidentId, rules }
 
  );
}

getServicesWithoutIngress(clusterId: string, namespace: string): Observable<{ namespace: string; services: ServiceWithoutIngress[] }> {
  return this.http.get<{ namespace: string; services: ServiceWithoutIngress[] }>(
    `${REMEDIATION_API_URL}/clusters/${clusterId}/services-without-ingress?namespace=${namespace}`
  );
}

createIngress(clusterId: string, namespace: string, name: string, rules: IngressRuleEdit[]): Observable<IngressDetail> {
  return this.http.post<IngressDetail>(
    `${REMEDIATION_API_URL}/clusters/${clusterId}/ingresses?namespace=${namespace}`,
    { name, rules }
  );
}
getClusterMetricsTimeseries(clusterId: string, range: MetricsRange): Observable<MetricsTimeseriesResponse> {
  return this.http.get<MetricsTimeseriesResponse>(
    `${INGESTION_API_URL}/clusters/${clusterId}/metrics/timeseries`,
    { params: { range } }
  );
}
}