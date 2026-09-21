import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">Integrations</h1>
        <p class="text-xs text-secondaryText mt-0.5">Connected monitoring tools, notification channels, and cloud providers</p>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-lg border border-border bg-surface1 p-5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-primaryText">Prometheus & Grafana</span>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-success/10 text-success border border-success/20">Connected</span>
          </div>
          <p class="text-xs text-secondaryText">Telemetry scraping, metric proxying, and timeseries storage.</p>
        </div>

        <div class="rounded-lg border border-border bg-surface1 p-5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-primaryText">Kubernetes API Server</span>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-success/10 text-success border border-success/20">Connected</span>
          </div>
          <p class="text-xs text-secondaryText">Direct client-go integration with AES-GCM credential encryption.</p>
        </div>

        <div class="rounded-lg border border-border bg-surface1 p-5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-primaryText">Slack & PagerDuty</span>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-surface2 text-mutedText border border-border">Available</span>
          </div>
          <p class="text-xs text-secondaryText">Real-time incident dispatching and interactive approval webhooks.</p>
        </div>

        <div class="rounded-lg border border-border bg-surface1 p-5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-primaryText">Mistral AI Platform</span>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-success/10 text-success border border-success/20">Connected</span>
          </div>
          <p class="text-xs text-secondaryText">Autonomous root cause inference and patch candidate generation.</p>
        </div>
      </div>
    </div>
  `,
})
export class IntegrationsComponent {}
