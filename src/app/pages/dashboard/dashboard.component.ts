import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent, SeverityBadgeComponent, AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { IncidentService, Incident } from '../../services/incident.service';
import { ClusterService, Cluster } from '../../services/cluster.service';
import { IngestionService, ClusterDashboard } from '../../services/ingestion.service';

const POLL_INTERVAL_MS = 30000;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, SeverityBadgeComponent, AgentBadgeComponent],
  template: `
    <div class="p-6 space-y-6">
      <!-- 4 Top Metric Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Clusters -->
        <div class="rounded-lg border border-border bg-surface1 p-5">
          <div class="text-xs font-medium text-secondaryText uppercase tracking-wide">Clusters</div>
          <div class="mt-2 text-3xl font-bold text-primaryText font-sans">{{ clusters.length }}</div>
          <div class="mt-1 text-xs font-medium text-success">{{ healthyClustersCount }} healthy</div>
        </div>

        <!-- Pods -->
        <div class="rounded-lg border border-border bg-surface1 p-5">
          <div class="text-xs font-medium text-secondaryText uppercase tracking-wide">Pods</div>
          <div class="mt-2 text-3xl font-bold text-primaryText font-sans">{{ totalPods }}</div>
          <div class="mt-1 text-xs font-medium text-success">{{ runningPodsCount }} running</div>
        </div>

        <!-- Active Incidents -->
        <div class="rounded-lg border border-border bg-surface1 p-5">
          <div class="text-xs font-medium text-secondaryText uppercase tracking-wide">Active Incidents</div>
          <div class="mt-2 text-3xl font-bold font-sans" [ngClass]="activeCount > 0 ? 'text-critical' : 'text-primaryText'">{{ activeCount }}</div>
          <div class="mt-1 text-xs font-medium" [ngClass]="criticalIncidentsCount > 0 ? 'text-critical' : 'text-secondaryText'">
            {{ criticalIncidentsCount }} critical
          </div>
        </div>

        <!-- Resolved Incidents -->
        <div class="rounded-lg border border-border bg-surface1 p-5">
          <div class="text-xs font-medium text-secondaryText uppercase tracking-wide">Resolved Incidents</div>
          <div class="mt-2 text-3xl font-bold text-success font-sans">{{ resolvedCount }}</div>
          <div class="mt-1 text-xs font-medium text-success">Automated resolution</div>
        </div>
      </div>

      <!-- Cluster Health Overview Card -->
      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-border">
          <div class="text-sm font-semibold text-primaryText">Cluster Health</div>
          <span class="text-xs font-mono text-mutedText">{{ clusters.length }} cluster(s) connected</span>
        </div>

        <div *ngIf="clusters.length === 0 && !isLoading" class="p-8 text-center text-xs text-secondaryText">
          No clusters registered. Go to Clusters to add one.
        </div>

        <div class="divide-y divide-border">
          <div
            *ngFor="let c of clusters"
            (click)="goToCluster(c.id)"
            class="flex items-center justify-between px-5 py-3 hover:bg-surface2/50 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <app-status-badge [status]="getClusterIncidentCount(c.id) > 0 ? 'critical' : 'healthy'"></app-status-badge>
              <div class="min-w-0">
                <div class="text-sm font-semibold text-primaryText truncate">{{ c.name }}</div>
                <div class="font-mono text-xs text-mutedText">v{{ c.k8s_version || '1.30' }}</div>
              </div>
            </div>

            <div class="hidden sm:flex items-center gap-6 text-xs text-secondaryText">
              <div>{{ getClusterPodCount(c.id) }} pods</div>
              <div [ngClass]="getClusterIncidentCount(c.id) > 0 ? 'text-critical font-semibold' : 'text-secondaryText'">
                {{ getClusterIncidentCount(c.id) }} incident(s)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Incidents Table Card -->
      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <div class="text-sm font-semibold text-primaryText">Active Incidents</div>

          <!-- Search Filter -->
          <div class="relative">
            <svg class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-mutedText" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              [(ngModel)]="searchQuery"
              placeholder="Search incidents..."
              class="pl-8 pr-3 py-1.5 rounded-md text-xs border border-border bg-surface2 text-primaryText outline-none focus:border-brand w-56 transition-colors"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-left text-mutedText border-b border-border font-medium">
                <th class="px-5 py-3">Severity</th>
                <th class="px-5 py-3">Incident</th>
                <th class="px-5 py-3 hidden md:table-cell">Cluster</th>
                <th class="px-5 py-3 hidden lg:table-cell">Resource</th>
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
                <td class="px-5 py-3 hidden md:table-cell text-secondaryText">
                  {{ inc.cluster_name || inc.cluster_id }}
                </td>
                <td class="px-5 py-3 hidden lg:table-cell font-mono text-secondaryText">
                  {{ inc.service_name || inc.resource_name || 'deployment' }}
                </td>
                <td class="px-5 py-3 text-secondaryText font-mono text-[11px]">
                  {{ inc.detected_at | date: 'HH:mm:ss' }}
                </td>
                <td class="px-5 py-3">
                  <app-status-badge [status]="inc.status === 'resolved' ? 'resolved' : 'active'"></app-status-badge>
                </td>
              </tr>
              <tr *ngIf="filteredIncidents.length === 0">
                <td colspan="6" class="px-5 py-8 text-center text-secondaryText">
                  No active incidents. Infrastructure operating normally.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  clusters: Cluster[] = [];
  telemetryMap: Map<string, ClusterDashboard> = new Map();
  incidents: Incident[] = [];
  isLoading = false;
  searchQuery = '';

  private pollHandle: any = null;

  constructor(
    private incidentService: IncidentService,
    private clusterService: ClusterService,
    private ingestionService: IngestionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadInstantData();
    this.pollHandle = setInterval(() => this.loadInstantData(), POLL_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
    }
  }

  loadInstantData(): void {
    // 1. Instant loading from postgres (takes < 10ms)
    this.clusterService.getClusters().subscribe({
      next: (clusters) => {
        this.clusters = clusters;
      },
      error: () => {}
    });

    this.incidentService.getIncidents().subscribe({
      next: (incidents) => {
        this.incidents = incidents;
      },
      error: () => {}
    });

    // 2. Background telemetry fetch (asynchronous)
    this.ingestionService.getAllClustersDashboard().subscribe({
      next: (dashboards) => {
        dashboards.forEach(d => this.telemetryMap.set(d.cluster_id, d));
      },
      error: () => {}
    });
  }

 getClusterPodCount(clusterId: string): number {
  const t = this.telemetryMap.get(clusterId);
  return t ? t.total_pods : 0;
}

getClusterIncidentCount(clusterId: string): number {
  const t = this.telemetryMap.get(clusterId);
  if (t) return t.active_incidents;
  return this.incidents.filter(i => i.cluster_id === clusterId && i.status !== 'resolved').length;
}

  get totalPods(): number {
  let sum = 0;
  this.clusters.forEach(c => sum += this.getClusterPodCount(c.id));
  return sum;
}


  get runningPodsCount(): number {
  return Math.max(0, this.totalPods - this.activeCount);
}

  get healthyClustersCount(): number {
    return this.clusters.filter(c => this.getClusterIncidentCount(c.id) === 0).length;
  }

  get activeCount(): number {
    return this.incidents.filter(i => i.status !== 'resolved').length;
  }

  get criticalIncidentsCount(): number {
    return this.incidents.filter(i => i.status !== 'resolved' && (i.severity === 'critical' || i.title.toLowerCase().includes('oom') || i.title.toLowerCase().includes('crash'))).length;
  }

  get resolvedCount(): number {
    return this.incidents.filter(i => i.status === 'resolved').length;
  }

  get filteredIncidents(): Incident[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.incidents
      .filter(i => i.status !== 'resolved')
      .filter(i => !q || i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }

  goToCluster(id: string): void {
    this.router.navigate(['/clusters', id]);
  }

  goToIncident(id: string): void {
    this.router.navigate(['/incidents', id]);
  }

  
}
