import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Postmortem {
  id: string;
  title: string;
  incidentId: string;
  author: string;
  date: string;
}

@Component({
  selector: 'app-post-mortems',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Rapports Post-mortems</h1>
        <p class="text-sm text-secondaryText">Historique des analyses de pannes générées ou rédigées pour les incidents majeurs.</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let pm of postmortems" class="rounded-md border border-border bg-surface1 p-5 space-y-4 hover:border-brand/40 transition-colors cursor-pointer">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-brand uppercase tracking-wider">Rapport {{ pm.id }}</span>
            <h3 class="text-base font-bold text-primaryText leading-snug">{{ pm.title }}</h3>
          </div>
          <div class="flex justify-between items-center text-xs text-mutedText border-t border-border pt-3">
            <span>Auteur: {{ pm.author }}</span>
            <span>{{ pm.date }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PostMortemsComponent {
  postmortems: Postmortem[] = [
    { id: 'PM-2026-01', title: 'Perte de connectivité Database Auth', incidentId: 'INC-1049', author: 'SentinelOps AI', date: '09/07/2026' },
    { id: 'PM-2026-02', title: 'Expiration Certificat SSL Ingress', incidentId: 'INC-1022', author: 'Jean Dupont', date: '28/06/2026' },
  ];
}
