import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventarioManagerService } from '../../../inventario-manager.service';
import { Tipo } from '../../../inventario-manager.service';

@Component({
  selector: 'app-eliminar-sub-tipo',
  templateUrl: './eliminar-sub-tipo.component.html',
  styleUrls: ['./eliminar-sub-tipo.component.css']
})
export class EliminarSubTipoComponent implements OnInit {

  onEliminar = new EventEmitter();

  eliminating = false;

  constructor(public dialogRef: MatDialogRef<EliminarSubTipoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {codigo: string, subName: string},
              private invetarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
  }

  eliminarSubTipo() {
    this.eliminating = true;
    this.invetarioMNG.eliminarSubTipo(this.data.codigo, this.data.subName).subscribe((res) => {
      this.eliminating = false;
      if (res) {
        this.dialogRef.close({message: true});
      } else {
        alert('Error Al Eliminar');
      }
    });
  }

}
