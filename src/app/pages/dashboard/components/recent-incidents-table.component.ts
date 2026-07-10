// src/app/pages/dashboard/components/recent-incidents-table.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent, AgentBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { Incident } from '../../../models/incident.model';

@Component({
  selector: 'app-recent-incidents-table',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, AgentBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface-1)]">
      <div class="border-b border-[var(--border)] px-5 py-4">
        <h2
          class="font-['IBM_Plex_Sans_Condensed'] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
        >
          Incidents récents
        </h2>
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr class="font-['IBM_Plex_Sans_Condensed'] text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <th class="px-5 py-2 text-left font-medium">Incident</th>
            <th class="px-5 py-2 text-left font-medium">Cluster</th>
            <th class="px-5 py-2 text-left font-medium">Statut</th>
            <th class="px-5 py-2 text-left font-medium">Diagnostic IA</th>
            <th class="px-5 py-2 text-left font-medium">Détecté</th>
          </tr>
        </thead>
        <tbody>
          @for (incident of incidents(); track incident.id) {
            <tr
              [routerLink]="['/incidents', incident.id]"
              class="cursor-pointer border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-surface-2)]"
            >
              <td class="px-5 py-3 font-['IBM_Plex_Sans'] text-sm text-[var(--text-primary)]">
                {{ incident.title }}
              </td>
              <td class="px-5 py-3 font-['IBM_Plex_Mono'] text-xs text-[var(--text-secondary)]">
                {{ incident.cluster }}
              </td>
              <td class="px-5 py-3">
                <app-status-badge [status]="incident.status" [severity]="incident.severity" />
              </td>
              <td class="px-5 py-3">
                @if (incident.aiConfidence !== null) {
                  <app-agent-badge [confidence]="incident.aiConfidence" />
                } @else {
                  <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">—</span>
                }
              </td>
              <td class="px-5 py-3 font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">
                {{ incident.detectedAt | date: 'short' }}
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="px-5 py-8 text-center font-['IBM_Plex_Sans'] text-sm text-[var(--text-muted)]">
                Aucun incident récent.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class RecentIncidentsTableComponent {
  readonly incidents = input<Incident[]>([]);
}
