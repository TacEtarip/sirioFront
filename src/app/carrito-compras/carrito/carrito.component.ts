import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  descripcion = 'Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor;' +
  'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
  'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más información enviar un mensaje' +
  ' al +51 977 426 349, estamos para servirle.';

  whatsAppLinkOne = 'https://wa.me/51977426349?text=' + 'Buenas, me gustaria obtener más información.';
  whatsAppLinkTwo = 'https://wa.me/51922412404?text=' + 'Buenas, me gustaria obtener más información.';

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
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

}
