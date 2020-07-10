import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { NewItemDialogComponent } from '../new-item-dialog/new-item-dialog.component';
@Component({
  selector: 'app-lista-plegable',
  templateUrl: './lista-plegable.component.html',
  styleUrls: ['./lista-plegable.component.css']
})
export class ListaPlegableComponent implements OnInit {

  @Input() tipoLista: string;

  @Output() openDialogOnMain = new EventEmitter();
  @Output() sendTipo = new EventEmitter<string>();

  listaDeItems: Item[];

  status = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openList(){
    if (this.status) {
      this.status = false;
      this.sendTipo.emit('Todos');
    }
    else {
      this.status = true;
      this.sendTipo.emit(this.tipoLista);
    }
  }

  openDialog() {
    this.openDialogOnMain.emit();
  }

}
