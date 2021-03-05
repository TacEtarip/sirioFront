import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { saveAs } from 'file-saver';

import { InventarioManagerService } from 'src/app/inventario-manager.service';
import { Subscription, BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

import { WindowScrollService } from '../../../window-scroll.service';
import { Title, Meta } from '@angular/platform-browser';

export interface SubConteoOrder {
  name: string;
  nameSecond: string;
  cantidad: number;
}
@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit, AfterViewInit, OnDestroy {

  item: Item;

  item$ = new BehaviorSubject<Item>(null);

  itemsRelacionados$ = new BehaviorSubject<Item[]>(null);

  imageLink: string;

  panelOpenState = false;
  displayedColumnsPos: string[] = ['name', 'nameSecond', 'cantidad'];
  dataSource: MatTableDataSource<SubConteoOrder>;
  balance = 0;

  whatsAppLinkOne;
  whatsAppLinkTwo;

  urlOfImage = new BehaviorSubject<string>(null);

  scrollY$: Observable<number>;

  subs: Subscription;

  datasourceTest: SubConteoOrder[] = [{name: 'Test1', nameSecond: 'test2', cantidad: 2}];

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    if ( this.item && this.item.subConteo) {
      this.dataSource.sort = sort;
    }
  }

  constructor(private inventarioMNG: InventarioManagerService,
              private ar: ActivatedRoute, private router: Router,
              private titleService: Title,
              private metaTagService: Meta,
              private wSS: WindowScrollService, public authService: AuthService) {

    let ruta = 'noone';

    this.scrollY$ = this.wSS.scrollY$;

    this.subs = this.ar.paramMap.subscribe((param) => {

      if (wSS.elementScroll !== undefined) {
        wSS.scrollToTop();
      }

      ruta = param.get('item');

      this.item$.next(null);

      this.inventarioMNG.getItem(ruta).subscribe(res => {
        this.item$.next(res);
        this.titleService.setTitle(`Sirio Dinar | ${this.item$.value.name}`);
        this.metaTagService.updateTag(
          { name: 'description', content: `Informacion de ${this.item$.value.name} en trujillo` }
        );
        const mensajeInicio = 'Buenas estoy interesado en ';
        const mensajeFinal = ' quisiera obtener más información';
        this.whatsAppLinkOne = 'https://wa.me/51977426349?text=' + mensajeInicio + this.item$.value.name + mensajeFinal;
        this.whatsAppLinkTwo = 'https://wa.me/51922412404?text=' + mensajeInicio + this.item$.value.name + mensajeFinal;

        this.inventarioMNG.getItemsRelacionados(this.item$.value.codigo, this.item$.value.tipo).subscribe(relRes => {
          this.itemsRelacionados$.next(relRes);
        });

        this.imageLink = 'https://inventario-sirio-dinar.herokuapp.com/inventario/image/' + this.item$.value.photo;
        this.item = res;
        if (this.item && this.item.subConteo) {
          this.dataSource = new MatTableDataSource(this.item.subConteo.order);
         }

      });
    });


   }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.wSS.elementScroll === undefined) {
      const documentScroll = document.getElementById('listado');
      this.wSS.elementScroll = documentScroll;
    }
  }

  descargarReporteItem() {
    this.inventarioMNG.getExcelReportItem(this.item$.value.codigo).subscribe((res) => {
      if (res) {
        saveAs(res, `reporte-${this.item$.value.name}`);
      }
    });
  }

  deConvertToFavorite() {
    this.inventarioMNG.deConvertToFavorite(this.item$.value).subscribe((res) => {
      if (res) {
        this.item$.next(res);
      }
    });
  }

  convertToFavorite() {
    this.inventarioMNG.convertToFavorite(this.item$.value).subscribe((res) => {
      if (res) {
        this.item$.next(res);
      }
    });
  }

  descargarFicha() {
    window.open('https://inventario-sirio-dinar.herokuapp.com/inventario/pdf/ficha-' + this.item$.value.codigo + '.pdf', '_blank');
  }

  refreshPage() {
    window.location.reload();
  }

  goToTipo() {
    this.router.navigate(['/inventario', this.parsedRoute(this.item$.value.tipo)]);
  }

  goToSubTipo() {
    this.router.navigate(['/inventario', this.parsedRoute(this.item$.value.tipo),
    this.parsedRoute(this.item$.value.subTipo)]);
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

  getMousePos(e: Event) {

  }

  goToItem(tipo: string, subTipo: string, codigo: string) {
    this.router.navigate(['/inventario', this.parsedRoute(tipo),
    this.parsedRoute(subTipo), codigo]);
  }

  parsedRoute(ruta: string) {
    return ruta.trim().replace(/ /g, '_');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
