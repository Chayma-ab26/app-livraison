import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7009/api/user';

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

  // 🔹 Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 🔹 Ajouter un utilisateur
  addUser(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`  // Assurez-vous que le token est stocké
      })
    });
  }

  // 🔹 Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`  // 🔥 Ajout du token
      })
    });
  }


  // 🔹 Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 🔹 Supprimer un utilisateur par ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour récupérer le nombre de chauffeurs
  getNombreChauffeurs(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/count-chauffeurs`);
  }

}
