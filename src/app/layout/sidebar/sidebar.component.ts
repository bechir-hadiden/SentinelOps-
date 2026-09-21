import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
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
    <aside
      class="flex h-full flex-col border-r border-border transition-all duration-200"
      [ngClass]="collapsed ? 'w-16' : 'w-60'"
      style="background-color: var(--bg-sidebar);"
    >
      <!-- Logo Header -->
      <div class="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div *ngIf="!collapsed" class="flex items-center gap-2.5">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg" style="background-color: var(--brand-soft);">
            <svg class="h-4 w-4" style="color: var(--brand);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span class="font-sans text-sm font-bold tracking-tight text-primaryText">SentinelOps</span>
        </div>

        <button
          (click)="toggleCollapse()"
          class="flex h-7 w-7 items-center justify-center rounded-md text-secondaryText hover:bg-surface2 hover:text-primaryText transition-colors"
          [title]="collapsed ? 'Déplier le menu' : 'Replier le menu'"
        >
          <svg *ngIf="!collapsed" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg *ngIf="collapsed" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- Nav Groups -->
      <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        <div *ngFor="let group of navGroups">
          <div
            *ngIf="!collapsed"
            class="mb-1.5 px-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-mutedText"
          >
            {{ group.label }}
          </div>

          <div class="space-y-0.5">
            <a
              *ngFor="let item of group.items"
              [routerLink]="item.href"
              [routerLinkActiveOptions]="{ exact: item.href === '/clusters' || item.href === '/dashboard' }"
              routerLinkActive="active-nav-item"
              class="group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-secondaryText transition-colors hover:bg-surface2 hover:text-primaryText"
              [title]="collapsed ? item.label : ''"
            >
              <!-- Icon Container -->
              <span class="flex h-5 w-5 shrink-0 items-center justify-center text-secondaryText group-hover:text-primaryText" [innerHTML]="item.icon"></span>

              <span *ngIf="!collapsed" class="flex-1 truncate">{{ item.label }}</span>

              <span
                *ngIf="!collapsed && item.badge"
                class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
                style="background-color: var(--bg-critical); color: var(--critical);"
              >
                {{ item.badge }}
              </span>
            </a>
          </div>
        </div>
      </nav>

      <!-- User Profile Card in Footer -->
      <div *ngIf="!collapsed" class="m-2 rounded-md border border-border bg-surface1 p-2.5 flex items-center justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface2 text-xs font-bold text-brand border border-border">
            B
          </div>
          <div class="min-w-0 flex-1">
            <div class="truncate text-xs font-semibold text-primaryText">bechir</div>
            <div class="truncate text-[10.5px] text-mutedText">SRE Engineer</div>
          </div>
        </div>
        <button
          (click)="logout()"
          title="Se déconnecter"
          class="flex h-7 w-7 items-center justify-center rounded text-mutedText hover:bg-surface2 hover:text-critical transition-colors"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <div *ngIf="collapsed" class="p-2 border-t border-border flex justify-center">
        <button
          (click)="logout()"
          title="Se déconnecter"
          class="flex h-8 w-8 items-center justify-center rounded text-mutedText hover:bg-surface2 hover:text-critical transition-colors"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .active-nav-item {
      background-color: var(--brand-soft) !important;
      color: var(--brand) !important;
      font-weight: 600;
    }
    .active-nav-item span {
      color: var(--brand) !important;
    }
  `]
})
export class SidebarComponent {
  collapsed = false;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.router.navigate(['/login']);
  }

  navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        },
        {
          href: '/clusters',
          label: 'Clusters',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
        },
      ],
    },
    {
      label: 'Operations',
      items: [
        {
          href: '/incidents',
          label: 'Incidents',
          badge: 3,
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        },
        {
          href: '/alerts',
          label: 'Alerts',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        },
        {
          href: '/history',
          label: 'History',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
        },
      ],
    },
    {
      label: 'Observability',
      items: [
        {
          href: '/metrics',
          label: 'Metrics',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        },
        {
          href: '/logs',
          label: 'Logs',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="10" y1="9" x2="8" y2="9"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        },
        {
          href: '/traces',
          label: 'Traces',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        {
          href: '/ai-chat',
          label: 'AI Chat',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        },
        {
          href: '/ai-configuration',
          label: 'AI Configuration',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
        },
        {
          href: '/post-mortems',
          label: 'Post-mortems',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          href: '/audit-logs',
          label: 'Audit Logs',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
        },
        {
          href: '/integrations',
          label: 'Integrations',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        },
        {
          href: '/settings',
          label: 'Settings',
          icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        },
      ],
    },
  ];
}
