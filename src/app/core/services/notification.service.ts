import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../../models/notification'; // adapte si chemin différent

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'https://localhost:7009/api/Notification'; // base de l'URL

  constructor(private http: HttpClient) {}

  getNotificationsByChauffeurId(chauffeurId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/chauffeur/${chauffeurId}`);
  }
}
