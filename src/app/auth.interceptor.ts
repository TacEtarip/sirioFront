import { catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.auth.getCookies().pipe(
      switchMap((res: {login_info: string}) => {
        let reqToSend: HttpRequest<any>;
        const loginArray = res.login_info.split(' ');
        const reqWithAuth = request.clone({
          setHeaders: {
            Authorization: 'JWT ' + loginArray[1] + ' ' + loginArray[0] + ' ' + loginArray[2],
          },
          withCredentials: true,
        });
        if (this.auth.loggedIn() === true) {
          reqToSend = reqWithAuth;
        } else {
          reqToSend = request;
        }
        return next.handle(reqToSend).pipe(catchError((error) => {
          if (error.status === 401) {
            if (this.auth.loggedIn()) {
              this.auth.cerrarSesion();
            }
            this.router.navigate(['/login']);
            console.log({error, message: 'w'});
          }
          return throwError(error);
        }));
      })
    );
  }
}
