import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChauffeurRoutingModule } from './chauffeur-routing.module';
import { DashboardChauffeurComponent } from './dashboard-chauffeur/dashboard-chauffeur.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfilComponent } from './profil/profil.component';


@NgModule({
  declarations: [
    DashboardChauffeurComponent,
    NavbarComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    ChauffeurRoutingModule,
    HttpClientModule
  ]
})
export class ChauffeurModule { }
