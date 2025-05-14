import { Facture, FactureService } from './../../../core/services/facture.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { LivraisonService } from '../../../core/services/livraison.service';
import { Livraison } from '../../../models/livraison';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  livraisons: Livraison[] = [];
  l: any;
  enCours: number = 0;
  livre: number = 0;
  rejete: number = 0;
  factures: Facture[] = [];
  nbFactures: number = 0;
  f:any;
  totalPrixLivraison: number = 0;


  constructor(
    private userService: UserService,
    private livraisonService: LivraisonService ,
    private Http: HttpClient,
    private factureService: FactureService
  ) {}



  ngOnInit(): void {
    // Appel API pour récupérer le nombre de chauffeurs
    this.userService.getNombreChauffeurs().subscribe(
      data => this.nbChauffeurs = data.total,
      error => console.error('Erreur lors de la récupération du nombre de chauffeurs', error)
    );

    this.factureService.getNombrefacture().subscribe(
  data => {
    this.nbFactures = data.total;
  },
  error => {
    console.error('Erreur lors de la récupération du nombre de factures', error);
  }
);


    this.GetLivraisons();

    this.factureService.getFactures().subscribe(
  (factures) => {
    this.factures = factures;
    this.totalPrixLivraison = factures.reduce((sum, facture) => sum + facture.prixLivraison, 0);
  },
  (error) => {
    console.error('Erreur lors de la récupération des factures', error);
  }
);
this.factureService.getNombrefacture().subscribe(
  data => {
    console.log('Nombre de factures :', data);
    this.nbFactures = data.total;
  },
  error => {
    console.error('Erreur lors de la récupération du nombre de factures', error);
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

  this.Http.get<any[]>('https://localhost:7009/api/Livraison', { headers })
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


calculateLivraisonStats(): void {
  this.enCours = this.livraisons.filter(livraison => livraison.statut === 'Encours').length;
  this.livre = this.livraisons.filter(livraison => livraison.statut === 'Livrée').length;
  this.rejete = this.livraisons.filter(livraison => livraison.statut === 'Annulée').length;
}
get tauxLivraison(): number {
  const total = this.livre + this.rejete;
  return total > 0 ? (this.livre / total) * 100 : 0;
}

}
