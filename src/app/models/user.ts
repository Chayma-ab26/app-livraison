export interface User {
  id: number | null;
  nom: string;
  email: string;
  motDePasse: string;
  role: string;
  localisation?: string;  // Optional, si applicable
}
