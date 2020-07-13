import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tipo } from '../../../inventario-manager.service';

@Component({
  selector: 'app-seguro-eliminar',
  templateUrl: './seguro-eliminar.component.html',
  styleUrls: ['./seguro-eliminar.component.css']
})
export class SeguroEliminarComponent implements OnInit {

  onEliminar = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<SeguroEliminarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Tipo) { }

  ngOnInit(): void {
  }

  eliminarTipo() {
    this.onEliminar.emit(this.data);
  }
}
