import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);

  protected email = '';
  protected password = '';

  protected readonly isLoading = signal(false);
  protected readonly errorMsg = signal<string | null>(null);

  protected onSubmit(): void {
    this.errorMsg.set(null);
    this.isLoading.set(true);

    const email = this.email.trim();
    const password = this.password.trim();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.tokenStorage.saveToken(response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMsg.set('Email ou mot de passe incorrect.');
        } else if (err.status === 0) {
          this.errorMsg.set('Impossible de joindre le serveur. Vérifiez que le backend Go est démarré sur le port 3001.');
        } else {
          this.errorMsg.set(`Erreur serveur (${err.status}). Réessayez.`);
        }
      },
    });
  }
}