import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../../models/livraison';
import { LivraisonService } from '../../../core/services/livraison.service';

@Component({
  selector: 'app-mes-livraisons',
  standalone: false,
  templateUrl: './mes-livraisons.component.html',
  styleUrl: './mes-livraisons.component.css'
})

export class MesLivraisonsComponent implements OnInit {
  livraisons: Livraison[] = [];

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    this.chargerLivraisons();
  }

  chargerLivraisons(): void {
    this.livraisonService.getMesLivraisons().subscribe({
      next: (data) => {
        console.log('Livraisons récupérées:', data);
        this.livraisons = data;
        console.log(this.livraisons);

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des livraisons:', err);
      }
    });
  }

  changerStatut(id: number, nouveauStatut: string) {
    if (confirm(`Voulez-vous vraiment changer le statut en "${nouveauStatut}" ?`)) {
      this.livraisonService.updateStatus(id, nouveauStatut).subscribe({
        next: (res) => {
          console.log('Réponse de l\'API :', res);
          alert(res?.message || 'Statut mis à jour avec succès ✅');
          this.chargerLivraisons(); // Recharge la liste après modif
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
          alert('Erreur lors de la mise à jour ❌');
        }
      });
    }
  }


  isEncours(Statut: string | undefined): boolean {
    console.log('Statut brut reçu:', JSON.stringify(Statut));
    return true; // forcer le bouton à s'afficher pour toutes les lignes


  }


}
