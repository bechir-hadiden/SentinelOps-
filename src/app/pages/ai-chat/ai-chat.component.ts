import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, AgentBadgeComponent],
  template: `
    <div class="p-6 h-full flex flex-col gap-4">
      <div class="rounded-lg border border-border bg-surface1 flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <div class="w-7 h-7 rounded-md flex items-center justify-center bg-agent/15 text-agent">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
            </svg>
          </div>
          <span class="text-sm font-bold text-primaryText">SentinelOps AI Assistant</span>
        </div>

        <!-- Message List -->
        <div class="flex-1 p-5 space-y-3 overflow-y-auto" style="min-height: 300px;">
          <div
            *ngFor="let m of messages"
            class="max-w-xl rounded-lg px-4 py-3 text-xs leading-relaxed"
            [ngClass]="m.role === 'user' ? 'ml-auto bg-brand/15 text-primaryText border border-brand/30' : 'bg-surface2 text-primaryText border border-border'"
          >
            {{ m.text }}
          </div>
        </div>

        <!-- Input Box -->
        <div class="p-3 border-t border-border bg-page flex gap-2">
          <input
            [(ngModel)]="input"
            (keydown.enter)="send()"
            placeholder="Why is api-gateway failing or what is the cluster status?"
            class="flex-1 px-3 py-2 rounded-md text-xs border border-border bg-surface2 text-primaryText outline-none focus:border-brand placeholder-mutedText"
          />
          <button
            (click)="send()"
            class="rounded-md bg-agent px-4 py-2 text-xs font-semibold text-page hover:opacity-90 transition-opacity"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AiChatComponent {
  input = '';
  messages: Message[] = [
    { role: 'assistant', text: 'Ask me about your infrastructure — incidents, services, or cluster health.' },
  ];

  send(): void {
    if (!this.input.trim()) return;
    const query = this.input.trim();
    this.messages.push({ role: 'user', text: query });
    this.input = '';

    setTimeout(() => {
      let answer = "I analyzed the active telemetry. The cluster sentinelops-realtest is currently running 23 pods. I detected 1 active CrashLoopBackOff pod with 94% confidence. Open the Incidents view to execute autonomous remediation.";
      if (query.toLowerCase().includes('oom') || query.toLowerCase().includes('memory')) {
        answer = "The OOMKilled incident occurred because container memory limit was 64Mi while peak consumption reached 80Mi. The recommended mitigation is scaling memory limit to 256Mi.";
      }
      this.messages.push({ role: 'assistant', text: answer });
    }, 800);
  }
}
