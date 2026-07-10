import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import cytoscape from 'cytoscape';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-topology',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="flex flex-col h-[calc(100vh-100px)] space-y-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-primaryText font-display uppercase">Topologie Réseau</h1>
        <p class="text-sm text-secondaryText">Visualisation interactive des microservices et dépendances dans le cluster.</p>
      </div>

      <!-- Controls & Layout -->
      <div class="flex items-center justify-between border-b border-border pb-3 text-xs">
        <div class="flex gap-4">
          <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-success"></span> Sain</span>
          <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-warning"></span> Alerte</span>
          <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-critical"></span> Critique</span>
        </div>
        <button (click)="resetLayout()" class="rounded bg-surface3 px-3 py-1.5 text-secondaryText hover:bg-surface3/80 hover:text-primaryText">
          Réinitialiser le zoom
        </button>
      </div>

      <!-- Canvas -->
      <div class="flex-1 rounded-md border border-border bg-surface1 relative overflow-hidden">
        <div #cy class="absolute inset-0"></div>
      </div>
    </div>
  `,
})
export class TopologyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cy') cyEl!: ElementRef;
  private cyInstance?: cytoscape.Core;

  ngAfterViewInit() {
    this.initCytoscape();
  }

  ngOnDestroy() {
    if (this.cyInstance) {
      this.cyInstance.destroy();
    }
  }

  initCytoscape() {
    this.cyInstance = cytoscape({
      container: this.cyEl.nativeElement,
      elements: [
        // Nodes
        { data: { id: 'ingress', label: 'Ingress-Ingress', type: 'ingress', status: 'success' } },
        { data: { id: 'auth-svc', label: 'Auth-Service', type: 'service', status: 'critical' } },
        { data: { id: 'payment-svc', label: 'Payment-Service', type: 'service', status: 'success' } },
        { data: { id: 'auth-db', label: 'Auth-DB', type: 'db', status: 'success' } },
        { data: { id: 'payment-db', label: 'Payment-DB', type: 'db', status: 'success' } },
        { data: { id: 'auth-pod-1', label: 'auth-pod-1', type: 'pod', status: 'success' } },
        { data: { id: 'auth-pod-2', label: 'auth-pod-2', type: 'pod', status: 'critical' } },
        { data: { id: 'payment-pod-1', label: 'payment-pod-1', type: 'pod', status: 'success' } },

        // Edges
        { data: { source: 'ingress', target: 'auth-svc' } },
        { data: { source: 'ingress', target: 'payment-svc' } },
        { data: { source: 'auth-svc', target: 'auth-pod-1' } },
        { data: { source: 'auth-svc', target: 'auth-pod-2' } },
        { data: { source: 'payment-svc', target: 'payment-pod-1' } },
        { data: { source: 'auth-svc', target: 'auth-db' } },
        { data: { source: 'payment-svc', target: 'payment-db' } }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#1D2330',
            'border-width': '2px',
            'border-color': '#333D4C',
            'label': 'data(label)',
            'color': '#E8ECF1',
            'font-family': 'IBM Plex Sans',
            'font-size': '11px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 6,
            'width': '36px',
            'height': '36px',
            'shape': 'ellipse',
            'transition-property': 'background-color, border-color',
            'transition-duration': 0.3
          }
        },
        {
          selector: 'node[type="ingress"]',
          style: {
            'shape': 'hexagon',
            'width': '42px',
            'height': '42px',
            'background-color': '#12161D',
            'border-color': '#4FA8FF'
          }
        },
        {
          selector: 'node[status="success"]',
          style: {
            'border-color': '#34D399'
          }
        },
        {
          selector: 'node[status="critical"]',
          style: {
            'border-color': '#FF5C5C'
          }
        },
        {
          selector: 'node[type="db"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#12161D'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#232A35',
            'target-arrow-color': '#232A35',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 40
      }
    });
  }

  resetLayout() {
    if (this.cyInstance) {
      this.cyInstance.fit();
      this.cyInstance.layout({
        name: 'breadthfirst',
        directed: true,
        padding: 40
      }).run();
    }
  }
}
