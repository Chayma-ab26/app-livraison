import { LivraisonService } from './../../../../core/services/livraison.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../models/user';
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
    private userservice:UserService
  ) {
    this.livraisonForm = this.fb.group({
      Client: ['', Validators.required],
      AdresseLivraison: ['', Validators.required],
      Produit: ['', Validators.required],
      statut: this.fb.control({ value: 'Encours', disabled: true }), // affiché mais non modifiable
      ChauffeurId: ['', Validators.required]  // Assure-toi d'avoir la liste des chauffeurs dans l'interface
    });
    this.userservice.getChauffeurs().subscribe(data => {
      this.chauffeurs = data;
    });
  }

  ngOnInit(): void {
    this.getChauffeurs();

   }
   getChauffeurs() {
    this.userservice.getChauffeurs().subscribe({
      next: (data) => {
        this.chauffeurs = data;
      },
      error: (err) => {
        console.error("Erreur récupération des chauffeurs :", err);
      }
    });
  }
  onSubmit() {
    console.log('Form Valid: ', this.livraisonForm.valid);  // Log l'état du formulaire
    console.log('Form Errors: ', this.livraisonForm.errors);  // Log les erreurs

    if (this.livraisonForm.valid) {
      const formData = this.livraisonForm.getRawValue(); // Inclut les champs désactivés

      this.livraisonService.addLivraison(formData).subscribe({
        next: (res) => {
          alert('Livraison ajoutée avec succès');
          this.livraisonForm.reset();
          this.livraisonForm.patchValue({ statut: 'Encours' });
        },
        error: (err) => console.error(err)
      });
    } else {
      console.log("Le formulaire est invalide, veuillez vérifier les champs.");
    }
  }

}
