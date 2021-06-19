import { JsonLDServiceService } from 'src/app/json-ldservice.service';
import { Subscription } from 'rxjs';
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
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
  constructor(update: SwUpdate, private metaTagService: Meta, private router: Router,
              @Inject(DOCUMENT) private document: Document, private jsonLDS: JsonLDServiceService) {
    this.subI = update.available.subscribe(event => {
        update.activateUpdate().then(() => this.document.location.reload());
    });
  }
  ngOnInit(): void {
    this.metaTagService.addTags([
      { name: 'keywords',
      content: 'Sirio Dinar, Inventario Sirio Dinar, trujillo, peru, casco, filtro' +
      'Compras Seguridad, Trujillo Seguridad, seguridad, mascarillas, minas, cascos, guantes, lentes, orejeras, tampones, respiradores, respirador' },
      { name: 'description', content: 'Indumentaria de seguridad a el mejor precio en trujillo, venta al por menor y al por mayor.' },
      { name: 'author', content: 'Tac Etarip Web' },
      { property: 'og:site_name', content: 'Sirio Dinar Store' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://inventario.siriodinar.com/store/main' },
      { property: 'og:title', content: 'Sirio Dinar | Store' },
      { property: 'og:description', content: 'Indumentaria de seguridad a el mejor precio en trujillo, venta al por menor y al por mayor.'},
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
