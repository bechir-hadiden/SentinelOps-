import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-configuration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Configuration de l'IA</h1>
        <p class="text-sm text-secondaryText">Personnalisez le comportement des agents autonomes et des analyses automatiques.</p>
      </div>

      <div class="rounded-md border border-border bg-surface1 p-5 space-y-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-secondaryText">Fichier de Configuration (agent-config.yaml)</h3>
        <pre class="overflow-x-auto rounded bg-page p-4 font-mono text-xs text-secondaryText border border-border leading-relaxed">
# SentinelOps AI Agent Rules Config
version: "1.0"
agent:
  name: "SentinelOps DevOps Agent"
  autonomy_level: "semi-autonomous" # full, semi-autonomous, read-only
  scopes:
    - "kubernetes/pods"
    - "kubernetes/services"
    - "prometheus/alerts"

diagnostics:
  auto_trigger: true
  collect_logs_limit_lines: 100
  notification_channels:
    - "#alerts-devops-ia"
    - "email"

integrations:
  openai:
    model: "gpt-4o"
    temperature: 0.1
        </pre>
      </div>
    </div>
  `,
})
export class AiConfigurationComponent {}
