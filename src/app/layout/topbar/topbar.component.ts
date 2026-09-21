import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TokenStorageService } from '../../services/token-storage.service';

const ROUTE_INFO: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview', subtitle: 'Infrastructure health across all connected clusters' },
  '/clusters': { title: 'Clusters', subtitle: 'Connected Kubernetes environments' },
  '/incidents': { title: 'Incidents', subtitle: 'Active incidents requiring attention' },
  '/alerts': { title: 'Alerts', subtitle: 'Centralized alert stream' },
  '/history': { title: 'History', subtitle: 'Chronological operations journal' },
  '/metrics': { title: 'Metrics', subtitle: 'Cluster and service performance' },
  '/logs': { title: 'Logs', subtitle: 'Real-time log stream' },
  '/traces': { title: 'Traces', subtitle: 'Distributed tracing' },
  '/ai-chat': { title: 'AI Chat', subtitle: 'Ask questions about your infrastructure' },
  '/ai-configuration': { title: 'AI Configuration', subtitle: 'Model, thresholds and rules' },
  '/post-mortems': { title: 'Post-mortems', subtitle: 'Incident retrospectives' },
  '/audit-logs': { title: 'Audit Logs', subtitle: 'Full traceability of every action' },
  '/integrations': { title: 'Integrations', subtitle: 'Connected tools and services' },
  '/settings': { title: 'Settings', subtitle: 'Account and platform configuration' },
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <header class="flex h-14 shrink-0 items-center justify-between border-b border-border bg-page px-6">
      <div class="flex items-center gap-3 min-w-0">
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate text-primaryText">{{ currentTitle }}</div>
          <div *ngIf="currentSubtitle" class="text-xs truncate text-secondaryText">{{ currentSubtitle }}</div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Live System Status Badge -->
        <div class="flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium border border-success/20 bg-success/10 text-success">
          <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
          <span>All systems operational</span>
        </div>

        <!-- Global Refresh Button -->
        <button
          (click)="onRefresh()"
          class="flex items-center gap-1.5 rounded-md border border-border bg-surface1 px-3 py-1.5 text-xs font-medium text-secondaryText hover:bg-surface2 hover:text-primaryText transition-colors"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  currentTitle = 'Overview';
  currentSubtitle = 'Infrastructure health across all connected clusters';

  constructor() {
    this.updateRouteInfo(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.updateRouteInfo(e.urlAfterRedirects || e.url);
    });
  }

  private updateRouteInfo(url: string): void {
    const baseRoute = url.split('?')[0];
    if (baseRoute.startsWith('/clusters/') && baseRoute.length > 10) {
      this.currentTitle = 'Cluster Details';
      this.currentSubtitle = 'Real-time telemetry and resource state';
      return;
    }
    if (baseRoute.startsWith('/incidents/') && baseRoute.length > 11) {
      this.currentTitle = 'Incident Resolution';
      this.currentSubtitle = 'Root cause analysis & autonomous remediation';
      return;
    }

    const info = ROUTE_INFO[baseRoute];
    if (info) {
      this.currentTitle = info.title;
      this.currentSubtitle = info.subtitle;
    }
  }

  onRefresh(): void {
    window.location.reload();
  }
}
