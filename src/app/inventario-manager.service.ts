import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, map, retry, tap, first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InventarioManagerService {

  constructor(private http: HttpClient) { }

  addTipo(tipo: string): Observable<string> {
    console.log(tipo);
    return this.http.post<string>('http://localhost:5000/inventario/addTipo', {name: tipo})
      .pipe(first(),
        mapTo('ADDED'),
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
        return of('NEGATED');
      }));

  }

  getTipos(){
    return this.http.get('http://localhost:5000/inventario/getTipos')
      .pipe(first(), map((res: Tipo[]) => {
        const tipos: string[] = [];
        res.forEach((element: Tipo) => {
          tipos.push(element.name);
        });
        return tipos;
      }));
  }

  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>('http://localhost:5000/inventario/addItem', item)
          .pipe(first(),
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
            const errorItem: Item = null;
            return of(errorItem);
          }));
  }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>('http://localhost:5000/inventario/getItems')
     .pipe(first(),
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
            const errorItems: Item[] = null;
            return of(errorItems);
          }));
  }


  getAllItemsByType(tipoLista: string): Observable<Item[]> {
    return this.http.get<Item[]>('http://localhost:5000/inventario/getItemsByType/' + tipoLista)
     .pipe(first(),
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
            const errorItems: Item[] = null;
            return of(errorItems);
          }));
  }

  uploadFile(img: File, cod: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('img', img);
    return this.http.post<any>('http://localhost:5000/inventario/uploads/image/' + cod, formData)
            .pipe(first(),
              tap(res => this.uploadPhotoName(res.uploadedFile.filename, cod).subscribe()),
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

  uploadFilePDF(pdf: File, cod: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('pdf', pdf);
    return this.http.post<boolean>('http://localhost:5000/inventario/uploads/ficha/' + cod, formData)
            .pipe(first(),
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

  uploadPhotoName(photoName: string, codigoN: string): Observable<boolean> {
    console.log(photoName + ' ' + codigoN);
    return this.http.put<boolean>('http://localhost:5000/inventario/uploadPhotoName', {codigo: codigoN, photo: photoName})
            .pipe(first(),
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

}



export interface Item {
  name: string;
  priceIGV: number;
  priceNoIGV: number;
  cantidad: number;
  codigo: string;
  tipo: string;
  oferta: number;
  date: Date;
  unidadDeMedida: string;
  description: string;
  photo: string;
}

interface Tipo {
  name: string;
}

interface FileUploaded {
  uploadedFile: UploadedFile;
}

interface UploadedFile {
  filename: string;
}

interface TipoOBJ {
  tipo: string;
}
