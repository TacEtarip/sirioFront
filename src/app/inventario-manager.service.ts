import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, map, retry, tap, first } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioManagerService {

  // baseUrl = 'https://inventario-sirio-dinar.herokuapp.com/';
  baseUrl = 'http://localhost:5000/';


  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  deConvertToFavorite(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl + 'inventario/toUnFavorite', item)
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
    }));
  }

  convertToFavorite(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl + 'inventario/toFavorite', item)
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
    }));
  }


  getItemsDestacados(): Observable<Item[]>{
    return this.http.get<Item[]>(this.baseUrl + 'inventario/getItemsDestacados')
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
    }));
  }

  getItemsRelacionados(codigo: string, tipo: string): Observable<Item[]>{
    return this.http.get<Item[]>(this.baseUrl + 'inventario/getItemsRelacionados/' + tipo + '/' + codigo)
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
    }));
  }

  getItemsSearch(searchTerms: string): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl + 'inventario/getItemsSearch/' + searchTerms)
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
    }));
  }


  getItemBalance(codigo: string): Observable<{message: number}> {
    return this.http.get<{message: number}>(this.baseUrl + 'inventario/getItemBalance/' + codigo)
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
    }));
  }

  getExcelReportItem(codigo: string) {
    return this.http.get(this.baseUrl + 'inventario/getItemReport/' + codigo, { responseType: 'blob' })
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
  }));
  }

  getExcelReport(dateOne: string, dateTwo: string) {
    return this.http.get(this.baseUrl + 'ventas/createExcelReport/' + dateOne + '/' + dateTwo, { responseType: 'blob' })
    .pipe( first(), catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
  }));
  }

  anularVentaPost(venta: Venta): Observable<{message: string}> {
    return this.http.put<{message: string}>(this.baseUrl + 'ventas/anularVentaPost', venta).pipe(first(),
    catchError(error => {
      switch (error.status) {
      case 0:
        alert('Error al tratar de conectar al servidor');
        break;
      case 700:
        break;
      default:
        break;
    }
      return of(null);
  }));
  }

  eliminarItemVentaSC(infoToDeleteItem: VentaSimpleEliminarSCInfo): Observable<Venta> {
    return this.http.put<Venta>(this.baseUrl + 'ventas/eliminarItemSCVenta', infoToDeleteItem).pipe(first(),
      catchError(error => {
        switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 700:
          break;
        default:
          break;
      }
        return of(null);
    }));
  }

  eliminarItemVenta(infoToDeleteItem: VentaSimpleEliminarInfo): Observable<Venta> {
    return this.http.put<Venta>(this.baseUrl + 'ventas/eliminarItemVenta', infoToDeleteItem).pipe(first(),
      catchError(error => {
        switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 700:
          break;
        default:
          break;
      }
        return of(null);
    }));
  }

  getCantidadVentasPorEstado(estado: string, dateOne: string, dateTwo: string): Observable<{cantidadVentas: number}> {
    return this.http.get<{cantidadVentas: number}>(this.baseUrl + 'ventas/getCantidadVentas/' + estado + '/' + dateOne + '/' + dateTwo)
      .pipe(first(),
      catchError(error => {
        switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 700:
          break;
        default:
          break;
      }
        return of(null);
    }));
  }


  getVentasEJecutadas(limit: number, skip: number, dateOne: string, dateTwo: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.baseUrl + 'ventas/getEjecutadas/' + skip + '/' + limit + '/' + dateOne + '/' + dateTwo)
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  break;
              }
              return of(null);
            }));
  }

  anularVenta(venta: Venta): Observable<{message: string}> {
    return this.http.put<{message: string}>(this.baseUrl + 'ventas/anularVenta/', { venta })
    .pipe(first(),
    catchError(error => {
      switch (error.status) {
        case 0:
          alert('Error al tratar de conectar al servidor');
          break;
        case 700:
          break;
        default:
          break;
      }
      return of(null);
    }));
  }

  getVenta(ventaCod: string): Observable<Venta> {
    return this.http.get<Venta>(this.baseUrl + 'ventas/obtenerVenta/' + ventaCod)
          .pipe(first(),
          catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                break;
            }
            return of(null);
          }));
  }

  getVentaCompleta(ventaCod: string): Observable<Venta> {
    return this.http.get<Venta>(this.baseUrl + 'ventas/obtenerVenta/' + ventaCod)
          .pipe(first(),
          catchError(error => {
            switch (error.status) {
              case 0:
                alert('Error al tratar de conectar al servidor');
                break;
              case 700:
                break;
              default:
                break;
            }
            return of(null);
          }));
  }

  ejecutarVenta(venta: Venta): Observable<{message: string}> {
    return this.http.post<{message: string}>(this.baseUrl + 'ventas/ejecutarVenta', {venta})
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  break;
              }
              return of(null);
            }));
  }


  obtenerCardPreInfoVenta(codVenta: string): Observable<ItemsVentaForCard[]> {
    return this.http
    .post<ItemsVentaForCard[]>(this.baseUrl + 'ventas/ventasForCard', {codVenta})
      .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  break;
              }
              return of(null);
            })
            );
  }


  agregarItemVenta(itemVendido: ItemVendido, codigoVenta: string): Observable<{message: string}> {
    return this.http
            .post<{message: string}>(this.baseUrl + 'ventas/agregarItemVenta', {itemVendido, codigoVenta})
              .pipe(first(),
                    catchError(error => {
                      switch (error.status) {
                        case 0:
                          alert('Error al tratar de conectar al servidor');
                          break;
                        case 700:
                          break;
                        default:
                          break;
                      }
                      return of(null);
                    })
                    );
  }

  getVentasActivas(): Observable<Venta> {
    return this.http.get<Venta>(this.baseUrl + 'ventas/ventasPendientes')
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  break;
              }
              return of(null);
            })
            );
  }


  generarVentaNueva(bodyToVenta: {venta: Venta}): Observable<{venta: Venta, message: string}> {
    return this.http.post<{venta: Venta, message: string}>(this.baseUrl + 'ventas/agregarVenta', bodyToVenta)
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  break;
              }
              return of({venta: null, message: 'Error'});
            })
            );
  }

  generarVentaSimple(bodyToVenta: {venta: Venta}): Observable<{message: string}> {
    return this.http.post<{message: string}>(this.baseUrl + 'ventas/ventaSimple', bodyToVenta)
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 700:
                  break;
                default:
                  break;
              }
              return of({message: 'Error'});
            })
            );
  }

  getDNI(dni: string): Observable<DNI> {
    return this.http.get<DNI>(this.baseUrl + 'ventas/dni/' + dni.toString())
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 422:
                  alert('Numero De DNI Invalido');
                  break;
                case 404:
                  alert('Documento No Encontrado');
                  break;
                case 700:
                  break;
                default:
                  alert(error.error.errorMSG);
                  break;
              }
              const errorItem: DNI = null;
              return of(errorItem);
            })
            );
  }

  getRUC(dni: string): Observable<RUC> {
    return this.http.get<RUC>(this.baseUrl + 'ventas/ruc/' + dni.toString())
            .pipe(first(),
            catchError(error => {
              switch (error.status) {
                case 0:
                  alert('Error al tratar de conectar al servidor');
                  break;
                case 422:
                  alert('Numero De RUC Invalido');
                  break;
                case 700:
                  break;
                case 404:
                    alert('Documento No Encontrado');
                    break;
                default:
                  alert(error.error.errorMSG);
                  break;
              }
              const errorItem: RUC = null;
              return of(errorItem);
            })
            );
  }

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

  getItemsSorted(subORtipo: string, tipo: string, ordernarPor: string, orden: string, limit: number): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl +  'inventario/getAllItemsSort/' + subORtipo + '/' + tipo + '/' + ordernarPor + '/' + orden + '/' + limit)
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
                              case 401:
                                alert('Tu usuario no tiene permitido esta acción.');
                                this.auth.cerrarSesion();
                                this.router.navigate(['/login']);
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
  name: string;
  priceIGV: number;
  priceNoIGV: number;
  cantidad: number;
  totalPrice: number;
  totalPriceNoIGV: number;
  descripcion: string;
  cantidadSC: CantidadSubConteo[];
}

