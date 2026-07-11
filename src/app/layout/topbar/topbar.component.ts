import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PulseLineComponent } from '../../shared/pulse-line/pulse-line.component';
import { TokenStorageService } from '../../services/token-storage.service';

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

        <!-- User profile container -->
        <div class="flex items-center gap-3 border-l border-[var(--border)] pl-4">
          <!-- User avatar -->
          <div
            class="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--bg-surface-3)] font-['IBM_Plex_Mono'] text-xs font-medium text-[var(--text-secondary)]"
          >
            JD
          </div>

          <!-- Disconnect/Logout Button -->
          <button
            (click)="logout()"
            title="Se déconnecter"
            class="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-3)] hover:text-[var(--critical)]"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  protected logout(): void {
        this.tokenStorage.clearToken();
    this.router.navigate(['/login']);
  }
}
