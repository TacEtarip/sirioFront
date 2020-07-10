import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, mapTo, catchError, tap, first } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  USUARIO_USER = 'usuario_user';
  TOKEN_JWT = 'jwt_token';
  loggedInUSER: string = null;

  constructor(private http: HttpClient) { }

  login(user: User): Observable<boolean> {
    return this.http.post<Token>('http://localhost:5000/auth/login', user)
    .pipe( first(),
      tap((res: Token) => this.doLoginUser(res)),
      mapTo(true),
      catchError(error => {
        switch (error.status) {
          case 0:
            alert('Error al tratar de conectar al servidor');
            break;
          case 700:
            break;
          default:
            alert('Error al tratar de compropar credenciales');
            break;
        }
        return of(false);
      })
    );
  }

  private doLoginUser(res: Token) {
    if (res.success === true) {
      localStorage.setItem(this.USUARIO_USER, res.username);
      this.loggedInUSER = res.username;
      this.storeToken(res.token);
    } else {
      throwError(400);
    }
  }

  private storeToken(token: string) {
    localStorage.setItem(this.TOKEN_JWT, token);
  }

  public getUser(): string {
    return localStorage.getItem(this.USUARIO_USER);
  }

  public getToken(): string {
    return localStorage.getItem(this.TOKEN_JWT);
  }

  public loggedIn() {
    return !!localStorage.getItem(this.TOKEN_JWT);
  }
}
interface Token {
  username: string;
  success: boolean;
  message: string;
  token: string;
}

export interface User {
  username: string;
  password: string;
}
