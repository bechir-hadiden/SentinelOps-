import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AuditItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Audit Logs</h1>
        <p class="text-sm text-secondaryText">Historique complet des actions administratives et des opérations système.</p>
      </div>

      <div class="rounded-md border border-border bg-surface1 overflow-hidden">
        <table class="min-w-full divide-y divide-border text-[13.5px]">
          <thead class="bg-surface2 text-xs font-semibold text-secondaryText uppercase tracking-wider">
            <tr>
              <th scope="col" class="px-6 py-3 text-left">Utilisateur</th>
              <th scope="col" class="px-6 py-3 text-left">Action</th>
              <th scope="col" class="px-6 py-3 text-left">Cible</th>
              <th scope="col" class="px-6 py-3 text-left">Horodatage</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-surface1 text-secondaryText">
            <tr *ngFor="let item of auditLogs" class="hover:bg-surface2/50 transition-colors">
              <td class="whitespace-nowrap px-6 py-4 font-semibold text-primaryText">{{ item.user }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-xs">{{ item.action }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-xs text-brand">{{ item.target }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-xs">{{ item.timestamp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AuditLogsComponent {
  auditLogs: AuditItem[] = [
    { id: '1', user: 'SentinelOps AI', action: 'DEPLOY_ROLLBACK', target: 'deployment/auth-service', timestamp: '09/07/2026 09:49:12' },
    { id: '2', user: 'Jean Dupont', action: 'SECRET_UPDATE', target: 'secret/db-credentials', timestamp: '09/07/2026 09:12:45' },
    { id: '3', user: 'Sarah Connors', action: 'SCALE_UP', target: 'deployment/payment-gateway', timestamp: '08/07/2026 18:32:00' },
  ];
}
