import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Venta, InventarioManagerService } from 'src/app/inventario-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguro-ejec-dialog',
  templateUrl: './seguro-ejec-dialog.component.html',
  styleUrls: ['./seguro-ejec-dialog.component.css']
})
export class SeguroEjecDialogComponent implements OnInit {


  ventaEnCurso = new BehaviorSubject<boolean>(false);

  constructor(public dialogRef: MatDialogRef<SeguroEjecDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public venta: Venta,
              private inventarioMNG: InventarioManagerService,
              private router: Router) { }

  ngOnInit(): void {
  }


  ejecutarVenta() {
    this.ventaEnCurso.next(true);
    this.inventarioMNG.ejecutarVenta(this.venta).subscribe((res) => {
      this.ventaEnCurso.next(false);
      if (res) {
        if (res.message.split('||')[0] === 'succes') {
          this.router.navigateByUrl(`/ventas/postVenta/${res.message.split('||')[1]}`);
          this.dialogRef.close();
        } else{
          alert('Ya no se dispone con las cantidades suficientes para realizar esta venta.');
          this.dialogRef.close();
        }

      } else {
        alert('Ocurrio un error, intente denuevo en un momento.');
        this.dialogRef.close();
      }
    });
  }
}
