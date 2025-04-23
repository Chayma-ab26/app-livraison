import { Component, OnInit } from '@angular/core';
import { Facture, FactureService } from '../../../../core/services/facture.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var bootstrap: any; // 👈 Import global de Bootstrap JS

@Component({
  selector: 'app-list-facture',
  standalone: false,
  templateUrl: './list-facture.component.html',
  styleUrl: './list-facture.component.css'
})
export class ListFactureComponent implements OnInit {

  factures: Facture[] = [];
  pdfUrl?: SafeResourceUrl;
  showPreview: boolean = false;
  selectedFactureId?: number;
  selectedFacture: any;

  constructor(
    private factureService: FactureService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getFactures();
  }

  getFactures(): void {
    this.factureService.getFactures().subscribe({
      next: (data) => {
        this.factures = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des factures', err);
      }
    });
  }

  openPreviewModal(facture: any) {
    this.selectedFacture = facture;

    const modalElement = document.getElementById('previewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // 👈 Utilise le Bootstrap JS natif
      modal.show();
    }
  }

  exportPDF(factureId: number): void {
    this.factureService.exportPdf(factureId).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Facture_${factureId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur lors de l\'exportation PDF', err);
      }
    });
  }

  deleteFacture(factureId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette facture ?')) {
      this.factureService.deleteFacture(factureId).subscribe({
        next: () => {
          this.factures = this.factures.filter(f => f.id !== factureId);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }
}
