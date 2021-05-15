import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandingGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad() {
    return this.canActivate();
  }
  canActivate() {
    if (this.auth.loggedIn()) {
      this.router.navigate(['/inventario']);
    }
    return !this.auth.loggedIn();
  }

}
