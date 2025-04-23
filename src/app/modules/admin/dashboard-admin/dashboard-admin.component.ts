import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { LivraisonService } from '../../../core/services/livraison.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  nbChauffeurs: number = 0;
  totalCourses: number = 0;
  totalRevenus: number = 0;
  nbFacturesPayees: number = 0;
  nbFacturesImpayees: number = 0;

  constructor(
    private userService: UserService,
    private livraisonService: LivraisonService // Service pour obtenir les autres stats
  ) {}

  ngOnInit(): void {
    // Appel API pour récupérer le nombre de chauffeurs
    this.userService.getNombreChauffeurs().subscribe(
      data => this.nbChauffeurs = data.total,
      error => console.error('Erreur lors de la récupération du nombre de chauffeurs', error)
    );

   /* // Appel API pour récupérer les autres statistiques
    this.livraisonService.getCoursesStats().subscribe(
      data => this.totalCourses = data.total,
      error => console.error('Erreur lors de la récupération du nombre de courses', error)
    );

    this.statService.getRevenusStats().subscribe(
      data => this.totalRevenus = data.total,
      error => console.error('Erreur lors de la récupération des revenus', error)
    );

    this.statService.getFacturesStats().subscribe(
      data => {
        this.nbFacturesPayees = data.payees;
        this.nbFacturesImpayees = data.impayees;
      },
      error => console.error('Erreur lors de la récupération des factures', error)
    );
  }*/
}
}
