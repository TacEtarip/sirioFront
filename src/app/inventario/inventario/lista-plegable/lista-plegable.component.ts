import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { NewItemDialogComponent } from '../new-item-dialog/new-item-dialog.component';
import { BehaviorSubject } from 'rxjs';

import { Tipo } from '../../../inventario-manager.service';
@Component({
  selector: 'app-lista-plegable',
  templateUrl: './lista-plegable.component.html',
  styleUrls: ['./lista-plegable.component.css']
})
export class ListaPlegableComponent implements OnInit {

  @Input() tipoLista: Tipo;

  @Output() openDialogOnMain = new EventEmitter();
  @Output() openDialogEliminarOnMain = new EventEmitter<Tipo>();
  @Output() openDialogEditarTipo = new EventEmitter<Tipo>();
  @Output() sendTipo = new EventEmitter<string>();

  listaDeItems = new BehaviorSubject<Item[]>([]);

  status = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openList(){
    if (this.status) {
      this.status = false;
      this.sendTipo.emit('Todos');
      window.scroll(0, 0);
    }
    else {
      this.status = true;
      this.sendTipo.emit(this.tipoLista.name);
      window.scroll(0, 0);
    }
  }

  openDialog() {
    this.openDialogOnMain.emit();
  }

  openDialogEliminar() {
    this.openDialogEliminarOnMain.emit(this.tipoLista);
  }

  openDialogEditar() {
    this.openDialogEditarTipo.emit(this.tipoLista);
  }

}
