import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent, AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { injectRecentIncidentsQuery } from '../../queries/incidents.queries';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, AgentBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6 p-6">
      <div>
        <h1 class="font-['IBM_Plex_Sans_Condensed'] text-xl font-semibold text-[var(--text-primary)]">Incidents Actifs</h1>
        <p class="font-['IBM_Plex_Sans'] text-sm text-[var(--text-secondary)]">Suivez et résolvez les pannes de service et alertes d'infrastructure.</p>
      </div>

      <div class="flex flex-col gap-4">
        @if (incidentsQuery.isPending()) {
          <p class="font-['IBM_Plex_Sans'] text-sm text-[var(--text-secondary)]">Chargement…</p>
        }

        @for (inc of incidentsQuery.data() ?? []; track inc.id) {
          <div class="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface-1)] p-5 flex items-center justify-between hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
               [routerLink]="['/incidents', inc.id]">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2.5">
                <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">{{ inc.id }}</span>
                <h3 class="font-['IBM_Plex_Sans'] text-base font-semibold text-[var(--text-primary)]">{{ inc.title }}</h3>
                <app-status-badge [status]="inc.status" [severity]="inc.severity" />
              </div>
              <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">
                {{ inc.cluster }} / {{ inc.namespace }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              @if (inc.aiConfidence !== null) {
                <app-agent-badge [confidence]="inc.aiConfidence" />
              }
              <svg class="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        }

        @empty {
          <div class="rounded-[10px] border border-dashed border-[var(--border)] p-10 text-center bg-[var(--bg-surface-1)]">
            <h3 class="font-['IBM_Plex_Sans'] text-sm font-semibold text-[var(--text-secondary)]">Aucun incident actif</h3>
            <p class="mt-1 font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">Tous vos microservices fonctionnent normalement.</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class IncidentsComponent {
  protected readonly incidentsQuery = injectRecentIncidentsQuery(20);
}
