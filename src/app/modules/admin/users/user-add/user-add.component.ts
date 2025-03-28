import { UserService } from './../../../../core/services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-add',
  standalone:false,
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  user: any = {
    nom: '',
    email: '',
    motDePasse: '',
    role: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Si vous avez des logiques de récupération de données à faire ici, ajoutez-les.
  }

  // Méthode pour valider les données avant d'envoyer la requête
  validateUser(): boolean {
    if (!this.user.nom || !this.user.email || !this.user.motDePasse || !this.user.role) {
      this.errorMessage = 'Tous les champs doivent être remplis.';
      return false;
    }

    // Validation basique de l'email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.user.email)) {
      this.errorMessage = 'Email invalide.';
      return false;
    }

    // Si tout est bon, on retourne true
    this.errorMessage = ''; // Réinitialiser le message d'erreur
    return true;
  }

  // Méthode pour envoyer les données de l'utilisateur
  addUser() {
    // Si la validation échoue, ne pas envoyer la requête
    if (!this.validateUser()) {
      return;
    }

    // On prépare l'objet à envoyer sans l'ID
    const userToSend = { ...this.user };
    delete userToSend.id; // Assurez-vous que l'ID est supprimé avant l'envoi

    // Envoi de la requête POST pour ajouter un utilisateur
    this.userService.addUser(userToSend).subscribe({
      next: (response) => {
        this.successMessage = 'Utilisateur ajouté avec succès!';
        this.router.navigate(['/admin/users/user-list']); // Redirection après ajout
      },

      error: (err) => {
        console.error('❌ Erreur lors de l’ajout :', err);

        // Gérer les erreurs spécifiques du backend
        if (err.status === 400) {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            // Erreurs de validation détaillées
            this.errorMessage = 'Des erreurs de validation sont survenues :\n';
            for (const [field, messages] of Object.entries(err.error.errors)) {
              if (Array.isArray(messages)) {
                this.errorMessage += `${field}: ${messages.join(', ')}\n`;
              } else {
                this.errorMessage += `${field}: ${messages}\n`;
              }
            }
          }
        } else {
          // Erreur générale
          this.errorMessage = 'Une erreur est survenue lors de l’ajout de l’utilisateur.';
        }
      }
    });
  }
}
