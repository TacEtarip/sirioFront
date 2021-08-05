import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserInfo } from 'src/app/auth.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';
import { InventarioManagerService, Item, Tipo } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  busquedaForm: FormGroup;

  loggedInfo$ = new BehaviorSubject<UserInfo>(null);

  filteredItem$ = new BehaviorSubject<Item[]>(null);

  tipos = new BehaviorSubject<Tipo[]>(null);

  descripcion = 'Carrito de compras. Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor;' +
  'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
  'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más información enviar un mensaje' +
  ' al +51 977 426 349, estamos para servirle.';

  whatsAppLinkOne = 'https://wa.me/51977426349?text=' + 'Buenas, me gustaria obtener más información.';
  whatsAppLinkTwo = 'https://wa.me/51922412404?text=' + 'Buenas, me gustaria obtener más información.';

  constructor(public auth: AuthService, private router: Router, private analyticsGoogle: GoogleAnalyticsService,
              private fb: FormBuilder, private inv: InventarioManagerService, private metaService: Meta, private titleService: Title) {
    this.auth.getAuhtInfo().pipe(first()).subscribe(res => {
      this.loggedInfo$.next(res);
    });
   }

  ngOnInit(): void {
    this.analyticsGoogle.addAnalytics();

    this.titleService.setTitle('Carrito De Compras | Sirio Dinar');
    this.metaService.updateTag({ name: 'description',
    content: this.descripcion });

    this.metaService.updateTag({ property: 'og:url', content: 'https://inventario.siriodinar.com/carrito/listado' });
    this.metaService.updateTag({ property: 'og:title', content: 'Carrito De Compras | Sirio Dinar' });
    this.metaService.updateTag({ property: 'og:description',
    content: this.descripcion });
    this.metaService.updateTag({ property: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' });
    this.metaService.updateTag({ property: 'og:image:alt', content: 'sirio presentacion' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

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

  goToBusqueda(name: string) {
    if (this.busquedaForm.valid) {
      this.router.navigate(['store', 'busqueda', name]);
    }
  }

  clearBusqueda() {
    this.busquedaForm.reset();
    this.router.navigate(['store', 'categorias']);
  }

}
