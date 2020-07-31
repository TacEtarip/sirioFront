import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NewItemDialogComponent } from './new-item-dialog/new-item-dialog.component';
import { AgregarClaseItemComponent } from './agregar-clase-item/agregar-clase-item.component';
import { BehaviorSubject } from 'rxjs';
import { ListaPlegableComponent } from './lista-plegable/lista-plegable.component';
import { UploadsDialogComponent } from './uploads-dialog/uploads-dialog.component';
import {InventarioManagerService, Item,  Tipo} from '../../inventario-manager.service';
import { AuthService } from '../../auth.service';
import { first, debounceTime, skip} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {  SeguroEliminarComponent } from './seguro-eliminar/seguro-eliminar.component';
import { EditarClaseComponent } from './editar-clase/editar-clase.component';
import { EliminarDialogComponent } from './eliminar-dialog/eliminar-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MarcasDialogComponent } from '../inventario/marcas-dialog/marcas-dialog.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioComponent implements OnInit, OnDestroy {


  specialGetItem = true;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  selectedSort = 'date';
  subORtipo = 'tipo';

  @ViewChildren(ListaPlegableComponent) listasPlegables: QueryList<ListaPlegableComponent>;

  codigo: string = null;
  panelOpenState = false;
  tipos: string[];
  dialogRef: MatDialogRef<AgregarClaseItemComponent, any>;
  dialogItemRef: MatDialogRef<NewItemDialogComponent, any>;
  dialogUploadRef: MatDialogRef<UploadsDialogComponent, any>;

  tiposSubject = new BehaviorSubject<Tipo[]>([]);

  keep = new BehaviorSubject<boolean>(true);

  order = new BehaviorSubject<string>('dsc');

  listaItemsCurrent = 'Destacados';

  currentListToDisplay = new BehaviorSubject<string>('Destacados');

  listItems = new BehaviorSubject<Item[]>([]);

  nombreUsuario: string;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              private auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router, private snackBar: MatSnackBar) {
    this.nombreUsuario = auth.getDisplayUser();
    this.mobileQuery = media.matchMedia('(max-width: 820px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    //  .removeEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.loadList();
    // this.getItems(this.listaItemsCurrent);
    this.currentListToDisplay.subscribe((cl: string) => {
      if (this.specialGetItem) {
        this.specialGetItem = false;
      } else {
        this.inventarioMNG.getItemsSorted(this.subORtipo, cl, this.selectedSort, this.order.value).subscribe((res: Item[]) => {
          this.listItems.next(res);
          this.keep.next(true);
        });
      }
    });
    this.order.pipe(skip(1), debounceTime(300)).subscribe((order: string) => {
      this.inventarioMNG.getItemsSorted(this.subORtipo, this.currentListToDisplay.value,
        this.selectedSort, order).subscribe((res: Item[]) => {
        this.listItems.next(res);
        this.keep.next(true);
      });
    });
  }

  loadListItems(loadInfo: {name: string, subORtipo: string}) {
    this.keep.next(false);
    this.subORtipo = loadInfo.subORtipo;
    this.currentListToDisplay.next(loadInfo.name);
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
      this.order.next('asc');
    });
  }

  changeItemCurrentList(newCurrent: string) {
    this.listaItemsCurrent = newCurrent;
    this.order.next(this.order.value);
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

  ngOnDestroy(): void {
   this.listItems.unsubscribe();
   this.order.unsubscribe();
   this.currentListToDisplay.unsubscribe();
   this.mobileQuery.removeListener(this.mobileQueryListener);
   // this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  aInventario() {
    this.router.navigate(['/inventario']);
  }

  openDialogDelete(tipo: Tipo) {
    const dialogRef = this.dialog.open(SeguroEliminarComponent, {
      width: '600px',
      data: tipo
    });

    dialogRef.componentInstance.onEliminar.pipe(first()).subscribe( (tipoE: Tipo) => {
      this.inventarioMNG.eliminarTipo(tipoE.codigo).subscribe(() => {
        this.inventarioMNG.getTipos().subscribe(res => {
          window.location.reload();
          // this.tiposSubject.next(res);
        });
        });
    });
  }

  openDialogEditar(tipo: Tipo) {
    const dialogRef = this.dialog.open(EditarClaseComponent, {
      width: '600px',
      data: tipo
    });

    dialogRef.componentInstance.onSub.pipe(first()).subscribe( (tipoE: Tipo) => {
      dialogRef.close();
      this.inventarioMNG.updateTipoName(tipoE).pipe(first()).subscribe(() => {
        this.inventarioMNG.getTipos().subscribe(res => {
          this.tiposSubject.next(res);
        });
        });
      });
  }

  openDialogEliminarItem(item: Item) {
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '600px',
      data: item
    });

    dialogRef.afterClosed().pipe(first()).subscribe((cod: string) => {
      if (cod) {
        this.inventarioMNG.eliminarItem(cod).subscribe((res) => {
          if (res) {
            this.keep.next(false);
            this.order.next(this.order.value);
            this.snackBar.open('Item Eliminado!!', '', {
              duration: 2000,
            });
          }
        });
      }
    });
  }

  orderDsc() {
    this.keep.next(false);
    this.order.next('dsc');
  }

  orderAsc() {
    this.keep.next(false);
    this.order.next('asc');
  }

  onChageTipo() {
    this.keep.next(false);
    this.order.next(this.order.value);
  }

  reloadPage() {
    window.location.reload();
  }
  ////////////////////////////////////////////////////////////

  openDialogMarcas() {
    const dialogRef = this.dialog.open(MarcasDialogComponent, {
      width: '800px',
    });
  }

}
