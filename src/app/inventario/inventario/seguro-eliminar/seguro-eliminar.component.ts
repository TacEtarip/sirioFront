import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventarioManagerService } from 'src/app/inventario-manager.service';
import { Tipo } from '../../../inventario-manager.service';

@Component({
  selector: 'app-seguro-eliminar',
  templateUrl: './seguro-eliminar.component.html',
  styleUrls: ['./seguro-eliminar.component.css'],
})
export class SeguroEliminarComponent {
  onEliminar = new EventEmitter();
  disabled = false;

  constructor(
    public dialogRef: MatDialogRef<SeguroEliminarComponent>,
    private inv: InventarioManagerService,
    @Inject(MAT_DIALOG_DATA) public data: Tipo
  ) {}

  eliminarTipo() {
    this.disabled = true;
    this.inv.eliminarTipo(this.data.codigo).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      } else {
        this.disabled = false;
        this.dialogRef.close(null);
        alert('No se pudo eliminar esta categoria.');
      }
    });
  }
}
