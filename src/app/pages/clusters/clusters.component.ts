import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

interface ClusterNode {
  name: string;
  role: string;
  status: 'success' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  version: string;
}

@Component({
  selector: 'app-clusters',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Gestion des Clusters</h1>
        <p class="text-sm text-secondaryText">Vue détaillée des nœuds et des ressources du cluster actif.</p>
      </div>

      <!-- Cluster Info Card -->
      <div class="rounded-md border border-border bg-surface1 p-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-brand/10 p-3 text-brand">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-primaryText">cluster-prod-eu</h2>
            <p class="text-xs text-secondaryText">Région : Europe Ouest (Paris) • Kubernetes 1.29</p>
          </div>
        </div>
        <app-status-badge status="success" label="Opérationnel"></app-status-badge>
      </div>

      <!-- Nodes Table -->
      <div class="rounded-md border border-border bg-surface1 overflow-hidden">
        <div class="px-5 py-4 border-b border-border">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primaryText font-display">Liste des Nœuds ({{ nodes.length }})</h3>
        </div>
        <table class="min-w-full divide-y divide-border text-[13.5px]">
          <thead class="bg-surface2 text-xs font-semibold text-secondaryText uppercase tracking-wider">
            <tr>
              <th scope="col" class="px-6 py-3 text-left">Nom</th>
              <th scope="col" class="px-6 py-3 text-left">Rôle</th>
              <th scope="col" class="px-6 py-3 text-left">Statut</th>
              <th scope="col" class="px-6 py-3 text-left">Charge CPU</th>
              <th scope="col" class="px-6 py-3 text-left">Charge Mémoire</th>
              <th scope="col" class="px-6 py-3 text-left">Version Kubelet</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-surface1 text-secondaryText">
            <tr *ngFor="let node of nodes" class="hover:bg-surface2/50 transition-colors">
              <td class="whitespace-nowrap px-6 py-4 font-mono font-bold text-primaryText">{{ node.name }}</td>
              <td class="whitespace-nowrap px-6 py-4">{{ node.role }}</td>
              <td class="whitespace-nowrap px-6 py-4">
                <app-status-badge [status]="node.status" [label]="node.status === 'success' ? 'Prêt' : node.status === 'warning' ? 'Surchargé' : 'Hors service'"></app-status-badge>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="w-8 font-mono">{{ node.cpu }}%</span>
                  <div class="h-1.5 w-16 rounded-full bg-surface3 overflow-hidden">
                    <div class="h-full bg-brand" [style.width.%]="node.cpu"></div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="w-8 font-mono">{{ node.memory }}%</span>
                  <div class="h-1.5 w-16 rounded-full bg-surface3 overflow-hidden">
                    <div class="h-full bg-info" [style.width.%]="node.memory"></div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-xs">{{ node.version }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ClustersComponent {
  nodes: ClusterNode[] = [
    { name: 'aks-nodepool1-209384-vmss000000', role: 'control-plane', status: 'success', cpu: 42, memory: 58, version: 'v1.29.2' },
    { name: 'aks-nodepool1-209384-vmss000001', role: 'agent', status: 'success', cpu: 78, memory: 82, version: 'v1.29.2' },
    { name: 'aks-nodepool1-209384-vmss000002', role: 'agent', status: 'warning', cpu: 94, memory: 89, version: 'v1.29.2' },
    { name: 'aks-nodepool1-209384-vmss000003', role: 'agent', status: 'success', cpu: 31, memory: 44, version: 'v1.29.2' },
  ];
}
