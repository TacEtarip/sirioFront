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
    this.subII = this.router.events.subscribe(r => {
      console.log('qwe');
      // this.jsonLDS.removeStructuredData();
    });
  }
  ngOnInit(): void {
    this.metaTagService.addTags([
      { name: 'keywords',
      content: 'Sirio Dinar, Inventario Sirio Dinar, trujillo, peru, casco, filtro' +
      'Compras Seguridad, Trujillo Seguridad, seguridad, mascarillas, minas, cascos, guantes, lentes, orejeras, tampones, respiradores, respirador' },
      { name: 'description', content: 'Indumentaria de seguridad a el mejor precio en trujillo, venta al por menor y al por mayor.' },
      { name: 'author', content: 'Sirio Dinar' },
      { name: 'og:site_name', content: 'Sirio Dinar Store' },
      { name: 'og:type', content: 'website' },
      { name: 'og:url', content: 'https://inventario.siriodinar.com/store/main' },
      { name: 'og:title', content: 'Sirio Dinar | Store' },
      { name: 'og:description', content: 'Indumentaria de seguridad a el mejor precio en trujillo, venta al por menor y al por mayor.' },
      { name: 'og:image', content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg' },
      { name: 'og:image:alt', content: 'sirio presentacion' }
    ]);

  }
  ngOnDestroy(): void {
    if (this.subI) {
      this.subI.unsubscribe();
    }
    if (this.subII) {
      this.subII.unsubscribe();
      console.log('here2');
    }
  }

  promptUser(event) {
    return true;
  }
}
