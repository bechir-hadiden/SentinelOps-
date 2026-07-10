import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Métriques de Performance</h1>
        <p class="text-sm text-secondaryText">Indicateurs clés de performance et télémétrie système.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- CPU Gauge -->
        <div class="rounded-md border border-border bg-surface1 p-5">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-secondaryText mb-3">Répartition CPU par microservice</h3>
          <div class="space-y-3 text-xs">
            <div *ngFor="let svc of services" class="space-y-1">
              <div class="flex justify-between">
                <span class="font-mono text-primaryText">{{ svc.name }}</span>
                <span class="text-secondaryText font-mono">{{ svc.cpu }}%</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-surface3 overflow-hidden">
                <div class="h-full bg-brand" [style.width.%]="svc.cpu"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Latency Gauge -->
        <div class="rounded-md border border-border bg-surface1 p-5">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-secondaryText mb-3">Latence moyenne P95 (ms)</h3>
          <div class="space-y-3 text-xs">
            <div *ngFor="let svc of services" class="space-y-1">
              <div class="flex justify-between">
                <span class="font-mono text-primaryText">{{ svc.name }}</span>
                <span class="text-secondaryText font-mono">{{ svc.latency }} ms</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-surface3 overflow-hidden">
                <div class="h-full bg-info" [style.width.%]="svc.latency / 5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MetricsComponent {
  services = [
    { name: 'nginx-ingress', cpu: 14, latency: 12 },
    { name: 'auth-service', cpu: 76, latency: 450 },
    { name: 'payment-gateway', cpu: 32, latency: 890 },
    { name: 'notification-service', cpu: 8, latency: 45 },
    { name: 'user-service', cpu: 48, latency: 110 },
  ];
}
