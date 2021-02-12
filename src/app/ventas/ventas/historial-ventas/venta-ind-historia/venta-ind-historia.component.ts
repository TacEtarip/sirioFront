import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Venta, InventarioManagerService, ItemVendido, VentaCompleta } from 'src/app/inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { SeguroAnularComponent } from '../seguro-anular/seguro-anular.component';

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
  selector: 'app-venta-ind-historia',
  templateUrl: './venta-ind-historia.component.html',
  styleUrls: ['./venta-ind-historia.component.css']
})
export class VentaIndHistoriaComponent implements OnInit {

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


  dummyVenta: VentaCompleta = {codigo: '000000', totalPrice: 0, totalPriceNoIGV: 0,
                                estado: '0000', documento: null, itemsVendidos: null, date: '' };

  venta$ = new BehaviorSubject<Venta>(null);

  constructor(private activatedRoute: ActivatedRoute, private inventarioMNG: InventarioManagerService,
              private router: Router, public dialog: MatDialog) {
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(first()).subscribe(param => {
      const ruta = param.get('ventaCod');

      this.inventarioMNG.getVentaCompleta(ruta).subscribe((res: Venta) => {
        if (res) {
          if (res.estado !== 'ejecutada' && res.estado !== 'anuladaPost') {
            this.router.navigate(['/ventas/eject/404']);
          }
        } else {
          this.router.navigate(['/ventas/eject/404']);
        }
        this.venta = res;
        for (const item of res.itemsVendidos) {
          this.dataSource.push({codigo: item.codigo, name: item.name,
                                cantidad: item.cantidad, priceIGV: item.priceIGV,
                                totalPrice: item.totalPrice});
        }
        this.venta$.next(res);
        this.date = new Date(res.date).toLocaleTimeString();
        this.dataSource$.next(this.dataSource);
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

  anularVenta() {
    this.dialog.open(SeguroAnularComponent, {
      width: '600px',
      data: this.venta$.value,
    });
  }

  descargarPDF() {
    window.open('https://inventario-sirio-dinar.herokuapp.com/inventario/pdf/' + this.venta$.value.codigo + '.pdf', '_blank');
  }

  desargarPDFsunat() {
    window.open(this.venta$.value.linkComprobante, '_blank');
  }

  descargarGUIA() {
    window.open(this.venta$.value.guia_link, '_blank');
  }

}
