import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Paramètres généraux</h1>
        <p class="text-sm text-secondaryText">Configurez les réglages globaux de votre instance SentinelOps.</p>
      </div>

      <div class="rounded-md border border-border bg-surface1 p-5 space-y-6 max-w-xl">
        <!-- Cluster Settings Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primaryText font-display">Préférences Cluster</h3>
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-secondaryText">Cluster Actif par Défaut</label>
            <select class="w-full rounded border border-border bg-surface2 px-3 py-2 text-xs text-primaryText focus:border-brand focus:outline-none">
              <option>cluster-prod-eu (Actuel)</option>
              <option>cluster-prod-us</option>
              <option>cluster-staging-eu</option>
            </select>
          </div>
        </div>

        <!-- Notification preferences -->
        <div class="space-y-3 border-t border-border pt-6">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primaryText font-display">Notifications</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-secondaryText">Envoyer un rapport par email</p>
              <p class="text-[10px] text-mutedText">Envoyé chaque matin résumant les incidents résolus par l'IA.</p>
            </div>
            <input type="checkbox" checked class="h-4 w-4 rounded border-border text-brand focus:ring-brand" />
          </div>
        </div>

        <!-- Button actions -->
        <div class="flex justify-end pt-4">
          <button class="rounded bg-brand px-4 py-2 text-xs font-bold text-on-brand hover:bg-brand-hover transition-colors">
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {}
