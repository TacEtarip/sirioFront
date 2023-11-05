import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';

@Component({
  selector: 'app-eliminar-dialog',
  templateUrl: './eliminar-dialog.component.html',
  styleUrls: ['./eliminar-dialog.component.css'],
})
export class EliminarDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EliminarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {}

  eliminarItem() {
    this.dialogRef.close(this.data.codigo);
  }
}
