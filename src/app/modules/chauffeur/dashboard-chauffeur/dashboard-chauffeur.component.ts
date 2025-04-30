import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Livraison } from '../../../models/livraison';
import { LivraisonService } from '../../../core/services/livraison.service';

@Component({
  selector: 'app-dashboard-chauffeur',
  standalone: false,
  templateUrl: './dashboard-chauffeur.component.html',
  styleUrl: './dashboard-chauffeur.component.css'
})
export class DashboardChauffeurComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;
  livraisons: Livraison[] = [];
l: any;
enCours: number = 0;
livre: number = 0;
rejete: number = 0;
  constructor(private http: HttpClient,private livraisonservive: LivraisonService) {}

  ngOnInit(): void {
    this.GetProfile();
    this.GetLivraisons();
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
GetLivraisons(): void {
  const token = localStorage.getItem('token'); // Récupérer le token

  if (!token) {
    console.error("Token introuvable, redirection vers login...");
    return;
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<any[]>('https://localhost:7009/api/Livraison', { headers })
    .subscribe(
      (data) => {
        console.log('Livraisons:', data);
        this.livraisons = data;
        this.calculateLivraisonStats();
      },
      (error) => {
        console.error('Erreur lors du chargement des livraisons', error);
      }
    );
}

// Méthode pour calculer les statistiques des livraisons
calculateLivraisonStats(): void {
  this.enCours = this.livraisons.filter(livraison => livraison.statut === 'Encours').length;
  this.livre = this.livraisons.filter(livraison => livraison.statut === 'Livrée').length;
  this.rejete = this.livraisons.filter(livraison => livraison.statut === 'Annulée').length;
}
}
