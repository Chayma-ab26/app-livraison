import { authGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule), canActivate: [authGuard] }, // ✅ Protéger Admin
  { path: 'chauffeur', loadChildren: () => import('./modules/chauffeur/chauffeur.module').then(m => m.ChauffeurModule), canActivate: [authGuard] }, // ✅ Protéger Chauffeur
  { path: '**', redirectTo: '/auth/login' }
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
