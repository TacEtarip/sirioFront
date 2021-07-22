import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit, OnDestroy {
  title = 'inventarioSirioFront';
  subI: Subscription;
  subII: Subscription;
  constructor(update: SwUpdate, private metaTagService: Meta,
              @Inject(DOCUMENT) private document: Document) {
    this.subI = update.available.subscribe(event => {
        update.activateUpdate().then(() => this.document.location.reload());
    });
  }
  ngOnInit(): void {
    this.metaTagService.addTags([
      { name: 'keywords',
      content: 'Sirio Dinar, Inventario Sirio Dinar, trujillo, peru, casco, filtro, epp, epps,' +
      'Compras Seguridad, Trujillo Seguridad, seguridad, mascarillas, minas, cascos, guantes, lentes, orejeras, tampones, respiradores, respirador' },
      { name: 'description',
      content: 'Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor,' +
      'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
      'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más informacion enviar un mensaje' +
      ' al +51 977 426 349, estamos para servirle.'  },
      { name: 'author', content: 'Tac Etarip Web' },
      { property: 'og:site_name', content: 'Sirio Dinar Store' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://inventario.siriodinar.com/store/main' },
      { property: 'og:title', content: 'Sirio Dinar | Store' },
      { property: 'og:description', content: 'Venta de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor,' +
      'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
      'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más informacion enviar un mensaje' +
      ' al +51 977 426 349, estamos para servirle.'},
      { property: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' },
      { property: 'og:image:alt', content: 'sirio presentacion' }
    ]);

  }
  ngOnDestroy(): void {
    if (this.subI) {
      this.subI.unsubscribe();
    }
  }

  promptUser(event) {
    return true;
  }
}
