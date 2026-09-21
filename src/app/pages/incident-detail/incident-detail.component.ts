import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StatusBadgeComponent, SeverityBadgeComponent, RiskBadgeComponent, AgentBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { IngressEditorComponent } from './ingress-editor.component';
import {
  Incident,
  Diagnosis,
  Recommendation,
  Postmortem,
  IncidentService,
  CandidateRecommendation,
  CandidatesResponse,
} from '../../services/incident.service';

const REMEDIATION_STEPS = ["Diagnosis", "Candidates", "Review", "Approval", "Execution", "Verification"];

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    SeverityBadgeComponent,
    RiskBadgeComponent,
    AgentBadgeComponent,
    IngressEditorComponent
  ],
  template: `
    <div class="p-6 space-y-5">
      <!-- Back button -->
      <button
        (click)="goBack()"
        class="flex items-center gap-1.5 text-xs text-secondaryText hover:text-primaryText transition-colors"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Back to incidents</span>
      </button>

      <!-- Main Incident Header Card -->
      <div *ngIf="incident" class="rounded-lg border border-border bg-surface1 p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <app-severity-badge [severity]="incident.severity || 'critical'"></app-severity-badge>
              <app-status-badge [status]="incident.status === 'resolved' ? 'resolved' : 'active'"></app-status-badge>
            </div>
            <h1 class="text-xl font-bold text-primaryText mt-2 font-sans">{{ incident.title }}</h1>
            <div class="flex items-center gap-2.5 mt-1.5 text-xs text-secondaryText font-mono flex-wrap">
              <span class="text-primaryText font-semibold">{{ incident.id }}</span>
              <span>&middot;</span>
              <span>{{ incident.cluster_name || incident.cluster_id }}</span>
              <span>&middot;</span>
              <span>{{ incident.service_name || incident.resource_name || 'default' }}</span>
              <span>&middot;</span>
              <span>Detected {{ incident.detected_at | date: 'dd/MM/yyyy HH:mm:ss' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6-Step Stepper -->
      <div *ngIf="incident" class="rounded-lg border border-border bg-surface1 p-4">
        <div class="flex items-center overflow-x-auto pb-1">
          <div *ngFor="let step of steps; let idx = index" class="flex items-center shrink-0">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
                [ngClass]="{
                  'bg-success/15 text-success border border-success/30': idx < currentStepIndex,
                  'bg-brand/15 text-brand border border-brand': idx === currentStepIndex,
                  'bg-surface2 text-mutedText border border-border': idx > currentStepIndex
                }"
              >
                <svg *ngIf="idx < currentStepIndex" class="h-3 w-3 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span *ngIf="idx >= currentStepIndex">{{ idx + 1 }}</span>
              </div>
              <span
                class="text-xs whitespace-nowrap"
                [ngClass]="{
                  'font-bold text-primaryText': idx === currentStepIndex,
                  'text-secondaryText': idx < currentStepIndex,
                  'text-mutedText': idx > currentStepIndex
                }"
              >
                {{ step }}
              </span>
            </div>
            <div
              *ngIf="idx < steps.length - 1"
              class="w-8 h-px mx-2 shrink-0"
              [ngClass]="idx < currentStepIndex ? 'bg-success/40' : 'bg-border'"
            ></div>
          </div>
        </div>
      </div>

      <!-- 1. AI ROOT CAUSE ANALYSIS CARD -->
      <div *ngIf="incident" class="rounded-lg border border-agent/30 bg-surface1 p-5 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-agent/15 border border-agent/30 text-agent">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-bold text-primaryText">AI Agent &mdash; Root Cause Analysis</div>
              <div class="text-xs text-mutedText">SentinelOps Intelligence Engine (Mistral)</div>
            </div>
          </div>

          <button
            *ngIf="!diagnosis && !isDiagnosing"
            (click)="runDiagnosis()"
            class="rounded-md bg-agent py-1.5 px-3 text-xs font-semibold text-page hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
            </svg>
            <span>Run Diagnosis</span>
          </button>
        </div>

        <div *ngIf="isDiagnosing" class="flex items-center gap-2 text-xs text-agent">
          <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Analyzing cluster telemetry, logs, and container specs with Mistral...</span>
        </div>

        <!-- Diagnosis Error Banner -->
        <div *ngIf="diagnosisError" class="rounded-md border border-critical/30 bg-critical/10 p-3 text-xs text-critical flex items-center justify-between">
          <span>{{ diagnosisError }}</span>
          <button (click)="runDiagnosis()" class="rounded border border-critical/40 px-2 py-1 text-[11px] font-semibold hover:bg-critical/20">
            Retry
          </button>
        </div>

        <div *ngIf="diagnosis" class="space-y-3 pt-1">
          <div>
            <div class="text-[11px] font-semibold uppercase tracking-wider text-mutedText mb-1">Hypothesis</div>
            <div class="text-sm text-primaryText font-medium">{{ diagnosis.hypothesis }}</div>
          </div>

          <div>
            <div class="text-[11px] font-semibold uppercase tracking-wider text-mutedText mb-1">Evidence</div>
            <div class="rounded-md border border-border bg-page p-3 font-mono text-xs text-critical">
              {{ diagnosis.evidence }}
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-mutedText">Confidence</div>
            <div class="flex-1 h-1.5 rounded-full bg-surface2 max-w-xs overflow-hidden">
              <div class="h-full bg-agent rounded-full" [style.width.%]="diagnosis.confidence"></div>
            </div>
            <span class="text-xs font-bold text-agent font-mono">{{ diagnosis.confidence }}%</span>
          </div>
        </div>
      </div>

      <!-- 2. REMEDIATION AGENT & CANDIDATES -->
      <div *ngIf="diagnosis" class="rounded-lg border border-remediation/30 bg-surface1 p-5 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-remediation/15 border border-remediation/30 text-remediation">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-bold text-primaryText">Remediation Agent</div>
              <div class="text-xs text-mutedText">Ranked mitigation candidates</div>
            </div>
          </div>

          <button
            *ngIf="candidates.length === 0 && !isRecommending"
            (click)="getRecommendation()"
            class="rounded-md bg-remediation py-1.5 px-3 text-xs font-semibold text-page hover:opacity-90 transition-opacity"
          >
            Generate Remediation
          </button>
        </div>

        <div *ngIf="isRecommending" class="flex items-center gap-2 text-xs text-remediation">
          <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Evaluating risk and safety constraints...</span>
        </div>

        <!-- Candidate List -->
        <div *ngIf="candidates.length > 0" class="space-y-3">
          <div
            *ngFor="let cand of candidates; let cIdx = index"
            class="rounded-lg border p-4 transition-all"
            [ngClass]="cand.is_selected ? 'border-remediation bg-surface2' : 'border-border bg-page hover:border-borderStrong'"
          >
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div class="text-[10px] font-semibold text-mutedText uppercase">Candidate #{{ cIdx + 1 }}</div>
                <div class="text-sm font-semibold text-primaryText">{{ cand.title }}</div>
              </div>
              <div class="flex items-center gap-2">
                <app-risk-badge [risk]="cand.risk_level || 'LOW'"></app-risk-badge>
              </div>
            </div>

            <!-- Terminal box -->
            <div *ngIf="cand.action_command" class="mt-2.5 rounded-md border border-border bg-surface1 p-2.5 font-mono text-xs text-primaryText">
              {{ cand.action_command }}
            </div>

            <div *ngIf="cand.justification" class="mt-2 text-xs text-secondaryText">
              {{ cand.justification }}
            </div>

            <div class="mt-3 flex items-center justify-between">
              <div class="text-xs text-secondaryText">
                Confidence <span class="font-bold text-primaryText font-mono">{{ cand.final_score || 85 }}%</span>
              </div>
              <button
                (click)="chooseCandidate(cand)"
                [disabled]="isSelectingCandidate"
                class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                [ngClass]="cand.is_selected ? 'bg-remediation text-page' : 'border border-border bg-surface1 text-primaryText hover:bg-surface2'"
              >
                {{ cand.is_selected ? 'Selected Candidate' : 'Choose Candidate' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. PRE-APPROVAL REVIEW -->
      <div *ngIf="selectedCandidate" class="rounded-lg border border-border bg-surface1 p-5 space-y-4">
        <div class="text-sm font-semibold text-primaryText">Review Proposed Change</div>

        <div *ngIf="selectedCandidate.action_type === 'set_image'" class="grid sm:grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-mutedText mb-1 font-medium">Before</div>
            <div class="rounded-md border border-border bg-page p-2.5 font-mono text-xs text-secondaryText">
              {{ incident?.service_name || 'api-gateway' }}:v1.0.0
            </div>
          </div>
          <div>
            <div class="text-xs text-mutedText mb-1 font-medium">After</div>
            <div class="rounded-md border border-brand bg-page p-2.5 font-mono text-xs text-primaryText">
              {{ selectedCandidate.action_command || 'kubectl rollout restart' }}
            </div>
          </div>
        </div>

        <div *ngIf="selectedCandidate.action_type !== 'set_image'" class="rounded-md border border-border bg-page p-3 font-mono text-xs text-primaryText">
          {{ selectedCandidate.action_command || 'No shell action required' }}
        </div>

        <div class="flex items-center gap-4 text-xs text-secondaryText">
          <span>Target: <strong class="font-mono text-primaryText">{{ incident?.cluster_name || incident?.cluster_id }} / {{ incident?.service_name || incident?.resource_name || 'default' }}</strong></span>
          <span>Risk: <app-risk-badge [risk]="selectedCandidate.risk_level || 'LOW'"></app-risk-badge></span>
        </div>

        <!-- Special Ingress Action Trigger -->
        <div *ngIf="isIngressIncident()" class="pt-2">
          <button
            (click)="showIngressEditor = true"
            class="rounded-md bg-brand px-3.5 py-2 text-xs font-semibold text-on-brand hover:bg-brand-hover"
          >
            Modifier / Créer l'Ingress
          </button>
        </div>
      </div>

      <!-- 3bis. MANUAL ACTION REQUIRED (action_type === 'other') -->
      <div *ngIf="selectedCandidate && selectedCandidate.action_type === 'other' && !isExecuted" class="rounded-lg border border-warning/40 bg-surface1 p-5 space-y-3">
        <div class="flex items-center gap-2 text-warning">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div class="text-sm font-bold text-primaryText">Intervention manuelle requise</div>
        </div>
        <div class="text-xs text-secondaryText">
          {{ selectedCandidate.justification || "Cette action nécessite une valeur que le systeme ne peut pas déterminer automatiquement (registre, image, ou identifiant réel). Un opérateur doit fournir la vraie commande à exécuter manuellement sur le cluster." }}
        </div>
        <div *ngIf="selectedCandidate.action_command" class="rounded-md border border-border bg-page p-3 font-mono text-xs text-primaryText">
          {{ selectedCandidate.action_command }}
        </div>
        <div class="pt-2">
          <button
            (click)="markAsManuallyResolved()"
            class="rounded-md border border-border bg-surface2 px-3.5 py-2 text-xs font-semibold text-primaryText hover:bg-surface3"
          >
            Marquer comme résolu manuellement
          </button>
        </div>
      </div>

      <!-- 4. APPROVAL CARD -->
      <div *ngIf="selectedCandidate && !isApproved && selectedCandidate.action_type !== 'other'" class="rounded-lg border border-warning/40 bg-surface1 p-5 space-y-3">
        <div class="flex items-center gap-2 text-warning">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div class="text-sm font-bold text-primaryText">Approval Required</div>
        </div>
        <div class="text-xs text-secondaryText">
          This action will run against <strong class="font-mono text-primaryText">{{ incident?.cluster_name || incident?.cluster_id }}</strong>. Review the change above before proceeding.
        </div>
        <div class="flex gap-2.5 pt-2">
          <button
            (click)="rejectAction()"
            class="rounded-md border border-critical/30 bg-critical/10 px-4 py-2 text-xs font-semibold text-critical hover:bg-critical/20 transition-colors"
          >
            Reject Action
          </button>
          <button
            (click)="approveAction()"
            class="rounded-md bg-brand px-4 py-2 text-xs font-semibold text-on-brand hover:bg-brand-hover transition-colors"
          >
            Approve & Proceed
          </button>
        </div>
      </div>

      <!-- 5. EXECUTION CARD -->
      <div *ngIf="isApproved && !isExecuted && selectedCandidate" class="rounded-lg border border-remediation/40 bg-surface1 p-5 space-y-3">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="text-sm font-bold text-primaryText">Ready to Execute</div>
            <div class="text-xs text-secondaryText mt-0.5">Approved by bechir &middot; Target: {{ incident?.cluster_name || incident?.cluster_id }}</div>
          </div>
          <button
            (click)="executeAction()"
            [disabled]="isExecuting"
            class="rounded-md bg-remediation px-4 py-2 text-xs font-semibold text-page hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <svg *ngIf="isExecuting" class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isExecuting ? 'Executing...' : 'Execute Remediation' }}</span>
          </button>
        </div>

        <div *ngIf="isExecuting" class="text-xs text-secondaryText font-mono">
          Running {{ selectedCandidate.action_command || 'remediation action' }}...
        </div>
      </div>

      <!-- 6. VERIFICATION RESULT -->
      <div *ngIf="isExecuted" class="rounded-lg border p-5 space-y-3" [ngClass]="isVerifiedHealthy ? 'border-success/40 bg-surface1' : 'border-critical/40 bg-surface1'">
        <div class="flex items-center gap-2">
          <svg *ngIf="isVerifiedHealthy" class="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
          </svg>
          <svg *ngIf="!isVerifiedHealthy" class="h-5 w-5 text-critical" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <div class="text-sm font-bold text-primaryText">
            {{ isVerifiedHealthy ? 'Remediation completed successfully' : 'Remediation executed' }}
          </div>
        </div>
        <div class="text-xs text-secondaryText">
          {{ isVerifiedHealthy ? 'The service recovered successfully after applying the mitigation.' : 'Verification check failed. The service is still showing errors.' }}
        </div>
        <div class="pt-2">
          <button
            (click)="generatePostmortem()"
            class="rounded-md border border-border bg-surface2 px-3.5 py-1.5 text-xs font-semibold text-primaryText hover:bg-surface3 flex items-center gap-1.5"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Generate Post-Mortem</span>
          </button>
        </div>
      </div>

      <!-- Ingress Editor Modal -->
      <app-ingress-editor
        *ngIf="showIngressEditor && incident"
        mode="edit"
        [incidentId]="incident.id"
        [clusterId]="incident.cluster_id"
        [ingressName]="incident.service_name || 'ingress-broken'"
        [namespace]="'default'"
        (close)="showIngressEditor = false"
        (updated)="onIngressSaved()"
      ></app-ingress-editor>
    </div>
  `,
})
export class IncidentDetailComponent implements OnInit, OnDestroy {
  incident: Incident | null = null;
  diagnosis: Diagnosis | null = null;
  recommendation: Recommendation | null = null;
  candidates: CandidateRecommendation[] = [];
  selectedCandidate: CandidateRecommendation | null = null;

