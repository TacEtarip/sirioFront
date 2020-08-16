import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Venta, InventarioManagerService } from 'src/app/inventario-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguro-anular',
  templateUrl: './seguro-anular.component.html',
  styleUrls: ['./seguro-anular.component.css']
})
export class SeguroAnularComponent implements OnInit {

  ventaEnCurso = new BehaviorSubject<boolean>(false);

  constructor(public dialogRef: MatDialogRef<SeguroAnularComponent>,
              @Inject(MAT_DIALOG_DATA) public venta: Venta,
              private inventarioMNG: InventarioManagerService,
              private router: Router) { }

  ngOnInit(): void {
  }

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
