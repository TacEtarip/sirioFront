import { WindowScrollService } from './../../window-scroll.service';
import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList,
  AfterViewInit, OnDestroy, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NewItemDialogComponent } from './new-item-dialog/new-item-dialog.component';
import { AgregarClaseItemComponent } from './agregar-clase-item/agregar-clase-item.component';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { ListaPlegableComponent } from './lista-plegable/lista-plegable.component';
import { UploadsDialogComponent } from './uploads-dialog/uploads-dialog.component';
import {InventarioManagerService, Item,  Tipo} from '../../inventario-manager.service';
import { AuthService } from '../../auth.service';
import { first, takeUntil, distinctUntilChanged} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import {  SeguroEliminarComponent } from './seguro-eliminar/seguro-eliminar.component';
import { EditarClaseComponent } from './editar-clase/editar-clase.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MarcasDialogComponent } from '../inventario/marcas-dialog/marcas-dialog.component';
import { SideopenService } from '../../sideopen.service';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioComponent implements OnInit, OnDestroy, AfterViewInit {


  specialGetItem = true;
  whatsAppLinkOne = 'https://wa.me/51977426349?text=' + 'Buenas, me gustaria obtener más información.';
  whatsAppLinkTwo = 'https://wa.me/51922412404?text=' + 'Buenas, me gustaria obtener más información.';

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

  destroy = new Subject();

  destroy$ = this.destroy.asObservable();

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              public auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router, private snackBar: MatSnackBar, private ar: ActivatedRoute, private wss: WindowScrollService,
              private titleService: Title, @Inject(PLATFORM_ID) private platformId: any,
              private metaTagService: Meta, @Inject(DOCUMENT) private document: Document) {
    this.nombreUsuario = auth.getDisplayUser();
    this.mobileQuery = media.matchMedia('(max-width: 1080px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    //  .removeEventListener('change', this.mobileQueryListener);
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Sirio Dinar | Inventario');
    this.metaTagService.updateTag(
      { name: 'description', content: 'Inventario de Sirio Dinar' }
    );
    this.loadList();
  }

  ngAfterViewInit(): void {
      const documentScroll = this.document.getElementById('listado');
      this.wss.elementScroll = documentScroll;
      fromEvent(documentScroll, 'scroll')
      .pipe(distinctUntilChanged(),
      takeUntil(this.destroy$))
        .subscribe((e: Event) => {
          this.wss.scrollY.next(this.getYPosition(e));
          this.wss.scrollH.next(documentScroll.scrollHeight);
          const porcent = Math.round((this.wss.scrollY.value * 100 ) / (this.wss.scrollH.value - this.wss.elementScroll.clientHeight));
          this.wss.porcent.next(porcent);
        });
  }

  loadListItems(loadInfo: {name: string, subORtipo: string}) {
    this.subORtipo = loadInfo.subORtipo;
    this.currentListToDisplay.next(loadInfo.name);
    if (this.subORtipo === 'tipo') {
      this.router.navigate(['/inventario', this.parsedRoute(loadInfo.name)]);
    }
    else {
      const tipoRoute = this.router.url.slice(1).split('/')[1];
      this.router.navigate(['/inventario', this.parsedRoute(tipoRoute), this.parsedRoute(loadInfo.name)]);
    }
  }

  parsedRoute(ruta: string) {
    return ruta.trim().replace(/ /g, '_');
  }


  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }

  changeState() {
    SideopenService.opened.next(true);
  }

  changeStateNeg() {
    SideopenService.opened.next(false);
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
    if (isPlatformBrowser(this.platformId)) {
      this.listItems.unsubscribe();
      this.order.unsubscribe();
      this.currentListToDisplay.unsubscribe();
      this.destroy.unsubscribe();
    }
    this.mobileQuery.removeListener(this.mobileQueryListener);
   // this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  aInventario() {
    this.router.navigate(['/inventario']);
  }

  aToLogin() {
    this.router.navigate(['/login']);
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



  goToLink(url: string) {
    if (url === 'w1') {
      window.open(this.whatsAppLinkOne, '_blank');
    }
    else if (url === 'w2') {
      window.open(this.whatsAppLinkTwo, '_blank');
    }
    else {
      window.open(url, '_blank');
    }
  }

  reloadPage() {
    this.router.navigate(['/inventario']);
  }
  ////////////////////////////////////////////////////////////

  openDialogMarcas() {
    const dialogRef = this.dialog.open(MarcasDialogComponent, {
      width: '800px',
    });
  }

}
