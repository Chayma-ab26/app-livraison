import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Facture {
  id?: number;
  livraisonId?: number;
  client?: string;
  adresseLivraison?: string;
  produit?: string;
  prixProduit: number;
  prixLivraison: number;
  prixTotal: number;
  dateEmission: string | Date;
}

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = 'https://localhost:7009/api/Facture';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Aucun token trouvé');
      throw new Error('Authentification requise.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getFacture(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createFacture(facture: Facture): Observable<any> {
    return this.http.post(this.apiUrl, facture, {
      headers: this.getHeaders(),
    });
  }

  updateFacture(id: number, facture: Facture): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, facture, {
      headers: this.getHeaders(),
    });
  }
  /*exportPdf(id: number): Observable<Blob> {
    return this.http.get(`https://localhost:7009/api/factures/${id}/export`, {
      responseType: 'blob'
    });
  }*/

  deleteFacture(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  exportPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-pdf/${id}`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }
}
