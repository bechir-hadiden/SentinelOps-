// src/app/pages/incident-detail/components/incident-timeline.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimelineStepComponent } from './timeline-step.component';
import { AiReasoningPanelComponent } from './ai-reasoning-panel.component';
import { ActionApprovalCardComponent } from './action-approval-card.component';
import {
  AiDiagnosisStep,
  ActionProposalStep,
  TimelineStep,
} from '../../../models/incident.model';
import { injectActionDecisionMutation } from '../../../queries/incident-actions.mutations';

@Component({
  selector: 'app-incident-timeline',
  standalone: true,
  imports: [TimelineStepComponent, AiReasoningPanelComponent, ActionApprovalCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col">
      @for (step of steps(); track step.id; let last = $last) {
        <app-timeline-step [step]="step" [isLast]="last">
          @if (step.kind === 'ai_diagnosis') {
            <app-ai-reasoning-panel [step]="asAiDiagnosis(step)" />
          }
          @if (step.kind === 'action_proposal') {
            <app-action-approval-card
              [step]="asActionProposal(step)"
              [isSubmitting]="decisionMutation.isPending()"
              (approve)="onDecision(step.id, 'approved')"
              (reject)="onDecision(step.id, 'rejected')"
            />
          }
        </app-timeline-step>
      }
    </div>
  `,
})
export class IncidentTimelineComponent {
  readonly incidentId = input.required<string>();
  readonly steps = input<TimelineStep[]>([]);

  protected readonly decisionMutation = injectActionDecisionMutation();

  protected asAiDiagnosis(step: TimelineStep): AiDiagnosisStep {
    return step as AiDiagnosisStep;
  }

  protected asActionProposal(step: TimelineStep): ActionProposalStep {
    return step as ActionProposalStep;
  }

  protected onDecision(stepId: string, decision: 'approved' | 'rejected'): void {
    this.decisionMutation.mutate({
      incidentId: this.incidentId(),
      stepId,
      decision,
    });
  }
}
