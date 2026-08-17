import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatusBadgeComponent, AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { PulseLineComponent } from '../../shared/pulse-line/pulse-line.component';
import { IncidentService } from '../../services/incident.service';
import { IngestionService, ClusterDashboard, PodDashboardInfo } from '../../services/ingestion.service';

const POLL_INTERVAL_MS = 20000; // 20s -- assez réactif sans spammer le backend

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, AgentBadgeComponent, PulseLineComponent],
  template: `
    <div class="mb-6 flex items-end justify-between">
      <div>
        <h1 class="font-display text-[22px] font-semibold">Dashboard</h1>
        <p class="mt-1 text-[13px] text-secondaryText">
          Aperçu temps réel de l'ensemble de vos clusters surveillés
        </p>
      </div>

      <div class="flex items-center gap-3">
        <label class="flex cursor-pointer items-center gap-2 text-[13px] text-secondaryText">
          <input
            type="checkbox"
            [checked]="showOnlyIncidents"
            (change)="showOnlyIncidents = !showOnlyIncidents"
            class="h-3.5 w-3.5 accent-critical"
          />
          Afficher uniquement les pods en incident
        </label>
      </div>
    </div>

    <div *ngIf="isLoading" class="text-[13.5px] text-secondaryText">
      Chargement des données...
    </div>

    <div *ngIf="errorMessage" class="rounded-md bg-critical-bg px-4 py-3 text-[13.5px] text-critical">
      {{ errorMessage }}
    </div>

    <div *ngIf="!isLoading && !errorMessage">
      <!-- Résumé global tous clusters confondus -->
      <div class="mb-4 grid grid-cols-4 gap-3.5">
        <div class="rounded-md border border-border bg-surface2 p-4">
          <div class="mb-2 text-xs text-secondaryText">Clusters surveillés</div>
          <div class="font-display text-[26px] font-semibold">{{ clusters.length }}</div>
        </div>
        <div class="rounded-md border border-border bg-surface2 p-4">
          <div class="mb-2 text-xs text-secondaryText">Pods au total</div>
          <div class="font-display text-[26px] font-semibold">{{ totalPods }}</div>
        </div>
        <div class="rounded-md border border-border bg-surface2 p-4">
          <div class="mb-2 text-xs text-secondaryText">Incidents actifs</div>
          <div class="font-display text-[26px] font-semibold text-critical">{{ activeCount }}</div>
        </div>
        <div class="rounded-md border border-border bg-surface2 p-4">
          <div class="mb-2 text-xs text-secondaryText">Incidents résolus</div>
          <div class="font-display text-[26px] font-semibold text-success">{{ resolvedCount }}</div>
        </div>
      </div>

      <!-- Mini-cartes par cluster -- coup d'œil rapide, clic = scroll vers le détail -->
      <div
        *ngIf="clusters.length > 1"
        class="mb-6 flex gap-3 overflow-x-auto pb-1"
      >
        <button
          *ngFor="let cluster of clusters"
          (click)="scrollToCluster(cluster.cluster_id)"
          class="flex min-w-[180px] flex-shrink-0 items-center justify-between rounded-md border px-3.5 py-2.5 text-left transition-colors hover:bg-surface3"
          [class.border-critical]="cluster.active_incidents > 0"
          [class.border-border]="cluster.active_incidents === 0"
          [class.bg-critical-bg]="cluster.active_incidents > 0"
          [class.bg-surface2]="cluster.active_incidents === 0"
        >
          <div>
            <div class="text-[12.5px] font-medium text-primaryText">{{ cluster.cluster_name }}</div>
            <div class="mt-0.5 text-[11px] text-secondaryText">{{ cluster.total_pods }} pod(s)</div>
          </div>
          <div
            class="font-display text-lg font-semibold"
            [class.text-critical]="cluster.active_incidents > 0"
            [class.text-success]="cluster.active_incidents === 0"
          >
            {{ cluster.active_incidents }}
          </div>
        </button>
      </div>

      <!-- Une section par cluster -->
      <div
        *ngFor="let cluster of clusters"
        [id]="'cluster-' + cluster.cluster_id"
        class="mb-6 overflow-hidden rounded-md border border-border bg-surface2 scroll-mt-4"
      >
        <div class="flex items-center justify-between border-b border-border px-4.5 py-3.5">
          <div class="flex items-center gap-2.5">
            <h3 class="text-sm font-medium">{{ cluster.cluster_name }}</h3>
            <span class="font-mono text-xs text-mutedText">AKS {{ cluster.k8s_version }}</span>
          </div>
          <div class="flex items-center gap-3">
            <app-status-badge
              [status]="cluster.active_incidents > 0 ? 'critical' : 'success'"
              [label]="cluster.active_incidents > 0 ? (cluster.active_incidents + ' incident(s) actif(s)') : 'Tous systèmes opérationnels'"
            ></app-status-badge>
          </div>
        </div>

        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Pod</th>
              <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Namespace</th>
              <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Statut</th>
              <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Redémarrages</th>
              <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">CPU</th>
              <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Mémoire</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let pod of filteredPods(cluster)"
              (click)="onPodClick(pod)"
              [class.cursor-pointer]="pod.has_incident && pod.incident_id"
              [class.hover:bg-surface3]="pod.has_incident && pod.incident_id"
            >
              <td class="border-b border-border px-4.5 py-3 font-mono text-[12.5px]">{{ pod.name }}</td>
              <td class="border-b border-border px-4.5 py-3 text-[13px] text-secondaryText">{{ pod.namespace }}</td>
              <td class="border-b border-border px-4.5 py-3">
                <app-status-badge
                  [status]="pod.has_incident ? 'critical' : 'success'"
                  [label]="pod.has_incident ? pod.reason : 'OK'"
                ></app-status-badge>
              </td>
              <td class="border-b border-border px-4.5 py-3 text-[13px]">{{ pod.restart_count }}</td>
              <td class="border-b border-border px-4.5 py-3 font-mono text-[12.5px]">{{ formatCPU(pod.cpu) }}</td>
              <td class="border-b border-border px-4.5 py-3 font-mono text-[12.5px]">{{ formatMemory(pod.memory_bytes) }}</td>
            </tr>
          </tbody>
        </table>

        <div
          *ngIf="filteredPods(cluster).length === 0"
          class="px-4.5 py-6 text-center text-[13px] text-secondaryText"
        >
          Aucun pod à afficher avec ce filtre.
        </div>
      </div>

      <div *ngIf="clusters.length === 0" class="rounded-md border border-dashed border-border bg-surface1 p-10 text-center text-[13.5px] text-secondaryText">
        Aucun cluster enregistré pour l'instant.
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  clusters: ClusterDashboard[] = [];
  isLoading = true;
  errorMessage = '';
  showOnlyIncidents = false;

  private pollHandle: ReturnType<typeof setInterval> | null = null;

  constructor(
    private incidentService: IncidentService,
    private ingestionService: IngestionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDashboard(true);

    // Rafraîchissement automatique -- ne remet pas isLoading à true pour
    // éviter un flash de l'UI toutes les 20 secondes, juste une mise à jour
    // silencieuse des données.
    this.pollHandle = setInterval(() => this.loadDashboard(false), POLL_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.pollHandle !== null) {
      clearInterval(this.pollHandle);
    }
  }

  private loadDashboard(showLoadingState: boolean): void {
    if (showLoadingState) {
      this.isLoading = true;
    }
    this.ingestionService.getAllClustersDashboard().subscribe({
      next: (clusters) => {
        this.clusters = clusters;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('[Dashboard] Erreur:', err);
        this.errorMessage = 'Impossible de charger les données des clusters';
        this.isLoading = false;
      },
    });
  }

  filteredPods(cluster: ClusterDashboard): PodDashboardInfo[] {
    if (!this.showOnlyIncidents) {
      return cluster.pods;
    }
    return cluster.pods.filter((p) => p.has_incident);
  }

  onPodClick(pod: PodDashboardInfo): void {
    if (pod.has_incident && pod.incident_id) {
      this.router.navigate(['/incidents', pod.incident_id]);
    }
  }

  scrollToCluster(clusterId: string): void {
    const el = document.getElementById('cluster-' + clusterId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  get totalPods(): number {
    return this.clusters.reduce((sum, c) => sum + c.total_pods, 0);
  }

  get activeCount(): number {
    return this.clusters.reduce((sum, c) => sum + c.active_incidents, 0);
  }

  get resolvedCount(): number {
    return this.clusters.reduce((sum, c) => sum + c.resolved_incidents, 0);
  }

  formatCPU(cores: number): string {
    return (cores * 1000).toFixed(1) + 'm';
  }

  formatMemory(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return (bytes / 1024).toFixed(0) + ' Ki';
    return mb.toFixed(1) + ' Mi';
  }
}