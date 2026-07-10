// src/app/shared/metric-card/metric-card.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type MetricTrend = 'up' | 'down' | 'neutral';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface-1)] px-5 py-4 flex flex-col gap-2"
    >
      <span
        class="font-['IBM_Plex_Sans_Condensed'] text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]"
      >
        {{ label() }}
      </span>

      <div class="flex items-baseline gap-2">
        <span class="font-['IBM_Plex_Mono'] text-[28px] leading-none text-[var(--text-primary)]">
          {{ value() }}
        </span>
        @if (unit()) {
          <span class="font-['IBM_Plex_Mono'] text-sm text-[var(--text-muted)]">{{ unit() }}</span>
        }
      </div>

      @if (trendLabel()) {
        <span
          class="font-['IBM_Plex_Sans'] text-xs"
          [class]="trendColorClass()"
        >
          {{ trendLabel() }}
        </span>
      }
    </div>
  `,
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly unit = input<string | null>(null);
  readonly trend = input<MetricTrend>('neutral');
  readonly trendLabel = input<string | null>(null);

  protected trendColorClass(): string {
    switch (this.trend()) {
      case 'up':
        return 'text-[var(--success)]';
      case 'down':
        return 'text-[var(--critical)]';
      default:
        return 'text-[var(--text-muted)]';
    }
  }
}
