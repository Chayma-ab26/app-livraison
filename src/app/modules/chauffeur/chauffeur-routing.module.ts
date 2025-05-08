import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardChauffeurComponent } from './dashboard-chauffeur/dashboard-chauffeur.component';
import { ProfilComponent } from './profil/profil.component';
import { authGuard } from '../../guards/auth.guard';
import { MesLivraisonsComponent } from './mes-livraisons/mes-livraisons.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  { path: '', component: DashboardChauffeurComponent , canActivate: [authGuard]},

  { path: 'chauffeur/profil/profil', component: ProfilComponent, canActivate: [authGuard] },
  { path: 'chauffeur/mes-livraisons/mes-livraisons', component: MesLivraisonsComponent, canActivate: [authGuard] },
  { path: 'chauffeur/chatbot/chatbot', component: ChatbotComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChauffeurRoutingModule { }
