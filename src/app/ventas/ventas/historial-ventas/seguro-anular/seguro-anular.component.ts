import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  InventarioManagerService,
  Venta,
} from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-seguro-anular',
  templateUrl: './seguro-anular.component.html',
  styleUrls: ['./seguro-anular.component.css'],
})
export class SeguroAnularComponent implements OnInit {
  ventaEnCurso = new BehaviorSubject<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<SeguroAnularComponent>,
    @Inject(MAT_DIALOG_DATA) public venta: Venta,
    private inventarioMNG: InventarioManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ejecutarAnular() {
    this.ventaEnCurso.next(true);
    this.inventarioMNG.anularVentaPost(this.venta).subscribe((res) => {
      this.ventaEnCurso.next(false);
      if (res) {
        if (res.message.split('||')[0] === 'succes') {
          this.router.navigateByUrl(`/ventas/historialVentas`);
          this.dialogRef.close();
        }
      } else {
        alert('Ocurrio un error, intente denuevo en un momento.');
        this.dialogRef.close();
      }
    });
  }
}
