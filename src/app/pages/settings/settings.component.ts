import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-primaryText font-sans">Settings</h1>
        <p class="text-xs text-secondaryText mt-0.5">Account security, organizations, and team access</p>
      </div>

      <div class="rounded-lg border border-border bg-surface1 p-6 space-y-4 max-w-xl">
        <div>
          <label class="block text-xs font-semibold text-primaryText mb-1">Organization Name</label>
          <input value="SentinelOps Demo Org" class="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-xs text-primaryText outline-none focus:border-brand" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-primaryText mb-1">User Email</label>
          <input value="test@sentinelops.io" disabled class="w-full rounded-md border border-border bg-page px-3 py-2 text-xs text-mutedText outline-none" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-primaryText mb-1">Role</label>
          <div class="font-mono text-xs text-brand">SRE / Administrator</div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {}
