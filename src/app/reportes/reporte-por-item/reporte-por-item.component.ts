import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InventarioManagerService, Item } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-reporte-por-item',
  templateUrl: './reporte-por-item.component.html',
  styleUrls: ['./reporte-por-item.component.css']
})
export class ReportePorItemComponent implements OnInit, OnDestroy {
  busqueda: FormGroup;
  filteredItem$ = new BehaviorSubject<Item[]>(null);
  busquedaSub: Subscription;
  routesSub: Subscription;
  item$ = new BehaviorSubject<Item>(null);
  itemAct$ = new BehaviorSubject<Item>(null);
  itemHistorico = new BehaviorSubject<any>(null);
  itemGanancia = new BehaviorSubject<any>(null);

  view: [number, number] = [800, 400];
  colorScheme = {
    domain: ['#E44D25', '#112E96']
  };
  colorSchemeTwo = {
    domain: ['#E44D25', '#112E96']
  };
  single: any[];
  multi: any[];

  ruta: string = null;

  smallSubs: Subscription;

  constructor(private router: Router, private fb: FormBuilder, private ar: ActivatedRoute,
              breakpointObserver: BreakpointObserver, private inv: InventarioManagerService) {
    const isSmallScreenObs = breakpointObserver.observe(['(max-width: 900px)', '(max-width: 700px)']);
    this.smallSubs = isSmallScreenObs.subscribe(res => {
      if (res.breakpoints['(max-width: 900px)'] === true) {
      this.view = [550, 300];
      }
    });
               }

  ngOnInit(): void {

    this.busqueda = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required,
      ])),
    });

    this.routesSub = this.ar.paramMap.subscribe(rutaM => {
      this.ruta = '';
      this.ruta = rutaM.get('itemCod');
      this.item$.next(null);
      this.itemAct$.next(null);
      this.itemHistorico.next(null);
      if (this.ruta) {
        this.inv.getItem(this.ruta).subscribe(item => {
          this.busqueda.get('name').setValue(item);
          this.item$.next(item);
          this.itemAct$.next(item);
        });

        this.inv.getItemGIC(this.ruta).subscribe(res => {
          this.itemHistorico.next(res);
        });

        this.inv.getItemVentasPorMes(this.ruta).subscribe(single => {
          this.single = single;
          if (single) {
            Object.assign(this, { single } );
          }
        });

        this.inv.getItemIngresosGananciasPorMes(this.ruta).subscribe(multi => {
          this.multi = multi;
          if (multi) {
            Object.assign(this, { multi } );
          }
        });
        this.inv.getItemGananciasTotal(this.ruta).subscribe(singleTwo => {
          this.itemGanancia.next(singleTwo);
        });
      }
    });

    this.busquedaSub = this.busqueda.get('name').valueChanges.subscribe((changeV: any) => {
      this.item$.next(null);
      if (changeV) {
        this.filterItemValue(changeV);
      } else {
        this.filteredItem$.next(null);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.busquedaSub) {
      this.busquedaSub.unsubscribe();
    }

    if (this.routesSub) {
      this.routesSub.unsubscribe();
    }

    if (this.smallSubs) {
      this.smallSubs.unsubscribe();
    }
  }

  displayFn(item: Item): string {
    return item && item.name ? item.name : '';
  }

  selectItem(e: MatAutocompleteSelectedEvent) {
    this.item$.next(e.option.value);
    this.filteredItem$.next(null);
  }

  filterItemValue(value: any) {

    this.inv.getListOfItemsFilteredByRegex(value.name || value, 15).subscribe(res => {
      if (res) {
        this.filteredItem$.next(res);
        if (res.length === 0) {
          this.item$.next(null);
        } else {
          const testValue = value.name ? value.name.toUpperCase() : value;
          this.filteredItem$.value.findIndex((el) => el.name.toUpperCase() === testValue ? value.name.toUpperCase() : value.toUpperCase());
          // this.item$.next(this.filteredItem$.value[index]);
        }
      } else {
        this.filteredItem$.next(null);
      }
    });
  }

  goToProductoReport() {
    this.router.navigate(['reportes', 'item', this.item$.value.codigo]);
  }
}
