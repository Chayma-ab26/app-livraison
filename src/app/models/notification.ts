// src/app/models/notification.ts

import { User } from './user';

export interface Notification {
  id: number;
  message: string;
  sentAt: Date;

  // Expéditeur (expediteurId et objet user complet facultatif selon l'API)
  expediteurId: number;
  expediteur?: User;

  // Chauffeur (destinataire)
  chauffeurId: number ;
  chauffeur?: User;
}
