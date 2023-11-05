import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventarioManagerService } from '../../../inventario-manager.service';

@Component({
  selector: 'app-eliminar-sub-tipo',
  templateUrl: './eliminar-sub-tipo.component.html',
  styleUrls: ['./eliminar-sub-tipo.component.css'],
})
export class EliminarSubTipoComponent {
  onEliminar = new EventEmitter();

  eliminating = false;

  constructor(
    public dialogRef: MatDialogRef<EliminarSubTipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codigo: string; subName: string },
    private invetarioMNG: InventarioManagerService
  ) {}

  eliminarSubTipo() {
    this.eliminating = true;
    this.invetarioMNG
      .eliminarSubTipo(this.data.codigo, this.data.subName)
      .subscribe((res) => {
        this.eliminating = false;
        if (res) {
          this.dialogRef.close({ message: true });
        } else {
          alert('Error Al Eliminar');
        }
      });
  }
}
