import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Livraison } from '../../../models/livraison';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../models/notification';import { LivraisonService } from '../../../core/services/livraison.service';
{}
@Component({
  selector: 'app-dashboard-chauffeur',
  templateUrl: './dashboard-chauffeur.component.html',
  styleUrls: ['./dashboard-chauffeur.component.css'],
  standalone:false
})
export class DashboardChauffeurComponent implements OnInit {
  user: User | null = null;
  livraisons: Livraison[] = [];
  notifications: Notification[] = [];
  enCours: number = 0;
  livre: number = 0;
  rejete: number = 0;
  unreadCount: number = 0;
  loadingNotifications = false;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,private livraisonservice :LivraisonService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getLivraisons();
    this.getNotifications();

  }


 getNotifications(): void {
  this.loadingNotifications = true;

  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<User>('https://localhost:7009/api/User/profile', { headers }).subscribe({
    next: (user) => {
      this.user = user;
      const chauffeurId = user.id;

     this.notificationService.getNotificationsByChauffeurId(chauffeurId!).subscribe({
  next: (data) => {
    this.notifications = data;
    this.unreadCount = data.length;
    this.loadingNotifications = false;
  },
  error: (error) => {
    console.error('Erreur lors du chargement des notifications :', error);
    this.loadingNotifications = false;
  }
});

    },
    error: (err) => {
      console.error('Erreur lors de la récupération du profil pour les notifications :', err);
      this.loadingNotifications = false;
    }
  });
}


  getProfile(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<User>('https://localhost:7009/api/User/profile', { headers }).subscribe({
      next: (user) => this.user = user,
      error: (err) => {
        console.error('Erreur profil:', err);
        if (err.status === 401) window.location.href = '/login';
      }
    });
  }

  getLivraisons(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<Livraison[]>('https://localhost:7009/api/Livraison/mes-livraisons', { headers }).subscribe({
      next: (livraisons) => {
        this.livraisons = livraisons;
        this.calculateStats();
      },
      error: (err) => console.error('Erreur livraisons:', err)
    });
  }

  calculateStats(): void {
    this.enCours = this.livraisons.filter(l => l.statut === 'Encours').length;
    this.livre = this.livraisons.filter(l => l.statut === 'Livrée').length;
    this.rejete = this.livraisons.filter(l => l.statut === 'Annulée').length;
  }



}
