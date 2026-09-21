import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-traces',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">Traces</h1>
        <p class="text-xs text-secondaryText mt-0.5">Distributed OpenTelemetry request propagation</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 p-8 text-center text-xs text-secondaryText">
        <svg class="w-8 h-8 text-brand mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <div class="font-semibold text-primaryText">Distributed Trace Stream Connected</div>
        <p class="text-mutedText mt-1">Collecting span telemetry across ingress-nginx, api-gateway, and backend microservices.</p>
      </div>
    </div>
  `,
})
export class TracesComponent {}
