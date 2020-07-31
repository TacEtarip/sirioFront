import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { NewItemDialogComponent } from '../new-item-dialog/new-item-dialog.component';
import { BehaviorSubject, from } from 'rxjs';
import { AgregarSubCategoriasComponent } from '../agregar-sub-categorias/agregar-sub-categorias.component';
import { InventarioManagerService } from '../../../inventario-manager.service';
import { SubListaDesplegableComponent } from '../sub-lista-desplegable/sub-lista-desplegable.component';
import { EliminarSubTipoComponent } from '../eliminar-sub-tipo/eliminar-sub-tipo.component';

import { Tipo } from '../../../inventario-manager.service';
import { first, delay } from 'rxjs/operators';
@Component({
  selector: 'app-lista-plegable',
  templateUrl: './lista-plegable.component.html',
  styleUrls: ['./lista-plegable.component.css']
})
export class ListaPlegableComponent implements OnInit {

  @ViewChildren(SubListaDesplegableComponent) subListasPlegables: QueryList<SubListaDesplegableComponent>;

  @Input() tipoLista: Tipo;

  @Output() openDialogEliminarOnMain = new EventEmitter<Tipo>();
  @Output() openDialogEditarTipo = new EventEmitter<Tipo>();
  @Output() closeAllButThis = new EventEmitter();

  @Output() loadItemsOnMainTipo = new EventEmitter<{name: string, subORtipo: string}>();


  listaDeSub = new BehaviorSubject<string[]>([]);

  status = false;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
  }

  openList(){
    if (this.status) {
      this.status = false;
      this.closeAllSubList();
    }
    else {
      this.status = true;
      this.loadItemsOnMainTipo.emit({name: this.tipoLista.name, subORtipo: 'tipo'});
      this.closeAllButThis.emit(this.tipoLista.name);
      this.inventarioMNG.getSubTipos(this.tipoLista.codigo).subscribe((res: Tipo) => {
        this.listaDeSub.next(res.subTipo);
      });
      // this.sendTipo.emit(this.tipoLista.name);
    }
  }

  loadSLI(subName: string) {
    this.loadItemsOnMainTipo.emit({name: subName, subORtipo: 'sub'});
  }

  closeAllSubList() {
    this.subListasPlegables.forEach(sublista => {
        sublista.status$.next(false);
    });
  }

  openDialogSubCat() {
    const dialogRef = this.dialog.open(AgregarSubCategoriasComponent, {
      width: '600px',
      data: this.tipoLista
    });
    dialogRef.componentInstance.onSucces.pipe().subscribe(() => {
      this.inventarioMNG.getSubTipos(this.tipoLista.codigo).subscribe((res: Tipo) => {
        this.listaDeSub.next(res.subTipo);
      });
    });
    dialogRef.afterClosed().pipe(first()).subscribe((() => {
      dialogRef.componentInstance.onSucces.unsubscribe();
    }));
  }

  eliminarSubTipo(subName: string) {
    const dialogRef = this.dialog.open(EliminarSubTipoComponent, {
      width: '600px',
      data: {codigo: this.tipoLista.codigo, subName}
    });
    dialogRef.afterClosed().pipe(first(), delay(300)).subscribe(() => {
      this.inventarioMNG.getSubTipos(this.tipoLista.codigo).subscribe((res: Tipo) => {
        this.listaDeSub.next(res.subTipo);
      });
    });
  }

  openDialogEliminar() {
    this.openDialogEliminarOnMain.emit(this.tipoLista);
  }

  openDialogEditar() {
    this.openDialogEditarTipo.emit(this.tipoLista);
  }

  closeAllButOne(current: string) {
    this.subListasPlegables.forEach(sublista => {
      if (current !== sublista.nameSub) {
        sublista.status$.next(false);
      }
    });
  }

}
