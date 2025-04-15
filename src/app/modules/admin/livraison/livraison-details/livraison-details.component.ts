import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LivraisonService } from '../../../../core/services/livraison.service';

@Component({
  selector: 'app-livraison-details',
  standalone: false,
  templateUrl: './livraison-details.component.html',
  styleUrl: './livraison-details.component.css'
})
export class LivraisonDetailsComponent {
  livraison: any;
  constructor(
    private route: ActivatedRoute,
    private livraisonService: LivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('❌ Aucun ID trouvé dans l’URL');
      return;
    }

    const id = +idParam;

    this.livraisonService.getLivraisonById(id).subscribe(
      data => {
        this.livraison = data;
      },
      error => {
        console.error('Erreur lors du chargement de la livraison', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']); // 🔁 Redirection ici si token invalide
        }
      }
    );
  }


}
