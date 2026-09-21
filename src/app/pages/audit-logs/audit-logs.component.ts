import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

interface AuditEntry {
  user: string;
  action: string;
  resource: string;
  time: string;
  result: 'SUCCESS' | 'FAILED';
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">Audit Logs</h1>
        <p class="text-xs text-secondaryText mt-0.5">Full traceability of autonomous and operator actions</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-left text-mutedText border-b border-border font-medium">
                <th class="px-5 py-3">User</th>
                <th class="px-5 py-3">Action</th>
                <th class="px-5 py-3">Resource</th>
                <th class="px-5 py-3">Timestamp</th>
                <th class="px-5 py-3">Result</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let a of auditList" class="hover:bg-surface2/50 transition-colors">
                <td class="px-5 py-3 font-semibold text-primaryText">{{ a.user }}</td>
                <td class="px-5 py-3 font-mono text-secondaryText">{{ a.action }}</td>
                <td class="px-5 py-3 font-mono text-primaryText">{{ a.resource }}</td>
                <td class="px-5 py-3 font-mono text-secondaryText">{{ a.time }}</td>
                <td class="px-5 py-3">
                  <app-status-badge [status]="a.result === 'SUCCESS' ? 'healthy' : 'critical'" [label]="a.result"></app-status-badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AuditLogsComponent {
  auditList: AuditEntry[] = [
    { user: "bechir", action: "APPROVE_REMEDIATION", resource: "INC-2026-00142", time: "08:45:32", result: "SUCCESS" },
    { user: "bechir", action: "EXECUTE_REMEDIATION", resource: "INC-2026-00142", time: "08:45:41", result: "SUCCESS" },
    { user: "system", action: "AUTO_DIAGNOSE", resource: "INC-2026-00141", time: "07:58:19", result: "SUCCESS" },
    { user: "test@sentinelops.io", action: "CONNECT_CLUSTER", resource: "sentinelops-realtest", time: "07:30:00", result: "SUCCESS" },
    { user: "bechir", action: "ROLLBACK_DEPLOYMENT", resource: "deployment/api-gateway", time: "Yesterday", result: "SUCCESS" },
  ];
}
