import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; // L'utilisateur est authentifié, on l'autorise à accéder à la page
    } else {
      this.router.navigate(['/auth/login']); // Redirige vers la page de connexion
      return false;
    }
  }
}
