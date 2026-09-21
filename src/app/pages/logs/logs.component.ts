import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LogLine {
  t: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  svc: string;
  msg: string;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-4">
      <!-- Controls -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2">
          <select
            [(ngModel)]="selectedLevel"
            class="px-3 py-1.5 rounded-md text-xs border border-border bg-surface2 text-primaryText outline-none focus:border-brand"
          >
            <option value="all">All levels</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>

        <button
          (click)="refreshLogs()"
          class="flex items-center gap-1.5 rounded-md border border-border bg-surface1 px-3 py-1.5 text-xs text-secondaryText hover:bg-surface2 hover:text-primaryText transition-colors"
        >
          <span>&#x21bb; Auto-refresh</span>
        </button>
      </div>

      <!-- Log Terminal Box -->
      <div class="rounded-lg border border-border bg-page p-4 font-mono text-xs overflow-x-auto space-y-1 max-h-[600px] overflow-y-auto">
        <div *ngFor="let l of filteredLogs" class="whitespace-nowrap hover:bg-surface1/50 px-1 py-0.5 rounded">
          <span class="text-mutedText mr-3">{{ l.t }}</span>
          <span
            class="font-bold mr-3 inline-block w-12"
            [ngClass]="{
              'text-info': l.level === 'INFO',
              'text-warning': l.level === 'WARN',
              'text-critical': l.level === 'ERROR'
            }"
          >{{ l.level }}</span>
          <span class="text-brand mr-3 font-semibold">{{ l.svc }}</span>
          <span class="text-primaryText">{{ l.msg }}</span>
        </div>
      </div>
    </div>
  `,
})
export class LogsComponent {
  selectedLevel = 'all';

  logs: LogLine[] = [
    { t: "08:42:11", level: "INFO", svc: "api-gateway", msg: "Handled GET /v1/orders 200 in 42ms" },
    { t: "08:42:12", level: "INFO", svc: "api-gateway", msg: "Handled GET /v1/orders 200 in 38ms" },
    { t: "08:42:13", level: "ERROR", svc: "api-gateway", msg: "upstream connect error: postgres:5432 connection refused" },
    { t: "08:42:13", level: "ERROR", svc: "postgres", msg: "FATAL: remaining connection slots are reserved" },
    { t: "08:42:14", level: "WARN", svc: "remediation-agent", msg: "Detected repeated connection failures, evaluating hypotheses" },
    { t: "08:42:16", level: "ERROR", svc: "api-gateway", msg: "upstream connect error: postgres:5432 connection refused" },
    { t: "08:42:18", level: "INFO", svc: "api-gateway", msg: "Handled GET /v1/health 200 in 4ms" },
    { t: "08:42:21", level: "ERROR", svc: "checkout-service", msg: "timeout waiting for api-gateway response" },
    { t: "08:42:25", level: "INFO", svc: "ingestion-service", msg: "Scanned 24 pods in sentinelops-realtest: 1 crash detected" },
    { t: "08:42:26", level: "INFO", svc: "diagnosis-agent", msg: "Initiated LLM context evaluation for incident INC-2026-00142" },
  ];

  get filteredLogs(): LogLine[] {
    if (this.selectedLevel === 'all') return this.logs;
    return this.logs.filter(l => l.level === this.selectedLevel);
  }

  refreshLogs(): void {
    const now = new Date().toLocaleTimeString();
    this.logs.unshift({
      t: now,
      level: 'INFO',
      svc: 'ingestion-service',
      msg: 'Heartbeat scan completed across all active clusters (0 errors)'
    });
  }
}
