import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../models/user';


export interface Livraison {
  id: number;
  client:string ;
  adresseLivraison: string;
  produit: string;
  chauffeur:User
}
@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'https://localhost:7009/api/Livraison';

  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Récupérer le token JWT
    if (!token) {
      console.error('❌ Aucun token trouvé dans localStorage');
      throw new Error('Authentification requise.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Ajouter le token dans l'en-tête
    });
  }
    // Récupérer toutes les livraisons (admin et chauffeur)
    getLivraisons(): Observable<any> {
      const token = localStorage.getItem('token'); // Assumes the token is stored in local storage
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any>(this.apiUrl, { headers });
    }

    // Ajouter une nouvelle livraison (admin uniquement)
    addLivraison(livraison: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(this.apiUrl, livraison, { headers });
    }
    getChauffeurs(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/chauffeurs`);
    }
    assignChauffeur(livraisonId: number, chauffeurId: number): Observable<any> {
      const token = localStorage.getItem('token'); // ou sessionStorage selon ton app
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return this.http.put(`${this.apiUrl}/${livraisonId}/assign`, chauffeurId, { headers });
    }
    deleteLivraison(id: number): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
    getLivraisonById(id: number): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/${id}`, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur récupération livraison :', error);
          return throwError(() => error);
        })
      );
    }



}
