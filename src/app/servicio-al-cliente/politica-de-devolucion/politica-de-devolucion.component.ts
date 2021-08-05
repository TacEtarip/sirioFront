import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-politica-de-devolucion',
  templateUrl: './politica-de-devolucion.component.html',
  styleUrls: ['./politica-de-devolucion.component.css']
})
export class PoliticaDeDevolucionComponent implements OnInit {

  descripcion = 'Política de devolución. Tienda de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor;' +
  'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
  'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más información enviar un mensaje' +
  ' al +51 977 426 349, estamos para servirle.';

  constructor(private titleService: Title, private metaTagService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('Politica de devolución | Sirio Dinar');
    this.metaTagService.updateTag(
      { name: 'description', content: this.descripcion }
    );
    this.metaTagService.updateTag({ property: 'og:url', content: 'https://inventario.siriodinar.com/servicio-al-cliente/politica-de-devolucion' });
    this.metaTagService.updateTag({ property: 'og:title', content: 'Politica de devolución | Sirio Dinar' });
    this.metaTagService.updateTag({ property: 'og:description',
    content: this.descripcion });
    this.metaTagService.updateTag({ property: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' });
    this.metaTagService.updateTag({ property: 'og:image:alt', content: 'sirio presentacion' });
    this.metaTagService.updateTag({ property: 'og:type', content: 'website' });
  }

}
