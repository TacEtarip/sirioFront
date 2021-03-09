import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mapTo, catchError, tap, first } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import {CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'https://inventario-sirio-dinar.herokuapp.com/';
  // baseUrl = 'http://localhost:5000/';
  USUARIO_USER = 'usuario_user';
  SHOW_USER = 'usuario_user_show';
  TYPE_USER = 'usuario_tipo';
  TOKEN_JWT = 'jwt_token';
  loggedInUSER: string = null;

  constructor(private http: HttpClient, private cs: CookieService,
              @Inject(PLATFORM_ID) private platformId: any, @Optional() @Inject(REQUEST) private request: any) {
  }

  [name: string]: any;

  length: number;

  cambiarContra(passwordForm: { passwordOld: string, password: string }, id: string): Observable<{ changed: boolean }> {
    return this.http.post<{ changed: boolean }>(this.baseUrl + 'auth/cambiarContrasena', { ...passwordForm, id })
    .pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }


  confirmarContr(oldPassword: string, id: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(this.baseUrl + 'auth/confirmarContr', { oldPassword, id })
    .pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  agregarDocumento(documentoInfo: any, id: string): Observable<FullUser> {
    return this.http.post<FullUser>(this.baseUrl + 'auth/agregarDocumento', { ...documentoInfo, id }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  agregarDireccion(direccionInfo: any, id: string): Observable<FullUser> {
    return this.http.post<FullUser>(this.baseUrl + 'auth/agregarDireccion', { ...direccionInfo, id }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  actCelular(celular: string, id: string): Observable<FullUser> {
    return this.http.put<FullUser>(this.baseUrl + 'auth/actCelular', { celular, id }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  getUserInfo(username: string): Observable<FullUser> {
    return this.http.get<FullUser>(this.baseUrl + 'auth/getUserInfo/' + username).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  getLoginInfoFTG(token: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/getLoginInfoFromToken', { loginToken: token }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  registerLow(userRegister: UserRegister): Observable<FullUser> {
    return this.http.post<FullUser>(this.baseUrl + 'auth/registerlow', userRegister).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 400:
          alert('Error al llenar el formulario');
          break;
        case 500:
          alert('Ocurrio un error inesperado en el servidor');
          break;
        default:
          alert('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  isValid(idUser: string): Observable<boolean> {
    return this.http.post<{reload: boolean}>(this.baseUrl + 'auth/isValid', { idUser }).pipe(
      first(),
      map(res => res.reload),
      catchError( error => {
        switch (error.status) {
          case 0:
            alert('Error al tratar de conectar al servidor');
            break;
          case 400:
            alert('Error al llenar el formulario');
            break;
          case 500:
            alert('Ocurrio un error inesperado en el servidor');
            break;
          default:
            alert('Error desconocido');
            break;
        }
        return of(null);
      })
    );
  }

  usernameExist(username: string): Observable<boolean> {
    return this.http.get<{exists: boolean}>(this.baseUrl + 'auth/userEx/' + username)
            .pipe(first(),
                  map((res) => {
                    return res.exists;
                  }), catchError(error => {
                    switch (error.status) {
                      case 0:
                        alert('Error al tratar de conectar al servidor');
                        break;
                      case 700:
                        break;
                      default:
                        alert('Error inesperado');
                        break;
                    }
                    return of(null);
                  }));
  }

  emailExist(email: string): Observable<boolean> {
    return this.http.get<{exists: boolean}>(this.baseUrl + 'auth/emailEx/' + email)
            .pipe(first(),
                  map((res) => {
                    return res.exists;
                  }), catchError(error => {
                    switch (error.status) {
                      case 0:
                        alert('Error al tratar de conectar al servidor');
                        break;
                      case 700:
                        break;
                      default:
                        alert('Error inesperado');
                        break;
                    }
                    return of(null);
                  }));
  }

  loginFast(loginToken: string): Observable<{message: string, code: number}> {
    return this.http.post<Token>( this.baseUrl + 'auth/loginfast', { loginToken } )
    .pipe(first(),
          tap((res: Token) => this.doLoginUser(res)),
          mapTo({message: 'Redirecionando a la pagina principal.', code: 0}),
          catchError(error => {
            switch (error.status) {
              case 0:
                return of({message: 'Error al tratar de conectar al servidor', code: 2});
              case 400:
                return of({message: 'Redirecionando a la pagina de login', code: 1});
              default:
                break;
            }
            return of({message: 'Ocurrio un error desconocido', code: 3});
          }));
  }

  login(user: User): Observable<{logged: boolean, credentialsErr: boolean}> {
    return this.http.post<Token>( this.baseUrl + 'auth/login', user)
    .pipe( first(),
      tap((res: Token) => this.doLoginUser(res)),
      mapTo({logged: true, credentialsErr: false}),
      catchError(error => {
        switch (error.status) {
          case 0:
            alert('Error al tratar de conectar al servidor');
            break;
          case 700:
            break;
          case 400:
            return of({logged: false, credentialsErr: true});
          default:
            alert('Error al tratar de compropar credenciales');
            break;
        }
        return of({logged: false, credentialsErr: false});
      })
    );
  }

  doGoogleLogin(): Observable<FullUser> {
    return this.http.get<FullUser>(this.baseUrl + 'auth/google').pipe(first());
  }

  private doLoginUser(res: Token) {
    if (res.success === true) {
      this.http.post('/auth/signIn', { jwt: res.token, type: res.type, usershow: res.displayName, usuario:  res.username.toLowerCase()})
      .subscribe();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.USUARIO_USER, res.username.toLowerCase());
        localStorage.setItem(this.SHOW_USER, res.displayName);
        localStorage.setItem(this.TYPE_USER, res.type);
      }
      this.loggedInUSER = res.username;
      this.storeToken(res.token);
    } else {
      throwError(400);
    }
  }

  private storeToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_JWT, token);
    }
  }

  public cerrarSesion() {
    this.http.get<any>('/auth/signOut').subscribe();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.SHOW_USER);
      localStorage.removeItem(this.USUARIO_USER);
      localStorage.removeItem(this.TOKEN_JWT);
      localStorage.removeItem(this.TYPE_USER);
    }
  }

  public getUser(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.USUARIO_USER);
    }
    return this.request.cookies.usuario_user;
  }

  public getDisplayUser(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.SHOW_USER);
    }
    return this.request.cookies.usuario_user_show;
  }

  public getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_JWT);
    }
    return this.request.cookies.jwt_token;
  }

  public getTtype(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TYPE_USER);
    }
    return this.request.cookies.usuario_tipo;
  }

  public isAdmin(): boolean {
    if (this.getTtype() === 'admin') {
      return true;
    }
    return false;
  }

  public loggedIn() {
    let logged = false;
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.TOKEN_JWT);
    }
    if (this.request.cookies.jwt_token) {
      logged = true;
    }
    return logged;
  }

  public getCookies(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return of({
        login_info: this.cs.get('login_info')
      });
    }
    return of({
      login_info: this.request.cookies.usuario_user + ' ' + this.request.cookies.jwt_token + ' ' + this.request.cookies.usuario_user
    });
  }
}

interface Token {
  username: string;
  success: boolean;
  message: string;
  token: string;
  displayName: string;
  type: string;
}

export interface User {
  username: string;
  password: string;
}

export interface FullUser {
  _id: string;
  username: string;
  type: string;
  created_date: Date;
  password: string;
  displayName: string;
  email: string;
  dirOne: string;
  dirTwo: string;
  reference: string;
  nombre: string;
  apellido: string;
  nomape: string;
  googleCod: string;
  dni: string;
  ruc: string;
  tipoPersona: number;
  verified: boolean;
  ciudad: string;
  celular: string;
  documento: string;
}

export interface UserRegister {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  displayName: string;
  password: string;
}

export interface UserRegisterGoogle {
  nombre: string;
  apellido: string;
  email: string;
  googleCod: string;
}
