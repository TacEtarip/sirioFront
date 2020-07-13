import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NewItemDialogComponent } from './new-item-dialog/new-item-dialog.component';
import { AgregarClaseItemComponent } from './agregar-clase-item/agregar-clase-item.component';
import { BehaviorSubject } from 'rxjs';
import { ListaPlegableComponent } from './lista-plegable/lista-plegable.component';
import { UploadsDialogComponent } from './uploads-dialog/uploads-dialog.component';
import {InventarioManagerService, Item,  Tipo} from '../../inventario-manager.service';
import { AuthService } from '../../auth.service';
import { first } from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {  SeguroEliminarComponent } from './seguro-eliminar/seguro-eliminar.component';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  @ViewChildren(ListaPlegableComponent) listasPlegables: QueryList<ListaPlegableComponent>;

  codigo: string = null;
  panelOpenState = false;
  tipos: string[];
  dialogRef: MatDialogRef<AgregarClaseItemComponent, any>;
  dialogItemRef: MatDialogRef<NewItemDialogComponent, any>;
  dialogUploadRef: MatDialogRef<UploadsDialogComponent, any>;


  tiposSubject = new BehaviorSubject<Tipo[]>([]);

  keep = new BehaviorSubject<boolean>(true);

  listaItemsCurrent = 'Todos';

  listItems = new BehaviorSubject<Item[]>([]);

  nombreUsuario: string;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              private auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router) {
    this.nombreUsuario = auth.getDisplayUser();
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }


  closeAllButOne(current: string) {
    this.listasPlegables.forEach(lista => {
      if (current !== lista.tipoLista.name) {
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
      this.keep.next(false);
      this.getItems(this.listaItemsCurrent);
    });
  }

  changeItemCurrentList(nuevoTipo: string) {
    this.listaItemsCurrent = nuevoTipo;
    this.keep.next(false);
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
        this.keep.next(true);
        if (res != null) {
          this.listItems.next(res);
        } else {
          alert('Error Al Cargar Lista De Items');
        }
      });
    } else {
      this.inventarioMNG.getAllItemsByType(current).subscribe((res: Item[]) => {
        this.keep.next(true);
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
          if (lista.tipoLista.name === this.listaItemsCurrent) {
            lista.listaDeItems.next(value);
            return ;
          }
        });
      }
    });
    this.getItems(this.listaItemsCurrent);
  }

  ngOnDestroy(): void {
   this.listItems.unsubscribe();
   this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  aInventario() {
    this.router.navigate(['/inventario']);
  }

  openDialogDelete(tipo: Tipo) {

    const dialogRef = this.dialog.open(SeguroEliminarComponent, {
      width: '500px',
      data: tipo
    });

    dialogRef.componentInstance.onEliminar.pipe(first()).subscribe( (tipoE: Tipo) => {
      this.inventarioMNG.eliminarTipo(tipoE.codigo).subscribe(() => {
        this.inventarioMNG.getTipos().subscribe(res => {
          this.listaItemsCurrent = 'Todos';
          this.getItems(this.listaItemsCurrent);
          this.tiposSubject.next(res);
        });
      });
    });
  }

}
