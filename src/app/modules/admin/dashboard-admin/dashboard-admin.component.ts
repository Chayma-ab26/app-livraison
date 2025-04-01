import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  nbChauffeurs: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Appel à l'API pour récupérer le nombre de chauffeurs
    this.userService.getNombreChauffeurs().subscribe(
      data => this.nbChauffeurs = data.total,
      error => console.error('Erreur lors de la récupération du nombre de chauffeurs', error)
    );
  }
}