export interface Documento {
  type: string;
  name: string;
  codigo: number;
  direccion: string;
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

export interface DNI {
  dni: string;
  nombre: string;
}

export interface RUC {
  ruc: string;
  nombre_o_razon_social: string;
}

export interface Venta {
  codigo: string;
  totalPrice: number;
  totalPriceNoIGV: number;
  estado: string;
  documento: Documento;
  itemsVendidos: ItemVendido[];
  vendedor: string;
  tipoVendedor: string;
  linkComprobante?: string;
  medio_de_pago: string;
  serie?: string;
  numero?: number;
  tipoComprobante?: string;
  cliente_email?: string;
  guia_serie?: string;
  guia_numero?: string;
  guia?: boolean;
  peso?: number;
  transportista_codigo?: string;
  transportista_nombre?: string;
  transportista_placa?: string;
  partida_ubigeo?: string;
  partida_direccion?: string;
  llegada_ubigeo?: string;
  llegada_direccion?: string;
  bultos?: number;
  guia_link?: string;
  date?: string;
}

export interface VentaCompleta {
  codigo: string;
  totalPrice: number;
  totalPriceNoIGV: number;
  estado: string;
  documento: Documento;
  itemsVendidos: ItemVendido[];
  date: string;
}

export interface CantidadSubConteo {
  name: string;
  nameSecond: string;
  cantidadDisponible: number;
  cantidadVenta: number;
}

export interface ItemsVentaForCard {
  codigo: string;
  name: string;
  priceIGV: number;
  priceNoIGV: number;
  cantidadSC: CantidadSubConteo;
  cantidad: number;
}


export interface VentaSimpleEliminarInfo {
  codigo: string;
  itemCodigo: string;
  totalItemPrice: number;
  totalItemPriceNoIGV: number;
}

export interface VentaSimpleEliminarSCInfo {
  codigo: string;
  itemCodigo: string;
  name: string;
  nameSecond: string;
  cantidadVenta: number;
  totalPriceNoIGVSC: number;
  totalPriceSC: number;
}
