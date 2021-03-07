import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventarioManagerService, Item } from 'src/app/inventario-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { skip, debounceTime, first, distinctUntilChanged, pluck, filter } from 'rxjs/operators';
import { EliminarDialogComponent } from '../eliminar-dialog/eliminar-dialog.component';
import { FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';
import { WindowScrollService } from '../../../window-scroll.service';
import { SideopenService } from '../../../sideopen.service';
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-tipo-ruta',
  templateUrl: './tipo-ruta.component.html',
  styleUrls: ['./tipo-ruta.component.css']
})
export class TipoRutaComponent implements OnInit, OnDestroy, AfterViewInit {

  currentListToDisplay = new BehaviorSubject<string>('Destacados');
  specialGetItem = true;
  selectedSort = 'date';
  subORtipo = 'tipo';
  order = new BehaviorSubject<string>('dsc');
  listItems = new BehaviorSubject<Item[]>([]);
  keep = new BehaviorSubject<boolean>(true);
  subs: Subscription;
  subsOrder: Subscription;
  subsScroll: Subscription;
  subsPorcent: Subscription;
  subsSearch: Subscription;

  searched = false;

  scrollY$: Observable<number>;
  loadingNewItems = false;
  loadingNewItems$ = new BehaviorSubject(false);
  numeroDeCargas = 1;

  searchForm: FormGroup;

  localOpened = true;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              private router: Router, private snackBar: MatSnackBar, private ar: ActivatedRoute,
              private wSS: WindowScrollService, private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: any) {
                if (isPlatformBrowser(this.platformId)) {
                  this.scrollY$ = this.wSS.scrollY$;
                }
              }

  ngOnInit(): void {
    // this.getItems(this.listaItemsCurrent);
    SideopenService.opened.pipe().subscribe((value) => {
      this.localOpened = value;
    });
    this.searchForm = this.fb.group({
      search: this.fb.control('', Validators.compose([
        Validators.pattern(/^[a-zA-Z0-9.-_# ]*$/),
        Validators.minLength(2),
      ]))
    });

    this.subsSearch = this.searchForm.get('search').valueChanges.pipe(distinctUntilChanged(),
    debounceTime(500)).subscribe((r: string) => {
      if (r) {
        if (this.searchForm.valid && r.length > 0 && !this.loadingNewItems$.value) {
          this.loadSearchItems(r.trim());
          this.searched = true;
        }
      } else if (this.searched === true) {
        this.order.next(this.order.value);
        this.searched = false;
      }
    });


    this.subs = this.ar.paramMap.subscribe(param => {
      let ruta = param.get('tipo');
      this.subORtipo = 'tipo';
      if (param.get('subTipo')) {
        ruta = param.get('subTipo');
        this.subORtipo = 'sub';
      }

      ruta = this.inverseParseRoute(ruta);

      this.searched = false;

      this.currentListToDisplay.next(ruta);
      this.loadingNewItems$.next(true);
      this.listItems.next([]);

      this.searchForm.get('search').reset();

      this.inventarioMNG.getItemsSorted(this.subORtipo, ruta, this.selectedSort, this.order.value, 12).subscribe((res: Item[]) => {
        if (isPlatformBrowser(this.platformId)) {
          this.wSS.scrollToTop();
        }
        this.listItems.next(res);
        this.numeroDeCargas = 1;
        this.loadingNewItems$.next(false);
      });
    });

    this.subsOrder = this.order.pipe(skip(1), debounceTime(300)).subscribe((order: string) => {
      this.loadingNewItems$.next(true);
      this.listItems.next([]);
      this.searched = false;

      this.inventarioMNG.getItemsSorted(this.subORtipo, this.currentListToDisplay.value,
        this.selectedSort, order, 12).subscribe((res: Item[]) => {
          this.numeroDeCargas = 1;
          this.listItems.next(res);
          this.loadingNewItems$.next(false);
          this.searchForm.get('search').reset();
      });
    });
  }

  inverseParseRoute(route: string) {
    return route.trim().replace(/_/g, ' ');
  }

  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      if (this.wSS.elementScroll === undefined) {
        const documentScroll = document.getElementById('listado');
        this.wSS.elementScroll = documentScroll;
      }
    }


    if (isPlatformBrowser(this.platformId)) {
      const searchDoc = document.getElementById('searchBar');
    }



    /*const eventSoure = fromEvent(searchDoc, 'keyup');

    this.subsSearch = eventSoure.pipe(pluck('target', 'value'), debounceTime(500), distinctUntilChanged()).subscribe((e: string) => {
      if (this.searchForm.valid && e.length > 0) {
        this.loadSearchItems(e.trim());
        this.searched = true;
      }
      else if (e.length === 0 && this.searched === true) {
        this.order.next(this.order.value);
        this.searched = false;
      }
    });*/

    this.subsPorcent = this.wSS.porcent.pipe(distinctUntilChanged()).subscribe((p) => {

      if (p >= 70 && this.loadingNewItems$.value === false && this.listItems.value.length === 12 * this.numeroDeCargas) {
        this.loadingNewItems$.next(true);
        this.inventarioMNG.getItemsSorted(this.subORtipo, this.currentListToDisplay.value,
          this.selectedSort, this.order.value, 12 * this.numeroDeCargas * 2).subscribe((res: Item[]) => {
            this.numeroDeCargas++;
            this.loadingNewItems$.next(false);
            const temporalList = this.listItems.value;
            res.forEach(item => {
              temporalList.push(item);
            });
            this.listItems.next(temporalList);
        });
      }
    });
  }

  loadSearchItems(searchTerms: string) {
    this.listItems.next([]);
    this.loadingNewItems$.next(true);

    this.inventarioMNG.getItemsSearch(searchTerms).subscribe((res: Item[]) => {
      this.listItems.next(res);
      this.loadingNewItems$.next(false);
    });
  }

  orderDsc() {
    this.order.next('dsc');
  }

  orderAsc() {
    this.order.next('asc');
  }

  onChageTipo() {
    this.order.next(this.order.value);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subs.unsubscribe();
      this.subsOrder.unsubscribe();
      this.subsPorcent.unsubscribe();
      this.subsSearch.unsubscribe();
      this.loadingNewItems$.complete();
    }
  }

  openDialogEliminarItem(item: Item) {
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '600px',
      data: item
    });

    dialogRef.afterClosed().pipe(first()).subscribe((cod: string) => {
      if (cod) {
        this.inventarioMNG.eliminarItem(cod).pipe(first()).subscribe((res) => {
          if (res) {
            this.order.next(this.order.value);
            this.snackBar.open('Item Eliminado!!', '', {
              duration: 2000,
            });
          }
        });
      }
    });
  }

}
