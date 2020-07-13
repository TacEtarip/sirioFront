import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import {InventarioManagerService, Item } from '../../inventario-manager.service';
import { AuthService } from '../../auth.service';
import { first } from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  nombreUsuario: string;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              private auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router) {
                this.nombreUsuario = auth.getDisplayUser();
                this.mobileQuery = media.matchMedia('(max-width: 700px)');
                this._mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this._mobileQueryListener);
               }

  ngOnInit(): void {

  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }

  aInventario() {
    this.router.navigate(['/inventario']);
  }

}
