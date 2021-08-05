import { catchError, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  private baseUrl = environment.backEndUrl;

  enviarMensaje(mensaje: {nombre: string, apellido: string, email: string, mensaje: string}): Observable<{enviado: boolean}> {
    return this.http.post<{enviado: boolean}>(this.baseUrl + 'email/enviarMensaje',
    {nombre: mensaje.nombre, apellido: mensaje.apellido, email: mensaje.email, mensaje: mensaje.mensaje})
    .pipe(first(),  catchError( error => {
      switch (error.status) {
        case 0:
          this.auth.alertaUniversal('Error al tratar de conectar al servidor');
          break;
        case 400:
          this.auth.alertaUniversal('Error al llenar el formulario');
          break;
        case 500:
          this.auth.alertaUniversal('Ocurrio un error inesperado en el servidor');
          break;
        default:
          this.auth.alertaUniversal('Error desconocido');
          break;
      }
      return of({enviado: false});
    }));
  }
}
