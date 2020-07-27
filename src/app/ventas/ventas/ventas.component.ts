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
export class VentasComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  nombreUsuario: string;

  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              private auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router) {
                this.nombreUsuario = auth.getDisplayUser();
                this.mobileQuery = media.matchMedia('(max-width: 820px)');
                this.mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addEventListener('change', this.mobileQueryListener);
               }

  ngOnInit(): void {

  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }

  goToVentaHistorial() {
    this.router.navigate(['/ventas/historialVentas']);
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }

  aInventario() {
    this.router.navigate(['/inventario']);
  }

  reloadPage() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
   }

   goToVentaActiva() {
    this.router.navigateByUrl(`/ventas/ventasActivas`);
   }
}
