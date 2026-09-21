import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClusterService, MetricsRange, MetricsTimeseriesResponse } from '../../services/cluster.service';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-metrics-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rounded-md border border-border bg-surface2 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-medium text-primaryText">Métriques dans le temps</h3>
        <select
          [(ngModel)]="selectedRange"
          (ngModelChange)="onRangeChange()"
          class="rounded-md border border-borderStrong bg-surface1 px-2 py-1 text-xs text-primaryText"
        >
          <option value="1h">1 heure</option>
          <option value="6h">6 heures</option>
          <option value="24h">24 heures</option>
        </select>
      </div>

      <div *ngIf="isLoading" class="text-xs text-secondaryText">Chargement des métriques...</div>
      <p *ngIf="errorMessage" class="rounded-md bg-critical-bg px-3 py-2 text-xs text-critical">{{ errorMessage }}</p>

      <div class="mb-4">
        <p class="mb-1 text-[11px] uppercase tracking-wide text-mutedText">CPU (cores)</p>
        <canvas #cpuCanvas height="120"></canvas>
      </div>
      <div>
        <p class="mb-1 text-[11px] uppercase tracking-wide text-mutedText">Mémoire (bytes)</p>
        <canvas #memoryCanvas height="120"></canvas>
      </div>
    </div>
  `,
})
export class MetricsChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() clusterId = '';

  @ViewChild('cpuCanvas') cpuCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('memoryCanvas') memoryCanvasRef!: ElementRef<HTMLCanvasElement>;

  selectedRange: MetricsRange = '1h';
  isLoading = false;
  errorMessage = '';

  private cpuChart: Chart | null = null;
  private memoryChart: Chart | null = null;
  private viewReady = false;

  constructor(private clusterService: ClusterService, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.clusterId) {
      this.loadMetrics();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clusterId'] && this.clusterId && this.viewReady) {
      this.loadMetrics();
    }
  }

  onRangeChange(): void {
    this.loadMetrics();
  }

 loadMetrics(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.clusterService.getClusterMetricsTimeseries(this.clusterId, this.selectedRange).subscribe({
    next: (res) => {
      this.renderCharts(res);
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = err?.error?.error || 'Impossible de charger les métriques';
      this.isLoading = false;
    },
  });
}

private renderCharts(data: MetricsTimeseriesResponse): void {
  if (!this.cpuCanvasRef?.nativeElement || !this.memoryCanvasRef?.nativeElement) {
    return;
  }
  this.cpuChart?.destroy();
  this.memoryChart?.destroy();

  const cpuHasEnoughData = (data.cpu ?? []).some(s => s.points && s.points.length >= 2);
  const memHasEnoughData = (data.memory ?? []).some(s => s.points && s.points.length >= 2);

  if (!cpuHasEnoughData && !memHasEnoughData) {
    this.errorMessage = 'Pas encore assez de données historiques pour afficher un graphique.';
    return;
  }

  this.ngZone.runOutsideAngular(() => {
    if (cpuHasEnoughData) {
      this.cpuChart = this.buildChart(this.cpuCanvasRef.nativeElement, data.cpu ?? []);
    }
    if (memHasEnoughData) {
      this.memoryChart = this.buildChart(this.memoryCanvasRef.nativeElement, data.memory ?? []);
    }
  });
}

  private buildChart(canvas: HTMLCanvasElement, series: { pod: string; points: { timestamp: number; value: number }[] }[]): Chart {
    const datasets = series.map((s) => ({
      label: s.pod,
      data: s.points.map((p) => ({ x: p.timestamp * 1000, y: p.value })),
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.2,
    }));

    const hasData = datasets.some((d) => d.data.length > 0);

    return new Chart(canvas, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        animation: false,
        scales: {
          x: {
            type: hasData ? 'time' : 'linear',
            time: { unit: 'minute' },
            ticks: { color: '#8a8f98' },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            ticks: { color: '#8a8f98' },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
        plugins: {
          legend: { labels: { color: '#c9cdd3', boxWidth: 10, font: { size: 10 } } },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.cpuChart?.destroy();
    this.memoryChart?.destroy();
  }
}