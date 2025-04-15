
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7009/api/auth/login';

  constructor(private https: HttpClient) {}

  login(credentials: { Email: string, MotDePasse: string }): Observable<any> {
    return this.https.post<any>('https://localhost:7009/api/auth/login', credentials);
  }


  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');

  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }


 // ✅ Ajout de getUserId() pour récupérer l'ID de l'utilisateur depuis le token JWT
 getUserIdFromToken(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.log('🔍 Token décodé:', decoded);
    return decoded.nameid ? parseInt(decoded.nameid) : null; // ← ADAPTE selon ton token
  } catch (error) {
    console.error('Erreur de décodage du token', error);
    return null;
  }
}
}
