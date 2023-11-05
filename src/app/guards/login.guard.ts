import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.canActivate();
  }
  canActivate(): Observable<boolean> {
    return this.auth.getAuhtInfo().pipe(
      switchMap(r => {

        if (r.authenticated) {
          this.router.navigate(['store', 'categorias']);
          return of(false);
        }

        return of(true);
      })
    );
  }

}
