import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  codeBlock?: string;
  time: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, AgentBadgeComponent],
  template: `
    <div class="flex flex-col h-[calc(100vh-100px)] space-y-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Assistant IA DevOps</h1>
        <p class="text-sm text-secondaryText">Posez des questions ou demandez à l'IA d'exécuter des diagnostics automatiques sur les clusters.</p>
      </div>

      <!-- Chat Box -->
      <div class="flex-1 rounded-md border border-border bg-surface1 flex flex-col overflow-hidden">
        <!-- Messages Area -->
        <div class="flex-1 overflow-auto p-4 space-y-4">
          <div *ngFor="let msg of messages" class="flex flex-col" [ngClass]="msg.sender === 'user' ? 'items-end' : 'items-start'">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-mutedText">{{ msg.time }}</span>
              <app-agent-badge *ngIf="msg.sender === 'agent'" label="SentinelOps AI"></app-agent-badge>
              <span *ngIf="msg.sender === 'user'" class="text-xs font-bold text-brand">Opérateur</span>
            </div>

            <div class="max-w-[85%] rounded-md px-4 py-2.5 text-[13.5px]"
                 [ngClass]="msg.sender === 'user' ? 'bg-surface3 text-primaryText' : 'bg-surface2 text-primaryText border border-border'">
              <p class="whitespace-pre-line">{{ msg.text }}</p>

              <!-- Monaco-like code block -->
              <pre *ngIf="msg.codeBlock" class="mt-2.5 overflow-x-auto rounded bg-page p-3 font-mono text-xs text-secondaryText border border-border">{{ msg.codeBlock }}</pre>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="border-t border-border bg-surface2 px-4 py-2.5 flex flex-wrap gap-2">
          <button *ngFor="let action of quickActions" (click)="triggerAction(action)" class="text-xs px-3 py-1.5 rounded-full border border-border bg-surface1 text-secondaryText hover:border-brand hover:text-brand transition-all">
            {{ action }}
          </button>
        </div>

        <!-- Message Input -->
        <div class="border-t border-border bg-surface1 p-3 flex gap-2.5">
          <input type="text" [(ngModel)]="userQuery" (keydown.enter)="sendMessage()" placeholder="Saisissez une commande ou posez une question..."
                 class="flex-1 rounded-md border border-border bg-surface2 px-4 py-2.5 text-sm text-primaryText focus:border-brand focus:outline-none placeholder-mutedText" />
          <button (click)="sendMessage()" class="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-hover transition-all">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AiChatComponent {
  userQuery = '';
  messages: Message[] = [
    {
      sender: 'agent',
      text: 'Bonjour ! Je suis l\'assistant SentinelOps. J\'analyse actuellement le cluster et j\'ai détecté une anomalie sur le service `auth-service`. Comment puis-je vous aider ?',
      time: '09:50',
    },
  ];

  quickActions = [
    'Diagnostiquer auth-service',
    'Vérifier les événements K8s',
    'Analyser les derniers logs d\'erreur',
    'Générer le brouillon de post-mortem',
  ];

  sendMessage() {
    if (!this.userQuery.trim()) return;

    const query = this.userQuery;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.messages.push({
      sender: 'user',
      text: query,
      time: now,
    });

    this.userQuery = '';

    // Simulate AI response
    setTimeout(() => {
      this.respondToQuery(query);
    }, 1000);
  }

  triggerAction(action: string) {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({
      sender: 'user',
      text: action,
      time: now,
    });
    setTimeout(() => {
      this.respondToQuery(action);
    }, 1000);
  }

  private respondToQuery(query: string) {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let text = '';
    let codeBlock = '';

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('diagnostiquer') || lowerQuery.includes('auth-service')) {
      text = 'Diagnostic de `auth-service` terminé :\n- Le pod `auth-pod-2` est dans l\'état `CrashLoopBackOff` depuis 12 minutes.\n- Raison détectée : Erreur de connexion à la base de données (timeout).\n- Résolution suggérée : Vérifier les secrets K8s et la connectivité réseau vers `auth-db`.';
      codeBlock = `kubectl describe pod auth-pod-2 -n production
...
State:          Waiting
  Reason:       CrashLoopBackOff
Last State:     Terminated
  Reason:       Error
  Exit Code:    137
...
Logs:
[Error] dial tcp 10.96.128.4:5432: i/o timeout`;
    } else if (lowerQuery.includes('événements') || lowerQuery.includes('k8s')) {
      text = 'Voici les derniers événements K8s marquants :';
      codeBlock = `2026-07-09 09:48:12  Warning  FailedScheduling  pod/worker-6a8b  0/8 nodes are available: 3 Insufficient memory.
2026-07-09 09:49:05  Warning  BackOff           pod/auth-pod-2   Back-off restarting failed container`;
    } else if (lowerQuery.includes('logs') || lowerQuery.includes('erreur')) {
      text = 'Voici un extrait des logs d\'erreurs récents filtrés :';
      codeBlock = `[2026-07-09T09:48:55.102Z] ERROR: Database connection failed (host=auth-db:5432). Retrying in 5s...
[2026-07-09T09:49:00.125Z] ERROR: Database connection failed. Max retries reached. Shutting down.`;
    } else if (lowerQuery.includes('post-mortem') || lowerQuery.includes('postmortem')) {
      text = 'J\'ai préparé le brouillon du post-mortem. Il est prêt à être exporté vers votre outil de documentation :';
      codeBlock = `# Post-Mortem : Incident de connexion auth-service
**Date** : 2026-07-09
**Sévérité** : Critique
**Impact** : Taux d'échec de 100% sur les connexions utilisateurs.
**Description** : Perte de connectivité vers auth-db à la suite d'une mise à jour de politique réseau.`;
    } else {
      text = `Je comprends votre question concernant "${query}". Pourriez-vous préciser si vous souhaitez consulter les métriques, logs ou diagnostics d'un service en particulier ?`;
    }

    this.messages.push({
      sender: 'agent',
      text,
      codeBlock: codeBlock || undefined,
      time: now,
    });
  }
}
