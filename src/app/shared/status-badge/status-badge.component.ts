import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Status = 'success' | 'warning' | 'critical' | 'info' | 'detected' | 'correlating' | 'diagnosing' | 'awaiting_approval' | 'resolving' | 'resolved';

const STYLES: Record<string, { bg: string; text: string; label: string }> = {
  success: { bg: 'bg-[rgba(52,211,153,0.12)]', text: 'text-[var(--success)]', label: 'Résolu' },
  warning: { bg: 'bg-[rgba(255,159,64,0.12)]', text: 'text-[var(--warning)]', label: 'Avertissement' },
  critical: { bg: 'bg-[rgba(255,92,92,0.12)]', text: 'text-[var(--critical)]', label: 'Critique' },
  info: { bg: 'bg-[rgba(79,168,255,0.12)]', text: 'text-[var(--info)]', label: 'Info' },
};

const STATUS_LABELS: Record<string, string> = {
  detected: 'Détecté',
  correlating: 'Corrélation',
  diagnosing: 'Diagnostic',
  awaiting_approval: "En attente d'approbation",
  resolving: 'Résolution en cours',
  resolved: 'Résolu',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-0.5 text-xs font-medium font-['IBM_Plex_Sans'] border"
      [class]="styleClass"
    >
      <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
      {{ label ?? displayLabel }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: any = 'info';
  @Input() severity: any = null;
  @Input() label?: string;

  get displayLabel(): string {
    if (STATUS_LABELS[this.status]) {
      return STATUS_LABELS[this.status];
    }
    if (STYLES[this.status]) {
      return STYLES[this.status].label;
    }
    return this.status;
  }

  get styleClass(): string {
    if (this.status === 'resolved' || this.status === 'success') {
      return 'bg-[rgba(52,211,153,0.12)] text-[var(--success)] border-[rgba(52,211,153,0.2)]';
    }
    
    if (STYLES[this.status] && !this.severity) {
      const style = STYLES[this.status];
      const borders: Record<string, string> = {
        critical: 'border-[rgba(255,92,92,0.2)]',
        warning: 'border-[rgba(255,159,64,0.2)]',
        info: 'border-[rgba(79,168,255,0.2)]',
      };
      return `${style.bg} ${style.text} ${borders[this.status] || ''}`;
    }

    const activeSeverity = this.severity || 'info';
    const style = STYLES[activeSeverity] || STYLES['info'];
    const borders: Record<string, string> = {
      critical: 'border-[rgba(255,92,92,0.2)]',
      warning: 'border-[rgba(255,159,64,0.2)]',
      info: 'border-[rgba(79,168,255,0.2)]',
    };
    return `${style.bg} ${style.text} ${borders[activeSeverity] || ''}`;
  }
}

@Component({
  selector: 'app-agent-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-0.5 text-xs font-medium font-['IBM_Plex_Sans'] border"
      style="background-color: var(--bg-agent); color: var(--text-agent); border-color: rgba(139, 124, 246, 0.2);"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-3 w-3" stroke="currentColor">
        <circle cx="12" cy="12" r="9" stroke-width="2" />
        <path d="M12 7v5l3 3" stroke-width="2" stroke-linecap="round" />
      </svg>
      Agent IA {{ confidence !== null ? '(' + confidence + '%)' : '' }}
    </span>
  `,
})
export class AgentBadgeComponent {
  @Input() confidence: number | null = null;
}
