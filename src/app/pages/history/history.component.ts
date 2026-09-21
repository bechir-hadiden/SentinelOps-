import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">History</h1>
        <p class="text-xs text-secondaryText mt-0.5">Chronological journal of cluster events and remediation runs</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="divide-y divide-border text-xs">
          <div *ngFor="let item of historyItems" class="p-4 flex items-center justify-between hover:bg-surface2/50 transition-colors">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <app-status-badge [status]="item.status === 'SUCCESS' ? 'healthy' : 'critical'"></app-status-badge>
                <span class="font-semibold text-primaryText">{{ item.title }}</span>
              </div>
              <p class="text-xs text-secondaryText font-mono">{{ item.details }}</p>
            </div>
            <span class="text-xs font-mono text-mutedText">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HistoryComponent {
  historyItems = [
    { title: "Remediation Executed: Restart API Gateway", details: "kubectl rollout restart deployment/api-gateway -n default", status: "SUCCESS", time: "10m ago" },
    { title: "Autonomous Diagnostic: OOMKilled detected", details: "Identified container memory limit starvation (64Mi)", status: "SUCCESS", time: "25m ago" },
    { title: "ConfigMap Created: cache-config", details: "Restored missing maxmemory configuration", status: "SUCCESS", time: "1h ago" },
    { title: "Ingress Created: billing-service", details: "Configured HTTP path /api/v1/billing with nginx class", status: "SUCCESS", time: "3h ago" },
  ];
}
