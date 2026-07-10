// src/app/queries/incident-actions.mutations.ts
import { inject } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ActionDecisionPayload } from '../models/incident.model';
import { IncidentService } from '../services/incident.service';

/**
 * Mutation for approving/rejecting an AI-proposed remediation action.
 * On success, invalidates the affected incident detail (and the recent
 * incidents list, since status may have changed) so the UI refreshes.
 */
export function injectActionDecisionMutation() {
  const incidentService = inject(IncidentService);
  const queryClient = injectQueryClient();

  return injectMutation(() => ({
    mutationFn: (payload: ActionDecisionPayload) =>
      firstValueFrom(incidentService.submitActionDecision(payload)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['incidents', 'detail', variables.incidentId],
      });
      queryClient.invalidateQueries({ queryKey: ['incidents', 'recent'] });
      queryClient.invalidateQueries({ queryKey: ['incidents', 'active'] });
    },
  }));
}
