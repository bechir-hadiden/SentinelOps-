import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClusterService, Cluster } from '../../services/cluster.service';

@Component({
  selector: 'app-clusters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6 flex items-end justify-between">
      <div>
        <h1 class="font-display text-[22px] font-semibold">Clusters</h1>
        <p class="mt-1 text-[13px] text-secondaryText">
          Clusters Kubernetes connectés à votre organisation
        </p>
      </div>
      <button
        (click)="showForm = !showForm"
        class="rounded-md bg-brand px-4 py-2 text-[13.5px] font-medium text-brand-on hover:bg-brand-hover"
      >
        {{ showForm ? 'Annuler' : '+ Connecter un cluster' }}
      </button>
    </div>

    <!-- Formulaire de création -->
    <form
      *ngIf="showForm"
      (ngSubmit)="onCreateCluster()"
      class="mb-6 rounded-md border border-border bg-surface2 p-5"
    >
      <div class="mb-3.5">
        <label class="mb-1.5 block text-[13px] text-secondaryText">Nom du cluster</label>
        <input
          type="text"
          [(ngModel)]="newClusterName"
          name="name"
          required
          placeholder="cluster-prod-eu"
          class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 text-sm text-primaryText outline-none focus:border-brand"
        />
      </div>

      <div class="mb-3.5">
        <label class="mb-1.5 block text-[13px] text-secondaryText">Version Kubernetes</label>
        <input
          type="text"
          [(ngModel)]="newClusterK8sVersion"
          name="k8sVersion"
          placeholder="1.29"
          class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 text-sm text-primaryText outline-none focus:border-brand"
        />
      </div>

      <div class="mb-3.5">
        <label class="mb-1.5 block text-[13px] text-secondaryText">
          Adresse de l'API server
        </label>
        <input
          type="text"
          [(ngModel)]="newClusterApiServer"
          name="apiServer"
          required
          placeholder="https://1.2.3.4:6443"
          class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-xs text-primaryText outline-none focus:border-brand"
        />
        <p class="mt-1 text-[11px] text-mutedText">
          kubectl config view --minify -o jsonpath='&#123;.clusters[0].cluster.server&#125;'
        </p>
      </div>

      <div class="mb-3.5">
        <label class="mb-1.5 block text-[13px] text-secondaryText">
          Certificat CA (base64)
        </label>
        <textarea
          [(ngModel)]="newClusterCaCert"
          name="caCert"
          required
          rows="3"
          placeholder="LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t..."
          class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-xs text-primaryText outline-none focus:border-brand"
        ></textarea>
        <p class="mt-1 text-[11px] text-mutedText">
          kubectl config view --minify --raw -o jsonpath='&#123;.clusters[0].cluster.certificate-authority-data&#125;'
        </p>
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-[13px] text-secondaryText">
          Token du ServiceAccount
        </label>
        <textarea
          [(ngModel)]="newClusterToken"
          name="token"
          required
          rows="3"
          placeholder="eyJhbGciOiJSUzI1NiIs..."
          class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-xs text-primaryText outline-none focus:border-brand"
        ></textarea>
        <p class="mt-1 text-[11px] text-mutedText">
          Token du ServiceAccount RBAC minimal appliqué sur le cluster (voir k8s-manifests/sentinelops-rbac.yaml)
        </p>
      </div>

      <div *ngIf="createErrorMessage" class="mb-4 rounded-md bg-critical-bg px-3 py-2 text-[13px] text-critical">
        {{ createErrorMessage }}
      </div>

      <button
        type="submit"
        [disabled]="isCreating"
        class="rounded-md bg-brand px-4 py-2 text-[13.5px] font-medium text-brand-on hover:bg-brand-hover disabled:opacity-60"
      >
        {{ isCreating ? 'Connexion en cours...' : 'Connecter' }}
      </button>
    </form>

    <div *ngIf="isLoading" class="text-[13.5px] text-secondaryText">
      Chargement des clusters...
    </div>

    <div *ngIf="errorMessage" class="rounded-md bg-critical-bg px-4 py-3 text-[13.5px] text-critical">
      {{ errorMessage }}
    </div>

    <div *ngIf="!isLoading && !errorMessage" class="overflow-hidden rounded-md border border-border bg-surface2">
      <div *ngIf="clusters.length === 0" class="px-4.5 py-8 text-center text-[13.5px] text-secondaryText">
        Aucun cluster connecté pour l'instant.
      </div>

      <table *ngIf="clusters.length > 0" class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Nom</th>
            <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Version K8s</th>
            <th class="border-b border-border px-4.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-mutedText">Connecté le</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cluster of clusters">
            <td class="border-b border-border px-4.5 py-3 text-[13.5px]">{{ cluster.name }}</td>
            <td class="border-b border-border px-4.5 py-3 font-mono text-[12.5px] text-secondaryText">{{ cluster.k8s_version }}</td>
            <td class="border-b border-border px-4.5 py-3 font-mono text-[12.5px] text-secondaryText">
              {{ cluster.connected_at | date: 'dd/MM/yyyy HH:mm' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class ClustersComponent implements OnInit {
  clusters: Cluster[] = [];
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

  constructor(private clusterService: ClusterService) {}

  ngOnInit(): void {
    this.loadClusters();
  }

  loadClusters(): void {
    console.log('[Clusters] Chargement de la liste des clusters...');
    this.isLoading = true;
    this.clusterService.getClusters().subscribe({
      next: (clusters) => {
        console.log('[Clusters] Clusters reçus:', clusters);
        this.clusters = clusters;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[Clusters] Erreur lors du chargement:', err);
        this.errorMessage = 'Impossible de charger les clusters. Le service est-il démarré ?';
        this.isLoading = false;
      },
    });
  }

  onCreateCluster(): void {
    this.createErrorMessage = '';
    this.isCreating = true;

    console.log('[Clusters] Création du cluster:', this.newClusterName);

    this.clusterService
      .createCluster({
        name: this.newClusterName,
        k8s_version: this.newClusterK8sVersion,
        credentials: {
          api_server: this.newClusterApiServer,
          ca_cert: this.newClusterCaCert,
          token: this.newClusterToken,
        },
      })
      .subscribe({
        next: (cluster) => {
          console.log('[Clusters] Cluster créé avec succès:', cluster);
          this.isCreating = false;
          this.showForm = false;
          this.newClusterName = '';
          this.newClusterK8sVersion = '';
          this.newClusterApiServer = '';
          this.newClusterCaCert = '';
          this.newClusterToken = '';
          this.loadClusters();
        },
        error: (err) => {
          console.error('[Clusters] Erreur lors de la création:', err);
          this.createErrorMessage = 'Impossible de créer le cluster';
          this.isCreating = false;
        },
      });
  }
}