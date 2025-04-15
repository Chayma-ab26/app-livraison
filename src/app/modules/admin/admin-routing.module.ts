import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { authGuard } from '../../guards/auth.guard';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { ProfilComponent } from './profil/profil.component';
import { ListLivraisonComponent } from './livraison/list-livraison/list-livraison.component';
import { AddLivraisonComponent } from './livraison/add-livraison/add-livraison.component';
import { LivraisonDetailsComponent } from './livraison/livraison-details/livraison-details.component';

const routes: Routes = [
  { path: '', component: DashboardAdminComponent, canActivate: [authGuard] },

  // Routes protégées pour l'admin
  {
    path: 'admin',
    canActivate: [authGuard], // Active la protection pour toutes les routes enfants
    children: [
      { path: 'users/user-list', component: UserListComponent },  // Liste des utilisateurs
      { path: 'users/user-add', component: UserAddComponent }, // Ajout utilisateur
      { path: 'users/user-edit/:id', component: UserEditComponent }, // Édition utilisateur
      { path: 'profil/profil', component: ProfilComponent},
      { path: 'livraison/list-livraison', component: ListLivraisonComponent},
      { path: 'livraison/add-livraison', component: AddLivraisonComponent},
      { path: 'livraison-details/:id', component: LivraisonDetailsComponent}


    ]
  },

  // Routes utilisateurs
  { path: 'users/user-list', component: UserListComponent, canActivate: [authGuard] },
  { path: 'users/user-edit/:id', component: UserEditComponent, canActivate: [authGuard] },
  { path: 'users/user-add', component: UserAddComponent, canActivate: [authGuard] },
  { path: 'profil/profil', component: ProfilComponent, canActivate: [authGuard] },

  //routes livraison
  { path: 'livraison/list-livraison', component: ListLivraisonComponent, canActivate: [authGuard] },
  { path: 'livraison/add-livraison', component: AddLivraisonComponent, canActivate: [authGuard] },
  { path: 'livraison/livraison-details/:id', component: LivraisonDetailsComponent, canActivate: [authGuard] },

  // Redirection pour les routes inconnues
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
