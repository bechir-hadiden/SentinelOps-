// src/app/pages/dashboard/components/active-incident-panel.component.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PulseLineComponent } from '../../../shared/pulse-line/pulse-line.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { Incident } from '../../../models/incident.model';

@Component({
  selector: 'app-active-incident-panel',
  standalone: true,
  imports: [RouterLink, PulseLineComponent, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--bg-surface-1)] p-6"
    >
      <!-- Ambient Pulse background, very low opacity, purely decorative -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.05]">
        <app-pulse-line [state]="incident() ? 'active' : 'flat'" />
      </div>

      <div class="relative flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2
            class="font-['IBM_Plex_Sans_Condensed'] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
          >
            Incident actif
          </h2>
          @if (incident()) {
            <app-status-badge [status]="incident()!.status" [severity]="incident()!.severity" />
          }
        </div>

        @if (incident(); as inc) {
          <div class="flex flex-col gap-1">
            <span class="font-['IBM_Plex_Sans'] text-lg text-[var(--text-primary)]">
              {{ inc.title }}
            </span>
            <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">
              {{ inc.cluster }} / {{ inc.namespace }} · détecté {{ elapsedLabel() }}
            </span>
          </div>

          <a
            [routerLink]="['/incidents', inc.id]"
            class="self-start rounded-[6px] bg-[var(--brand)] px-4 py-2 font-['IBM_Plex_Sans'] text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-hover)]"
          >
            Ouvrir l'incident
          </a>
        } @else {
          <div class="flex flex-col gap-1 py-2">
            <span class="font-['IBM_Plex_Sans'] text-sm text-[var(--text-secondary)]">
              Aucun incident actif. Tous les systèmes sont stables.
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class ActiveIncidentPanelComponent {
  readonly incident = input<Incident | null>(null);

  protected readonly elapsedLabel = computed(() => {
    const inc = this.incident();
    if (!inc) return '';
    const elapsedMs = Date.now() - new Date(inc.detectedAt).getTime();
    const minutes = Math.max(0, Math.floor(elapsedMs / 60_000));
    return minutes < 1 ? "à l'instant" : `il y a ${minutes} min`;
  });
}
