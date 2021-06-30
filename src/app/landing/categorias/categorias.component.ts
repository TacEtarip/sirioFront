import { Title, Meta } from '@angular/platform-browser';
import { EditarCantidadesDialogComponent } from './../../inventario/inventario/editar-cantidades-dialog/editar-cantidades-dialog.component';
import { ChangeOrderComponent } from './../change-order/change-order.component';
import { AgregarSubCategoriasComponent } from './../../inventario/inventario/agregar-sub-categorias/agregar-sub-categorias.component';
import { CaracteristicasComponent } from './../caracteristicas/caracteristicas.component';
import { TagsComponent } from './../tags/tags.component';
import { Item } from 'src/app/inventario-manager.service';
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


  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    if ( this.item$.value && this.item$.value.subConteo) {
      this.dataSource.sort = sort;
    }
  }

  constructor(private inv: InventarioManagerService, public dialog: MatDialog, private ar: ActivatedRoute,
              private titleService: Title, private jsonLDS: JsonLDServiceService,
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
              } else {
                this.estado$.next('sub');
                this.addMetaTagsGeneral(rutaM.get('sub'), res.name + '/' + rutaM.get('sub'));
              }
            } else {
              this.estado$.next('categoria');
              this.subTipos$.next(res.subTipo);
              this.subTiposPhoto$.next(res.subTipoLink);
              this.addMetaTagsGeneral(res.name, res.name);
            }
          });

      } else {
        this.addMetaTagsCategoria();
        this.inv.getTipos().subscribe(res => {
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
            resT.reviews.length, reviewMean);

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

  openLink() {
    window.open( this.whatsAppLinkOne, '_blank');
  }

  addMetaTagsCategoria() {
    this.titleService.setTitle('Sirio Dinar | Categorias');
    this.metaService.updateTag({ name: 'description', content: 'Distintas categorias de indumentaria de seguridad a el mejor precio en trujillo, venta al por menor y al por mayor.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://inventario.siriodinar.com/store/categorias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Sirio Dinar | Categorias' });
    this.metaService.updateTag({ property: 'og:description', content: 'Distintas categorias de indumentaria de seguridad a el mejor precio en trujillo, venta al por menor y al por mayor.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' });
    this.metaService.updateTag({ property: 'og:image:alt', content: 'sirio presentacion' });
  }

  addMetaTagsGeneral(titulo: string, link: string, imageLink?: string, descripcion = '', itemPrice = 0) {
    this.titleService.setTitle('Sirio Dinar | ' + titulo);
    this.metaService.updateTag({ name: 'description', content: titulo + ' | ' + descripcion + '\nAl mejor precio y de gran calidad. Venta al por mayor o al por menor en Trujillo.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://inventario.siriodinar.com/store/categorias/' + link });
    this.metaService.updateTag({ property: 'og:title', content: 'Sirio Dinar | ' + titulo });
    this.metaService.updateTag({ property: 'og:description', content: titulo + ' | ' + descripcion + '\nAl mejor precio y de gran calidad. Venta al por mayor o al por menor en Trujillo.' });
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

    console.log(this.userActualRating);

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



}
