import { LivraisonService } from './../../../../core/services/livraison.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-livraison',
  standalone: false,
  templateUrl: './add-livraison.component.html'
})
export class AddLivraisonComponent implements OnInit {
  livraisonForm: FormGroup;
  chauffeurs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private router: Router,
    private userservice: UserService
  ) {
    // Création du formulaire
    this.livraisonForm = this.fb.group({
      Client: ['', Validators.required],
      AdresseLivraison: ['', Validators.required],
      Produit: ['', Validators.required],
      Statut: this.fb.control({ value: 'Encours', disabled: true }), // <-- ici avec un grand S
      ChauffeurId: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.getChauffeurs();  // Récupère la liste des chauffeurs
  }

  getChauffeurs() {
    this.userservice.getChauffeurs().subscribe({
      next: (data) => {
        this.chauffeurs = data;  // Assigner les chauffeurs à la variable
      },
      error: (err) => {
        console.error("Erreur récupération des chauffeurs :", err);
      }
    });
  }

  onSubmit() {
  console.log('Form Valid: ', this.livraisonForm.valid);
  console.log('Form Data: ', this.livraisonForm.getRawValue());

  if (this.livraisonForm.valid) {
    const formData = this.livraisonForm.getRawValue();
    formData.ChauffeurId = Number(formData.ChauffeurId); // 🚀 Ajout de la conversion ici

    this.livraisonService.addLivraison(formData).subscribe({
      next: (res) => {
        alert('Livraison ajoutée avec succès');
        this.router.navigate(['/admin/livraison/list-livraison']); // 🔥 Redirection ici

      },
      error: (err) => console.error('Erreur lors de l\'ajout de la livraison:', err)
    });
  } else {
    console.log("Le formulaire est invalide, veuillez vérifier les champs.");
  }
}

}
