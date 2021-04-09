import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { InventarioManagerService, Venta } from '../../../inventario-manager.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { GenerarVentaComponent } from '../ventas-activas/generar-venta/generar-venta.component';
@Component({
  selector: 'app-ventas-activas',
  templateUrl: './ventas-activas.component.html',
  styleUrls: ['./ventas-activas.component.css']
})
export class VentasActivasComponent implements OnInit {

  constructor(private inventarioMNG: InventarioManagerService, public dialog: MatDialog) { }

  ventasActivas = new BehaviorSubject<Venta[]>(null);

  load = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.inventarioMNG.getVentaActivaFull().subscribe((res) => {
      this.ventasActivas.next(res);
      this.load.next(true);
    });
  }

  openCrearVentaDialog() {
    const dialogRef = this.dialog.open(GenerarVentaComponent, {
      width: '600px',
      data: {
        coti: false, crear: true, ventaCod: ''
      }
    });

    dialogRef.afterClosed().subscribe((res: { message: string, venta: Venta }) => {
      if (res && res.venta) {
        const newList = this.ventasActivas.value;
        newList.push(res.venta);
        this.ventasActivas.next(newList);
      }
    });
  }

  /*
  openAddItemDialog() {
    const dialogRef = this.dialog.open(GenerarVentaComponent, {
      width: '600px',
      data: {
        coti: false, crear: false, ventaCod: this.ventasActiva.value.codigo
      }
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: { message: string, venta: Venta }) => {
      if (res && res.venta) {
        this.ventasActiva.next(res.venta);
      }
    });
  }*/

}
