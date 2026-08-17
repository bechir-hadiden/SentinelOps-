import { Injectable } from '@angular/core';

const TOKEN_KEY = 'sentinelops_token';

/**
 * Isole TOUT accès au stockage du token dans un seul endroit. Si on décide
 * plus tard de passer de localStorage à un cookie httpOnly (plus sécurisé,
 * recommandé en vraie production), on ne change que ce fichier -- aucun
 * autre composant du projet ne touche directement à localStorage.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  saveToken(token: string): void {
    console.log('[TokenStorage] Sauvegarde du token dans localStorage');
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('[TokenStorage] Lecture du token:', token ? 'présent' : 'absent');
    return token;
  }

  clearToken(): void {
    console.log('[TokenStorage] Suppression du token');
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}