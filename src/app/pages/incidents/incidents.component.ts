import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent, AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { IncidentService, Incident } from '../../services/incident.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, AgentBadgeComponent],
  template: `
    <div class="flex flex-col gap-6 p-6">
      <div>
        <h1 class="font-display text-xl font-semibold text-primaryText">Incidents</h1>
        <p class="text-sm text-secondaryText">Suivez et résolvez les pannes de service et alertes d'infrastructure.</p>
      </div>

      <div *ngIf="isLoading" class="text-sm text-secondaryText">Chargement…</div>
      <div *ngIf="errorMessage" class="rounded-md bg-critical-bg px-4 py-3 text-sm text-critical">{{ errorMessage }}</div>

      <div *ngIf="!isLoading && !errorMessage" class="flex flex-col gap-4">
        <div
          *ngFor="let inc of incidents"
          [routerLink]="['/incidents', inc.id]"
          class="flex cursor-pointer items-center justify-between rounded-md border border-border bg-surface1 p-5 transition-colors hover:bg-surface2"
        >
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2.5">
              <span class="font-mono text-xs text-mutedText">{{ inc.id }}</span>
              <h3 class="text-base font-semibold text-primaryText">{{ inc.title }}</h3>
              <app-status-badge
                [status]="inc.status === 'active' ? 'critical' : 'success'"
                [label]="inc.status === 'active' ? 'Actif' : 'Résolu'"
              ></app-status-badge>
            </div>
          </div>
          <svg class="h-4 w-4 text-mutedText" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div *ngIf="incidents.length === 0" class="rounded-md border border-dashed border-border bg-surface1 p-10 text-center">
          <h3 class="text-sm font-semibold text-secondaryText">Aucun incident actif</h3>
          <p class="mt-1 font-mono text-xs text-mutedText">Tous vos microservices fonctionnent normalement.</p>
        </div>
      </div>
    </div>
  `,
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe({
      next: (incidents) => {
        this.incidents = incidents;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les incidents';
        this.isLoading = false;
      },
    });
  }
}