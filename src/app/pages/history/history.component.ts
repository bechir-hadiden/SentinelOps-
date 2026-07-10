import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Historique des Incidents</h1>
        <p class="text-sm text-secondaryText">Consultez l'historique complet des incidents résolus.</p>
      </div>

      <div class="rounded-md border border-border bg-surface1 overflow-hidden">
        <div class="divide-y divide-border text-[13.5px]">
          <div *ngFor="let item of history" class="p-4 flex items-center justify-between hover:bg-surface2/30 transition-colors">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-mutedText">[{{ item.id }}]</span>
                <span class="font-semibold text-primaryText">{{ item.service }}</span>
                <app-status-badge status="success" label="Résolu"></app-status-badge>
              </div>
              <p class="text-xs text-secondaryText">{{ item.description }}</p>
            </div>
            <div class="text-right text-xs text-mutedText font-mono">
              <p>Durée : {{ item.duration }}</p>
              <p>{{ item.resolvedAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HistoryComponent {
  history = [
    { id: 'INC-1044', service: 'redis-cache', description: 'Échec de réplication Master/Slave résolu après redémarrage des sentinelles Redis.', duration: '14 min', resolvedAt: 'Hier, 18:32' },
    { id: 'INC-1042', service: 'email-sender', description: 'Expiration des API credentials Sendgrid résolue par renouvellement du secret.', duration: '45 min', resolvedAt: '07 Juil, 10:15' },
    { id: 'INC-1039', service: 'frontend-app', description: 'Fuite mémoire mineure résolue par rollback de la version v2.1.2 à v2.1.1.', duration: '1h 12m', resolvedAt: '05 Juil, 14:02' },
  ];
}
