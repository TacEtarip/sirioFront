import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { NewItemDialogComponent } from '../new-item-dialog/new-item-dialog.component';
import { UploadsDialogComponent } from '../uploads-dialog/uploads-dialog.component';
import { SubTipoEditarComponent } from '../sub-tipo-editar/sub-tipo-editar.component';

import { Tipo, InventarioManagerService } from '../../../inventario-manager.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sub-lista-desplegable',
  templateUrl: './sub-lista-desplegable.component.html',
  styleUrls: ['./sub-lista-desplegable.component.css']
})
export class SubListaDesplegableComponent implements OnInit {
  @Input() nameSub: string;
  @Input() tipoCod: string;
  @Input() parentName: string;


  @Output() openDialogEliminarSub = new EventEmitter<string>();
  @Output() closeAllButThis = new EventEmitter<string>();

  @Output() loadListItemsSubTipo = new EventEmitter();

  listaDeItems = new BehaviorSubject<Item[]>([]);

  nameSub$ = new BehaviorSubject<string>(null);

  // listaDeSub = new BehaviorSubject<string[]>([]);

  status = false;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.nameSub$.next(this.nameSub);
  }

  openList(){
    if (this.status) {
      this.status = false;
    }
    else {
      this.status = true;
      this.loadListItemsSubTipo.emit(this.nameSub$.value);
      this.closeAllButThis.emit(this.nameSub$.value);
      this.inventarioMNG.getAllItemsOfSubType(this.nameSub$.value).subscribe((items: Item[]) => {
        this.listaDeItems.next(items);
      });
    }
  }

  openAgregarItemDialog() {
    const dialogRef = this.dialog.open(NewItemDialogComponent, {
      width: '800px',
      data: {subTipo: this.nameSub, parentTipoName: this.parentName}
    });
    dialogRef.afterClosed().pipe(first()).subscribe((itemCod: string) => {
      if (itemCod) {
          this.openUploadDialog(itemCod);
          this.inventarioMNG.getAllItemsOfSubType(this.nameSub$.value).subscribe((items: Item[]) => {
          this.listaDeItems.next(items);
        });
      }
    });
  }

  openUploadDialog(itemCod: string) {
    const dialogRef = this.dialog.open(UploadsDialogComponent, {
      width: '800px',
      data: {codigo: itemCod}
    });

    dialogRef.afterClosed().pipe(first()).subscribe(() => {
      this.loadListItemsSubTipo.emit(this.nameSub$.value);
    });
  }

  openDialogEliminar() {
    this.openDialogEliminarSub.emit(this.nameSub$.value);
  }

  openDialogEditar() {
    const dialogRef = this.dialog.open(SubTipoEditarComponent, {
      width: '600px',
      data: {codigo: this.tipoCod, antiguoSubName: this.nameSub}
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res: string) => {
        if (res !== undefined) {
          this.nameSub$.next(res);
        }
    });
  }

}
