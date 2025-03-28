import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('🔐 Tentative de login avec :', { Email: this.email, MotDePasse: this.password });

    this.authService.login({ Email: this.email, MotDePasse: this.password }).subscribe({
      next: (res) => {
        console.log('✅ Réponse reçue du backend :', res);

        if (res.token) {
          this.authService.saveToken(res.token);

          // Redirection selon le rôle
          if (res.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (res.role === 'chauffeur') {
            this.router.navigate(['/chauffeur']);
          } else {
            this.errorMessage = 'Rôle inconnu. Accès refusé.';
          }
        } else {
          this.errorMessage = 'Connexion échouée : Token manquant.';
        }
      },
      error: (err) => {
        console.error('❌ Erreur de connexion :', err);
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }




}
