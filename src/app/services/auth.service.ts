import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3001';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    organization_id: string;
  };
}

/**
 * Isole tous les appels réseau liés à l'authentification. Les composants
 * (comme la future page de login) n'appellent jamais HttpClient directement
 * -- ils passent toujours par ce service. Ça permettra plus tard de changer
 * l'URL de l'API (ex. passage en production) à un seul endroit.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/login`, { email, password });
  }
}