import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Status =
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'active'
  | 'acknowledged'
  | 'resolved'
  | 'connected'
  | 'disconnected'
  | 'success'
  | 'info'
  | 'detected'
  | 'correlating'
  | 'diagnosing'
  | 'awaiting_approval'
  | 'resolving';

export type Severity = 'critical' | 'warning' | 'info';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-0.5 text-xs font-medium font-sans border transition-colors"
      [ngClass]="badgeClass"
      [style.border-color]="customBorderColor"
      [style.background-color]="customBgColor"
      [style.color]="customTextColor"
    >
      <!-- Dot indicator or status icon -->
      <span
        *ngIf="!isCustomIcon"
        class="h-1.5 w-1.5 rounded-full"
        [style.background-color]="dotColor"
      ></span>
      {{ displayLabel }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: string = 'healthy';
  @Input() severity: string | null = null;
  @Input() label?: string;

  get normalizedStatus(): string {
    const s = (this.status || '').toLowerCase();
    if (s === 'success') return 'healthy';
    return s;
  }

  get displayLabel(): string {
    if (this.label) return this.label;
    const s = this.normalizedStatus;
    const map: Record<string, string> = {
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
      active: 'Active',
      acknowledged: 'Acknowledged',
      resolved: 'Resolved',
      connected: 'Connected',
      disconnected: 'Disconnected',
      detected: 'Détecté',
      correlating: 'Corrélation',
      diagnosing: 'Diagnostic',
      awaiting_approval: "En attente d'approbation",
      resolving: 'Résolution en cours',
    };
    return map[s] || (s.charAt(0).toUpperCase() + s.slice(1));
  }

  get dotColor(): string {
    const s = this.normalizedStatus;
    if (s === 'healthy' || s === 'resolved' || s === 'connected') return '#22C55E';
    if (s === 'warning' || s === 'acknowledged') return '#F59E0B';
    if (s === 'critical' || s === 'active') return '#EF4444';
    if (s === 'info' || s === 'detected' || s === 'correlating') return '#38BDF8';
    return '#8B98A8';
  }

  get customTextColor(): string {
    const s = this.normalizedStatus;
    if (s === 'healthy' || s === 'resolved' || s === 'connected') return '#22C55E';
    if (s === 'warning' || s === 'acknowledged') return '#F59E0B';
    if (s === 'critical' || s === 'active') return '#EF4444';
    if (s === 'info' || s === 'detected' || s === 'correlating') return '#38BDF8';
    return '#8B98A8';
  }

  get customBgColor(): string {
    const s = this.normalizedStatus;
    if (s === 'healthy' || s === 'resolved' || s === 'connected') return 'rgba(34, 197, 94, 0.12)';
    if (s === 'warning' || s === 'acknowledged') return 'rgba(245, 158, 11, 0.12)';
    if (s === 'critical' || s === 'active') return 'rgba(239, 68, 68, 0.12)';
    if (s === 'info' || s === 'detected' || s === 'correlating') return 'rgba(56, 189, 248, 0.12)';
    return 'rgba(139, 152, 168, 0.12)';
  }

  get customBorderColor(): string {
    const s = this.normalizedStatus;
    if (s === 'healthy' || s === 'resolved' || s === 'connected') return 'rgba(34, 197, 94, 0.25)';
    if (s === 'warning' || s === 'acknowledged') return 'rgba(245, 158, 11, 0.25)';
    if (s === 'critical' || s === 'active') return 'rgba(239, 68, 68, 0.25)';
    if (s === 'info' || s === 'detected' || s === 'correlating') return 'rgba(56, 189, 248, 0.25)';
    return 'rgba(139, 152, 168, 0.25)';
  }

  get badgeClass(): string {
    return '';
  }

  get isCustomIcon(): boolean {
    return false;
  }
}

@Component({
  selector: 'app-severity-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-0.5 text-xs font-medium font-sans border"
      [style.color]="badgeColor"
      [style.background-color]="badgeSoft"
      [style.border-color]="badgeBorder"
    >
      {{ displayLabel }}
    </span>
  `,
})
export class SeverityBadgeComponent {
  @Input() severity: string = 'info';

  get normalizedSeverity(): string {
    return (this.severity || 'info').toLowerCase();
  }

  get displayLabel(): string {
    const s = this.normalizedSeverity;
    if (s === 'critical') return 'Critical';
    if (s === 'warning') return 'Warning';
    return 'Info';
  }

  get badgeColor(): string {
    const s = this.normalizedSeverity;
    if (s === 'critical') return '#EF4444';
    if (s === 'warning') return '#F59E0B';
    return '#38BDF8';
  }

  get badgeSoft(): string {
    const s = this.normalizedSeverity;
    if (s === 'critical') return 'rgba(239, 68, 68, 0.12)';
    if (s === 'warning') return 'rgba(245, 158, 11, 0.12)';
    return 'rgba(56, 189, 248, 0.12)';
  }

  get badgeBorder(): string {
    const s = this.normalizedSeverity;
    if (s === 'critical') return 'rgba(239, 68, 68, 0.25)';
    if (s === 'warning') return 'rgba(245, 158, 11, 0.25)';
    return 'rgba(56, 189, 248, 0.25)';
  }
}

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[11px] font-semibold font-mono tracking-wide border"
      [style.color]="badgeColor"
      [style.background-color]="badgeSoft"
      [style.border-color]="badgeBorder"
    >
      {{ normalizedRisk }} RISK
    </span>
  `,
})
export class RiskBadgeComponent {
  @Input() risk: string = 'LOW';

  get normalizedRisk(): string {
    return (this.risk || 'LOW').toUpperCase();
  }

  get badgeColor(): string {
    const r = this.normalizedRisk;
    if (r === 'LOW') return '#22C55E';
    if (r === 'MEDIUM') return '#F59E0B';
    if (r === 'HIGH') return '#FB923C';
    if (r === 'CRITICAL') return '#EF4444';
    return '#22C55E';
  }

  get badgeSoft(): string {
    const r = this.normalizedRisk;
    if (r === 'LOW') return 'rgba(34, 197, 94, 0.12)';
    if (r === 'MEDIUM') return 'rgba(245, 158, 11, 0.12)';
    if (r === 'HIGH') return 'rgba(251, 146, 60, 0.12)';
    if (r === 'CRITICAL') return 'rgba(239, 68, 68, 0.12)';
    return 'rgba(34, 197, 94, 0.12)';
  }

  get badgeBorder(): string {
    const r = this.normalizedRisk;
    if (r === 'LOW') return 'rgba(34, 197, 94, 0.25)';
    if (r === 'MEDIUM') return 'rgba(245, 158, 11, 0.25)';
    if (r === 'HIGH') return 'rgba(251, 146, 60, 0.25)';
    if (r === 'CRITICAL') return 'rgba(239, 68, 68, 0.25)';
    return 'rgba(34, 197, 94, 0.25)';
  }
}

@Component({
  selector: 'app-agent-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-0.5 text-xs font-medium font-sans border"
      style="background-color: var(--bg-agent); color: var(--agent); border-color: rgba(167, 139, 250, 0.25);"
    >
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
      </svg>
      {{ label || 'AI Agent' }} {{ confidence !== null ? '(' + confidence + '%)' : '' }}
    </span>
  `,
})
export class AgentBadgeComponent {
  @Input() label?: string;
  @Input() confidence: number | null = null;
}
