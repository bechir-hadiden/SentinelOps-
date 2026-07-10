import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

interface Integration {
  name: string;
  category: string;
  status: 'success' | 'warning' | 'critical';
  description: string;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Intégrations</h1>
        <p class="text-sm text-secondaryText">Gérez les connexions avec vos outils externes d'observabilité, d'alerte et de chatops.</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let item of integrations" class="rounded-md border border-border bg-surface1 p-5 space-y-4 hover:border-brand/40 transition-colors">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-mono font-bold text-mutedText uppercase tracking-wider">{{ item.category }}</span>
              <h3 class="text-base font-bold text-primaryText leading-snug">{{ item.name }}</h3>
            </div>
            <app-status-badge [status]="item.status" [label]="item.status === 'success' ? 'Connecté' : 'Erreur'"></app-status-badge>
          </div>
          <p class="text-xs text-secondaryText leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class IntegrationsComponent {
  integrations: Integration[] = [
    { name: 'Slack ChatOps', category: 'Chat / Notification', status: 'success', description: 'Permet de recevoir les résumés d\'incidents et d\'exécuter des requêtes de diagnostic directement depuis vos canaux Slack.' },
    { name: 'Prometheus Server', category: 'Observabilité', status: 'success', description: 'Collecte et stocke en continu les métriques de performance et l\'état de santé de vos pods et machines.' },
    { name: 'Kubernetes API', category: 'Infrastructure', status: 'success', description: 'Accès natif au cluster Kubernetes principal pour l\'administration, l\'échelle automatique et l\'inspection en temps réel.' },
    { name: 'Datadog APM', category: 'Traces', status: 'warning', description: 'Service de traçage distribué externe. Échec de synchronisation de l\'API Key détecté récemment.' },
  ];
}
