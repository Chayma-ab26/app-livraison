import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-edit',
  standalone:false,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User = { id: 0, nom: '', email: '', motDePasse: '', role: '' };
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (user) => (this.user = user),
        error: () => (this.errorMessage = 'Utilisateur introuvable')
      });
    }
  }

  updateUser(): void {
    console.log('Données envoyées:', this.user);
    if (this.user.id) {
      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: () => {
          console.log('Mise à jour réussie');
          this.router.navigate(['/admin/users/user-list']);
        },
        error: (error) => {
          console.error('Erreur API:', error);
          console.error('Détail de l\'erreur:', error.error); // 🔥 Voir le vrai message d'erreur du serveur
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
        }
      });
    }
  }

}
