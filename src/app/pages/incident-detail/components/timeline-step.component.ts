// src/app/pages/incident-detail/components/timeline-step.component.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TimelineStepBase, TimelineStepStatus } from '../../../models/incident.model';

@Component({
  selector: 'app-timeline-step',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex gap-4 pb-8 last:pb-0">
      <!-- Vertical connector line -->
      <div class="flex flex-col items-center">
        <div
          class="h-3 w-3 shrink-0 rounded-full border-2"
          [class]="markerClass()"
        ></div>
        @if (!isLast()) {
          <div class="w-px flex-1 bg-[var(--border)]"></div>
        }
      </div>

      <div class="flex flex-1 flex-col gap-2 pt-[-2px]">
        <div class="flex items-center justify-between gap-4">
          <h3 class="font-['IBM_Plex_Sans_Condensed'] text-sm font-semibold text-[var(--text-primary)]">
            {{ step().title }}
          </h3>
          @if (step().timestamp) {
            <span class="font-['IBM_Plex_Mono'] text-xs text-[var(--text-muted)]">
              {{ step().timestamp | date: 'HH:mm:ss' }}
            </span>
          }
        </div>

        <p class="font-['IBM_Plex_Sans'] text-sm text-[var(--text-secondary)]">
          {{ step().summary }}
        </p>

        <ng-content />
      </div>
    </div>
  `,
})
export class TimelineStepComponent {
  readonly step = input.required<TimelineStepBase>();
  readonly isLast = input<boolean>(false);

  protected readonly markerClass = computed(() => {
    const status: TimelineStepStatus = this.step().status;
    switch (status) {
      case 'completed':
        return 'border-[var(--success)] bg-[var(--success)]';
      case 'active':
        return 'border-[var(--brand)] bg-[var(--brand)]';
      default:
        return 'border-[var(--border-strong)] bg-[var(--bg-surface-2)]';
    }
  });
}
