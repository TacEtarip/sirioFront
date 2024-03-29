import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Venta, InventarioManagerService, ItemVendido } from 'src/app/inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface TableData {
  codigo: string;
  name: string;
  cantidad: number;
  priceIGV: number;
  totalPrice: number;
}

export interface TableVentaInfo {
  codigo: string;
  name: string;
  subName: string;
  subNameSecond: string;
  cantidad: number;
  priceIGV: number;
  total: number;
}

@Component({
  selector: 'app-post-venta',
  templateUrl: './post-venta.component.html',
  styleUrls: ['./post-venta.component.css']
})
export class PostVentaComponent implements OnInit {

  venta: Venta;

  date: string;

  displayedColumnsVenta: string[] = ['codigo', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total'];

  displayedColumns: string[] = ['codigo', 'name', 'cantidad',  'priceIGV', 'totalPrice'];

  dataSource: TableData[] = [];

  dataSource$ = new BehaviorSubject<TableData[]>([]);

  tableVentaInfo$ = new BehaviorSubject<TableVentaInfo[]>([]);

  tableVentaInfo: TableVentaInfo[] = [];

  precios: number[] = [];

  costoTotal = new BehaviorSubject<number>(0);


  dummyVenta: Venta = {codigo: '000000', totalPrice: 0, totalPriceNoIGV: 0,
                                estado: '0000', documento: null, itemsVendidos: null,
                                linkComprobante: '', vendedor: '', tipoVendedor: '', medio_de_pago: ''};

  venta$ = new BehaviorSubject<Venta>(this.dummyVenta);

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private activatedRoute: ActivatedRoute, private inventarioMNG: InventarioManagerService, private router: Router) {
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(first()).subscribe(param => {
      const ruta = param.get('postVentaCod');
      this.inventarioMNG.getVenta(ruta).subscribe((res: Venta) => {
        if (res) {
          if (res.estado !== 'ejecutada') {
            this.router.navigate(['/ventas/eject/404']);
          }
        } else {
          this.router.navigate(['/ventas/eject/404']);
        }
        if (res !== null) {
          for (const item of res.itemsVendidos) {
            this.dataSource.push({codigo: item.codigo, name: item.name,
                                  cantidad: item.cantidad, priceIGV: item.priceIGV,
                                  totalPrice: item.totalPrice});
          }
          this.venta$.next(res);
          this.dataSource$.next(this.dataSource);
        }

      });

      this.inventarioMNG.obtenerCardPreInfoVenta(ruta).subscribe((res) => {
        res.forEach(infoVenta => {
          if (infoVenta.cantidadSC && infoVenta.cantidadSC.cantidadVenta > 0) {
            const tableInfo: TableVentaInfo = {codigo: infoVenta.codigo, name: infoVenta.name,
              subName: infoVenta.cantidadSC.name, subNameSecond: infoVenta.cantidadSC.nameSecond,
              cantidad: infoVenta.cantidadSC.cantidadVenta, priceIGV: infoVenta.priceIGV,
              total: this.getTotal(infoVenta.cantidadSC.cantidadVenta, infoVenta.priceIGV)};
            this.tableVentaInfo.push(tableInfo);
            this.precios.push(tableInfo.total);
          }
          else if (!infoVenta.cantidadSC) {
            const tableInfo: TableVentaInfo = {codigo: infoVenta.codigo, name: infoVenta.name,
              subName: '...', subNameSecond: '...',
              cantidad: infoVenta.cantidad, priceIGV: infoVenta.priceIGV,
              total: this.getTotal(infoVenta.cantidad, infoVenta.priceIGV)};
            this.tableVentaInfo.push(tableInfo);
            this.precios.push(tableInfo.total);
          }
        });
        this.costoTotal.next(this.getVentaCostoTotal());
        this.tableVentaInfo$.next(this.tableVentaInfo);
      });
    });
  }


  getTotal(n1: number, n2: number): number {
    return Math.round(((n1 * n2) + Number.EPSILON) * 100) / 100;
  }

  getVentaCostoTotal() {
    let sum = 0;
    this.precios.forEach(precio => {
      sum = sum + precio;
    });
    return sum;
  }

  descargarPDF() {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://inventario-sirio-dinar.herokuapp.com/inventario/pdf/' + this.venta$.value.codigo + '.pdf', '_blank');
    }
  }

  desargarPDFsunat() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.venta$.value.linkComprobante, '_blank');
    }
  }

  descargarGUIA() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.venta$.value.guia_link, '_blank');
    }
  }

}
