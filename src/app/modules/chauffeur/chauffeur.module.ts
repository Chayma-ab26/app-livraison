import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChauffeurRoutingModule } from './chauffeur-routing.module';
import { DashboardChauffeurComponent } from './dashboard-chauffeur/dashboard-chauffeur.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    DashboardChauffeurComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    ChauffeurRoutingModule
  ]
})
export class ChauffeurModule { }
