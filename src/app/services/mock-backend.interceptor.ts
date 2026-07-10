import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IncidentDetail, DashboardMetrics } from '../models/incident.model';

// In-memory data store for stateful interactions
let mockMetrics: DashboardMetrics = {
  avgMttrSeconds: 485,
  incidentsResolved: 28,
  avgAiConfidence: 94,
  autoApprovedActionsPct: 85,
};

let mockIncidents: IncidentDetail[] = [
  {
    id: 'INC-1049',
    title: 'Taux élevé d\'erreurs HTTP 5xx sur auth-service',
    cluster: 'cluster-prod-eu',
    namespace: 'production',
    severity: 'critical',
    status: 'awaiting_approval',
    detectedAt: new Date(Date.now() - 12 * 60_000).toISOString(), // 12 minutes ago
    resolvedAt: null,
    mttrSeconds: null,
    aiConfidence: 96,
    autoApproved: false,
    postMortemUrl: null,
    timeline: [
      {
        id: 'step-1',
        kind: 'detection',
        status: 'completed',
        timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
        title: 'Alerte de crash de conteneur',
        summary: 'Le pod auth-pod-2 dans le namespace production s\'est arrêté brusquement (Exit Code 137, Out Of Memory).',
      },
      {
        id: 'step-2',
        kind: 'correlation',
        status: 'completed',
        timestamp: new Date(Date.now() - 11 * 60_000).toISOString(),
        title: 'Corrélation avec les erreurs HTTP 5xx',
        summary: 'Détection d\'un pic de requêtes en échec sur l\'Ingress Nginx pointant vers auth-service.',
      },
      {
        id: 'step-3',
        kind: 'ai_diagnosis',
        status: 'completed',
        timestamp: new Date(Date.now() - 10 * 60_000).toISOString(),
        title: 'Analyse et diagnostic IA',
        summary: 'L\'agent IA a identifié une fuite de mémoire liée aux sessions Redis sans TTL.',
        confidence: 96,
        rootCause: 'Fuite de mémoire dans la gestion de session Redis suite à la mise à jour v2.1.2.',
        reasoningSteps: [
          'Inspection des journaux de crash d\'OutOfMemory.',
          'Analyse des statistiques de clé Redis montrant une croissance exponentielle sans expiration.',
          'Identification de l\'absence du paramètre de configuration session.timeout dans les propriétés.',
        ],
        evidenceRefs: ['LOG-AUTH-2894', 'METRIC-REDIS-MEM'],
      } as any,
      {
        id: 'step-4',
        kind: 'action_proposal',
        status: 'active',
        timestamp: new Date(Date.now() - 9 * 60_000).toISOString(),
        title: 'Plan de remédiation proposé',
        summary: 'Ajouter une variable d\'environnement session.timeout=3600 au déploiement pour forcer l\'expiration des sessions Redis.',
        actionLabel: 'Injecter session.timeout variable',
        actionCommand: 'kubectl patch deployment auth-service -p \'{"spec":{"template":{"spec":{"containers":[{"name":"auth","env":[{"name":"SESSION_TIMEOUT","value":"3600"}]}]}}}}\'',
        riskLevel: 'low',
        decision: 'pending',
        decidedBy: null,
      } as any,
      {
        id: 'step-5',
        kind: 'resolution',
        status: 'pending',
        timestamp: null,
        title: 'Application du correctif',
        summary: 'Redéploiement progressif des pods et suivi de la stabilité de la mémoire.',
      },
    ],
  },
  {
    id: 'INC-1048',
    title: 'Augmentation de la latence Stripe',
    cluster: 'cluster-prod-eu',
    namespace: 'production',
    severity: 'warning',
    status: 'resolving',
    detectedAt: new Date(Date.now() - 30 * 60_000).toISOString(), // 30 minutes ago
    resolvedAt: null,
    mttrSeconds: null,
    aiConfidence: 85,
    autoApproved: false,
    postMortemUrl: null,
    timeline: [
      {
        id: 'step-1',
        kind: 'detection',
        status: 'completed',
        timestamp: new Date(Date.now() - 30 * 60_000).toISOString(),
        title: 'Latence de paiement élevée',
        summary: 'La latence moyenne sur /payment/checkout a dépassé 1200ms.',
      },
      {
        id: 'step-2',
        kind: 'ai_diagnosis',
        status: 'completed',
        timestamp: new Date(Date.now() - 28 * 60_000).toISOString(),
        title: 'Analyse et diagnostic IA',
        summary: 'L\'IA confirme que le goulet d\'étranglement provient de la passerelle externe Stripe API.',
        confidence: 85,
        rootCause: 'Latence du service tiers Stripe API de +950ms par rapport à la normale.',
        reasoningSteps: [
          'Vérification des métriques système internes montrant CPU/RAM stables.',
          'Analyse des logs HTTP out-of-bound vers api.stripe.com.',
        ],
        evidenceRefs: ['TRACE-PAY-90184', 'METRIC-STRIPE-LATENCY'],
      } as any,
      {
        id: 'step-3',
        kind: 'action_proposal',
        status: 'completed',
        timestamp: new Date(Date.now() - 25 * 60_000).toISOString(),
        title: 'Bascule de passerelle',
        summary: 'Activer temporairement le circuit-breaker pour basculer sur Adyen.',
        actionLabel: 'Activer le circuit-breaker Adyen',
        actionCommand: 'helm upgrade payment-gateway ./charts/payment-gateway --set provider=adyen',
        riskLevel: 'medium',
        decision: 'approved',
        decidedBy: 'Sarah Connors',
      } as any,
      {
        id: 'step-4',
        kind: 'resolution',
        status: 'active',
        timestamp: new Date(Date.now() - 24 * 60_000).toISOString(),
        title: 'Déploiement du backup en cours',
        summary: 'Le pod de paiement se réaligne sur Adyen.',
      },
    ],
  },
];

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const method = req.method;

  // 1. Dashboard Metrics
  if (url.endsWith('/metrics/dashboard') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: mockMetrics,
    })).pipe(delay(200));
  }

  // 2. Active incident (first non-resolved incident in our array)
  if (url.endsWith('/incidents/active') && method === 'GET') {
    const active = mockIncidents.find(i => i.status !== 'resolved') || null;
    return of(new HttpResponse({
      status: 200,
      body: active,
    })).pipe(delay(200));
  }

  // 3. Recent incidents list
  if (url.endsWith('/incidents') && method === 'GET') {
    const list = mockIncidents.map(i => ({
      id: i.id,
      title: i.title,
      cluster: i.cluster,
      namespace: i.namespace,
      severity: i.severity,
      status: i.status,
      detectedAt: i.detectedAt,
      resolvedAt: i.resolvedAt,
      mttrSeconds: i.mttrSeconds,
      aiConfidence: i.aiConfidence,
      autoApproved: i.autoApproved,
    }));
    return of(new HttpResponse({
      status: 200,
      body: list,
    })).pipe(delay(200));
  }

  // 4. Incident Detail by ID
  const detailMatch = url.match(/\/incidents\/([A-Z0-9-]+)$/);
  if (detailMatch && method === 'GET') {
    const id = detailMatch[1];
    const incident = mockIncidents.find(i => i.id === id);
    if (incident) {
      return of(new HttpResponse({
        status: 200,
        body: incident,
      })).pipe(delay(200));
    }
    return of(new HttpResponse({ status: 404, statusText: 'Not Found' }));
  }

  // 5. Submit action decision (Approve/Reject)
  const decisionMatch = url.match(/\/incidents\/([A-Z0-9-]+)\/steps\/([a-zA-Z0-9-]+)\/decision$/);
  if (decisionMatch && method === 'POST') {
    const incidentId = decisionMatch[1];
    const stepId = decisionMatch[2];
    const body = req.body as { decision: 'approved' | 'rejected' };

    const incident = mockIncidents.find(i => i.id === incidentId);
    if (incident) {
      const step = incident.timeline.find(s => s.id === stepId);
      if (step && step.kind === 'action_proposal') {
        const propStep = step as any;
        propStep.decision = body.decision;
        propStep.decidedBy = 'Opérateur Courant (Vous)';
        propStep.status = 'completed';

        if (body.decision === 'approved') {
          incident.status = 'resolving';
          
          const resStep = incident.timeline.find(s => s.kind === 'resolution');
          if (resStep) {
            resStep.status = 'active';
            resStep.timestamp = new Date().toISOString();
          }

          setTimeout(() => {
            incident.status = 'resolved';
            incident.resolvedAt = new Date().toISOString();
            incident.mttrSeconds = 720;
            if (resStep) {
              resStep.status = 'completed';
              resStep.summary = 'Le correctif de variable d\'environnement a été appliqué avec succès. Les redémarrages de pods ont cessé et la mémoire est stable.';
            }
            mockMetrics = {
              ...mockMetrics,
              incidentsResolved: mockMetrics.incidentsResolved + 1,
            };
          }, 5000);
        } else {
          incident.status = 'diagnosing';
        }

        return of(new HttpResponse({
          status: 200,
          body: incident,
        })).pipe(delay(500));
      }
    }
    return of(new HttpResponse({ status: 404, statusText: 'Not Found' }));
  }

  return next(req);
};
