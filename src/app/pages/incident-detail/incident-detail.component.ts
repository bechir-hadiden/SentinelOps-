// src/app/pages/incident-detail/incident-detail.component.ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { IncidentTimelineComponent } from './components/incident-timeline.component';
import { injectIncidentDetailQuery } from '../../queries/incidents.queries';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, IncidentTimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6 p-6">
      <a
        routerLink="/dashboard"
        class="w-fit font-['IBM_Plex_Sans'] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        ← Retour au dashboard
      </a>

      @if (incidentQuery.data(); as incident) {
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="font-['IBM_Plex_Sans_Condensed'] text-xl font-semibold text-[var(--text-primary)]">
              {{ incident.title }}
            </h1>
            <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">
              {{ incident.cluster }} / {{ incident.namespace }} · ID {{ incident.id }}
            </span>
          </div>
          <app-status-badge [status]="incident.status" [severity]="incident.severity" />
        </div>

        <app-incident-timeline [incidentId]="incident.id" [steps]="incident.timeline" />

        @if (incident.postMortemUrl) {
          <a
            [href]="incident.postMortemUrl"
            target="_blank"
            rel="noopener"
            class="w-fit rounded-[6px] border border-[var(--border-strong)] px-4 py-2 font-['IBM_Plex_Sans'] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-3)]"
          >
            Voir le post-mortem
          </a>
        }
      } @else if (incidentQuery.isPending()) {
        <span class="font-['IBM_Plex_Sans'] text-sm text-[var(--text-secondary)]">Chargement…</span>
      } @else if (incidentQuery.isError()) {
        <span class="font-['IBM_Plex_Sans'] text-sm text-[var(--critical)]">
          Impossible de charger cet incident.
        </span>
      }
    </div>
  `,
})
export class IncidentDetailComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly incidentId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  protected readonly incidentQuery = injectIncidentDetailQuery(() => this.incidentId());
}
