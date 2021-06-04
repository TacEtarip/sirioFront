import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';

@Component({
  selector: 'app-eliminar-dialog',
  templateUrl: './eliminar-dialog.component.html',
  styleUrls: ['./eliminar-dialog.component.css']
})
export class EliminarDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EliminarDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Item) { }

  ngOnInit(): void {
  }

  eliminarItem() {
    this.dialogRef.close(this.data.codigo);
  }

}
