import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  nombreUsuario: string;

  constructor(public dialog: MatDialog,
              public auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private titleService: Title,
              private metaTagService: Meta,
              private router: Router) {
                this.nombreUsuario = auth.getDisplayUser();
                this.mobileQuery = media.matchMedia('(max-width: 1080px)');
                this.mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this.mobileQueryListener);
               }

  ngOnInit(): void {
    this.titleService.setTitle('Sirio Dinar | Ventas');
    this.metaTagService.updateTag(
      { name: 'description', content: 'Vender articulos seguridad sirio' }
    );
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
    this.router.navigate(['store', 'categorias']);
  }

  reloadPage() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
   }

   goToVentaActiva() {
    this.router.navigateByUrl(`/ventas/ventasActivas`);
   }

   goToCotizaciones() {
    this.router.navigateByUrl(`/ventas/cotizaciones`);
   }

   aToLogin() {
    this.router.navigate(['/login']);
  }
}
