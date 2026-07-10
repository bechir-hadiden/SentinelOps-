// src/app/pages/dashboard/components/metrics-row.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MetricCardComponent } from '../../../shared/metric-card/metric-card.component';
import { DashboardMetrics } from '../../../models/incident.model';

@Component({
  selector: 'app-metrics-row',
  standalone: true,
  imports: [MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <app-metric-card
        label="MTTR moyen"
        [value]="metrics() ? formatDuration(metrics()!.avgMttrSeconds) : '—'"
      />
      <app-metric-card
        label="Incidents résolus"
        [value]="metrics() ? metrics()!.incidentsResolved.toString() : '—'"
        unit="ce mois-ci"
      />
      <app-metric-card
        label="Confiance IA moyenne"
        [value]="metrics() ? metrics()!.avgAiConfidence.toString() : '—'"
        unit="%"
      />
      <app-metric-card
        label="Actions auto-approuvées"
        [value]="metrics() ? metrics()!.autoApprovedActionsPct.toString() : '—'"
        unit="%"
      />
    </div>
  `,
})
export class MetricsRowComponent {
  readonly metrics = input<DashboardMetrics | null>(null);

  protected formatDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }
}
