import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentasGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad() {
    return this.canActivate();
  }
  canActivate() {
    if (!this.auth.loggedIn() || this.auth.getTtype() === 'low') {
      this.router.navigate(['/login']);
    }
    let guard = this.auth.loggedIn();
    if (this.auth.getTtype() === 'low') {
      guard = false;
    }
    return guard;
  }

}
