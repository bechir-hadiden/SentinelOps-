import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="flex w-60 flex-shrink-0 flex-col border-r border-border bg-surface1">
      <div class="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 12h4l2-7 4 14 2-7h8"
            stroke="var(--brand)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="font-display text-base font-semibold tracking-wide">SentinelOps</span>
      </div>

      <div *ngFor="let group of navGroups" class="px-3 py-4">
        <div class="px-2.5 pb-2 text-[11px] uppercase tracking-wider text-mutedText">
          {{ group.label }}
        </div>
        <a
          *ngFor="let item of group.items"
          [routerLink]="item.href"
          routerLinkActive="bg-brand/10 font-medium text-brand"
          class="mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] text-secondaryText hover:bg-surface3 hover:text-primaryText"
        >
          {{ item.label }}
        </a>
      </div>

      <div class="mt-auto px-3 py-4">
        <a
          *ngFor="let item of footerItems"
          [routerLink]="item.href"
          routerLinkActive="text-brand"
          class="mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] text-secondaryText hover:bg-surface3 hover:text-primaryText"
        >
          {{ item.label }}
        </a>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  navGroups: NavGroup[] = [
    {
      label: "Vue d'ensemble",
      items: [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/topology', label: 'Topologie' },
        { href: '/clusters', label: 'Clusters' },
      ],
    },
    {
      label: 'Incidents',
      items: [
        { href: '/incidents', label: 'Incidents actifs' },
        { href: '/alerts', label: 'Alert Center' },
        { href: '/history', label: 'Historique' },
      ],
    },
    {
      label: 'Observabilité',
      items: [
        { href: '/metrics', label: 'Metrics' },
        { href: '/logs', label: 'Logs' },
        { href: '/traces', label: 'Traces' },
      ],
    },
    {
      label: 'IA',
      items: [
        { href: '/ai-chat', label: 'AI Chat' },
        { href: '/post-mortems', label: 'Post-mortems' },
        { href: '/ai-configuration', label: 'AI Configuration' },
      ],
    },
  ];

  footerItems: NavItem[] = [
    { href: '/audit-logs', label: 'Audit logs' },
    { href: '/integrations', label: 'Intégrations' },
    { href: '/settings', label: 'Paramètres' },
  ];
}
