import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClusterService, IngressDetail, IngressRuleEdit } from '../../services/cluster.service';

@Component({
    selector: 'app-ingress-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" (click)="onBackdropClick($event)">
      <div class="w-full max-w-2xl rounded-md border border-border bg-surface2 p-6" (click)="$event.stopPropagation()">
<div class="mb-4 flex items-center justify-between">
  <h2 class="font-display text-lg font-semibold text-primaryText">
    {{ mode === 'create' ? 'Créer un Ingress pour' : "Modifier l'Ingress" }}
    <span class="font-mono text-sm text-secondaryText">{{ ingressName }}</span>
  </h2>
  <button (click)="close.emit()" class="text-mutedText hover:text-primaryText">✕</button>
</div>

        <div *ngIf="isLoading" class="text-sm text-secondaryText">Chargement de l'Ingress...</div>
        <p *ngIf="loadError" class="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical">{{ loadError }}</p>

<div *ngIf="mode === 'create'" class="mb-4">
  <label class="mb-1 block text-[12px] text-mutedText">Nom de l'Ingress</label>
  <input
    type="text"
    [(ngModel)]="newIngressName"
    name="new-ingress-name"
    placeholder="ex: fake-db-ingress"
    class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-sm text-primaryText outline-none focus:border-brand"
  />
</div>

        <div *ngIf="rules.length > 0" class="flex flex-col gap-4">
          <div *ngFor="let rule of rules; let ri = index" class="rounded-md border border-border p-4">
            <div class="mb-3">
              <label class="mb-1 block text-[12px] text-mutedText">Host</label>
              <input
                type="text"
                [(ngModel)]="rule.host"
                [name]="'host-' + ri"
                class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-sm text-primaryText outline-none focus:border-brand"
              />
            </div>

            <div *ngFor="let path of rule.paths; let pi = index" class="mb-3 rounded-md border border-border/50 p-3">
              <div class="mb-2">
                <label class="mb-1 block text-[12px] text-mutedText">Chemin (path)</label>
                <input
                  type="text"
                  [(ngModel)]="path.path"
                  [name]="'path-' + ri + '-' + pi"
                  placeholder="/"
                  class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-sm text-primaryText outline-none focus:border-brand"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-[12px] text-mutedText">Nom du service backend</label>
                  <input
                    type="text"
                    [(ngModel)]="path.service_name"
                    [name]="'service-' + ri + '-' + pi"
                    placeholder="ex: checkout-service"
                    class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-sm text-primaryText outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-[12px] text-mutedText">Port</label>
                  <input
                    type="number"
                    [(ngModel)]="path.service_port"
                    [name]="'port-' + ri + '-' + pi"
                    class="w-full rounded-md border border-borderStrong bg-surface1 px-3 py-2 font-mono text-sm text-primaryText outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p *ngIf="submitError" class="mt-3 rounded-md bg-critical-bg px-3 py-2 text-sm text-critical">{{ submitError }}</p>
        <p *ngIf="submitSuccess" class="mt-3 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
          Ingress mis à jour avec succès.
        </p>

        <div class="mt-4 flex justify-end gap-3">
          <button
            (click)="close.emit()"
            class="rounded-md border border-border px-4 py-2 text-sm text-secondaryText hover:bg-surface3"
          >
            Fermer
          </button>
          <button
            *ngIf="rules.length > 0"
            (click)="submit()"
            [disabled]="isSubmitting"
            class="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-on hover:bg-brand-hover disabled:opacity-60"
          >
            {{ isSubmitting ? 'Application...' : 'Appliquer les modifications' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class IngressEditorComponent implements OnInit {
    @Input() clusterId = '';
    @Input() ingressName = '';
    @Input() namespace = 'default';
    @Input() incidentId = '';
    @Input() mode: 'edit' | 'create' = 'edit';
    @Input() servicePort = 80;
    @Output() close = new EventEmitter<void>();
    @Output() updated = new EventEmitter<void>();

    rules: IngressRuleEdit[] = [];
    newIngressName = '';
    isLoading = true;
    loadError = '';
    isSubmitting = false;
    submitError = '';
    submitSuccess = false;

    constructor(private clusterService: ClusterService) { }

    ngOnInit(): void {
        if (this.mode === 'create') {
            this.rules = [{ host: '', paths: [{ path: '/', path_type: 'Prefix', service_name: this.ingressName, service_port: this.servicePort }] }];
            this.isLoading = false;
            return;
        }
        this.clusterService.getIngressDetail(this.clusterId, this.ingressName, this.namespace).subscribe({
            next: (detail: IngressDetail) => {
                this.rules = detail.rules;
                this.isLoading = false;
            },
            error: (err) => {
                this.loadError = err?.error?.error || "Impossible de charger l'Ingress";
                this.isLoading = false;
            },
        });
    }

    submit(): void {
        this.isSubmitting = true;
        this.submitError = '';
        this.submitSuccess = false;

        const request$ = this.mode === 'create'
            ? this.clusterService.createIngress(this.clusterId, this.namespace, this.newIngressName, this.rules)
            : this.clusterService.updateIngress(this.clusterId, this.ingressName, this.namespace, this.incidentId, this.rules);

        request$.subscribe({
            next: () => {
                this.isSubmitting = false;
                this.submitSuccess = true;
                this.updated.emit();
            },
            error: (err) => {
                this.submitError = err?.error?.error || "Impossible d'appliquer les modifications";
                this.isSubmitting = false;
            },
        });
    }

    onBackdropClick(event: MouseEvent): void {
        this.close.emit();
    }
}