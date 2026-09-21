import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

/**
 * WarmupService — pré-chauffe toutes les connexions WSL relay au démarrage.
 * Le premier appel à chaque service coûte ~2s (TCP setup via wslrelay.exe).
 * Ce service envoie silencieusement un /health à chaque port dès le lancement,
 * pour que toutes les connexions soient prêtes quand l'utilisateur navigue.
 */
@Injectable({ providedIn: 'root' })
export class WarmupService {
  private readonly endpoints = [
    'http://localhost:3001/health',
    'http://localhost:3002/health',
    'http://localhost:3003/health',
    'http://localhost:3004/health',
    'http://localhost:3005/health',
    'http://localhost:3006/health',
  ];

  constructor(private http: HttpClient) {}

  /** Appeler cette méthode une seule fois depuis app.component.ts */
  warmup(): void {
    for (const url of this.endpoints) {
      this.http.get(url).pipe(
        catchError(() => of(null))
      ).subscribe();
    }
  }
}