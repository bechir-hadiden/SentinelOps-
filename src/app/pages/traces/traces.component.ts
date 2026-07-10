import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Trace {
  id: string;
  name: string;
  duration: number;
  spanCount: number;
  timestamp: string;
  status: 'success' | 'critical';
}

@Component({
  selector: 'app-traces',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Traces Distribuées</h1>
        <p class="text-sm text-secondaryText">Analysez la latence et le cheminement des requêtes entre vos microservices.</p>
      </div>

      <div class="rounded-md border border-border bg-surface1 overflow-hidden">
        <div class="px-5 py-4 border-b border-border">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primaryText font-display">Requêtes Récentes (Spans)</h3>
        </div>
        <div class="divide-y divide-border text-[13.5px]">
          <div *ngFor="let trace of traces" class="p-4 flex items-center justify-between hover:bg-surface2/30 transition-colors">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-mutedText">[{{ trace.id }}]</span>
                <span class="font-semibold text-primaryText">{{ trace.name }}</span>
              </div>
              <p class="text-xs text-secondaryText">Spans: {{ trace.spanCount }} • Exécuté le: {{ trace.timestamp }}</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex flex-col items-end">
                <span class="font-mono text-sm font-bold" [ngClass]="trace.status === 'critical' ? 'text-critical' : 'text-success'">
                  {{ trace.duration }} ms
                </span>
                <span class="text-[10px] text-mutedText">P95</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TracesComponent {
  traces: Trace[] = [
    { id: 'TRC-90184', name: 'GET /api/v1/auth/login', duration: 1250, spanCount: 14, timestamp: 'Il y a 2 min', status: 'critical' },
    { id: 'TRC-90183', name: 'POST /api/v1/payment/checkout', duration: 890, spanCount: 9, timestamp: 'Il y a 5 min', status: 'success' },
    { id: 'TRC-90180', name: 'GET /api/v1/users/me', duration: 45, spanCount: 4, timestamp: 'Il y a 10 min', status: 'success' },
  ];
}
