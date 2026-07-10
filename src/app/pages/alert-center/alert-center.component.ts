import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

interface Alert {
  id: string;
  name: string;
  cluster: string;
  severity: 'critical' | 'warning' | 'info';
  status: string;
  timestamp: string;
}

@Component({
  selector: 'app-alert-center',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Centre d'Alertes</h1>
        <p class="text-sm text-secondaryText">Consultez l'historique et les alertes actives générées par Prometheus/Alertmanager.</p>
      </div>

      <div class="rounded-md border border-border bg-surface1 overflow-hidden">
        <div class="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primaryText font-display">Alertes Actives</h3>
          <span class="text-xs text-mutedText">Filtré par sévérité >= Warning</span>
        </div>
        <div class="divide-y divide-border text-[13.5px]">
          <div *ngFor="let alert of alerts" class="p-4 flex items-center justify-between hover:bg-surface2/30 transition-colors">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-mutedText">[{{ alert.id }}]</span>
                <span class="font-semibold text-primaryText">{{ alert.name }}</span>
                <app-status-badge [status]="alert.severity"></app-status-badge>
              </div>
              <p class="text-xs text-secondaryText">Cluster: {{ alert.cluster }} • Statut: <span class="text-brand">{{ alert.status }}</span></p>
            </div>
            <span class="text-xs text-mutedText font-mono">{{ alert.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AlertCenterComponent {
  alerts: Alert[] = [
    { id: 'ALT-882', name: 'KubePodNotReady', cluster: 'cluster-prod-eu', severity: 'critical', status: 'firing', timestamp: '09:47:12' },
    { id: 'ALT-881', name: 'CPUUsageThresholdExceeded', cluster: 'cluster-prod-us', severity: 'warning', status: 'firing', timestamp: '09:45:00' },
    { id: 'ALT-879', name: 'DiskSpaceRunningLow', cluster: 'cluster-staging-eu', severity: 'warning', status: 'firing', timestamp: '09:22:15' },
  ];
}
