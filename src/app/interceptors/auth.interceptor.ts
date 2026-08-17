import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

/**
 * Un intercepteur s'exécute automatiquement sur CHAQUE requête HTTP sortante,
 * avant qu'elle parte vers le backend. Ici : si un token existe, on l'ajoute
 * automatiquement à l'en-tête Authorization -- sans que chaque composant
 * n'ait besoin d'y penser manuellement à chaque appel API.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const token = tokenStorage.getToken();

  if (token) {
    console.log('[AuthInterceptor] Token trouvé, ajout à la requête vers:', req.url);
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(clonedReq);
  }

  console.log('[AuthInterceptor] Aucun token, requête envoyée sans Authorization vers:', req.url);
  return next(req);
};