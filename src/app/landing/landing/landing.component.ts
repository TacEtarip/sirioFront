import { Title } from '@angular/platform-browser';
import { Tipo } from './../../inventario-manager.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InventarioManagerService, Item } from 'src/app/inventario-manager.service';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  busquedaForm: FormGroup;

  filteredItem$ = new BehaviorSubject<Item[]>(null);
  item$ = new BehaviorSubject<Item>(null);

  tipos = new BehaviorSubject<Tipo[]>(null);

  openMenu = false;

  busquedaSub: Subscription;

  whatsAppLinkOne = 'https://wa.me/51977426349?text=' + 'Buenas, me gustaria obtener más información.';
  whatsAppLinkTwo = 'https://wa.me/51922412404?text=' + 'Buenas, me gustaria obtener más información.';

  constructor(public auth: AuthService, private inv: InventarioManagerService, private titleService: Title,
              private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.titleService.setTitle('Sirio Dinar | Store');

    this.busquedaForm = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60)
      ])),
    });

    this.inv.getTipos().subscribe(res => {
      this.tipos.next(res);
    });

    this.busquedaSub = this.busquedaForm.get('name').valueChanges.subscribe((changeV: any) => {
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
  }

  aInventario() {
    this.router.navigate(['/store/categorias']);
  }

  reloadPage() {
    window.location.reload();
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }

  aToLogin() {
    this.router.navigate(['/login']);
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
          const index =
          this.filteredItem$.value.findIndex((el) => el.name.toUpperCase() === testValue ? value.name.toUpperCase() : value.toUpperCase());
          this.item$.next(this.filteredItem$.value[index]);
        }
      } else {
        this.filteredItem$.next(null);
      }
    });
  }

  goToBusqueda(name: string) {
    if (this.busquedaForm.valid) {
      this.router.navigate(['store', 'busqueda', name]);
    }
  }

  clearBusqueda() {
    this.busquedaForm.reset();
    this.router.navigate(['store', 'categorias']);
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

}
