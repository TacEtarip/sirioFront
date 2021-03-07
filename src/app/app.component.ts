import { Subscription } from 'rxjs';
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
  static isBrowser = new BehaviorSubject<boolean>(null);
  title = 'inventarioSirioFront';
  subI: Subscription;
  constructor(update: SwUpdate, private metaTagService: Meta, @Inject(DOCUMENT) private document: Document,
              @Inject(PLATFORM_ID) private platformId: any) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    this.subI = update.available.subscribe(event => {
      if (this.promptUser(event)) {
        update.activateUpdate().then(() => this.document.location.reload());
      }
    });
  }
  ngOnInit(): void {
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Sirio Dinar, Inventario Sirio Dinar, Compras Seguridad, Trujillo Seguridad' },
      { name: 'author', content: 'Sirio Dinar' },
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
