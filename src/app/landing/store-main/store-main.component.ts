import { Title } from '@angular/platform-browser';
import {  Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InventarioManagerService, Item, Tipo } from 'src/app/inventario-manager.service';
import { AuthService } from '../../auth.service';
import anime from 'animejs';
import { JsonLDServiceService } from 'src/app/json-ldservice.service';

@Component({
  selector: 'app-store-main',
  templateUrl: './store-main.component.html',
  styleUrls: ['./store-main.component.css']
})
export class StoreMainComponent implements OnInit, OnDestroy {

  busqueda: FormGroup;

  filteredItem$ = new BehaviorSubject<Item[]>(null);

  itemsDestacados$ = new BehaviorSubject<Item[]>(null);

  item$ = new BehaviorSubject<Item>(null);

  toShowNext$ = new BehaviorSubject<number>(0);
  toShowBack$ = new BehaviorSubject<number>(0);

  toShowNextTwo$ = new BehaviorSubject<number>(0);
  toShowBackTwo$ = new BehaviorSubject<number>(0);

  tenRandomItems$ = new BehaviorSubject<Item[]>(null);

  tipos = new BehaviorSubject<Tipo[]>(null);

  busquedaSub: Subscription;

  cantidadSlider: number;

  smallSubs: Subscription;

  constructor(public auth: AuthService, private inv: InventarioManagerService, private titleService: Title,
              private router: Router, private fb: FormBuilder, breakpointObserver: BreakpointObserver) {
                const isSmallScreenObs = breakpointObserver.observe(['(max-width: 650px)', '(max-width: 1100px)', '(max-width: 1300px)']);
                this.smallSubs = isSmallScreenObs.subscribe(res => {
                  if (res.breakpoints['(max-width: 650px)'] === true) {
                    this.cantidadSlider = 1;
                  } else if (res.breakpoints['(max-width: 1100px)'] === true) {
                    this.cantidadSlider = 2;
                  } else if (res.breakpoints['(max-width: 1300px)'] === true) {
                    this.cantidadSlider = 3;
                  } else {
                    this.cantidadSlider = 4;
                  }

                  if (this.tipos.value && this.itemsDestacados$.value) {
                    this.resetAnimations();
                  }
                });
                this.titleService.setTitle('Sirio Dinar | Tienda de los mejores EPPs');

   }

  ngOnDestroy(): void {
    if (this.busquedaSub) {
      this.busquedaSub.unsubscribe();
    }

    if (this.smallSubs) {
      this.smallSubs.unsubscribe();
    }

  }

  ngOnInit(): void {



    this.busqueda = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required,
      ])),
    });


    this.inv.getItemsDestacados().subscribe(res => {
      this.itemsDestacados$.next(res);
      this.toShowNext$.next(res.length - this.cantidadSlider);
    });

    this.busquedaSub = this.busqueda.get('name').valueChanges.subscribe((changeV: any) => {
      this.item$.next(null);
      if (changeV) {
        this.filterItemValue(changeV);
      } else {
        this.filteredItem$.next(null);
      }
    });

    this.inv.getAllItems().subscribe(res => {
      const tenRI: Item[] = [];
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < 10; index++) {
        tenRI.push(res[index]);
      }

      this.tenRandomItems$.next(tenRI);
    });

    this.inv.getTipos().subscribe(res => {
      this.tipos.next(res);
      this.toShowNextTwo$.next(res.length - this.cantidadSlider);
    });
  }

  displayFn(item: Item): string {
    return item && item.name ? item.name : '';
  }

  selectItem(e: MatAutocompleteSelectedEvent) {
    this.item$.next(e.option.value);
    this.filteredItem$.next(null);
  }

  goToInventario() {
    this.router.navigate(['store', 'categorias']);
  }

  goToProducto() {
    this.router.navigate(['store', 'categorias', this.item$.value.tipo, this.item$.value.subTipo, this.item$.value.codigo]);
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

  animateTransTwo() {
    return anime.timeline({
      targets: '.sliderTwo',
      duration: 500,
      easing: 'easeOutQuad'
    });
  }


  animateTrans() {
    return anime.timeline({
      targets: '.slider',
      duration: 500,
      easing: 'easeOutQuad'
    });
  }

  resetAnimations() {
    this.toShowBack$.next(0);
    this.toShowNext$.next(this.itemsDestacados$.value.length - this.cantidadSlider);

    this.toShowBackTwo$.next(0);
    this.toShowNextTwo$.next(this.tipos.value.length - this.cantidadSlider);

    this.animateTrans().add({
      translateX: (0),
    });

    this.animateTransTwo().add({
      translateX: (0),
    });
  }

  nextSlide() {
    this.toShowBack$.next(this.toShowBack$.value + 1);
    this.toShowNext$.next(this.toShowNext$.value - 1);
    this.animateTrans().add({
      translateX: (-266 * (this.toShowBack$.value)),
    });
  }

  backSlide() {
    this.toShowBack$.next(this.toShowBack$.value - 1);
    this.toShowNext$.next(this.toShowNext$.value + 1);

    this.animateTrans().add({
      translateX: (-266 * (this.toShowBack$.value)),
    });
  }

  nextSlideTwo() {
    this.toShowBackTwo$.next(this.toShowBackTwo$.value + 1);
    this.toShowNextTwo$.next(this.toShowNextTwo$.value - 1);
    this.animateTransTwo().add({
      translateX: (-266 * (this.toShowBackTwo$.value)),
    });
  }

  backSlideTwo() {
    this.toShowBackTwo$.next(this.toShowBackTwo$.value - 1);
    this.toShowNextTwo$.next(this.toShowNextTwo$.value + 1);

    this.animateTransTwo().add({
      translateX: (-266 * (this.toShowBackTwo$.value)),
    });
  }
}
