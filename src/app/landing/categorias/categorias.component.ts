import { Title, Meta } from '@angular/platform-browser';
import { EditarCantidadesDialogComponent } from './../../inventario/inventario/editar-cantidades-dialog/editar-cantidades-dialog.component';
import { ChangeOrderComponent } from './../change-order/change-order.component';
import { AgregarSubCategoriasComponent } from './../../inventario/inventario/agregar-sub-categorias/agregar-sub-categorias.component';
import { CaracteristicasComponent } from './../caracteristicas/caracteristicas.component';
import { TagsComponent } from './../tags/tags.component';
import { Item, ItemVendido, Order, Venta } from 'src/app/inventario-manager.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService, Tipo } from './../../inventario-manager.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AgregarClaseItemComponent } from '../../inventario/inventario/agregar-clase-item/agregar-clase-item.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { MarcasDialogComponent } from './../../inventario/inventario/marcas-dialog/marcas-dialog.component';
import { NewItemDialogComponent } from './../../inventario/inventario/new-item-dialog/new-item-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { VentaDialogComponent } from 'src/app/inventario/inventario/venta-dialog/venta-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditarItemDialogComponent } from 'src/app/inventario/inventario/editar-item-dialog/editar-item-dialog.component';
import { JsonLDServiceService } from 'src/app/json-ldservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MensajeTemplateComponent } from '../mensaje-template/mensaje-template.component';
export interface SubConteoOrder {
  name: string;
  nameSecond: string;
  cantidad: number;
}

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit, OnDestroy {
  tipos = new BehaviorSubject<Tipo[]>(null);
  dialogRef: MatDialogRef<AgregarClaseItemComponent, any>;
  estado$ = new BehaviorSubject<string>('pre');
  estados = ['pre', 'categoria', 'sub', 'item'];
  subTipos$ = new BehaviorSubject<string[]>(null);
  subTiposPhoto$ = new BehaviorSubject<string[]>(null);
  carritoForm: FormGroup;

  aCarrito = false;

  columnas = 'repeat(4, max-content)';
  titulo$  = new BehaviorSubject<string>('');
  tituloSub$ = new BehaviorSubject<string>('');
  items = new BehaviorSubject<Item[]>(null);
  itemSecond = new BehaviorSubject<Item[]>([]);
  showNotBuyed = new BehaviorSubject<boolean>(false);
  item$ = new BehaviorSubject<Item>(null);
  ruta = '';
  itemCod = '';
  displayedColumnsPos: string[] = ['name', 'nameSecond', 'cantidad'];
  dataSource: MatTableDataSource<SubConteoOrder>;
  whatsAppLinkOne: string;

  routesSub: Subscription;

  estadoSub: Subscription;

  loaded$ = new BehaviorSubject<boolean>(false);

  reviewMean$ = new BehaviorSubject<number>(0);

  mockList = new BehaviorSubject<number[]>([]);

  mockListTwo  = new BehaviorSubject<number[]>([]);

  userActualRating = 0;

  scActive = 0;
  scSecondActive = 0;

  simpleOrder$ = new BehaviorSubject<{ name: string, disabled: boolean }[]>([]);

  simpleSecondOrder$ = new BehaviorSubject<{ name: string, disabled: boolean }[]>([]);

  mensajeDeError = { texto: 'Ejemplo de mensaje de error.', mostrar: false };

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    if ( this.item$.value && this.item$.value.subConteo) {
      this.dataSource.sort = sort;
    }
  }

  constructor(private inv: InventarioManagerService, public dialog: MatDialog, private ar: ActivatedRoute,
              private titleService: Title, private jsonLDS: JsonLDServiceService, private fb: FormBuilder,
              public auth: AuthService, private snackBar: MatSnackBar, private metaService: Meta) { }

  ngOnDestroy(): void {
    if (this.routesSub) {
      this.routesSub.unsubscribe();
    }
    if (this.estadoSub) {
      this.estadoSub.unsubscribe();
    }

    this.jsonLDS.removeStructuredData();

  }

  ngOnInit(): void {
    this.routesSub = this.ar.paramMap.subscribe(rutaM => {
      this.subTipos$.next(null);
      this.tipos.next(null);
      this.items.next(null);
      this.item$.next(null);
      this.itemSecond.next([]);
      this.loaded$.next(false);
      this.ruta = rutaM.get('categoria');
      this.jsonLDS.removeStructuredData();
      if (this.ruta) {
          this.inv.getTipo(this.ruta).subscribe(res => {
            this.loaded$.next(true);
            this.titulo$.next(res.name);
            if (rutaM.get('sub')) {
              this.tituloSub$.next(rutaM.get('sub'));
              if (rutaM.get('item')) {
                this.itemCod = rutaM.get('item');
                this.estado$.next('item');
                const bSquemeCategoria =
                this.jsonLDS.createBreadSqueme([
                  {position: 2, name: 'Categorias', link: '/categorias'},
                  {position: 3, name: rutaM.get('categoria').toUpperCase(), link: '/categorias' + '/' + rutaM.get('categoria')},
                  {position: 4, name: rutaM.get('sub').toUpperCase(),
                  link: '/categorias' + '/' + rutaM.get('categoria') + '/' + rutaM.get('sub') }
                ]);
                this.jsonLDS.insertSchema(bSquemeCategoria, 'structured-data-bread');
              } else {
                this.estado$.next('sub');
                this.addMetaTagsGeneral(rutaM.get('sub'), res.name + '/' + rutaM.get('sub'));
                const bSquemeCategoria =
                this.jsonLDS.createBreadSqueme([
                  {position: 2, name: 'Categorias', link: '/categorias'},
                  {position: 3, name: rutaM.get('categoria').toUpperCase(), link: '/categorias' + '/' + rutaM.get('categoria')}
                ]);
                this.jsonLDS.insertSchema(bSquemeCategoria, 'structured-data-bread');
              }
            } else {
              this.estado$.next('categoria');
              const bSquemeCategoria =
              this.jsonLDS.createBreadSqueme([{position: 2, name: 'Categorias', link: '/categorias'}]);
              this.jsonLDS.insertSchema(bSquemeCategoria, 'structured-data-bread');
              this.subTipos$.next(res.subTipo);
              this.subTiposPhoto$.next(res.subTipoLink);
              this.addMetaTagsGeneral(res.name, res.name);
            }
          });

      } else {
        this.addMetaTagsCategoria();
        this.inv.getTipos().subscribe(res => {
          const bSquemeCategoria = this.jsonLDS.createBreadSqueme();
          this.jsonLDS.insertSchema(bSquemeCategoria, 'structured-data-bread');
          this.titulo$.next('CATEGORIAS');
          this.estado$.next('pre');
          this.tipos.next(res);
          this.loaded$.next(true);
        });
      }
    });

    this.estadoSub = this.estado$.subscribe(res => {
      if (res === 'sub') {
          this.inv.getAllItemsOfSubTypeII(this.tituloSub$.value, this.titulo$.value).subscribe(resT => {
            this.loaded$.next(true);

            if (this.auth.loggedIn() && (this.auth.getTtype() === 'admin' || this.auth.getTtype() === 'vent')) {
              this.items.next(resT);
            } else {
              this.itemSecond.next(resT);
            }
          });
      } else if (res === 'item') {
        this.inv.getItem(this.itemCod).subscribe(resT => {
          this.loaded$.next(true);

          if (resT) {
            this.item$.next(resT);

            this.carritoForm = this.fb.group({
              cantidad:  this.fb.control(0,  Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(resT.cantidad)
              ])),
            });


            if (resT.subConteo) {
              this.simpleOrder$.next([]);
              this.simpleSecondOrder$.next([]);
              this.simpleOrder$.next(this.getSimpleOrderEND(resT.subConteo.order));
              if (resT.subConteo.nameSecond !== '') {
                this.simpleSecondOrder$.next(this.getSimpleSecondOrderEND(resT.subConteo.order));
                const inOrder = resT.subConteo.order
                .find(o => o.name === this.simpleOrder$.value[this.scActive].name &&
                  o.nameSecond === this.simpleSecondOrder$.value[this.scSecondActive].name);
                this.carritoForm.get('cantidad').setValidators([
                  Validators.required,
                  Validators.min(1),
                  Validators.max(inOrder.cantidad)
                ]);
              } else {
                const inOrder = resT.subConteo.order.find(o => o.name === this.simpleOrder$.value[this.scActive].name);
                this.carritoForm.get('cantidad').setValidators([
                  Validators.required,
                  Validators.min(1),
                  Validators.max(inOrder.cantidad)
                ]);
              }
            }

            const descripcionComplicada = resT.description
            + '. Al mejor precio y de gran calidad. Venta al por mayor o al por menor en Trujillo.'
            + ((resT.caracteristicas.length > 0) ? resT.caracteristicas.join(' | ') : '')
            + 'Precio: S/' + resT.priceIGV.toString() + ' | Cantidad Disponible: ' + resT.cantidad.toString()
            + ' | ' + 'Marca: ' + resT.marca
            + '. Mas información al: +51 977 426 349';

            this.titleService.setTitle('Sirio Dinar | ' + resT.name);
            this.addMetaTagsGeneral(resT.name, resT.tipo + '/' + resT.subTipo + '/' +
            resT.codigo, resT.photo, descripcionComplicada, resT.priceIGV );

            let reviewsSum = 0;

            resT.reviews.forEach(r => {
              reviewsSum += r.rating;
            });

            const reviewMean =  Math.round(reviewsSum / resT.reviews.length) || 0;

            const tempMock = [];
            const tempMockTwo = [];

            this.mockList.next(tempMock);

            const storedReview = resT.reviews.find(x => x.user === this.auth.getUser());

            this.userActualRating = storedReview ? storedReview.rating : 0;

            for (let index = 0; index < this.userActualRating; index++) {
              tempMock.push(index);
              this.mockList.next(tempMock);
            }

            for (let index = this.userActualRating; index < 5; index++) {
              tempMockTwo.push(index);
              this.mockListTwo.next(tempMockTwo);
            }


            this.reviewMean$.next(reviewMean);

            const schema = this.jsonLDS
            .crearProductSquema(resT.name, ['https://siriouploads.s3.amazonaws.com/' + resT.photo.split('.')[0] + '.webp'],
            'https://inventario.siriodinar.com/store/categorias/' + resT.tipo + '/'  + resT.subTipo + '/' + resT.codigo,
            descripcionComplicada, resT.codigo,
            resT.marca, resT.priceIGV, resT.cantidad > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
            resT.reviews.length, reviewMean, resT.reviews);

            this.jsonLDS.insertSchema(schema);
            const mensajeInicio = 'Buenas estoy interesado en ';
            const mensajeFinal = ' quisiera obtener más información';
            this.whatsAppLinkOne = 'https://wa.me/51977426349?text=' + mensajeInicio + this.item$.value.name + mensajeFinal;
            if (this.item$.value && this.item$.value.subConteo) {
              this.dataSource = new MatTableDataSource(this.item$.value.subConteo.order);
             }
          }
        });
      }
    });
  }

  getSimpleOrderEND(order: Order[]): { name: string, disabled: boolean }[] {
    const orderListNoRepeat: { name: string, disabled: boolean }[] = [];
    order.forEach(o => {
        const indexLNR = orderListNoRepeat.findIndex(oln => oln.name === o.name);
        if (indexLNR === -1) {
          if (o.cantidad > 0) {
            orderListNoRepeat.push({ name: o.name, disabled: false });
          } else {
            orderListNoRepeat.push({ name: o.name, disabled: true });
          }
        } else {
            if (o.cantidad > 0) {
              orderListNoRepeat[indexLNR].disabled = false;
            }
        }
    });
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < orderListNoRepeat.length; index++) {
      if (orderListNoRepeat[index].disabled === true) {
        this.scActive = index + 1;
      } else {
        return orderListNoRepeat;
      }
    }
    return orderListNoRepeat;
  }

  getSimpleSecondOrderEND(order: Order[]): { name: string, disabled: boolean }[] {
    const orderListNoRepeat: { name: string, disabled: boolean }[] = [];
    order.forEach(o => {
      if (o.name === this.simpleOrder$.value[this.scActive].name) {
        const indexLNR = orderListNoRepeat.findIndex(oln => oln.name === o.nameSecond);
        if (indexLNR === -1) {
          if (o.cantidad > 0) {
            orderListNoRepeat.push({ name: o.nameSecond, disabled: false });
          } else {
            orderListNoRepeat.push({ name: o.nameSecond, disabled: true });
          }
        } else {
            if (o.cantidad > 0) {
              orderListNoRepeat[indexLNR].disabled = false;
            }
        }
      }
    });
       // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < orderListNoRepeat.length; index++) {
        if (orderListNoRepeat[index].disabled === true) {
          this.scSecondActive = index + 1;
        } else {
          return orderListNoRepeat;
        }
      }
    return orderListNoRepeat;
  }

  openLink() {
    window.open( this.whatsAppLinkOne, '_blank');
  }

  addMetaTagsCategoria() {
    const descripcion = 'Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor,' +
    'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
    'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más informacion enviar un mensaje' +
    ' al +51 977 426 349, estamos para servirle.';

    this.titleService.setTitle('Sirio Dinar | Categorias');
    this.metaService.updateTag({ name: 'description',
    content: descripcion });
    this.metaService.updateTag({ property: 'og:url', content: 'https://inventario.siriodinar.com/store/categorias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Sirio Dinar | Categorias' });
    this.metaService.updateTag({ property: 'og:description',
    content: descripcion });
    this.metaService.updateTag({ property: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' });
    this.metaService.updateTag({ property: 'og:image:alt', content: 'sirio presentacion' });
  }

  addMetaTagsGeneral(titulo: string, link: string, imageLink?: string, descripcion = '', itemPrice = 0) {
    this.titleService.setTitle('Sirio Dinar | ' + titulo);

    const descripcionEsp = 'Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor,' +
    'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
    'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más informacion enviar un mensaje' +
    ' al +51 977 426 349, estamos para servirle.';

    this.metaService.updateTag({ name: 'description', content: titulo + ' | ' + descripcion + '\n' + descripcionEsp });
    this.metaService.updateTag({ property: 'og:url', content: 'https://inventario.siriodinar.com/store/categorias/' + link });
    this.metaService.updateTag({ property: 'og:title', content: 'Sirio Dinar | ' + titulo });
    this.metaService.updateTag({ property: 'og:description', content: titulo + ' | ' + descripcion + '\n' + descripcionEsp});
    this.metaService.updateTag({ property: 'og:image',
    content: imageLink ? 'https://siriouploads.s3.amazonaws.com/' + imageLink.split('.')[0] + '.webp' : 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' });
    this.metaService.updateTag({ property: 'og:image:alt', content: titulo + 'imagen' });

    if (itemPrice > 0) {
      this.metaService.updateTag({ property: 'og:type', content: 'og:product' });

      if (this.metaService.getTag('property=\'product:price:amount\'')) {
        this.metaService.updateTag({ property: 'product:price:amount', content: itemPrice.toString() });
      } else {
        this.metaService.addTag({ property: 'product:price:amount', content: itemPrice.toString() });
      }

      if (!this.metaService.getTag('property=\'product:price:currency\'')) {
        this.metaService.addTag({ property: 'product:price:currency', content: 'PEN' });
      }

    } else {
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      if (this.metaService.getTag('property=\'product:price:amount\'')) {
        this.metaService.removeTag('property=\'product:price:amount\'');
      }
      if (this.metaService.getTag('property=\'product:price:currency\'')) {
        this.metaService.removeTag('property=\'product:price:currency\'');
      }
    }
  }

  openDialogAgregarCat(): void {
    this.dialogRef = this.dialog.open(AgregarClaseItemComponent, {
      width: '600px',
    });

    this.dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res) {
        const tempArrayTipo = this.tipos.value;
        tempArrayTipo.unshift(res);
        this.tipos.next(tempArrayTipo);
      }
    });
  }

  openDialogAgregarMarca() {
    this.dialog.open(MarcasDialogComponent, {
      width: '600px',
    });
  }

  openDialogAgregarTags() {
    this.dialog.open(TagsComponent, {
      width: '600px',
    });
  }

  actCategorias(tipo: Tipo) {
    const tempArrayTipo = this.tipos.value;
    const indexDeletedItem = tempArrayTipo.findIndex(x => x.name === tipo.name);
    tempArrayTipo.splice(indexDeletedItem, 1);
    this.tipos.next(tempArrayTipo);
  }

  actSubCategorias(tipo: string) {
    const tempArraySTipo = this.subTipos$.value;
    const indexDeletedItem = tempArraySTipo.indexOf(tipo);
    tempArraySTipo.splice(indexDeletedItem, 1);
    this.subTipos$.next(tempArraySTipo);
  }

  invertStringMerge(sOne: string, sTwo: string){
    const sOneArray = sOne.split('');
    const sTwoArray = sTwo.split('');
    const lengthSuperior = sOneArray.length >= sTwoArray.length ? sOneArray.length : sTwoArray.length;
    let newString = '';
    let switchA = true;
    if (sOneArray.length === 0) {
      switchA = false;
    }
    for (let index = 0; index < lengthSuperior; index++) {
        const preNewStringOne = switchA ? sOneArray.pop() : sTwoArray.pop();
        newString += preNewStringOne ? preNewStringOne : '';
        switchA = !switchA;
        const preNewStringTwo = switchA ? sOneArray.pop() : sTwoArray.pop();
        newString +=  preNewStringTwo ?  preNewStringTwo : '';
        switchA = !switchA;
    }

    return newString;
  }

  actItems(item: Item) {
    const tempArrayItem = this.items.value;
    const indexDeletedItem = tempArrayItem.findIndex(x => x.name === item.name);
    tempArrayItem.splice(indexDeletedItem, 1);
    this.items.next(tempArrayItem);
  }

  openDialogAgregarItem() {
    const dialogRef = this.dialog.open(NewItemDialogComponent, {
      width: '800px',
      data: {subTipo: this.tituloSub$.value, parentTipoName: this.titulo$.value}
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res) {
        const tempArrayItem = this.items.value;
        tempArrayItem.unshift(res);
        this.items.next(tempArrayItem);
      }
    });
  }

  eliminarItem(codigo: string) {
    this.inv.eliminarItem(codigo).subscribe(res => {
      if (res) {
        this.actItems(res);
      }
    });
  }

  actChangeItems(item: Item) {
    this.actItems(item);
  }

  openDialogVenta(): void {
    const dialogRef = this.dialog.open(VentaDialogComponent, {
      width: '600px',
      data: this.item$.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: {item: Item, message: string}) => {
      if (res) {
        if (res.message === 'Falta') {
          this.inv.getItem(this.item$.value.codigo).subscribe((resNew: Item) => {
            this.item$.next(resNew);
          });
        }
        else  if (res.message === 'Succes') {
          this.snackBar.open('Item Vendido!!', '', {
          duration: 2000,
          });
          this.item$.next(res.item);
        }
        else  if (res.message.split(' ')[0] === 'SuccesAG') {
          this.snackBar.open('Venta Creada; Codigo: ' + res.message.split(' ')[1], '', {
            duration: 2000,
          });
        }
        else if (res.message.split('|')[0] === 'succesAI'){
          this.snackBar.open(res.message.split('|')[1], '', {
            duration: 2000,
          });
        }
      }
    });
  }

  openCaracteristicas() {
    const dialogRef = this.dialog.open(CaracteristicasComponent, {
      width: '600px',
      data: this.item$.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(() => {
      this.inv.getItem(this.item$.value.codigo).subscribe(res => {
        this.item$.next(res);
      });
    });
  }

  openDialogEditarItem() {
    const dialogRef = this.dialog.open(EditarItemDialogComponent, {
      width: '800px',
      data: this.item$.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      this.inv.getItem(this.item$.value.codigo).subscribe(item => {
        if (item) {
          this.item$.next(item);
        }
      });
    });
  }

  openDialogEditarItemCantidades() {
    const dialogRef = this.dialog.open(EditarCantidadesDialogComponent, {
      width: '800px',
      data: this.item$.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      this.inv.getItem(this.item$.value.codigo).subscribe(item => {
        if (item) {
          this.item$.next(item);
        }
      });
    });
  }

  openDialogReOrdenarCat() {
    const listTemporal =  this.tipos.value;
    window.scroll(0, 0);
    const dialogRef = this.dialog.open(ChangeOrderComponent, {
      width: '800px',
      data: {categorias: listTemporal},
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if (res) {
          this.tipos.next(res);
      }
    });
  }


  openDialogReOrdenarSubCat() {
    window.scroll(0, 0);
    const dialogRef = this.dialog.open(ChangeOrderComponent, {
      width: '800px',
      data: {subCategorias: { names: this.subTipos$.value, links: this.subTiposPhoto$.value, tipoCodigo: this.ruta }},
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: Tipo) => {
      if (res) {
          this.subTipos$.next(res.subTipo);
          this.subTiposPhoto$.next(res.subTipoLink);
      }
    });
  }

  openDialogReOrdenarItems() {
    window.scroll(0, 0);
    const dialogRef = this.dialog.open(ChangeOrderComponent, {
      width: '800px',
      data: { items: this.items.value },
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: Item[]) => {
      if (res) {
          this.items.next(res);
      }
    });
  }

  openDialogAgregarSubCat(): void {
    const dialogRef = this.dialog.open(AgregarSubCategoriasComponent, {
      width: '600px',
      data: {codigo: this.ruta},
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      this.inv.getTipo(this.ruta).subscribe(resT => {
        this.subTipos$.next(resT.subTipo);
        this.subTiposPhoto$.next(resT.subTipoLink);
      });
    });
  }

  descargarReporte() {
    this.inv.getExcelReportItem(this.item$.value.codigo).subscribe(res => {
      saveAs(res, 'reporte.xlsx');
    });
  }

  thisAndTheOnesBehind(estrellaNumero: number) {
    if (this.auth.loggedIn() === false) {
      return;
    }
    const tempMock = [];
    const tempMockTwo = [];


    for (let index = 0; index < estrellaNumero + 1; index++) {
      tempMock.push(index);
    }

    this.mockList.next(tempMock);
    for (let index = (estrellaNumero + 1); index < 5; index++) {
      tempMockTwo.push(index);
    }
    this.mockListTwo.next(tempMockTwo);
  }

  returnRatingToNormal() {
    if (this.auth.loggedIn() === false) {
      return;
    }
    const tempMock = [];
    const tempMockTwo = [];


    for (let index = 0; index < this.userActualRating; index++) {
      tempMock.push(index);
    }

    this.mockList.next(tempMock);
    for (let index = this.userActualRating; index < 5; index++) {
      tempMockTwo.push(index);
    }
    this.mockListTwo.next(tempMockTwo);
  }

  setRating(estrellaNumero: number) {
    if (this.auth.loggedIn() === false || this.userActualRating === (estrellaNumero + 1)) {
      return;
    }
    const tempMock = [];
    const tempMockTwo = [];

    this.userActualRating = estrellaNumero + 1;

    for (let index = 0; index < this.userActualRating; index++) {
      tempMock.push(index);
    }

    this.mockList.next(tempMock);
    for (let index = (this.userActualRating); index < 5; index++) {
      tempMockTwo.push(index);
    }
    this.mockListTwo.next(tempMockTwo);


    this.inv.addItemReview(this.item$.value.codigo, this.userActualRating).subscribe(res => {
      if (res) {
        if (res.notBuyed){
          this.showNotBuyed.next(true);
        } else {
          const resConvertido = res as Item;
          this.item$.next(resConvertido);

          let reviewsSum = 0;

          resConvertido.reviews.forEach(r => {
            reviewsSum += r.rating;
          });
          const reviewMean =  Math.round(reviewsSum / resConvertido.reviews.length) || 0;
          this.reviewMean$.next(reviewMean);

        }
      }
    });

  }

  getSCname(order: Order[]): string[] {
    const tempArray = [];
    order.forEach(o => {
      if (tempArray.indexOf(o.name) === -1) {
        tempArray.push(o.name);
      }
    });
    return tempArray;
  }

  getSCnameSecond(order: Order[]): string[] {
    const tempArray = [];
    order.forEach(o => {
      if (tempArray.indexOf(o.nameSecond) === -1) {
        tempArray.push(o.nameSecond);
      }
    });
    return tempArray;
  }


  selectSCsecond(i: number) {
    if (this.scSecondActive !== i) {
      this.carritoForm.get('cantidad').reset();
      this.carritoForm.get('cantidad').setValue(0);
      this.scSecondActive = i;
      const inOrder = this.item$.value.subConteo.order
      .find(o => o.name === this.simpleOrder$.value[this.scActive].name &&
        o.nameSecond === this.simpleSecondOrder$.value[this.scSecondActive].name);
      this.carritoForm.get('cantidad').setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(inOrder.cantidad)
      ]);
    }
  }

  selectSC(i: number) {
    if (this.scActive !== i) {
      this.carritoForm.get('cantidad').reset();
      this.carritoForm.get('cantidad').setValue(0);
      this.scActive = i;
      this.scSecondActive = 0;
      if (this.item$.value.subConteo.nameSecond !== '') {
        this.simpleSecondOrder$.next(this.getSimpleSecondOrderEND(this.item$.value.subConteo.order));
        const inOrder = this.item$.value.subConteo.order
        .find(o => o.name === this.simpleOrder$.value[this.scActive].name &&
          o.nameSecond === this.simpleSecondOrder$.value[this.scSecondActive].name);
        this.carritoForm.get('cantidad').setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(inOrder.cantidad)
        ]);
      } else {
        const inOrder = this.item$.value.subConteo.order.find(o => o.name === this.simpleOrder$.value[this.scActive].name);
        this.carritoForm.get('cantidad').setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(inOrder.cantidad)
        ]);
      }
    }
  }

  crearNewVentaBody() {
    if (this.auth.loggedIn() === false && this.auth.getTtype() !== 'low') {
      this.dialog.open(MensajeTemplateComponent, {
        width: '600px',
        data: {codigo: this.ruta},
      });
      return;
    }

    this.aCarrito = true;
    this.carritoForm.disable();
    this.inv.getItem(this.item$.value.codigo).subscribe(itemAct => {

      let inOrder: Order;
      let inOrderAct: Order;

      if (itemAct.subConteo) {
        if (this.item$.value.subConteo.nameSecond !== '') {
          inOrder = this.item$.value.subConteo.order
          .find(o => o.name === this.simpleOrder$.value[this.scActive].name &&
            o.nameSecond === this.simpleSecondOrder$.value[this.scSecondActive].name);

          inOrderAct = itemAct.subConteo.order
            .find(o => o.name === this.simpleOrder$.value[this.scActive].name &&
              o.nameSecond === this.simpleSecondOrder$.value[this.scSecondActive].name);
        } else {
          inOrder = this.item$.value.subConteo.order.find(o => o.name === this.simpleOrder$.value[this.scActive].name);
          inOrderAct = itemAct.subConteo.order.find(o => o.name === this.simpleOrder$.value[this.scActive].name);
        }
      } else {
        inOrderAct = { name: '', nameSecond: '', cantidad: this.carritoForm.get('cantidad').value};
      }

      if (!itemAct) {
        this.mensajeDeError.texto = 'Ocurrio un error';
        this.mensajeDeError.mostrar = true;
        this.resetForm();
      } else if (itemAct.deleted) {
        this.mensajeDeError.texto = 'El item ha sido eliminado';
        this.mensajeDeError.mostrar = true;
        this.item$.next(itemAct);
        this.resetForm();
      } else if ((itemAct.cantidad < this.carritoForm.get('cantidad').value) && (itemAct.subConteo === undefined)) {
        this.mensajeDeError.texto = 'Ya no disponemos con estas cantidades';
        this.mensajeDeError.mostrar = true;
        this.item$.next(itemAct);
        this.resetForm();
      } else if ((inOrderAct.cantidad < this.carritoForm.get('cantidad').value) && (itemAct.subConteo)) {
        this.mensajeDeError.texto = 'Ya no disponemos con estas cantidades';
        this.mensajeDeError.mostrar = true;
        this.item$.next(itemAct);
        this.resetForm();
      } else if (itemAct.priceIGV !== this.item$.value.priceIGV) {
        this.mensajeDeError.texto = 'El precio a cambiado';
        this.mensajeDeError.mostrar = true;
        this.item$.next(itemAct);
        this.resetForm();
      } else {

        this.mensajeDeError.mostrar = false;

        let orderToSend;

        this.item$.next(itemAct);

        if (itemAct.subConteo) {
          orderToSend = { name: this.simpleOrder$.value[this.scActive].name, nameSecond: '' };
          if (itemAct.subConteo.nameSecond !== '') {
            orderToSend.nameSecond = this.simpleSecondOrder$.value[this.scSecondActive].name;
          }
        }
        const itemVendido =
        {
          codigo: this.item$.value.codigo, priceIGV: this.item$.value.priceIGV,
          cantidad: this.carritoForm.get('cantidad').value, orderToAdd: orderToSend
        };

        this.aCarrito = false;
        this.resetForm();
        console.log(itemVendido);

      }
    });
  }

  resetForm() {
    this.carritoForm.enable();
    this.carritoForm.reset();
    this.carritoForm.get('cantidad').setValue(0);
  }
}


