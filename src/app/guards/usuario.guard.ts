import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.canActivate();
  }
  canActivate(): Observable<boolean> {
    return this.auth.getAuhtInfo().pipe(
      switchMap(r => {
        if (r === null) {
          this.router.navigate(['/login']);
          return of(false);
        }

        if (r.authenticated === false) {
          this.router.navigate(['/login']);
          return of(false);
        }

        return of(true);
      })
    );
  }

}
