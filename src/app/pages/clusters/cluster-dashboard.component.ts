import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClusterService, ClusterDashboardResponse, ServiceWithoutIngress } from '../../services/cluster.service';
import { IngressEditorComponent } from '../incident-detail/ingress-editor.component';
import { MetricsChartComponent } from '../metrics/metrics-chart.component';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-cluster-dashboard',
  standalone: true,
  imports: [CommonModule, IngressEditorComponent, MetricsChartComponent, StatusBadgeComponent],
  template: `
    <div class="p-6 space-y-5">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex items-center gap-2.5 text-xs text-secondaryText">
        <svg class="h-4 w-4 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Loading cluster telemetry...</span>
      </div>

      <!-- Error message -->
      <div *ngIf="errorMessage && !isLoading" class="rounded-lg border border-critical/30 bg-critical/10 p-3 text-xs text-critical flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button (click)="loadClusterDashboard(clusterId)" class="rounded border border-critical/30 px-2 py-1 hover:bg-critical/20">
          Retry
        </button>
      </div>

      <!-- Dashboard content -->
      <div *ngIf="dashboard && !isLoading" class="space-y-5">
        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-xl font-bold text-primaryText font-sans">{{ dashboard.cluster_name }}</h1>
              <app-status-badge [status]="dashboard.active_incidents > 0 ? 'critical' : 'healthy'"></app-status-badge>
            </div>
            <p class="text-xs text-secondaryText font-mono mt-1">
              Kubernetes {{ dashboard.k8s_version }} &middot; ID: {{ clusterId }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              (click)="loadClusterDashboard(clusterId)"
              class="rounded-md border border-border bg-surface1 px-3 py-1.5 text-xs font-semibold text-secondaryText hover:bg-surface2 hover:text-primaryText transition-colors"
            >
              &#x21bb; Refresh
            </button>
            <button
              (click)="goBack()"
              class="rounded-md border border-border bg-surface1 px-3 py-1.5 text-xs font-semibold text-secondaryText hover:bg-surface2 hover:text-primaryText transition-colors"
            >
              &larr; Clusters
            </button>
          </div>
        </div>

        <!-- 3 Stats Cards -->
        <div class="grid grid-cols-3 gap-4">
          <div class="rounded-lg border border-border bg-surface1 p-4">
            <div class="text-[11px] font-semibold text-mutedText uppercase">Total Pods</div>
            <div class="text-2xl font-bold text-primaryText mt-1 font-sans">{{ dashboard.total_pods }}</div>
          </div>
          <div class="rounded-lg border border-critical/30 bg-surface1 p-4">
            <div class="text-[11px] font-semibold text-critical uppercase">Active Incidents</div>
            <div class="text-2xl font-bold text-critical mt-1 font-sans">{{ dashboard.active_incidents }}</div>
          </div>
          <div class="rounded-lg border border-success/30 bg-surface1 p-4">
            <div class="text-[11px] font-semibold text-success uppercase">Resolved Incidents</div>
            <div class="text-2xl font-bold text-success mt-1 font-sans">{{ dashboard.resolved_incidents }}</div>
          </div>
        </div>

        <!-- Real-time Timeseries CPU & Memory Charts -->
        <div class="rounded-lg border border-border bg-surface1 p-5">
          <div class="text-sm font-semibold text-primaryText mb-3">CPU & Memory Performance Timeseries</div>
          <app-metrics-chart *ngIf="clusterId" [clusterId]="clusterId"></app-metrics-chart>
        </div>

        <!-- Pods Table Card -->
        <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
          <div class="px-5 py-4 border-b border-border flex items-center justify-between">
            <div class="text-sm font-semibold text-primaryText">Pod Status & Workloads</div>
            <span class="text-xs font-mono text-mutedText">{{ dashboard.pods.length }} pods</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-mutedText border-b border-border font-medium">
                  <th class="px-5 py-3">Pod</th>
                  <th class="px-5 py-3">Namespace</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">Restarts</th>
                  <th class="px-5 py-3">CPU</th>
                  <th class="px-5 py-3">Memory</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  *ngFor="let pod of dashboard.pods"
                  (click)="goToIncident(pod)"
                  class="hover:bg-surface2/50 cursor-pointer transition-colors"
                >
                  <td class="px-5 py-3 font-semibold text-primaryText font-mono">{{ pod.name }}</td>
                  <td class="px-5 py-3 font-mono text-secondaryText">{{ pod.namespace }}</td>
                  <td class="px-5 py-3">
                    <app-status-badge [status]="pod.has_incident ? 'critical' : 'healthy'" [label]="pod.has_incident ? pod.reason : 'Running'"></app-status-badge>
                  </td>
                  <td class="px-5 py-3 font-mono text-secondaryText">{{ pod.restart_count }}</td>
                  <td class="px-5 py-3 font-mono text-secondaryText">{{ (pod.cpu * 1000) | number: '1.1-2' }}m</td>
                  <td class="px-5 py-3 font-mono text-secondaryText">{{ (pod.memory_bytes / 1024 / 1024) | number: '1.1-1' }} MiB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Services Without Ingress Section -->
        <div *ngIf="servicesWithoutIngress.length > 0" class="rounded-lg border border-border bg-surface1 p-5 space-y-3">
          <div class="text-sm font-semibold text-primaryText">Services without Ingress</div>
          <div class="space-y-2">
            <div *ngFor="let svc of servicesWithoutIngress" class="flex items-center justify-between rounded-md border border-border bg-page p-3">
              <div class="flex flex-col gap-0.5">
                <span class="font-mono text-xs text-primaryText font-semibold">{{ svc.name }} ({{ svc.namespace }}:{{ svc.port }})</span>
                <span class="text-[10px] text-mutedText">
                  {{ svc.likely_http ? 'HTTP protocol detected' : svc.protocol_hint }}
                </span>
              </div>
              <button
                (click)="openIngressCreator(svc)"
                class="rounded border border-border bg-surface2 px-3 py-1 text-xs font-medium text-primaryText hover:bg-surface3"
              >
                Create Ingress
              </button>
            </div>
          </div>
        </div>

        <app-ingress-editor
          *ngIf="showIngressCreator && selectedServiceForIngress"
          mode="create"
          [clusterId]="clusterId"
          [ingressName]="selectedServiceForIngress.name"
          [namespace]="selectedServiceForIngress.namespace"
          [servicePort]="selectedServiceForIngress.port"
          (close)="showIngressCreator = false"
          (updated)="showIngressCreator = false; loadServicesWithoutIngress()"
        ></app-ingress-editor>
      </div>
    </div>
  `,
})
export class ClusterDashboardComponent implements OnInit, OnDestroy {
  dashboard: ClusterDashboardResponse | null = null;
  isLoading = true;
  errorMessage = '';
  clusterId = '';
  servicesWithoutIngress: ServiceWithoutIngress[] = [];
  showIngressCreator = false;
  selectedServiceForIngress: ServiceWithoutIngress | null = null;

  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clusterService: ClusterService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== this.clusterId) {
        this.clusterId = id;
        this.loadClusterDashboard(id);
        this.loadServicesWithoutIngress();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadClusterDashboard(clusterId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.clusterService.getClusterDashboard(clusterId).subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to fetch cluster metrics.';
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  loadServicesWithoutIngress(): void {
    if (!this.clusterId) return;
    this.clusterService.getServicesWithoutIngress(this.clusterId, 'default').subscribe({
      next: (res) => {
        this.servicesWithoutIngress = res.services || [];
        this.cd.detectChanges();
      },
      error: () => {},
    });
  }

  openIngressCreator(svc: ServiceWithoutIngress): void {
    this.selectedServiceForIngress = svc;
    this.showIngressCreator = true;
  }

  goToIncident(pod: any): void {
    if (pod.has_incident && pod.incident_id) {
      this.router.navigate(['/incidents', pod.incident_id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/clusters']);
  }
}
