import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard · SentinelOps',
      },
      {
        path: 'topology',
        loadComponent: () =>
          import('./pages/topology/topology.component').then((m) => m.TopologyComponent),
        title: 'Topologie · SentinelOps',
      },
      {
        path: 'clusters',
        loadComponent: () =>
          import('./pages/clusters/clusters.component').then((m) => m.ClustersComponent),
        title: 'Clusters · SentinelOps',
      },
      {
        path: 'incidents',
        loadComponent: () =>
          import('./pages/incidents/incidents.component').then((m) => m.IncidentsComponent),
        title: 'Incidents actifs · SentinelOps',
      },
      {
        path: 'incidents/:id',
        loadComponent: () =>
          import('./pages/incident-detail/incident-detail.component').then(
            (m) => m.IncidentDetailComponent,
          ),
        title: 'Incident · SentinelOps',
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/alert-center/alert-center.component').then((m) => m.AlertCenterComponent),
        title: 'Alert Center · SentinelOps',
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/history/history.component').then((m) => m.HistoryComponent),
        title: 'Historique · SentinelOps',
      },
      {
        path: 'metrics',
        loadComponent: () =>
          import('./pages/metrics/metrics.component').then((m) => m.MetricsComponent),
        title: 'Metrics · SentinelOps',
      },
      {
        path: 'logs',
        loadComponent: () => import('./pages/logs/logs.component').then((m) => m.LogsComponent),
        title: 'Logs · SentinelOps',
      },
      {
        path: 'traces',
        loadComponent: () =>
          import('./pages/traces/traces.component').then((m) => m.TracesComponent),
        title: 'Traces · SentinelOps',
      },
      {
        path: 'ai-chat',
        loadComponent: () =>
          import('./pages/ai-chat/ai-chat.component').then((m) => m.AiChatComponent),
        title: 'AI Chat · SentinelOps',
      },
      {
        path: 'post-mortems',
        loadComponent: () =>
          import('./pages/post-mortems/post-mortems.component').then(
            (m) => m.PostMortemsComponent,
          ),
        title: 'Post-mortems · SentinelOps',
      },
      {
        path: 'ai-configuration',
        loadComponent: () =>
          import('./pages/ai-configuration/ai-configuration.component').then(
            (m) => m.AiConfigurationComponent,
          ),
        title: 'AI Configuration · SentinelOps',
      },
      {
        path: 'audit-logs',
        loadComponent: () =>
          import('./pages/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent),
        title: 'Audit logs · SentinelOps',
      },
      {
        path: 'integrations',
        loadComponent: () =>
          import('./pages/integrations/integrations.component').then(
            (m) => m.IntegrationsComponent,
          ),
        title: 'Intégrations · SentinelOps',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
        title: 'Paramètres · SentinelOps',
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
