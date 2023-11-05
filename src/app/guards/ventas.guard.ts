import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class VentasGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canLoad() {
    return this.canActivate();
  }
  canActivate() {
    return this.auth.getAuhtInfo().pipe(
      mergeMap((r) => {
        if (r.authenticated === false) {
          this.router.navigate(['login']);
          return of(false);
        }

        if (r.type === 'low') {
          this.router.navigate(['store', 'categorias']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
