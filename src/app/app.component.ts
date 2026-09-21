import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WarmupService } from './services/warmup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'SentinelOps';

  constructor(private warmup: WarmupService) {}

  ngOnInit(): void {
    // Pré-chauffe toutes les connexions WSL relay au démarrage
    // Élimine le cold-start de ~2s sur la première requête de chaque service
    this.warmup.warmup();
  }
}