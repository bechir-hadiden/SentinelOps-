import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  // changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="flex h-screen w-full overflow-hidden bg-page text-primaryText font-sans">
      <app-sidebar class="shrink-0"></app-sidebar>

      <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
        <app-topbar></app-topbar>
        <main class="flex-1 overflow-y-auto bg-page">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {}
