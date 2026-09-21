import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-mortems',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">Post-mortems</h1>
        <p class="text-xs text-secondaryText mt-0.5">Automated AI incident retrospectives and root cause documentation</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 class="text-sm font-bold text-primaryText">INC-2026-00142 &mdash; API Gateway Database Connection Pool Exhaustion</h2>
            <div class="text-xs text-mutedText mt-0.5 font-mono">Cluster: sentinelops-realtest &middot; Date: 2026-09-04 10:45</div>
          </div>
          <button class="rounded border border-border bg-surface2 px-3 py-1.5 text-xs text-primaryText hover:bg-surface3">
            Export Markdown
          </button>
        </div>

        <div class="space-y-3 text-xs text-secondaryText leading-relaxed">
          <div>
            <h3 class="font-semibold text-primaryText mb-1 text-xs uppercase tracking-wider text-brand">Summary</h3>
            <p>At 10:42 UTC, the API Gateway deployment experienced elevated error rates and pod restarts due to connection pool saturation on the backend database layer.</p>
          </div>

          <div>
            <h3 class="font-semibold text-primaryText mb-1 text-xs uppercase tracking-wider text-agent">Root Cause</h3>
            <p>Container memory limits prevented the connection pooler from scaling threads during peak traffic spikes, causing TCP resets.</p>
          </div>

          <div>
            <h3 class="font-semibold text-primaryText mb-1 text-xs uppercase tracking-wider text-remediation">Remediation Action</h3>
            <div class="rounded bg-page border border-border p-2.5 font-mono text-[11px] text-primaryText">
              kubectl rollout restart deployment/api-gateway -n default
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-primaryText mb-1 text-xs uppercase tracking-wider text-success">Preventative Recommendation</h3>
            <p>Scale horizontal pod autoscaling threshold and increase baseline memory request to 256Mi.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PostMortemsComponent {}
