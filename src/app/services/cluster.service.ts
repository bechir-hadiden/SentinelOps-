import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:3002';

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

export interface CreateClusterRequest {
  name: string;
  k8s_version: string;
  credentials: ClusterCredentials;
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
}