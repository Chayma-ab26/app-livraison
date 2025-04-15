import { Itineraire } from "./itineraire";
import { User } from "./user";

export interface Livraison {
  id: number;
  client: string;
  adresseLivraison: string;
  produit: string;
  statut: string;
  adminId: number;
  admin: User;
  chauffeurId: number;
  chauffeur: User;
  itineraire: Itineraire;
}
