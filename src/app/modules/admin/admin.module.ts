import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAddComponent } from './users/user-add/user-add.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfilComponent } from './profil/profil.component';
import { AddLivraisonComponent } from './livraison/add-livraison/add-livraison.component';
import { ListLivraisonComponent } from './livraison/list-livraison/list-livraison.component';
import { LivraisonDetailsComponent } from './livraison/livraison-details/livraison-details.component';
import { ListFactureComponent } from './facture/list-facture/list-facture.component';
import { AddFactureComponent } from './facture/add-facture/add-facture.component';


@NgModule({
  declarations: [
    DashboardAdminComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    NavbarComponent,
    ProfilComponent,
    AddLivraisonComponent,
    ListLivraisonComponent,
    LivraisonDetailsComponent,
    ListFactureComponent,
    AddFactureComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule


  ]
})
export class AdminModule { }
