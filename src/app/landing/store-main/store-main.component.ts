import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InventarioManagerService, Item, Tipo } from 'src/app/inventario-manager.service';
import { AuthService } from '../../auth.service';
import anime from 'animejs';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-store-main',
  templateUrl: './store-main.component.html',
  styleUrls: ['./store-main.component.css']
})
export class StoreMainComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

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

  constructor(public auth: AuthService, private inv: InventarioManagerService, media: MediaMatcher,
              private router: Router, private fb: FormBuilder, changeDetectorRef: ChangeDetectorRef) {
                this.mobileQuery = media.matchMedia('(max-width: 1600px)');
                this.mobileQueryListener = () => changeDetectorRef.detectChanges();
                // this.mobileQuery.addListener(this.mobileQueryListener);
                console.log(this.mobileQuery.matches);
                this.mobileQuery.addEventListener('change', (e) => {
                  console.log(e.matches);
                });
               }

  ngOnDestroy(): void {
    if (this.busquedaSub) {
      this.busquedaSub.unsubscribe();
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
      this.toShowNext$.next(res.length - 4);
    });

    this.busquedaSub = this.busqueda.get('name').valueChanges.subscribe((changeV: any) => {
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
      this.toShowNextTwo$.next(res.length - 4);
    });
  }

  displayFn(item: Item): string {
    return item && item.name ? item.name : '';
  }

  selectItem(e: MatAutocompleteSelectedEvent) {
    this.item$.next(e.option.value);
    console.log(this.item$.value);
    this.filteredItem$.next(null);
  }

  filterItemValue(value: any) {

    this.inv.getListOfItemsFilteredByRegex(value.name || value, 15).subscribe(res => {
      if (res) {
        this.filteredItem$.next(res);
        if (res.length === 0) {
          this.item$.next(null);
        } else {
          const index =
          this.filteredItem$.value.findIndex((el) => el.name.toUpperCase() === value.name ? value.name.toUpperCase() : value.toUpperCase());
          this.item$.next(this.filteredItem$.value[index]);
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
