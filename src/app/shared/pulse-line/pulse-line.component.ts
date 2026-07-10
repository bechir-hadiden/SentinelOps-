// src/app/shared/pulse-line/pulse-line.component.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type PulseState = 'flat' | 'active' | 'stable';

/**
 * Signature visual element of SentinelOps: an ECG/oscilloscope-style trace.
 * - flat:   idle / no incident
 * - active: incident in progress, agitated trace
 * - stable: incident resolved, settling back to flat
 *
 * Also used as the global loading indicator (state="active").
 * Respects prefers-reduced-motion: falls back to a static trace, no animation.
 */
@Component({
  selector: 'app-pulse-line',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="'0 0 240 60'"
      [class]="'w-full h-full overflow-visible ' + (state() === 'active' ? 'pulse-active' : '')"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <path
        [attr.d]="pathD()"
        fill="none"
        [attr.stroke]="strokeColor()"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="pulse-path"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .pulse-path {
        stroke-dasharray: 480;
        stroke-dashoffset: 0;
      }

      .pulse-active .pulse-path {
        animation: pulse-sweep 2.4s linear infinite;
      }

      @keyframes pulse-sweep {
        0% {
          stroke-dashoffset: 480;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pulse-active .pulse-path {
          animation: none;
        }
      }
    `,
  ],
})
export class PulseLineComponent {
  /** Visual/semantic state of the trace. */
  readonly state = input<PulseState>('flat');
  /** Optional explicit color override (defaults derived from state). */
  readonly color = input<string | null>(null);

  protected readonly ariaLabel = computed(() => {
    switch (this.state()) {
      case 'active':
        return 'Incident en cours';
      case 'stable':
        return 'Incident résolu, système stable';
      default:
        return 'Système au repos';
    }
  });

  protected readonly strokeColor = computed(() => {
    if (this.color()) return this.color() as string;
    switch (this.state()) {
      case 'active':
        return 'var(--critical)';
      case 'stable':
        return 'var(--success)';
      default:
        return 'var(--text-muted)';
    }
  });

  protected readonly pathD = computed(() => {
    switch (this.state()) {
      case 'active':
        return 'M0,30 L20,30 L28,10 L36,50 L44,18 L52,30 L70,30 L78,6 L86,54 L94,24 L100,30 L120,30 L128,10 L136,50 L144,18 L152,30 L170,30 L178,6 L186,54 L194,24 L200,30 L240,30';
      case 'stable':
        return 'M0,30 L60,30 L68,22 L76,38 L84,28 L92,30 L240,30';
      default:
        return 'M0,30 L240,30';
    }
  });
}
