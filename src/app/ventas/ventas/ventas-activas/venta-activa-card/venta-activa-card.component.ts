import { Component, OnInit, Input } from '@angular/core';
import { ItemsVentaForCard, InventarioManagerService, Venta } from '../../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SeguroEjecDialogComponent } from '../../seguro-ejec-dialog/seguro-ejec-dialog.component';
import { Router } from '@angular/router';

export interface TableVentaInfo {
  codigo: string;
  name: string;
  subName: string;
  subNameSecond: string;
  cantidad: number;
  priceIGV: number;
  total: number;
  eliminar: boolean;
}

@Component({
  selector: 'app-venta-activa-card',
  templateUrl: './venta-activa-card.component.html',
  styleUrls: ['./venta-activa-card.component.css']
})
export class VentaActivaCardComponent implements OnInit {

  @Input() ventaCod: Venta;


  displayedColumnsVenta: string[] = ['codigo', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total', 'eliminar'];

  tableVentaInfo$ = new BehaviorSubject<TableVentaInfo[]>([]);

  tableVentaInfo: TableVentaInfo[] = [];

  precios: number[] = [];

  costoTotal = new BehaviorSubject<number>(0);

  constructor(private inventarioMNG: InventarioManagerService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.inventarioMNG.obtenerCardPreInfoVenta(this.ventaCod.codigo).subscribe((res) => {
      res.forEach(infoVenta => {
        if (infoVenta.cantidadSC && infoVenta.cantidadSC.cantidadVenta > 0) {
          const tableInfo: TableVentaInfo = {codigo: infoVenta.codigo, name: infoVenta.name,
            subName: infoVenta.cantidadSC.name, subNameSecond: infoVenta.cantidadSC.nameSecond,
            cantidad: infoVenta.cantidadSC.cantidadVenta, priceIGV: infoVenta.priceIGV,
            total: this.getTotal(infoVenta.cantidadSC.cantidadVenta, infoVenta.priceIGV) ,
            eliminar: true};
          this.tableVentaInfo.push(tableInfo);
          this.precios.push(tableInfo.total);
        }
        else if (!infoVenta.cantidadSC) {
          const tableInfo: TableVentaInfo = {codigo: infoVenta.codigo, name: infoVenta.name,
            subName: '...', subNameSecond: '...',
            cantidad: infoVenta.cantidad, priceIGV: infoVenta.priceIGV,
            total: this.getTotal(infoVenta.cantidad, infoVenta.priceIGV), eliminar: true};

          this.tableVentaInfo.push(tableInfo);
          this.precios.push(tableInfo.total);
        }
      });
      this.costoTotal.next(this.getVentaCostoTotal());
      this.tableVentaInfo$.next(this.tableVentaInfo);
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

  ejecutarVenta() {
    this.dialog.open(SeguroEjecDialogComponent, {
      width: '600px',
      data: this.ventaCod,
    });
  }

  anularVenta() {
    this.inventarioMNG.anularVenta(this.ventaCod).subscribe((res) => {
      if (res) {
        this.router.navigate(['/inventario']);
      }
    });
  }

  getTotalCost() {
    // return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

}
