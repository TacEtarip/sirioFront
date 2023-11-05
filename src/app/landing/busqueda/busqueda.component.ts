import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import {
  InventarioManagerService,
  Item,
} from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
})
export class BusquedaComponent implements OnInit, OnDestroy {
  titulo$ = new BehaviorSubject<string>('');
  items$ = new BehaviorSubject<Item[]>([]);
  itemSecond$ = new BehaviorSubject<Item[]>([]);
  routesSub: Subscription;

  constructor(
    private inv: InventarioManagerService,
    public dialog: MatDialog,
    private ar: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.routesSub = this.ar.paramMap.subscribe((rutaM) => {
      if (rutaM.get('busqueda')) {
        this.titulo$.next(rutaM.get('busqueda'));
        this.inv.getItemsSearch(this.titulo$.value).subscribe((res) => {
          if (res) {
            if (
              this.auth.loggedIn() &&
              (this.auth.getTtype() === 'admin' ||
                this.auth.getTtype() === 'vent')
            ) {
              this.items$.next(res);
            } else {
              this.itemSecond$.next(res);
            }
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routesSub) {
      this.routesSub.unsubscribe();
    }
  }

  eliminarItem(e) {}
}
