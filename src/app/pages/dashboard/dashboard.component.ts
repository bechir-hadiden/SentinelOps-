// src/app/pages/dashboard/dashboard.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MetricsRowComponent } from './components/metrics-row.component';
import { ActiveIncidentPanelComponent } from './components/active-incident-panel.component';
import { RecentIncidentsTableComponent } from './components/recent-incidents-table.component';
import {
  injectDashboardMetricsQuery,
  injectActiveIncidentQuery,
  injectRecentIncidentsQuery,
} from '../../queries/incidents.queries';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricsRowComponent, ActiveIncidentPanelComponent, RecentIncidentsTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6 p-6">
      <h1 class="font-['IBM_Plex_Sans_Condensed'] text-xl font-semibold text-[var(--text-primary)]">
        Dashboard
      </h1>

      <app-metrics-row [metrics]="metricsQuery.data() ?? null" />

      <app-active-incident-panel [incident]="activeIncidentQuery.data() ?? null" />

      <app-recent-incidents-table [incidents]="recentIncidentsQuery.data() ?? []" />
    </div>
  `,
})
export class DashboardComponent {
  protected readonly metricsQuery = injectDashboardMetricsQuery();
  protected readonly activeIncidentQuery = injectActiveIncidentQuery();
  protected readonly recentIncidentsQuery = injectRecentIncidentsQuery(10);
}
