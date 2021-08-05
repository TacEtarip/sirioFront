import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-servicio-al-cliente',
  templateUrl: './servicio-al-cliente.component.html',
  styleUrls: ['./servicio-al-cliente.component.css']
})
export class ServicioAlClienteComponent implements OnInit {

  descripcion = 'Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor;' +
  'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
  'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más información enviar un mensaje' +
  ' al +51 977 426 349, estamos para servirle.';

  constructor(private metaTagService: Meta) { }

  ngOnInit(): void {
    this.metaTagService.updateTag({ property: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' });
    this.metaTagService.updateTag({ property: 'og:image:alt', content: 'sirio presentacion' });
    this.metaTagService.updateTag({ property: 'og:type', content: 'website' });
  }

}
