// src/app/pages/incident-detail/components/action-approval-card.component.ts
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActionProposalStep } from '../../../models/incident.model';

@Component({
  selector: 'app-action-approval-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface-2)] p-4">
      <div class="flex items-center justify-between">
        <span class="font-['IBM_Plex_Sans_Condensed'] text-sm font-medium text-[var(--text-primary)]">
          {{ step().actionLabel }}
        </span>
        <span
          class="rounded-[6px] px-2 py-0.5 font-['IBM_Plex_Sans_Condensed'] text-[11px] font-medium uppercase tracking-wide"
          [class]="riskClass()"
        >
          Risque {{ riskLabel() }}
        </span>
      </div>

      <pre
        class="overflow-x-auto rounded-[6px] border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2 font-['IBM_Plex_Mono'] text-xs text-[var(--text-secondary)]"
      >{{ step().actionCommand }}</pre>

      @if (step().decision === 'pending') {
        <div class="flex gap-2">
          <button
            type="button"
            (click)="approve.emit()"
            [disabled]="isSubmitting()"
            class="rounded-[6px] bg-[var(--brand)] px-4 py-2 font-['IBM_Plex_Sans'] text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-hover)] disabled:opacity-50"
          >
            Approuver
          </button>
          <button
            type="button"
            (click)="reject.emit()"
            [disabled]="isSubmitting()"
            class="rounded-[6px] border border-[var(--border-strong)] bg-transparent px-4 py-2 font-['IBM_Plex_Sans'] text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-3)] disabled:opacity-50"
          >
            Rejeter
          </button>
        </div>
      } @else {
        <div class="flex items-center gap-2">
          <span
            class="font-['IBM_Plex_Sans'] text-sm font-medium"
            [class]="step().decision === 'approved' ? 'text-[var(--success)]' : 'text-[var(--critical)]'"
          >
            {{ step().decision === 'approved' ? 'Approuvée' : 'Rejetée' }}
          </span>
          @if (step().decidedBy) {
            <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">
              par {{ step().decidedBy }}
            </span>
          }
        </div>
      }
    </div>
  `,
})
export class ActionApprovalCardComponent {
  readonly step = input.required<ActionProposalStep>();
  readonly isSubmitting = input<boolean>(false);

  readonly approve = output<void>();
  readonly reject = output<void>();

  protected readonly riskLabel = computed(() => {
    switch (this.step().riskLevel) {
      case 'high':
        return 'élevé';
      case 'medium':
        return 'moyen';
      default:
        return 'faible';
    }
  });

  protected readonly riskClass = computed(() => {
    switch (this.step().riskLevel) {
      case 'high':
        return 'bg-[rgba(255,92,92,0.12)] text-[var(--critical)]';
      case 'medium':
        return 'bg-[rgba(255,159,64,0.12)] text-[var(--warning)]';
      default:
        return 'bg-[rgba(52,211,153,0.12)] text-[var(--success)]';
    }
  });
}
