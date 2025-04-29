import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Facture, FactureService } from '../../../../core/services/facture.service';
import { Router } from '@angular/router';
import { Livraison } from '../../../../models/livraison';
import { LivraisonService } from '../../../../core/services/livraison.service';

@Component({
  selector: 'app-add-facture',
  standalone: false,
  templateUrl: './add-facture.component.html',
  styleUrl: './add-facture.component.css'
})
export class AddFactureComponent implements OnInit {
  factureForm!: FormGroup;
  livraisons: Livraison[] = [];

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private factureService: FactureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.factureForm = this.fb.group({
      livraisonId: ['', Validators.required],
      client: [''],
      adresseLivraison: [''],
      produit: [''],
      prixProduit: [0, [Validators.required, Validators.min(0)]],
      prixLivraison: [0, [Validators.required, Validators.min(0)]],
      prixTotal: [0],
      dateEmission: ['', Validators.required],
    });

    this.loadLivraisons();

    this.factureForm.get('livraisonId')?.valueChanges.subscribe(id => {
      const livraison = this.livraisons.find(l => l.id == id);
      if (livraison) {
        this.factureForm.patchValue({
          client: livraison.client,
          adresseLivraison: livraison.adresseLivraison,
          produit: livraison.produit,
        });
      }
    });

    this.factureForm.valueChanges.subscribe(values => {
      const total = (values.prixProduit || 0) + (values.prixLivraison || 0);
      this.factureForm.patchValue({ prixTotal: total }, { emitEvent: false });
    });
  }

  loadLivraisons() {
    this.livraisonService.getLivraisons().subscribe({
      next: (data) => (this.livraisons = data),
      error: (err) => console.error('Erreur chargement livraisons', err),
    });
  }

  onSubmit(): void {
    if (this.factureForm.invalid) return;

    const facture: Facture = this.factureForm.value;

    this.factureService.createFacture(facture).subscribe({
      next: () => this.router.navigate(['/admin/facture/list-facture']),
      error: (err) => console.error('Erreur création facture', err),
    });
  }
}
