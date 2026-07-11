// src/app/layout/shell/shell.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { PulseLineComponent } from '../../shared/pulse-line/pulse-line.component';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, PulseLineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen w-full bg-[var(--bg-page)]">
      <app-sidebar class="shrink-0" />

      <div class="flex flex-1 flex-col overflow-hiddenf">
        <app-topbar />

        <!-- Global navigation loading indicator, uses the Pulse signature element -->
        <div class="h-[2px] w-full">
          @if (isNavigating()) {
            <app-pulse-line state="active" />
          }
        </div>

        <main class="flex-1 overflow-y-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {
  private readonly router = inject(Router);

  protected readonly isNavigating = signal(false);
  private readonly tokenStorage = inject(TokenStorageService);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigating.set(false);
      }
    });
  }

  protected onLogout(): void {
  this.tokenStorage.clearToken();
  this.router.navigate(['/login']);
}
}
