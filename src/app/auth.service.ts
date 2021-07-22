import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, first, map, mapTo, mergeMap } from 'rxjs/operators';

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

  defaultKeyValue: UserInfo = {token: '', type: '', user: '', userShow: '', authenticated: false};

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
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
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
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  agregarDocumento(documentoInfo: any, id: string): Observable<FullUser> {
    return this.http.post<FullUser>(this.baseUrl + 'auth/agregarDocumento', { ...documentoInfo, id }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  agregarDireccion(direccionInfo: any, id: string): Observable<FullUser> {
    return this.http.post<FullUser>(this.baseUrl + 'auth/agregarDireccion', { ...direccionInfo, id }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  actCelular(celular: string, id: string): Observable<FullUser> {
    return this.http.put<FullUser>(this.baseUrl + 'auth/actCelular', { celular, id }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  getUserInfo(username: string): Observable<FullUser> {
    return this.http.get<FullUser>(this.baseUrl + 'auth/getUserInfo/' + username).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  getLoginInfoFTG(token: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/getLoginInfoFromToken', { loginToken: token }).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  registerLow(userRegister: UserRegister): Observable<FullUser> {
    return this.http.post<FullUser>(this.baseUrl + 'auth/registerlow', userRegister).pipe(first(), catchError( error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.alertaUniversal('Error desconocido');
          break;
      }
      return of(null);
    }));
  }

  registerLowGoogle(userRegister: UserRegister): Observable<{message: string, code: number}> {
    return this.http.post<Token>(this.baseUrl + 'auth/loginGoogleRegistro', userRegister)
    .pipe(first(),
    map(r => {
      if (r.success === false) {
        throwError(400);
      }
      return r;
    }),
    mergeMap(x => this.doLoginObs(x).pipe(map(doLoginResp => {
      // this.transferState.set(this.key, doLoginResp);
      this.loggedInUSER = x.username;
    }))),
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

  isValid(idUser: string): Observable<boolean> {
    return this.http.post<{reload: boolean}>(this.baseUrl + 'auth/isValid', { idUser }).pipe(
      first(),
      map(res => res.reload),
      catchError( error => {
        switch (error.status) {
          case 0:
            this.alertaUniversal('Error al tratar de conectar al servidor');
            break;
          case 400:
            this.alertaUniversal('Error al llenar el formulario');
            break;
          case 500:
            this.alertaUniversal('Ocurrio un error inesperado en el servidor');
            break;
          default:
            this.alertaUniversal('Error desconocido');
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
                        this.alertaUniversal('Error al tratar de conectar al servidor');
                        break;
                      case 700:
                        break;
                      default:
                        this.alertaUniversal('Error inesperado');
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
                        this.alertaUniversal('Error al tratar de conectar al servidor');
                        break;
                      case 700:
                        break;
                      default:
                        this.alertaUniversal('Error inesperado');
                        break;
                    }
                    return of(null);
                  }));
  }

  loginFast(loginToken: string): Observable<{message: string, code: number}> {
    return this.http.post<Token>( this.baseUrl + 'auth/loginfast', { loginToken } )
    .pipe(first(),
    map(r => {
      if (r.success === false) {
        throwError(400);
      }
      return r;
    }),
    mergeMap(x => this.doLoginObs(x).pipe(map(doLoginResp => {
      // this.transferState.set(this.key, doLoginResp);
      this.loggedInUSER = x.username;
      // this.storeToken(x.token);
    }))),
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
    .pipe(first(),
      map(r => {
        if (r.success === false) {
          throwError(400);
        }
        return r;
      }),
      mergeMap(x => this.doLoginObs(x).pipe(map(doLoginResp => {
        // this.transferState.set(this.key, doLoginResp);
        this.loggedInUSER = x.username;
        // this.storeToken(x.token);
      }))),
      mapTo({logged: true, credentialsErr: false}),
      catchError(error => {
        switch (error.status) {
          case 0:
            this.alertaUniversal('Error al tratar de conectar al servidor');
            break;
          case 700:
            break;
          case 400:
            return of({logged: false, credentialsErr: true});
          default:
            this.alertaUniversal('Error al tratar de compropar credenciales');
            break;
        }
        return of({logged: false, credentialsErr: false});
      })
    );
  }

  doGoogleLogin(): Observable<FullUser> {
    return this.http.get<FullUser>(this.baseUrl + 'auth/google').pipe(first());
  }

  doLoginObs(res: Token): Observable<UserInfo> {
    return this.http.post<UserInfo>('/auth/signIn',
    { jwt: res.token, type: res.type, usershow: res.displayName, usuario:  res.username.toLowerCase()})
    .pipe(first(), catchError(error => {
      switch (error.status) {
        case 0:
          this.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 700:
          break;
        case 400:
          return of({logged: false, credentialsErr: true});
        default:
          this.alertaUniversal('Error al tratar de compropar credenciales');
          break;
      }
      return of(null);
    }));
  }

  private doLoginUser(res: Token) {
    if (res.success === true) {
      this.http.post('/auth/signIn', { jwt: res.token, type: res.type, usershow: res.displayName, usuario:  res.username.toLowerCase()})
      .subscribe((resInfo: UserInfo) => {
        // this.transferState.set(this.key, resInfo);

        this.loggedInUSER = res.username;
        // this.storeToken(res.token);
      });
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
    // this.transferState.set(this.key, this.defaultKeyValue);
    this.http.get<any>('/auth/signOut').subscribe();
  }

  public getUser(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.cs.get('usuario_user');
    }
    return this.request.cookies.usuario_user;
  }

  public getDisplayUser(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.cs.get('usuario_user_show');
    }
    return this.request.cookies.usuario_user_show;
  }

  public getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.cs.get('jwt_token');
    }
    return this.request.cookies.jwt_token;
  }

  public getTtype(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.cs.get('usuario_tipo');
    }
    return this.request.cookies.usuario_tipo;
  }

  public loggedIn() {
    let logged = false;
    if (isPlatformBrowser(this.platformId)) {
      return !!this.cs.get('jwt_token');
    }
    if (this.request.cookies.jwt_token) {
      logged = true;
    }
    return logged;
  }

  /**
   *
   *
   * @deprecated No USAR
   */
  public loogedInV2(): Observable<boolean> {
    let logged = false;
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<{authenticated: boolean}>('/auth/isLoggedV2')
      .pipe(map(r => {
        return r.authenticated;
      }),
      catchError(error => {
        switch (error.status) {
          case 0:
            this.alertaUniversal('Error al tratar de conectar al servidor');
            break;
          case 700:
            break;
          default:
            break;
        }
        return of(false);
      }));
    }
    if (this.request.cookies.jwt_token) {
      logged = true;
    }
    return of(logged);
  }

  /**
   *
   *
   * @deprecated No USAR
   */
  public getUserTypeV2(): Observable<string> {
    let tipo: string;
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<{type: string}>('/auth/getUserType')
      .pipe(map(r => {
        return r.type;
      }));
    }
    if (this.request.cookies.jwt_token) {
      tipo = this.request.cookies.usuario_tipo;
    }
    return of(tipo);
  }

  /**
   *
   *
   * @deprecated No USAR
   */
  public getCookies(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return of({
        login_info: this.cs.get('login_info')
      });
    }

    return of({
      login_info: this.request.cookies.usuario_user + ' ' + this.request.cookies.jwt_token + ' ' + this.request.cookies.usuario_tipo
    });
  }

  alertaUniversal(alerta: string) {
    if (isPlatformBrowser(this.platformId)) {
      alert(alerta);
    } else {
      console.log(alerta);
    }
  }

  isPlatformB() {
    if (isPlatformBrowser(this.platformId)) {
      return true;
    }
    return false;
  }

  getLoginVersion() {
    let version = '';
    if (isPlatformBrowser(this.platformId)) {
      version =  this.cs.get('login_version') || '';
      return version;
    }
    version = this.request.cookies.login_version || '';
    return version;
  }

  public getAuhtInfo(): Observable<UserInfo> {
    if (isPlatformBrowser(this.platformId)) {
      const sendServerAuthInfoFront: UserInfo =
      { token: this.cs.get('jwt_token') || '', type:  this.cs.get('usuario_tipo') || '',
      user: this.cs.get('usuario_user') || '', userShow: this.cs.get('usuario_user_show') || '',
      authenticated: !!this.cs.get('jwt_token') };
      // this.transferState.set(this.key, sendServerAuthInfoFront);
      return of(sendServerAuthInfoFront);
      /*
      const storedResponse = this.transferState.get<UserInfo>(this.key, this.defaultKeyValue);
      if (storedResponse) {
        AuthService.loggedInfo = storedResponse;
        return of(storedResponse);
      } else {
        return this.http.get<UserInfo>('/auth/getAuhtInfo')
        .pipe(
          catchError(error => {
          switch (error.status) {
            case 0:
              this.alertaUniversal('Error al tratar de conectar al servidor');
              break;
            case 700:
              break;
            default:
              break;
          }
          return of(null);
        }));
      }*/
    }
    const sendServerAuthInfo: UserInfo =
    { token: this.request.cookies.jwt_token || '', type: this.request.cookies.usuario_tipo || '',
    user: this.request.cookies.usuario_user || '', userShow: this.request.cookies.usuario_user_show || '',
    authenticated: !!this.request.cookies.jwt_token };
    // this.transferState.set(this.key, sendServerAuthInfo);
    // AuthService.loggedInfo = sendServerAuthInfo;
    return of(sendServerAuthInfo);
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

export interface UserInfo { token: string; type: string; user: string; userShow: string; authenticated: boolean; }
