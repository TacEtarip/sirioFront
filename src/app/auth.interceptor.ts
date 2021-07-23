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

    return this.auth.getAuhtInfo().pipe(
      switchMap((res) => {
        if (res === null) {
          return  next.handle(request);
        }
        let reqToSend: HttpRequest<any>;
        const reqWithAuth = request.clone({
          setHeaders: {
            Authorization: 'JWT ' + res.token + ' ' + res.user + ' ' + res.type,
          },
          withCredentials: true,
        });
        if (res.authenticated === true) {
          reqToSend = reqWithAuth;
        } else {
          reqToSend = request;
        }
        return next.handle(reqToSend).pipe(catchError((error) => {
          if (error.status === 401) {
            if ((res.authenticated === true)) {
                this.auth.cerrarSesion();
            }
          }
          return throwError(error);
        }));
      })
    );
  }
}
