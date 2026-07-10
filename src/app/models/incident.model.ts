// src/app/models/incident.model.ts

export type IncidentSeverity = 'critical' | 'warning' | 'info';

export type IncidentStatus =
  | 'detected'
  | 'correlating'
  | 'diagnosing'
  | 'awaiting_approval'
  | 'resolving'
  | 'resolved';

export interface Incident {
  id: string;
  title: string;
  cluster: string;
  namespace: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: string; // ISO timestamp
  resolvedAt: string | null;
  mttrSeconds: number | null;
  aiConfidence: number | null; // 0-100
  autoApproved: boolean;
}

export interface DashboardMetrics {
  avgMttrSeconds: number;
  incidentsResolved: number;
  avgAiConfidence: number; // 0-100
  autoApprovedActionsPct: number; // 0-100
}

export type TimelineStepKind =
  | 'detection'
  | 'correlation'
  | 'ai_diagnosis'
  | 'action_proposal'
  | 'resolution'
  | 'post_mortem';

export type TimelineStepStatus = 'completed' | 'active' | 'pending';

export interface TimelineStepBase {
  id: string;
  kind: TimelineStepKind;
  status: TimelineStepStatus;
  timestamp: string | null; // ISO, null if not yet reached
  title: string;
  summary: string;
}

export interface AiDiagnosisStep extends TimelineStepBase {
  kind: 'ai_diagnosis';
  confidence: number; // 0-100
  rootCause: string;
  reasoningSteps: string[];
  evidenceRefs: string[]; // log/trace/metric IDs referenced by the agent
}

export interface ActionProposalStep extends TimelineStepBase {
  kind: 'action_proposal';
  actionLabel: string;
  actionCommand: string; // e.g. kubectl command or remediation script
  riskLevel: 'low' | 'medium' | 'high';
  decision: 'pending' | 'approved' | 'rejected';
  decidedBy: string | null;
}

export type TimelineStep =
  | TimelineStepBase
  | AiDiagnosisStep
  | ActionProposalStep;

export interface IncidentDetail extends Incident {
  timeline: TimelineStep[];
  postMortemUrl: string | null;
}

export interface ActionDecisionPayload {
  incidentId: string;
  stepId: string;
  decision: 'approved' | 'rejected';
}
