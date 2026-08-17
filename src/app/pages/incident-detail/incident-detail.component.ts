import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StatusBadgeComponent, AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { Incident, Diagnosis, Recommendation, Postmortem, IncidentService, PatchOperation } from '../../services/incident.service';

const API_URL = 'http://localhost:3003';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, AgentBadgeComponent],
  template: `
    <div class="flex flex-col gap-6 p-6">
      <div *ngIf="isLoading" class="text-sm text-secondaryText">Chargement…</div>
      <div *ngIf="errorMessage" class="rounded-md bg-critical-bg px-4 py-3 text-sm text-critical">{{ errorMessage }}</div>

      <div *ngIf="incident">
        <h1 class="font-display text-xl font-semibold text-primaryText">{{ incident.title }}</h1>
        <div class="mt-2 flex items-center gap-3">
          <app-status-badge
            [status]="incident.status === 'active' ? 'critical' : 'success'"
            [label]="incident.status === 'active' ? 'Actif' : 'Résolu'"
          ></app-status-badge>
          <span class="font-mono text-xs text-mutedText">{{ incident.id }}</span>
        </div>
        <p class="mt-4 text-sm text-secondaryText">
          Détecté le {{ incident.detected_at | date: 'dd/MM/yyyy HH:mm' }}
        </p>

        <div class="mt-6 rounded-md border border-agent/30 bg-agent-bg p-5">
          <div class="mb-3 flex items-center justify-between">
            <app-agent-badge label="Diagnosis Agent"></app-agent-badge>
            <button
              *ngIf="!diagnosis && !isDiagnosing"
              (click)="runDiagnosis()"
              class="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-on hover:bg-brand-hover"
            >
              Lancer le diagnostic
            </button>
          </div>

          <div *ngIf="isDiagnosing" class="text-sm text-secondaryText">Analyse en cours…</div>
          <div *ngIf="diagnosisError" class="text-sm text-critical">{{ diagnosisError }}</div>

          <div *ngIf="diagnosis">
            <p class="text-sm text-primaryText">{{ diagnosis.hypothesis }}</p>
            <p class="mt-2 font-mono text-xs text-secondaryText">"{{ diagnosis.evidence }}"</p>
            <span class="mt-3 inline-block rounded-sm bg-agent/15 px-2 py-0.5 font-mono text-xs text-agent">
              Confiance : {{ diagnosis.confidence }}%
            </span>
          </div>
        </div>

        <div *ngIf="diagnosis" class="mt-6 rounded-md border border-brand/30 bg-surface2 p-5">
          <div class="mb-3 flex items-center justify-between">
            <span class="rounded-sm bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">Remediation Agent</span>
            <button
              *ngIf="!recommendation && !isRecommending"
              (click)="getRecommendation()"
              class="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-on hover:bg-brand-hover"
            >
              Proposer une action
            </button>
          </div>

          <div *ngIf="isRecommending" class="text-sm text-secondaryText">Génération de la proposition…</div>
          <div *ngIf="recommendationError" class="text-sm text-critical">{{ recommendationError }}</div>

          <div *ngIf="recommendation">
            <p class="font-mono text-xs text-secondaryText">{{ recommendation.action_command }}</p>
            <div class="mt-3 flex items-center gap-3">
              <span class="rounded-sm bg-warning-bg px-2 py-0.5 font-mono text-xs text-warning">
                Risque : {{ recommendation.risk_level }}
              </span>
              <span class="rounded-sm bg-surface3 px-2 py-0.5 font-mono text-xs text-secondaryText">
                Statut : {{ recommendation.status }}
              </span>
            </div>

            <div *ngIf="recommendation.status === 'pending'" class="mt-4 flex gap-3">
              <button
                (click)="decide('approved')"
                class="rounded-md bg-success px-3 py-1.5 text-xs font-medium text-primaryText hover:opacity-90"
              >
                Approuver
              </button>
              <button
                (click)="decide('rejected')"
                class="rounded-md bg-critical px-3 py-1.5 text-xs font-medium text-primaryText hover:opacity-90"
              >
                Rejeter
              </button>
            </div>

            <div *ngIf="recommendation.status === 'approved'" class="mt-4">
              <button
                (click)="execute()"
                [disabled]="isExecuting"
                class="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-on hover:bg-brand-hover disabled:opacity-60"
              >
                {{ isExecuting ? 'Exécution en cours…' : 'Exécuter maintenant' }}
              </button>
            </div>

            <!-- Nouveau : cas où l'action nécessite une intervention manuelle -->
            <div *ngIf="recommendation.status === 'manual_action_required'" class="mt-4 rounded-md border border-warning/30 bg-warning-bg/20 p-4">
              <p class="text-sm font-medium text-warning">Action manuelle requise</p>
              <p class="mt-1 text-sm text-secondaryText">{{ recommendation.message || "Cette action nécessite une intervention manuelle." }}</p>

              <div *ngIf="hasEditablePatch()" class="mt-4 flex flex-col gap-3">
                <div *ngFor="let op of editablePatchOps; let i = index" class="flex flex-col gap-1">
                  <label class="font-mono text-xs text-mutedText">{{ op.key || op.field }}</label>
                  <input
                    type="text"
                    [(ngModel)]="op.value"
                    [name]="'patch-value-' + i"
                    placeholder="Saisissez la vraie valeur"
                    class="rounded-md border border-border bg-surface1 px-3 py-2 text-sm text-primaryText"
                  />
                </div>
                <button
                  (click)="submitPatchCorrection()"
                  [disabled]="isCorrecting"
                  class="w-fit rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-on hover:bg-brand-hover disabled:opacity-60"
                >
                  {{ isCorrecting ? 'Envoi…' : 'Corriger et valider' }}
                </button>
                <p *ngIf="correctionError" class="text-sm text-critical">{{ correctionError }}</p>
              </div>

              <p *ngIf="!hasEditablePatch()" class="mt-3 font-mono text-xs text-mutedText">
                Consultez la commande suggérée ci-dessus et appliquez-la manuellement sur le cluster.
              </p>
            </div>

            <div *ngIf="recommendation.status === 'executed'" class="mt-4 text-sm text-success">
              ✓ Action exécutée avec succès sur le cluster
            </div>

            <div *ngIf="executeError" class="mt-3 text-sm text-critical">{{ executeError }}</div>
          </div>
        </div>

        <!-- Section post-mortem -->
        <div *ngIf="recommendation?.status === 'executed'" class="mt-6 rounded-md border border-border bg-surface2 p-5">
          <div class="mb-3 flex items-center justify-between">
            <span class="rounded-sm bg-surface3 px-2.5 py-1 text-xs font-medium text-secondaryText">Post-Mortem</span>
            <button
              *ngIf="!postmortem && !isGeneratingPostmortem"
              (click)="generatePostmortem()"
              class="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-on hover:bg-brand-hover"
            >
              Générer le post-mortem
            </button>
          </div>

          <div *ngIf="isGeneratingPostmortem" class="text-sm text-secondaryText">Rédaction en cours…</div>
          <div *ngIf="postmortemError" class="text-sm text-critical">{{ postmortemError }}</div>

          <div *ngIf="postmortem" class="whitespace-pre-wrap text-sm text-primaryText">{{ postmortem.content_markdown }}</div>
        </div>
      </div>
    </div>
  `,
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | null = null;
  diagnosis: Diagnosis | null = null;
  recommendation: Recommendation | null = null;
  postmortem: Postmortem | null = null;

  // Copie éditable des patch_operations affichée dans le formulaire de correction
  editablePatchOps: PatchOperation[] = [];

  isLoading = true;
  isDiagnosing = false;
  isRecommending = false;
  isExecuting = false;
  isCorrecting = false;
  isGeneratingPostmortem = false;

  errorMessage = '';
  diagnosisError = '';
  recommendationError = '';
  executeError = '';
  correctionError = '';
  postmortemError = '';

  private incidentId = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.incidentId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<Incident>(`${API_URL}/incidents/${this.incidentId}`).subscribe({
      next: (incident) => {
        this.incident = incident;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Incident introuvable';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  runDiagnosis(): void {
    this.isDiagnosing = true;
    this.diagnosisError = '';
    this.incidentService.diagnoseIncident(this.incidentId).subscribe({
      next: (diagnosis) => {
        this.diagnosis = diagnosis;
        this.isDiagnosing = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.diagnosisError = 'Impossible de générer le diagnostic';
        this.isDiagnosing = false;
        this.cdr.detectChanges();
      },
    });
  }

  getRecommendation(): void {
    this.isRecommending = true;
    this.recommendationError = '';
    this.incidentService.recommendAction(this.incidentId).subscribe({
      next: (recommendation) => {
        this.recommendation = recommendation;
        this.isRecommending = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recommendationError = 'Impossible de générer une recommandation';
        this.isRecommending = false;
        this.cdr.detectChanges();
      },
    });
  }

  decide(decision: 'approved' | 'rejected'): void {
    if (!this.recommendation) return;
    this.incidentService.decideRecommendation(this.recommendation.id, decision).subscribe({
      next: (updated) => {
        this.recommendation = updated;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recommendationError = 'Impossible de traiter la décision';
        this.cdr.detectChanges();
      },
    });
  }

execute(): void {
  if (!this.recommendation) return;
  this.isExecuting = true;
  this.executeError = '';
  this.incidentService.executeRecommendation(this.recommendation.id).subscribe({
    next: (response: any) => {
      if (this.recommendation) {
        this.recommendation.status = response.status;
        if (response.patch_operations) {
          this.recommendation.patch_operations = response.patch_operations;
        }
      }
      if (response.status === 'execution_failed' || response.status === 'manual_action_required') {
        this.executeError = response.message || 'L\'action n\'a pas résolu le problème.';
      }
      if (response.status === 'manual_action_required') {
        this.preparePatchCorrectionForm();  // ← ligne ajoutée
      }
      this.isExecuting = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.executeError = err?.error?.error || "Impossible d'exécuter cette action";
      this.isExecuting = false;
      this.cdr.detectChanges();
    },
  });
}

  // Détermine si on peut proposer un formulaire de correction (cas "patch"
  // avec des champs modifiables) plutôt qu'un simple message d'intervention manuelle.
  hasEditablePatch(): boolean {
    return this.recommendation?.action_type === 'patch' && this.editablePatchOps.length > 0;
  }

  private preparePatchCorrectionForm(): void {
    const ops = this.recommendation?.patch_operations ?? [];
    // Copie défensive pour ne pas modifier l'objet original avant validation
    this.editablePatchOps = ops.map((op) => ({ ...op }));
  }

  submitPatchCorrection(): void {
    if (!this.recommendation) return;
    this.isCorrecting = true;
    this.correctionError = '';
    this.incidentService.updatePatchOperations(this.recommendation.id, this.editablePatchOps).subscribe({
      next: (updated) => {
        this.recommendation = updated;
        this.isCorrecting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.correctionError = err?.error?.error || 'Impossible de valider la correction';
        this.isCorrecting = false;
        this.cdr.detectChanges();
      },
    });
  }

  generatePostmortem(): void {
    this.isGeneratingPostmortem = true;
    this.postmortemError = '';
    this.incidentService.generatePostmortem(this.incidentId).subscribe({
      next: (postmortem) => {
        this.postmortem = postmortem;
        this.isGeneratingPostmortem = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.postmortemError = 'Impossible de générer le post-mortem';
        this.isGeneratingPostmortem = false;
        this.cdr.detectChanges();
      },
    });
  }
}