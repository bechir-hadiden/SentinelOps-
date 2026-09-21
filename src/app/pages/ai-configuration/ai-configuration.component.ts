import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">AI Configuration</h1>
        <p class="text-xs text-secondaryText mt-0.5">Model selection, confidence thresholds, and autonomous guardrails</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 p-6 space-y-5 max-w-2xl">
        <div>
          <label class="block text-xs font-semibold text-primaryText mb-1">Diagnosis LLM Engine</label>
          <select class="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-xs text-primaryText outline-none focus:border-brand">
            <option>Mistral Large (Local / Self-hosted)</option>
            <option>Claude 3.5 Sonnet</option>
            <option>GPT-4o Mini</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-primaryText mb-1">Minimum Confidence Threshold for Auto-Remediation</label>
          <input type="range" min="50" max="99" value="85" class="w-full accent-brand" />
          <div class="flex justify-between text-[11px] text-mutedText font-mono mt-1">
            <span>50% (Permissive)</span>
            <span class="text-brand font-bold">85% (Recommended)</span>
            <span>99% (Strict)</span>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-border">
          <div class="text-xs font-semibold text-primaryText">Safety Guardrails</div>
          <label class="flex items-center gap-2 text-xs text-secondaryText">
            <input type="checkbox" checked class="accent-brand rounded" />
            Require human approval for all HIGH and CRITICAL risk remediations
          </label>
          <label class="flex items-center gap-2 text-xs text-secondaryText">
            <input type="checkbox" checked class="accent-brand rounded" />
            Never automate PVC deletion or StorageClass modifications
          </label>
          <label class="flex items-center gap-2 text-xs text-secondaryText">
            <input type="checkbox" checked class="accent-brand rounded" />
            Log all LLM prompts and raw responses to PostgreSQL audit store
          </label>
        </div>

        <button class="rounded-md bg-brand px-4 py-2 text-xs font-semibold text-on-brand hover:bg-brand-hover transition-colors">
          Save Configuration
        </button>
      </div>
    </div>
  `,
})
export class AiConfigurationComponent {}
