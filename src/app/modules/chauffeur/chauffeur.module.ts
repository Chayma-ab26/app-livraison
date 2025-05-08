import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChauffeurRoutingModule } from './chauffeur-routing.module';
import { DashboardChauffeurComponent } from './dashboard-chauffeur/dashboard-chauffeur.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfilComponent } from './profil/profil.component';
import { MesLivraisonsComponent } from './mes-livraisons/mes-livraisons.component';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot/chatbot.component';


@NgModule({
  declarations: [
    DashboardChauffeurComponent,
    NavbarComponent,
    ProfilComponent,
    MesLivraisonsComponent,
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    ChauffeurRoutingModule,
    HttpClientModule,
    FormsModule
  ]
})
export class ChauffeurModule { }
