import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LogLine {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  message: string;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Explorateur de Logs</h1>
          <p class="text-sm text-secondaryText">Consultez en direct les journaux d'exécution agrégés du cluster.</p>
        </div>
        <div class="flex gap-2">
          <button (click)="filterLevel('all')" class="text-xs px-2.5 py-1 rounded bg-surface3 text-secondaryText hover:text-primaryText">Tous</button>
          <button (click)="filterLevel('error')" class="text-xs px-2.5 py-1 rounded bg-critical/10 text-critical border border-critical/20">Erreurs</button>
        </div>
      </div>

      <!-- Terminal Output -->
      <div class="rounded-md border border-border bg-surface1 p-4 font-mono text-xs text-secondaryText space-y-1.5 overflow-auto max-h-[500px]">
        <div *ngFor="let log of filteredLogs" class="flex gap-3 hover:bg-surface2/50 p-1 rounded">
          <span class="text-mutedText shrink-0">{{ log.timestamp }}</span>
          <span class="font-semibold shrink-0" [ngClass]="{
            'text-success': log.level === 'info',
            'text-warning': log.level === 'warn',
            'text-critical': log.level === 'error'
          }">[{{ log.level.toUpperCase() }}]</span>
          <span class="text-brand shrink-0">[{{ log.service }}]</span>
          <span class="text-primaryText break-all">{{ log.message }}</span>
        </div>
      </div>
    </div>
  `,
})
export class LogsComponent {
  selectedLevel: 'all' | 'error' = 'all';

  logs: LogLine[] = [
    { timestamp: '09:49:15.102', level: 'info', service: 'nginx-ingress', message: '10.244.0.1 - - [09:49:15] "GET /login HTTP/1.1" 200 456' },
    { timestamp: '09:49:22.008', level: 'error', service: 'auth-service', message: 'Failed to connect to database: auth-db. Connection timeout.' },
    { timestamp: '09:49:25.882', level: 'warn', service: 'payment-gateway', message: 'External API Stripe latency is higher than expected: 1200ms' },
    { timestamp: '09:49:31.902', level: 'info', service: 'user-service', message: 'User profile requested for ID=USR-9988' },
    { timestamp: '09:49:45.312', level: 'error', service: 'auth-service', message: 'Failed to connect to database: auth-db. Connection timeout.' },
    { timestamp: '09:49:50.003', level: 'info', service: 'notification-service', message: 'Dispatched alert email for INC-1049' },
  ];

  get filteredLogs() {
    if (this.selectedLevel === 'error') {
      return this.logs.filter(l => l.level === 'error');
    }
    return this.logs;
  }

  filterLevel(level: 'all' | 'error') {
    this.selectedLevel = level;
  }
}
