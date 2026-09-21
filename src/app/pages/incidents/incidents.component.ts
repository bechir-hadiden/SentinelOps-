import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent, SeverityBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { IncidentService, Incident } from '../../services/incident.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, SeverityBadgeComponent],
  template: `
    <div class="p-6 space-y-5">
      <!-- Filters row -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <svg class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-mutedText" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            [(ngModel)]="searchQuery"
            placeholder="Search incidents..."
            class="pl-8 pr-3 py-1.5 rounded-md text-xs border border-border bg-surface2 text-primaryText outline-none focus:border-brand w-60 transition-colors"
          />
        </div>

        <!-- Severity filter -->
        <select
          [(ngModel)]="selectedSeverity"
          class="px-3 py-1.5 rounded-md text-xs border border-border bg-surface2 text-primaryText outline-none focus:border-brand transition-colors"
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <!-- Status filter -->
        <select
          [(ngModel)]="selectedStatus"
          class="px-3 py-1.5 rounded-md text-xs border border-border bg-surface2 text-primaryText outline-none focus:border-brand transition-colors"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <!-- Loading / Error -->
      <div *ngIf="isLoading" class="text-xs text-secondaryText flex items-center gap-2">
        <svg class="h-3.5 w-3.5 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Loading incidents...</span>
      </div>

      <div *ngIf="errorMessage" class="rounded-lg border border-critical/30 bg-critical/10 p-3 text-xs text-critical">
        {{ errorMessage }}
      </div>

      <!-- Incidents Table Card -->
      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-left text-mutedText border-b border-border font-medium">
                <th class="px-5 py-3">Severity</th>
                <th class="px-5 py-3">Incident</th>
                <th class="px-5 py-3 hidden md:table-cell">Resource</th>
                <th class="px-5 py-3 hidden lg:table-cell">Cluster</th>
                <th class="px-5 py-3">Detected</th>
                <th class="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                *ngFor="let inc of filteredIncidents"
                (click)="goToIncident(inc.id)"
                class="hover:bg-surface2/50 cursor-pointer transition-colors"
              >
                <td class="px-5 py-3">
                  <app-severity-badge [severity]="inc.severity || 'warning'"></app-severity-badge>
                </td>
                <td class="px-5 py-3">
                  <div class="font-semibold text-primaryText">{{ inc.title }}</div>
                  <div class="font-mono text-[11px] text-mutedText">{{ inc.id }}</div>
                </td>
                <td class="px-5 py-3 hidden md:table-cell font-mono text-secondaryText">
                  {{ inc.service_name || inc.resource_name || 'deployment' }}
                </td>
                <td class="px-5 py-3 hidden lg:table-cell text-secondaryText">
                  {{ inc.cluster_name || inc.cluster_id }}
                </td>
                <td class="px-5 py-3 text-secondaryText font-mono text-[11px]">
                  {{ inc.detected_at | date: 'dd/MM HH:mm' }}
                </td>
                <td class="px-5 py-3">
                  <app-status-badge [status]="inc.status === 'resolved' ? 'resolved' : 'active'"></app-status-badge>
                </td>
              </tr>
              <tr *ngIf="filteredIncidents.length === 0 && !isLoading">
                <td colspan="6" class="px-5 py-12 text-center text-secondaryText">
                  <svg class="w-8 h-8 text-success mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                  <div class="font-medium text-primaryText">No incidents found</div>
                  <div class="text-[11px] text-mutedText mt-0.5">All services operating normally.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  isLoading = true;
  errorMessage = '';

  searchQuery = '';
  selectedSeverity = 'all';
  selectedStatus = 'all';

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.isLoading = true;
    this.incidentService.getIncidents().subscribe({
      next: (incidents: Incident[]) => {
        this.incidents = incidents;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to fetch incidents from incident-service.';
        this.isLoading = false;
      },
    });
  }

  get filteredIncidents(): Incident[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.incidents.filter((inc) => {
      const matchQuery = !q || inc.title.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q);
      const matchSeverity = this.selectedSeverity === 'all' || (inc.severity || 'warning') === this.selectedSeverity;
      const matchStatus = this.selectedStatus === 'all' || (inc.status === this.selectedStatus);
      return matchQuery && matchSeverity && matchStatus;
    });
  }

  goToIncident(id: string): void {
    this.router.navigate(['/incidents', id]);
  }
}
