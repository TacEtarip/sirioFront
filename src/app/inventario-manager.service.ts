import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, map, retry, tap, first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InventarioManagerService {

  // baseUrl = 'https://inventario-sirio-dinar.herokuapp.com/';
  baseUrl = 'http://localhost:5000/';


  constructor(private http: HttpClient) { }

  uploadVariacionSimple(uploadInfo: UploadCantidadSimple) {
    return this.http.put(this.baseUrl + 'inventario/uploadVariationSimple', uploadInfo)
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  alert(error.error.errorMSG);
                  break;
              }
              return of(false);
            })
            );
  }

  uploadVariacion(uploadInfo: UploadCantidadSub) {
    return this.http.put(this.baseUrl + 'inventario/uploadVariationSC', uploadInfo)
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  alert(error.error.errorMSG);
                  break;
              }
              return of(false);
            })
            );
  }



  addTipo(tipo: string): Observable<string> {
    return this.http.post<string>( this.baseUrl + 'inventario/addTipo', {name: tipo})
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
            alert(error.error.errorMSG);
            break;
        }
        return of('NEGATED');
      }));
  }

  getTipos(): Observable<Tipo[]>{
    return this.http.get<Tipo[]>( this.baseUrl + 'inventario/getTipos')
      .pipe(first());
  }

  getSubTipos(tipoCod: string): Observable<Tipo>{
    return this.http.get<Tipo>( this.baseUrl + 'inventario/getSubTipos/' + tipoCod)
      .pipe(first());
  }

  getTipo(codigo: string): Observable<Tipo>{
    return this.http.get<Tipo>( this.baseUrl + 'inventario/getTipo/' + codigo)
      .pipe(first());
  }


  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl +  'inventario/addItem', item)
          .pipe(first(),
            catchError(error => {
            console.log(error);
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.message);
                break;
            }
            const errorItem: Item = null;
            return of(errorItem);
          }));
  }

  addNewMarca(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.baseUrl +  'inventario/marcas/add', marca)
          .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.message);
                break;
            }
            const errorItem: Marca = null;
            return of(errorItem);
          }));
  }

  deleteMarcas(deleteString: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseUrl +  'inventario/marcas/delete/' + deleteString )
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
                alert(error.error.message);
                break;
            }
            return of(false);
          }));
  }

  getAllMarcas(): Observable<Marca[]> {
    console.log('ji');
    return this.http.get<Marca[]>(this.baseUrl +  'inventario/marcas/getAll')
          .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.message);
                break;
            }
            const errorMarca: Marca[] = null;
            return of(errorMarca);
          }));
  }



  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(this.baseUrl +  'inventario/updateItem', item)
          .pipe(first(),
            catchError(error => {
              switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
            }
              const errorItem: Item = null;
              return of(errorItem);
          }));
  }

  getItem(codigo: string): Observable<Item> {
    return this.http.get<Item>(this.baseUrl +  'inventario/getItem/cod/' + codigo)
     .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
            }
            const errorItems: Item = null;
            return of(errorItems);
          }));
  }



  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl +  'inventario/getItems')
     .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
            }
            const errorItems: Item[] = null;
            return of(errorItems);
          }));
  }

  getAllItemsOfSubType(subTipo: string): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl +  'inventario/getItemsSubTipo/' + subTipo)
     .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
            }
            const errorItems: Item[] = null;
            return of(errorItems);
          }));
  }

  getItemsSorted(subORtipo: string,tipo: string, ordernarPor: string, orden: string): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl +  'inventario/getAllItemsSort/' + subORtipo + '/' + tipo + '/' + ordernarPor + '/' + orden)
     .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
            }
            const errorItems: Item[] = null;
            return of(errorItems);
          }));
  }


  getAllItemsByType(tipoLista: string): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl +  'inventario/getItemsByType/' + tipoLista)
     .pipe(first(),
            catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
            }
            const errorItems: Item[] = null;
            return of(errorItems);
          }));
  }

  uploadFile(img: File, cod: string, oldPhoto: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('img', img);
    formData.append('oldPhoto', oldPhoto);
    return this.http.post<any>(this.baseUrl +  'inventario/uploads/image/' + cod, formData)
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
                    alert(error.error.error.message);
                    break;
                }
                return of(false);
              })
            );
  }

  uploadFilePDF(pdf: File, cod: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('pdf', pdf);
    return this.http.post<boolean>(this.baseUrl +  'inventario/uploads/ficha/' + cod, formData)
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
                    alert(error.error.error.message);
                    break;
                }
                return of(false);
              })
            );
  }


  generarVenta(venta: Venta): Observable<any> {
    return this.http.post<any>(this.baseUrl +  'ventas/generarVenta', venta)
                    .pipe(first(),
                          catchError(error => {
                            switch (error.status) {
                              case 0:
                                alert('Error al tratar de conectar al servidor');
                                break;
                              case 700:
                                break;
                              default:
                                alert(error.error.error.message);
                                break;
                          }
                            return of(false);
                        }));
  }

  eliminarTipo(codigo: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl +  'inventario/deleteTipo/' + codigo)
                    .pipe(first(),
                          catchError(error => {
                            switch (error.status) {
                              case 0:
                                alert('Error al tratar de conectar al servidor');
                                break;
                              case 700:
                                break;
                              default:
                                alert(error.error.error.message);
                                break;
                          }
                            return of(false);
                        }));
  }

  eliminarSubTipo(codigo: string, subName: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl +  'inventario/deleteSupTipo/' + codigo + '/' + subName)
                    .pipe(first(),
                          catchError(error => {
                            switch (error.status) {
                              case 0:
                                alert('Error al tratar de conectar al servidor');
                                break;
                              case 700:
                                break;
                              default:
                                alert(error.error.error.message);
                                break;
                          }
                            return of(false);
                        }));
  }

  updateTipoName(tipo: Tipo) {
    return this.http.put<any>(this.baseUrl +  'inventario/updateTipo/', tipo)
    .pipe(first(),
          catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
          }
            return of(false);
        }));
  }

  updateSubTipoName(codigo: string, antiguoSubName: string, newSubName: string) {
    return this.http.put<any>(this.baseUrl +  'inventario/uptateSupTipos/', {codigo, antiguoSubName, newSubName})
    .pipe(first(),
          catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
          }
            return of(false);
        }));
  }

  agregarSubTipo(subTipo: string, codigo: string) {
    return this.http.put<any>(this.baseUrl +  'inventario/addSubTipo/', {subTipo, codigo})
    .pipe(first(),
          catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                alert(error.error.error.message);
                break;
          }
            return of(false);
        }));
  }

  eliminarItem(codigo: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl +  'inventario/deleteItem/' + codigo)
                    .pipe(first(),
                          catchError(error => {
                            switch (error.status) {
                              case 0:
                                alert('Error al tratar de conectar al servidor');
                                break;
                              case 700:
                                break;
                              default:
                                alert(error.error.message);
                                break;
                          }
                            return of(false);
                        }));
  }



}

