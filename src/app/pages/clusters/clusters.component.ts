import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClusterService, Cluster } from '../../services/cluster.service';
import { IngestionService, ClusterDashboard } from '../../services/ingestion.service';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-clusters',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-primaryText font-sans">Clusters</h1>
          <p class="text-xs text-secondaryText mt-0.5">Connected Kubernetes environments & isolated workloads</p>
        </div>
        <button
          (click)="showForm = !showForm"
          class="rounded-md bg-brand px-3.5 py-2 text-xs font-semibold text-on-brand hover:bg-brand-hover transition-colors flex items-center gap-1.5"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>{{ showForm ? 'Cancel' : 'Connect Cluster' }}</span>
        </button>
      </div>

      <!-- Add Cluster Form Modal/Card -->
      <form
        *ngIf="showForm"
        (ngSubmit)="onCreateCluster()"
        class="rounded-lg border border-border bg-surface1 p-5 space-y-4"
      >
        <div class="text-sm font-bold text-primaryText border-b border-border pb-2">Connect New Kubernetes Cluster</div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-secondaryText mb-1">Cluster Name</label>
            <input
              type="text"
              [(ngModel)]="newClusterName"
              name="name"
              required
              class="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-xs text-primaryText outline-none focus:border-brand"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-secondaryText mb-1">Kubernetes Version</label>
            <input
              type="text"
              [(ngModel)]="newClusterK8sVersion"
              name="k8sVersion"
              class="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-xs text-primaryText outline-none focus:border-brand"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-secondaryText mb-1">API Server URL</label>
          <input
            type="text"
            [(ngModel)]="newClusterApiServer"
            name="apiServer"
            required
            class="w-full rounded-md border border-border bg-surface2 px-3 py-2 font-mono text-xs text-primaryText outline-none focus:border-brand"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-secondaryText mb-1">CA Certificate </label>
          <textarea
            [(ngModel)]="newClusterCaCert"
            name="caCert"
            required
            rows="2"
            class="w-full rounded-md border border-border bg-surface2 px-3 py-2 font-mono text-[11px] text-primaryText outline-none focus:border-brand"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-medium text-secondaryText mb-1">Service Account Token</label>
          <textarea
            [(ngModel)]="newClusterToken"
            name="token"
            required
            rows="2"
            class="w-full rounded-md border border-border bg-surface2 px-3 py-2 font-mono text-[11px] text-primaryText outline-none focus:border-brand"
          ></textarea>
        </div>

        <div *ngIf="createErrorMessage" class="rounded-md bg-critical/10 border border-critical/30 p-2 text-xs text-critical">
          {{ createErrorMessage }}
        </div>

        <button
          type="submit"
          [disabled]="isCreating"
          class="rounded-md bg-brand px-4 py-2 text-xs font-semibold text-on-brand hover:bg-brand-hover disabled:opacity-50"
        >
          {{ isCreating ? 'Connecting...' : 'Save & Connect' }}
        </button>
      </form>

      <!-- Cluster Grid Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          *ngFor="let c of displayClusters"
          (click)="goToClusterById(c.id)"
          class="rounded-lg border border-border bg-surface1 p-5 hover:border-brand hover:bg-surface2/50 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="font-bold text-sm text-primaryText group-hover:text-brand transition-colors">{{ c.name }}</span>
              <app-status-badge [status]="(c.incidents || 0) > 0 ? 'critical' : 'healthy'"></app-status-badge>
            </div>
            <div class="font-mono text-xs text-mutedText mb-4">Kubernetes v{{ c.version || '1.30' }}</div>
          </div>

          <div class="border-t border-border pt-3 flex items-center justify-between text-xs text-secondaryText">
            <div class="flex items-center gap-3">
              <span><strong>{{ c.pods || 0 }}</strong> pods</span>
              <span [ngClass]="(c.incidents || 0) > 0 ? 'text-critical font-semibold' : 'text-secondaryText'">
                <strong>{{ c.incidents || 0 }}</strong> incident(s)
              </span>
            </div>
            <span class="text-brand font-medium group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>

      <!-- Clusters Table Summary -->
      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="px-5 py-4 border-b border-border text-sm font-semibold text-primaryText">
          Registered Clusters
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-left text-mutedText border-b border-border font-medium">
                <th class="px-5 py-3">Name</th>
                <th class="px-5 py-3">Version</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Connected</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                *ngFor="let cluster of clusters"
                class="hover:bg-surface2/50 transition-colors cursor-pointer"
                (click)="goToCluster(cluster)"
              >
                <td class="px-5 py-3 font-semibold text-primaryText">{{ cluster.name }}</td>
                <td class="px-5 py-3 font-mono text-secondaryText">v{{ cluster.k8s_version || '1.30' }}</td>
                <td class="px-5 py-3">
                  <app-status-badge [status]="'healthy'"></app-status-badge>
                </td>
                <td class="px-5 py-3 font-mono text-secondaryText text-[11px]">
                  {{ cluster.connected_at | date: 'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-5 py-3 text-right">
                  <button
                    class="rounded border border-border bg-surface2 px-2.5 py-1 text-[11px] font-medium text-secondaryText hover:text-primaryText hover:bg-surface3"
                  >
                    View Pods & Metrics &rarr;
                  </button>
                </td>
              </tr>
              <tr *ngIf="clusters.length === 0 && !isLoading">
                <td colspan="5" class="px-5 py-8 text-center text-secondaryText">
                  No clusters connected. Click "Connect Cluster" to add one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ClustersComponent implements OnInit {
  clusters: Cluster[] = [];
  dashboardClusters: ClusterDashboard[] = [];
  isLoading = true;
  errorMessage = '';

  showForm = false;
  newClusterName = '';
  newClusterK8sVersion = '';
  newClusterApiServer = '';
  newClusterCaCert = '';
  newClusterToken = '';
  isCreating = false;
  createErrorMessage = '';

  constructor(
    private clusterService: ClusterService,
    private ingestionService: IngestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    forkJoin({
      clusters: this.clusterService.getClusters().pipe(catchError(() => of([]))),
      dashboards: this.ingestionService.getAllClustersDashboard().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ clusters, dashboards }) => {
        this.clusters = clusters;
        this.dashboardClusters = dashboards;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get displayClusters(): { id: string; name: string; version: string; pods: number; incidents: number }[] {
    const dashMap = new Map(this.dashboardClusters.map(d => [d.cluster_id, d]));
    return this.clusters.map(c => {
      const d = dashMap.get(c.id);
      return {
        id: c.id,
        name: c.name,
        version: c.k8s_version || '1.30',
        pods: d ? d.total_pods : 0,
        incidents: d ? d.active_incidents : 0
      };
    });
  }

  goToCluster(cluster: Cluster): void {
    this.router.navigate(['/clusters', cluster.id]);
  }

  goToClusterById(id: string): void {
    this.router.navigate(['/clusters', id]);
  }

  onCreateCluster(): void {
    this.createErrorMessage = '';
    this.isCreating = true;
    let apiServer = this.newClusterApiServer.trim();
    if (apiServer.startsWith('https://172.0.0.1:')) {
      apiServer = apiServer.replace('https://172.0.0.1:', 'https://127.0.0.1:');
    }
    this.clusterService
      .createCluster({
        name: this.newClusterName.trim(),
        k8s_version: this.newClusterK8sVersion.trim() || '1.30',
        credentials: {
          api_server: apiServer,
          ca_cert: this.newClusterCaCert.trim(),
          token: this.newClusterToken.trim(),
        },
      })
      .subscribe({
        next: () => {
          this.isCreating = false;
          this.showForm = false;
          this.newClusterName = '';
          this.newClusterK8sVersion = '';
          this.newClusterApiServer = '';
          this.newClusterCaCert = '';
          this.newClusterToken = '';
          this.loadAll();
        },
        error: () => {
          this.createErrorMessage = 'Failed to create cluster connection.';
          this.isCreating = false;
        },
      });
  }
}
