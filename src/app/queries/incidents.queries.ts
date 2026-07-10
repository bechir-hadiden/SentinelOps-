// src/app/queries/incidents.queries.ts
import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { IncidentService } from '../services/incident.service';

/**
 * Read-side query wrappers. Each function must be called from an
 * injection context (component field initializer / constructor).
 * Components consume `.data()`, `.isPending()`, `.error()` signals —
 * no manual subscription/unsubscription needed.
 */

export function injectDashboardMetricsQuery() {
  const incidentService = inject(IncidentService);
  return injectQuery(() => ({
    queryKey: ['dashboard-metrics'],
    queryFn: () => firstValueFrom(incidentService.getDashboardMetrics()),
    staleTime: 30_000,
    refetchInterval: 30_000,
  }));
}

export function injectRecentIncidentsQuery(limit = 10) {
  const incidentService = inject(IncidentService);
  return injectQuery(() => ({
    queryKey: ['incidents', 'recent', limit],
    queryFn: () => firstValueFrom(incidentService.getRecentIncidents(limit)),
    staleTime: 15_000,
    refetchInterval: 15_000,
  }));
}

export function injectActiveIncidentQuery() {
  const incidentService = inject(IncidentService);
  return injectQuery(() => ({
    queryKey: ['incidents', 'active'],
    queryFn: () => firstValueFrom(incidentService.getActiveIncident()),
    staleTime: 10_000,
    refetchInterval: 10_000,
  }));
}

export function injectIncidentDetailQuery(id: () => string) {
  const incidentService = inject(IncidentService);
  return injectQuery(() => ({
    queryKey: ['incidents', 'detail', id()],
    queryFn: () => firstValueFrom(incidentService.getIncidentDetail(id())),
    enabled: !!id(),
    staleTime: 5_000,
  }));
}
