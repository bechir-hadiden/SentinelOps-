import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeverityBadgeComponent, StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

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
  imports: [CommonModule, SeverityBadgeComponent, StatusBadgeComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">Alerts</h1>
        <p class="text-xs text-secondaryText mt-0.5">Centralized Prometheus and Alertmanager real-time alert stream</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="px-5 py-4 border-b border-border flex justify-between items-center">
          <div class="text-sm font-semibold text-primaryText">Active Alerts</div>
          <span class="text-xs font-mono text-mutedText">3 firing</span>
        </div>
        <div class="divide-y divide-border text-xs">
          <div *ngFor="let alert of alerts" class="p-4 flex items-center justify-between hover:bg-surface2/50 transition-colors">
            <div class="space-y-1">
              <div class="flex items-center gap-2.5">
                <app-severity-badge [severity]="alert.severity"></app-severity-badge>
                <span class="font-semibold text-primaryText">{{ alert.name }}</span>
                <span class="font-mono text-[11px] text-mutedText">[{{ alert.id }}]</span>
              </div>
              <p class="text-xs text-secondaryText">Cluster: <strong class="font-mono text-primaryText">{{ alert.cluster }}</strong> &middot; Status: <span class="text-critical font-medium uppercase font-mono text-[11px]">{{ alert.status }}</span></p>
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
    { id: 'ALT-882', name: 'KubePodCrashLoopBackOff', cluster: 'sentinelops-realtest', severity: 'critical', status: 'firing', timestamp: '09:47:12' },
    { id: 'ALT-881', name: 'MemoryPressureThresholdExceeded', cluster: 'sentinelops-realtest', severity: 'warning', status: 'firing', timestamp: '09:45:00' },
    { id: 'ALT-879', name: 'PodConnectionRefusedPostgres', cluster: 'sentinelops-staging', severity: 'critical', status: 'firing', timestamp: '09:22:15' },
  ];
}
