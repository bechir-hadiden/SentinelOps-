import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

/**
 * Un Guard s'exécute AVANT que la route ne s'affiche -- comme le middleware
 * côté Go (authMiddleware) mais côté frontend. Si la fonction renvoie false,
 * Angular n'affiche jamais le composant demandé.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  if (tokenStorage.isLoggedIn()) {
    console.log('[AuthGuard] Token présent, accès autorisé à:', state.url);
    return true;
  }

  console.log('[AuthGuard] Aucun token, redirection vers /login depuis:', state.url);
  router.navigate(['/login']);
  return false;
};