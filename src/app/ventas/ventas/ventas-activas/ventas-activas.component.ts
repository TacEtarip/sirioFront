import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import {
  InventarioManagerService,
  Venta,
} from '../../../inventario-manager.service';
import { GenerarVentaComponent } from '../ventas-activas/generar-venta/generar-venta.component';
import { AuthService } from './../../../auth.service';
@Component({
  selector: 'app-ventas-activas',
  templateUrl: './ventas-activas.component.html',
  styleUrls: ['./ventas-activas.component.css'],
})
export class VentasActivasComponent implements OnInit {
  constructor(
    private inventarioMNG: InventarioManagerService,
    public auth: AuthService,
    public dialog: MatDialog
  ) {}

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
        coti: false,
        crear: true,
        ventaCod: '',
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((res: { message: string; venta: Venta }) => {
        if (res?.venta) {
          const newList = this.ventasActivas.value;
          newList.push(res.venta);
          this.ventasActivas.next(newList);
        }
      });
  }
}
