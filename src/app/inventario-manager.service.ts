import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, first } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioManagerService {

  baseUrl = 'https://inventario-sirio-dinar.herokuapp.com/';
  // baseUrl = 'http://localhost:5000/';


  constructor(private http: HttpClient, private auth: AuthService, private router: Router,
             ) { }

    getItemsNoStock(): Observable<Item[]> {
              return this.http.get<Item[]>(this.baseUrl + 'inventario/getItemsNoStock')
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

    getItemsLowStock(): Observable<Item[]> {
      return this.http.get<Item[]>(this.baseUrl + 'inventario/getItemsLowStock')
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

  getPhotoTipoRandom(tipo: string, subTipo: string): Observable<any>{
    return this.http.get<any>(this.baseUrl + 'inventario/getRandomImageOfTipo/' + tipo + '/' + subTipo)
    .pipe(first(), catchError(error => {
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

  getExcelCoti(codigo: string, extra: { observaciones: string, envio: number, otro: number, porPagar: number }, imagen: boolean) {
    return this.http.post(this.baseUrl + 'coti/getExcelCoti', { codigo, extra, imagen }, { responseType: 'blob' })
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

  getPdfCoti(codigo: string, extra: { observaciones: string, envio: number, otro: number, porPagar: number }, imagen: boolean) {
    return this.http.post(this.baseUrl + 'coti/getPdfCoti', { codigo, extra, imagen }, { responseType: 'blob' })
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

  getExcelReport(dateOne: string, dateTwo: string, estado: string[], tipo: string[],
                 busqueda: string, busquedaItemCodigo: string, busquedaUsername: string) {
    return this.http.post(this.baseUrl + 'ventas/createExcelReport/',
    { dateOne, dateTwo, estado, tipo, busqueda, busquedaItemCodigo, busquedaUsername  }, { responseType: 'blob' })
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

  getCantidadVentasPorEstado(estado: string[], dateOne: string, dateTwo: string, tipo: string[],
                             busqueda: string, busquedaItemCodigo: string, busquedaUsername: string):
                              Observable<{cantidadVentas: number}> {
    return this.http.post<{cantidadVentas: number}>(this.baseUrl + 'ventas/getCantidadVentas',
    {estado, dateOne, dateTwo, tipo, busqueda: busqueda || '',
    busquedaItemCodigo: busquedaItemCodigo || '', busquedaUsername: busquedaUsername || ''})
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


  getVentasEJecutadas(limit: number, skip: number, dateOne: string, dateTwo: string,
                      estado: string[], tipo: string[],
                      busqueda: string, busquedaItemCodigo: string, busquedaUsername: string,
                      orden: string, ordenOrden: number): Observable<Venta[]> {
    return this.http.post<Venta[]>(this.baseUrl + 'ventas/getEjecutadas',
    { limit, skip, dateOne, dateTwo, estado, tipo, busqueda: busqueda || '', orden, ordenOrden,
    busquedaItemCodigo: busquedaItemCodigo || '', busquedaUsername: busquedaUsername || '' })
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

  getCotis(limit: number, skip: number, dateOne: string, dateTwo: string, estado: string): Observable<Venta[]> {
    return this.http.post<Venta[]>(this.baseUrl + 'coti/getPendientes', { limit, skip, dateOne, dateTwo, estado })
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

  getCotiCompleta(cotiCod: string): Observable<Venta> {
    return this.http.get<Venta>(this.baseUrl + 'coti/obtenerCoti/' + cotiCod)
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

  obtenerCardCotiInfo(codCoti: string): Observable<ItemsVentaForCard[]> {
    return this.http
    .post<ItemsVentaForCard[]>(this.baseUrl + 'coti/cotiForCard', { codCoti })
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


  agregarItemVenta(itemVendido: ItemVendido, codigoVenta: string): Observable<{message: string, venta: Venta}> {
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

  agregarItemCoti(itemVendido: ItemVendido, codigoCoti: string): Observable<{message: string, coti: Venta}> {
    return this.http
            .post<{message: string}>(this.baseUrl + 'coti/agregarItemCoti', { itemVendido, codigoCoti })
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

  getVentaActiva(): Observable<Venta> {
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

  getVentaActivaFull(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.baseUrl + 'ventas/ventasActivasFull')
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

  getVentasActivas(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'ventas/ventasActivasList')
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
              let message = 'Error';
              switch (error.status) {
                case 0:
                  message = 'Error al tratar de conectar al servidor';
                  break;
                case 409:
                  message = 'Ya posee una venta activa';
                  break;
                default:
                  break;
              }
              return of({ venta: null, message });
            })
            );
  }

  generarCotiNueva(bodyToVenta: {venta: Venta}): Observable<{coti: Venta, message: string}> {
    return this.http.post<{coti: Venta, message: string}>(this.baseUrl + 'coti/generarCoti', bodyToVenta)
            .pipe(first(),
            catchError(error => {
              let message = 'Error';
              switch (error.status) {
                case 0:
                  message = 'Error al tratar de conectar al servidor';
                  break;
                case 409:
                  message = 'Ya posee una venta activa';
                  break;
                default:
                  break;
              }
              return of({ coti: null, message });
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



  addTipo(tipo: string): Observable<Tipo> {
    return this.http.post<Tipo>( this.baseUrl + 'inventario/addTipo', {name: tipo})
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
        return of(null);
      }));
  }

  getTipos(): Observable<Tipo[]>{
    return this.http.get<Tipo[]>( this.baseUrl + 'inventario/getTipos')
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
    return of(null);
  }));
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

  getAllItemsOfSubTypeII(subTipo: string, tipo: string): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl +  'inventario/getItemsSubTipo/' + tipo + '/' + subTipo)
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

  uploadFile(img: File, cod: string, oldPhoto: string): Observable<Item> {
    const formData: FormData = new FormData();
    formData.append('img', img);
    formData.append('oldPhoto', oldPhoto);
    return this.http.post<Item>(this.baseUrl +  'inventario/uploads/image/' + cod, formData)
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
                return of(null);
              })
            );
  }

  uploadFileCAT(img: File, cod: string, oldPhoto: string): Observable<Tipo> {
    const formData: FormData = new FormData();
    formData.append('img', img);
    formData.append('oldPhoto', oldPhoto);
    console.log(img);
    return this.http.post<Tipo>(this.baseUrl +  'inventario/uploads/imageCat/' + cod, formData)
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
                return of(null);
              })
            );
  }


  uploadFileSubCAT(img: File, cod: string, subCat: string, oldPhoto: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('img', img);
    formData.append('oldPhoto', oldPhoto);
    return this.http.post<any>(this.baseUrl +  'inventario/uploads/imageSubCat/' + cod + '/' + subCat, formData)
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
                return of(null);
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

  eliminarTipo(codigo: string): Observable<Tipo> {
    return this.http.delete<Tipo>(this.baseUrl +  'inventario/deleteTipo/' + codigo)
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
                            return of(null);
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
                                break;
                          }
                            return of(null);
                        }));
  }

  updateTipoName(codigo: string, tipoName: string): Observable<Tipo> {
    return this.http.put<Tipo>(this.baseUrl +  'inventario/updateTipo/', {codigo, tipoName})
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
            return of(null);
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

  eliminarItem(codigo: string): Observable<Item> {
    return this.http.delete<Item>(this.baseUrl +  'inventario/deleteItem/' + codigo)
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
                            return of(null);
                        }));
  }

  eliminarItemCoti(codigo: string, codigoItem: string, totalPrice: number, totalPriceNoIGV: number): Observable<Venta> {
    return this.http.post<Venta>(this.baseUrl +  'coti/eliminarItemCoti', { codigo, codigoItem, totalPrice, totalPriceNoIGV })
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
                            return of(null);
                        }));
  }

  eliminarCoti(codigo: string): Observable<{eliminada: boolean}> {
    return this.http.put<{eliminada: boolean}>(this.baseUrl +  'coti/eliminarCoti', { codigo })
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
                            return of({eliminada: false});
                        }));
  }

  getListOfItemsFilteredByRegex(value: string, limit = 0): Observable<Item[]> {
    return this.http.post<Item[]>(this.baseUrl + 'inventario/getListOfItemsFilteredByRegex', { value, limit })
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
                return of(null);
  }));
  }

  getListOfTagsFilteredByRegex(value: string, limit = 0): Observable<{name: string, deleted: boolean}[]> {
    return this.http.post<{name: string, deleted: boolean}[]>(this.baseUrl + 'inventario/getListOfTagsFilteredByRegex', { value, limit })
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
                return of(null);
  }));
  }

  getGraphOverTimeInfo(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'ventas/getInfoToPlotVentasOverTime')
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
        return of(null);
    }));
  }


  getItemMayorGananciaPosible(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/getItemMayorGananciaPosible')
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
        return of(null);
    }));
  }

  getGraphTopItemsFive(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'ventas/getItemsGanancias')
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
        return of(null);
    }));
  }

    getItemGIC(codigo: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/getItemGIC/' + codigo)
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
        return of(null);
    }));
  }

  getItemVentasPorMes(codigo: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'inventario/getItemVentasPorMes/' + codigo)
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
        return of(null);
    }));
  }

  getItemIngresosGananciasPorMes(codigo: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'ventas/getItemGananciaIngreso/' + codigo)
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
        return of(null);
    }));
  }

  getItemGananciasTotal(codigo: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'ventas/getGananciaTotalPorItem/' + codigo)
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
        return of(null);
    }));
  }

  getTags(): Observable<{name: string, deleted: boolean}[]> {
    return this.http.get<{name: string, deleted: boolean}[]>(this.baseUrl + 'inventario/getTags')
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
        return of(null);
    }));
  }

  addTag(tag: {name: string}): Observable<{name: string, deleted: boolean}> {
    return this.http.post<{name: string, deleted: boolean}>(this.baseUrl + 'inventario/addTag', tag)
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
        return of(null);
    }));
  }

  deleteTag(deleteArray: string[]): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'inventario/deteleTags', deleteArray)
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
        return of(null);
    }));
  }

  deleteCaracteristicas(deleteArray: string[], itemCod: string): Observable<Item> {
    return this.http.post<Item>(this.baseUrl + 'inventario/deteleCaracteristicas', { deleteArray, itemCod })
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
        return of(null);
    }));
  }

  reOrderTipos(tiposReOrder: Tipo[]): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'inventario/reorderTipos', { tiposReOrder })
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
        return of(null);
    }));
  }

  reOrderSubTipos(tipoCodigo: string, linksList: string[], subTipoList: string[]): Observable<Tipo> {
    return this.http.post<Tipo>(this.baseUrl + 'inventario/reorderSubTipos', { tipoCodigo, linksList, subTipoList })
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
        return of(null);
    }));
  }

  reOrderItems(itemReOrder: Item[]): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'inventario/reorderItems', { itemReOrder })
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
        return of(null);
    }));
  }

  changeFolder(newTipo: string, newSubTipo: string, codigo: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'inventario/changeFolder', { newTipo, newSubTipo, codigo })
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
        return of(null);
    }));
  }

  addCaracteristica(newCaracteristica: string, itemCod: string): Observable<Item> {
    return this.http.post<Item>(this.baseUrl + 'inventario/addCaracteristica', {newCaracteristica, itemCod})
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
        return of(null);
    }));
  }

  getGraphTopClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'ventas/getMejoresClientes')
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
        return of(null);
    }));
  }

  getVentasPotenciales(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/ventasPotenciales')
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
        return of(null);
    }));
  }

  getTotalVariaciones(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/getVariacionPosnegAll')
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
        return of(null);
    }));
  }

  getPeorMejorItem(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/getPeorMejorItem')
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
        return of(null);
    }));
  }

  getInvecionGananciasTotal(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/gananciasInvercionTotal')
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
        return of(null);
    }));
  }

  getGananciasTotalesSNS(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/getGananciasTotalesSNS')
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
        return of(null);
    }));
  }

  getItemMasVendidoCantidad(): Observable<Item> {
    return this.http.get<Item>(this.baseUrl + 'inventario/getItemsMasVendido')
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
        return of(null);
    }));
  }

  getTablaReporteItemGeneral(): Observable<TablaReporteItem[]> {
    return this.http.get<TablaReporteItem[]>(this.baseUrl + 'inventario/getTableInfItem')
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
        return of(null);
    }));
  }

  getClienteMasRegular(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'inventario/getClienteConMasCompras')
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
        return of(null);
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
  unidadDeMedida?: string;
  photo?: string;
  priceCosto?: number;
  tipo?: string;
}

export interface Documento {
  type: string;
  name: string;
  codigo: number;
  direccion: string;
}

export interface Variaciones {
  date: Date;
  cantidad: number;
  tipo: boolean;
  comentario: string;
  costoVar: number;
  usuario?: string;
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
  tags?: string[];
  caracteristicas?: string[];
  order?: number;
}

export interface Tipo {
  name: string;
  date: Date;
  codigo: string;
  subTipo: string[];
  deleted?: boolean;
  link?: string;
  subTipoLink?: string[];
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
  comentario: string;
  costoVar: number;
  codigo: string;
  cantidad: number;
  tipo: boolean;
}

export interface UploadCantidadSimple {
  cantidad: number;
  comentario: string;
  costoVar: number;
  codigo: string;
  tipo: boolean;
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
  celular_cliente?: string;
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
  unidadDeMedida?: string;
  priceCosto: number;
  tipo: string;
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

export interface TablaReporteItem  {
  name: string;
  codigo: string;
  cantidad: number;
  priceIGV: number;
  costoPropio: number;
  valueIngreso: number;
  valueGasto: number;
}
