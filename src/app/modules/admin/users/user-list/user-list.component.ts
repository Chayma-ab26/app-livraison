import { HttpClient } from '@angular/common/http';
import { UserService } from './../../../../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = []; // Liste complète des utilisateurs
  admins: User[] = []; // Liste des administrateurs
  chauffeurs: User[] = []; // Liste des chauffeurs
  errorMessage: string = ''; // Message d'erreur

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.errorMessage = ''; // Réinitialiser l'erreur si la récupération réussit
        this.filterUsersByRole();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des utilisateurs :', err);
        this.errorMessage = 'Impossible de charger la liste des utilisateurs.';
      }
    });
  }

  filterUsersByRole(): void {
    // Filtrer les utilisateurs par rôle admin et chauffeur
    this.admins = this.users.filter(user => user.role === 'Admin');
    this.chauffeurs = this.users.filter(user => user.role === 'chauffeur');
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => {
        // Mise à jour locale sans recharger les utilisateurs depuis le serveur
        this.users = this.users.filter(user => user.id !== id);
        this.filterUsersByRole(); // Re-filtrer après suppression
      });
    }
  }

  editUser(id: number): void {
    this.router.navigate(['/admin/users/user-edit', id]);
  }

  navigateToAddUser(): void {
    this.router.navigate(['/admin/users/user-add']); // Utiliser une route absolue
  }
}