  isDiagnosing = false;
  diagnosisError = '';
  isRecommending = false;
  isSelectingCandidate = false;
  isApproved = false;
  isExecuting = false;
  isExecuted = false;
  isVerifiedHealthy = true;
  showIngressEditor = false;

  steps = REMEDIATION_STEPS;
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadIncidentInstantly(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  get currentStepIndex(): number {
    if (this.isExecuted) return 5;
    if (this.isExecuting || this.isApproved) return 4;
    if (this.selectedCandidate) return 2;
    if (this.candidates.length > 0) return 1;
    if (this.diagnosis) return 1;
    return 0;
  }

  loadIncidentInstantly(id: string): void {
    forkJoin({
      inc: this.incidentService.getIncident(id).pipe(catchError(() => of(undefined))),
      cands: this.incidentService.getCandidates(id).pipe(catchError(() => of({ incident_id: id, candidates: [] }))),
    }).subscribe({
      next: ({ inc, cands }) => {
        if (inc) {
          this.incident = inc;
        } else {
          this.incident = {
            id: id,
            cluster_id: 'sentinelops-realtest',
            title: 'Cluster Incident ' + id,
            status: 'active',
            severity: 'critical',
            detected_at: new Date().toISOString(),
          };
        }

        if (cands && cands.candidates && cands.candidates.length > 0) {
          this.candidates = cands.candidates;
          const selected = this.candidates.find(c => c.is_selected);
          this.selectedCandidate = selected || this.candidates[0];
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.cd.detectChanges();
      }
    });
  }

  runDiagnosis(): void {
    if (!this.incident) return;
    this.isDiagnosing = true;
    this.diagnosisError = '';
    this.cd.detectChanges();

    this.incidentService.diagnoseIncident(this.incident.id).subscribe({
      next: (diag: Diagnosis) => {
        this.diagnosis = diag;
        this.isDiagnosing = false;
        this.cd.detectChanges();
        this.getRecommendation();
      },
      error: (err: any) => {
        this.isDiagnosing = false;
        this.diagnosisError = 'Diagnosis failed: The target pod may no longer exist in the cluster, or LLM service timed out.';
        this.cd.detectChanges();
      },
    });
  }

  getRecommendation(): void {
    if (!this.incident) return;
    this.isRecommending = true;
    this.cd.detectChanges();

    this.incidentService.recommendAction(this.incident.id).subscribe({
      next: (rec: Recommendation) => {
        this.recommendation = rec;
        this.isRecommending = false;
        if (rec.candidates && rec.candidates.length > 0) {
          this.candidates = rec.candidates;
          const selected = this.candidates.find(c => c.is_selected);
          this.selectedCandidate = selected || this.candidates[0];
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.isRecommending = false;
        this.cd.detectChanges();
      },
    });
  }

  chooseCandidate(cand: CandidateRecommendation): void {
    if (!this.incident) return;
    this.isSelectingCandidate = true;
    this.selectedCandidate = cand;
    this.incidentService.selectCandidate(cand.id).subscribe({
      next: (rec: Recommendation) => {
        this.recommendation = rec;
        this.candidates.forEach(c => c.is_selected = (c.id === cand.id));
        this.isSelectingCandidate = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isSelectingCandidate = false;
        this.cd.detectChanges();
      },
    });
  }

  approveAction(): void {
    if (!this.recommendation) {
      this.isApproved = true;
      return;
    }
    this.incidentService.decideRecommendation(this.recommendation.id, 'approved').subscribe({
      next: () => {
        this.isApproved = true;
        this.cd.detectChanges();
      },
      error: () => {
        this.isApproved = true;
        this.cd.detectChanges();
      }
    });
  }

  rejectAction(): void {
    if (this.recommendation) {
      this.incidentService.decideRecommendation(this.recommendation.id, 'rejected').subscribe({
        next: () => {
          this.selectedCandidate = null;
          this.isApproved = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.selectedCandidate = null;
          this.isApproved = false;
          this.cd.detectChanges();
        }
      });
    } else {
      this.selectedCandidate = null;
      this.isApproved = false;
      this.cd.detectChanges();
    }
  }

  executeAction(): void {
    if (!this.incident) return;
    this.isExecuting = true;
    this.cd.detectChanges();

    const recId = this.recommendation?.id || (this.selectedCandidate?.id || this.incident.id);
    this.incidentService.executeRecommendation(recId).subscribe({
      next: () => {
        this.isExecuting = false;
        this.isExecuted = true;
        this.isVerifiedHealthy = true;
        if (this.incident) {
          this.incident.status = 'resolved';
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.isExecuting = false;
        this.isExecuted = true;
        this.isVerifiedHealthy = false;
        this.cd.detectChanges();
      },
    });
  }

  markAsManuallyResolved(): void {
    this.isExecuted = true;
    this.isVerifiedHealthy = true;
    if (this.incident) {
      this.incident.status = 'resolved';
    }
    this.cd.detectChanges();
  }

  isIngressIncident(): boolean {
    return !!(this.incident?.title?.toLowerCase().includes('ingress') || this.selectedCandidate?.action_type === 'create_ingress');
  }

  onIngressSaved(): void {
    this.showIngressEditor = false;
    this.isExecuted = true;
    this.isVerifiedHealthy = true;
    this.cd.detectChanges();
  }

  generatePostmortem(): void {
    if (this.incident) {
      this.incidentService.generatePostmortem(this.incident.id).subscribe({
        next: () => {
          this.router.navigate(['/post-mortems']);
        },
        error: () => {
          this.router.navigate(['/post-mortems']);
        }
      });
    } else {
      this.router.navigate(['/post-mortems']);
    }
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }
}