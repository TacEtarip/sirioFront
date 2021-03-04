import { Subscription } from 'rxjs';
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'inventarioSirioFront';
  subI: Subscription;

  constructor(update: SwUpdate, private metaTagService: Meta) {

    this.subI = update.available.subscribe(event => {
      if (this.promptUser(event)) {
        update.activateUpdate().then(() => document.location.reload());
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
