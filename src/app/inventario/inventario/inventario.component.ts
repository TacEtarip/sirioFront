import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NewItemDialogComponent } from './new-item-dialog/new-item-dialog.component';
import { AgregarClaseItemComponent } from './agregar-clase-item/agregar-clase-item.component';
import { BehaviorSubject } from 'rxjs';
import { ListaPlegableComponent } from './lista-plegable/lista-plegable.component';
import { UploadsDialogComponent } from './uploads-dialog/uploads-dialog.component';
import {InventarioManagerService, Item } from '../../inventario-manager.service';
import { AuthService } from '../../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit, OnDestroy {

  @ViewChildren(ListaPlegableComponent) listasPlegables: QueryList<ListaPlegableComponent>;

  codigo: string = null;
  panelOpenState = false;
  tipos: string[];
  dialogRef: MatDialogRef<AgregarClaseItemComponent, any>;
  dialogItemRef: MatDialogRef<NewItemDialogComponent, any>;
  dialogUploadRef: MatDialogRef<UploadsDialogComponent, any>;

  tiposSubject = new BehaviorSubject<string[]>([]);

  listaItemsCurrent = 'Todos';

  listItems = new BehaviorSubject<Item[]>([]);

  nombreUsuario: string;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService, private auth: AuthService) {
    this.nombreUsuario = auth.getUser();
  }


  closeAllButOne(current: string) {
    this.listasPlegables.forEach(lista => {
      if (current !== lista.tipoLista) {
        lista.status = false;
      }
    });
  }

  openDialog() {
    this.dialogItemRef = this.dialog.open(NewItemDialogComponent);
    this.dialogItemRef.componentInstance.tipoOn = this.listaItemsCurrent;
    this.dialogItemRef.componentInstance.onNewItem.pipe(first()).subscribe((cod: string) => {
      this.dialogItemRef.close();
      this.codigo = cod;
    });
    this.dialogItemRef.afterClosed().pipe(first()).subscribe(() => {
      this.dialogItemRef.componentInstance.onNewItem.unsubscribe();
      if (this.codigo !== null) {
        this.openUploadDialog();
      }
    });
  }

  openUploadDialog() {
    this.dialogUploadRef = this.dialog.open(UploadsDialogComponent, {
      width: '800px',
    });
    this.dialogUploadRef.componentInstance.codigo = this.codigo;
    this.dialogUploadRef.afterClosed().pipe(first()).subscribe(() => {
      this.codigo = null;
      this.getItems(this.listaItemsCurrent);
    });
  }

  changeItemCurrentList(nuevoTipo: string) {
    this.listaItemsCurrent = nuevoTipo;
    if (this.listaItemsCurrent !== 'Todos') {
      this.closeAllButOne(this.listaItemsCurrent);
    }
    this.getItems(this.listaItemsCurrent);
  }

  openDialogAgregarCat(): void {
    this.dialogRef = this.dialog.open(AgregarClaseItemComponent, {
      width: '600px',
    });
    this.dialogRef.componentInstance.onSub.pipe(first()).subscribe(() => {
      this.loadList();
      this.dialogRef.close();
     });
    this.dialogRef.afterClosed().pipe(first()).subscribe(() => this.dialogRef.componentInstance.onSub.unsubscribe());
  }

  loadList() {
    this.inventarioMNG.getTipos().subscribe(res => {
      this.tiposSubject.next(res);
    });
  }

  getItems(current: string) {
    if (current === 'Todos') {
      this.inventarioMNG.getAllItems().subscribe((res: Item[]) => {
        if (res != null) {
          this.listItems.next(res);
        } else {
          alert('Error Al Cargar Lista De Items');
        }
      });
    } else {
      this.inventarioMNG.getAllItemsByType(current).subscribe((res: Item[]) => {
        if (res != null) {
          this.listItems.next(res);
        } else {
          alert('Error Al Cargar Lista De Items');
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadList();
    this.listItems.subscribe((value: Item[]) => {
      if (this.listaItemsCurrent !== 'Todos') {
        this.listasPlegables.forEach(lista => {
          if (lista.tipoLista === this.listaItemsCurrent) {
            lista.listaDeItems = value;
            return ;
          }
        });
      }
    });
    this.getItems(this.listaItemsCurrent);
  }

  ngOnDestroy(): void {
   this.listItems.unsubscribe();
  }

}
