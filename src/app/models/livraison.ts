import { Itineraire } from "./itineraire";
import { User } from "./user";

export interface Livraison {
  id: number;
  adresseLivraison: string;
  Statut: string;
  produit: string;
  client: string;
  chauffeurId: number;
  adminId: number;
  admin?: any;       // devient optionnel
  chauffeur?: any;   // devient optionnel
  itineraire?: any;  // devient optionnel
}