export interface ItemVendido {
  codigo: string;
  priceIGV: number;
  priceNoIGV: number;
  cantidad: number;
}

export interface Documento {
  type: string;
  codigo: number;
}

export interface Venta {
  codigo: string;
  totalPrice: number;
  totalPriceNoIGV: number;
  estado: string;
  documento: Documento;
  itemsVendidos: ItemVendido[];
}


interface Variaciones {
  date: Date;
  cantidad: number;
  tipo: boolean;
  comentario: string;
  costoVar: number;
}

export interface Order {
  name: string;
  nameSecond: string;
  cantidad: number;
}

export interface SubConteo {
  name: string;
  nameSecond: string;
  order: Order[];
}

export interface Item {
  name: string;
  priceIGV: number;
  priceNoIGV: number;
  cantidad: number;
  codigo: string;
  tipo: string;
  subTipo: string;
  oferta: number;
  date: Date;
  unidadDeMedida: string;
  description: string;
  photo: string;
  ficha: boolean;
  subConteo: SubConteo;
  marca: string;
  variaciones: Variaciones[];
  costoPropio: number;
}

export interface Tipo {
  name: string;
  date: Date;
  codigo: string;
  subTipo: string[];
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


export interface Marca {
  name: string;
  codigo: string;
}


export interface UploadCantidadSub {
  subConteo: SubConteo;
  cantidadNueva: number;
  cantidadAntigua: number;
  comentario: string;
  costoVar: number;
  codigo: string;
}

export interface UploadCantidadSimple {
  cantidadNueva: number;
  cantidadAntigua: number;
  comentario: string;
  costoVar: number;
  codigo: string;
}
