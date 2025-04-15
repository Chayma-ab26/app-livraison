import { UserService } from './../../../../core/services/user.service';
import { Livraison } from './../../../../models/livraison';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LivraisonService } from '../../../../core/services/livraison.service';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-list-livraison',
  standalone:false,
  templateUrl: './list-livraison.component.html',
  styleUrls: ['./list-livraison.component.css']
})
export class ListLivraisonComponent implements OnInit {
  livraisons: any[] = [];
  chauffeurs: User[] = [];

  constructor(private livraisonService: LivraisonService,
             private userservice: UserService,
             private router: Router

  ) { }

  ngOnInit(): void {
    this.getLivraisons();
    this.getChauffeurs();
  }

  getLivraisons(): void {
    this.livraisonService.getLivraisons().subscribe(
      (data: Livraison[]) => {
        this.livraisons = data.map((l: Livraison) => ({
          ...l,
          selectedChauffeurId: l.chauffeur?.id
        }));
      },
      error => console.error('Erreur lors de la récupération des livraisons', error)
    );
  }

  getChauffeurs(): void {
    this.userservice.getChauffeurs().subscribe(
      data => this.chauffeurs = data,
      error => console.error('Erreur lors de la récupération des chauffeurs', error)
    );
  }

  assignChauffeur(livraisonId: number, chauffeurId: number): void {
    this.livraisonService.assignChauffeur(livraisonId, chauffeurId).subscribe(
      () => {
        alert('Chauffeur réassigné avec succès');
        this.getLivraisons(); // actualise la liste
      },
      error => console.error('Erreur lors de la réassignation du chauffeur', error)
    );
  }
  deleteLivraison(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
      this.livraisonService.deleteLivraison(id).subscribe(
        () => {
          alert('Livraison supprimée avec succès');
          this.getLivraisons(); // Refresh
        },
        error => {
          console.error('Erreur lors de la suppression de la livraison', error);
          alert("Erreur lors de la suppression.");
        }
      );
    }
  }
  voirDetails(id: number) {
    this.router.navigate(['/admin/livraison/livraison-details', id]);
  }

}
