import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseLineComponent } from '../../shared/pulse-line/pulse-line.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, PulseLineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-14 flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-surface-1)] px-6">
      <div class="flex items-center gap-2.5 text-[13.5px] text-[var(--text-secondary)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <span class="font-['IBM_Plex_Sans'] font-medium text-[var(--text-primary)]">cluster-prod-eu</span>
        <span>· AKS 1.29</span>
      </div>

      <div class="flex items-center gap-4">
        <!-- System status -->
        <div class="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-['IBM_Plex_Sans']">
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]"></span>
          Tous systèmes opérationnels
        </div>

        <!-- User avatar -->
        <div
          class="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--bg-surface-3)] font-['IBM_Plex_Mono'] text-xs font-medium text-[var(--text-secondary)]"
        >
          JD
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {}
