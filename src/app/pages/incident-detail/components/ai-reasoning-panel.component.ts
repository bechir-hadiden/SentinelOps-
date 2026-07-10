// src/app/pages/incident-detail/components/ai-reasoning-panel.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AiDiagnosisStep } from '../../../models/incident.model';

/**
 * Visually distinct AI reasoning panel: --agent border/background.
 * This component and AgentBadgeComponent are the ONLY places where
 * the --agent color family may appear.
 */
@Component({
  selector: 'app-ai-reasoning-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col gap-4 rounded-[16px] border p-5"
      style="border-color: var(--agent); background-color: var(--bg-agent);"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span
            class="inline-block h-2 w-2 rounded-full"
            style="background-color: var(--agent);"
          ></span>
          <span
            class="font-['IBM_Plex_Sans_Condensed'] text-xs font-semibold uppercase tracking-wide"
            style="color: var(--text-agent);"
          >
            Diagnostic IA
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-['IBM_Plex_Mono'] text-xs" style="color: var(--text-agent);">
            Confiance
          </span>
          <span class="font-['IBM_Plex_Mono'] text-sm font-medium" style="color: var(--text-agent);">
            {{ step().confidence }}%
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <span class="font-['IBM_Plex_Sans_Condensed'] text-sm font-medium text-[var(--text-primary)]">
          Cause racine identifiée
        </span>
        <p class="font-['IBM_Plex_Sans'] text-sm text-[var(--text-primary)]">
          {{ step().rootCause }}
        </p>
      </div>

      @if (step().reasoningSteps.length) {
        <div class="flex flex-col gap-2">
          <span class="font-['IBM_Plex_Sans_Condensed'] text-sm font-medium text-[var(--text-primary)]">
            Raisonnement
          </span>
          <ol class="flex flex-col gap-1.5">
            @for (reasoning of step().reasoningSteps; track $index) {
              <li class="flex gap-2 font-['IBM_Plex_Sans'] text-sm text-[var(--text-secondary)]">
                <span class="font-['IBM_Plex_Mono'] text-xs" style="color: var(--text-agent);">
                  {{ $index + 1 }}.
                </span>
                <span>{{ reasoning }}</span>
              </li>
            }
          </ol>
        </div>
      }

      @if (step().evidenceRefs.length) {
        <div class="flex flex-wrap gap-2">
          @for (ref of step().evidenceRefs; track ref) {
            <span
              class="rounded-[6px] px-2 py-1 font-['IBM_Plex_Mono'] text-xs"
              style="background-color: rgba(139,124,246,0.18); color: var(--text-agent);"
            >
              {{ ref }}
            </span>
          }
        </div>
      }
    </div>
  `,
})
export class AiReasoningPanelComponent {
  readonly step = input.required<AiDiagnosisStep>();
}
