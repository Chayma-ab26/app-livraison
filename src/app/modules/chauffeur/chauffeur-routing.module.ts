import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardChauffeurComponent } from './dashboard-chauffeur/dashboard-chauffeur.component';

const routes: Routes = [
  { path: '', component: DashboardChauffeurComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChauffeurRoutingModule { }
