import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Venta, InventarioManagerService, ItemVendido, VentaCompleta, ItemsVentaForCard } from 'src/app/inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GenerarVentaComponent } from '../../ventas-activas/generar-venta/generar-venta.component';
import { TableVentaInfo } from '../../ventas-activas/venta-activa-card/venta-activa-card.component';
import { GenerarCotiComponent } from '../generar-coti/generar-coti.component';
import { PreExcelDialogComponent } from '../pre-excel-dialog/pre-excel-dialog.component';
import { saveAs } from 'file-saver';

interface TableData {
  codigo: string;
  name: string;
  cantidad: number;
  priceIGV: number;
  totalPrice: number;
}


@Component({
  selector: 'app-full-coti',
  templateUrl: './full-coti.component.html',
  styleUrls: ['./full-coti.component.css']
})
export class FullCotiComponent implements OnInit {

  venta: Venta;

  date: string;

  displayedColumnsVenta: string[] = ['codigo', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total'];

  displayedColumns: string[] = ['codigo', 'name', 'cantidad',  'priceIGV', 'totalPrice', 'editar', 'eliminar'];

  dataSource$ = new BehaviorSubject<MatTableDataSource<ItemVendido>>(null);

  tableVentaInfo$ = new BehaviorSubject<MatTableDataSource<ItemsVentaForCard>>(null);

  precios: number[] = [];

  costoTotal = new BehaviorSubject<number>(0);

  venta$ = new BehaviorSubject<Venta>(null);

  constructor(private activatedRoute: ActivatedRoute, private inventarioMNG: InventarioManagerService,
              private router: Router, public dialog: MatDialog) {
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe().subscribe(param => {
      const ruta = param.get('cotiCod');
      this.inventarioMNG.getCotiCompleta(ruta).subscribe((res: Venta) => {
        if (res) {
          if (res.estado === 'eliminada') {
            this.router.navigate(['/ventas/eject/404']);
          }
        } else {
          this.router.navigate(['/ventas/eject/404']);
        }
        this.venta = res;
        const temp = new MatTableDataSource(res.itemsVendidos);
        this.dataSource$.next(temp);
        this.venta$.next(res);
        this.date = new Date(res.date).toLocaleTimeString();
      });

      this.inventarioMNG.obtenerCardCotiInfo(ruta).subscribe((res) => {
        const secondTEMP = new MatTableDataSource(res);
        this.tableVentaInfo$.next(secondTEMP);
      });
    });
  }

  openAddItemDialog() {
    const dialogRef = this.dialog.open(GenerarVentaComponent, {
      width: '600px',
      data: {
        coti: true, crear: false, ventaCod: this.venta$.value.codigo
      }
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: { message: string, coti: Venta }) => {
      if (res && res.coti) {
        const temp = new MatTableDataSource(res.coti.itemsVendidos);
        this.dataSource$.next(temp);
        this.venta$.next(res.coti);
        this.inventarioMNG.obtenerCardCotiInfo(this.venta$.value.codigo).subscribe((resT) => {
          const secondTEMP = new MatTableDataSource(resT);
          this.tableVentaInfo$.next(secondTEMP);
        });
        // this.ventasActiva.next(res.venta);
      }
    });
  }

  openEditarItemDialog(item: TableVentaInfo) {
    const dialogRef = this.dialog.open(GenerarVentaComponent, {
      width: '600px',
      data: {
        coti: true, crear: false, ventaCod: this.venta$.value.codigo, item
      }
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: { message: string, coti: Venta }) => {
      if (res && res.coti) {
        const temp = new MatTableDataSource(res.coti.itemsVendidos);
        this.dataSource$.next(temp);
        this.venta$.next(res.coti);
        this.inventarioMNG.obtenerCardCotiInfo(this.venta$.value.codigo).subscribe((resT) => {
          const secondTEMP = new MatTableDataSource(resT);
          this.tableVentaInfo$.next(secondTEMP);
        });
      }
    });
  }

  eliminarItem(info) {
    this.inventarioMNG.eliminarItemCoti(this.venta$.value.codigo, info.codigo, info.totalPrice, info.totalPriceNoIGV).subscribe(res => {
      const temp = new MatTableDataSource(res.itemsVendidos);
      this.dataSource$.next(temp);
      this.venta$.next(res);
      this.inventarioMNG.obtenerCardCotiInfo(this.venta$.value.codigo).subscribe((resT) => {
        const secondTEMP = new MatTableDataSource(resT);
        this.tableVentaInfo$.next(secondTEMP);
      });
    });
  }

  eliminarCoti() {
    this.inventarioMNG.eliminarCoti(this.venta$.value.codigo).subscribe(res => {
      if (res.eliminada) {
        this.router.navigate(['/ventas/cotizaciones']);
      } else {
        alert('Error al eliminar');
      }
    });
  }

  openClonar() {
    const dialogReg = this.dialog.open(GenerarCotiComponent, {
      width: '600px',
      data: this.venta$.value
    });

    dialogReg.afterClosed().subscribe((res: {  message: string, coti: Venta }) => {
      if (res.coti) {
        this.router.navigate([`/ventas/cotizaciones/${res.coti.codigo}`]);
      }
    });
  }

  descargarCotiExcel() {
    this.dialog.open(PreExcelDialogComponent, {
      width: '600px',
      data: { cotiCod: this.venta$.value.codigo, pdf: false }
    });
  }

  descargarCotiPDF() {
    this.dialog.open(PreExcelDialogComponent, {
      width: '600px',
      data: { cotiCod: this.venta$.value.codigo, pdf: true }
    });
  }

}
