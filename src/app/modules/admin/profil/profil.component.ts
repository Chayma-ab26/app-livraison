import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.GetProfile();
  }

  GetProfile(): void {
    const token = localStorage.getItem('token'); // Récupérer le token

    if (!token) {
      console.error("Token introuvable, redirection vers login...");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User>('https://localhost:7009/api/User/profile', { headers })
      .subscribe(
        (data) => {
          console.log('Données du profil:', data);
          this.user = data;
        },
        (error) => {
          console.error('Erreur lors du chargement du profil', error);
          if (error.status === 401) {
            console.warn('Utilisateur non authentifié, redirection vers login');
            window.location.href = '/login'; // Rediriger si non authentifié
          }
        }
      );
}
}

