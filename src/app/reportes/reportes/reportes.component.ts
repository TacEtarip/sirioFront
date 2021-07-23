import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserInfo } from '../../auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit, OnDestroy {

  reporte$ = new BehaviorSubject(0);

  slide = new BehaviorSubject<boolean>(null);

  smallSubs: Subscription;

  loggedInfo$ = new BehaviorSubject<UserInfo>(null);


  constructor(public auth: AuthService, private breakpointObserver: BreakpointObserver,
              private router: Router) {
                this.auth.getAuhtInfo().pipe(first()).subscribe(res => {
                  this.loggedInfo$.next(res);
                });
                const isSmallScreenObs = breakpointObserver.observe(['(max-width: 1150px)']);
                this.smallSubs = isSmallScreenObs.subscribe(res => {
                  if (res.breakpoints['(max-width: 1150px)'] === false) {
                    this.slide.next(null);
                  }
                });
   }

   ngOnDestroy(): void {
     if (this.smallSubs) {
      this.smallSubs.unsubscribe();
     }
   }

  ngOnInit(): void {
    const urlStart = this.router.url.split('/')[2];
    if (urlStart === 'general') {
      this.reporte$.next(0);
    } else if (urlStart === 'generalItem') {
      this.reporte$.next(1);
    }
     else if (urlStart === 'item') {
      this.reporte$.next(2);
    }
  }

  aInventario() {
    this.router.navigate(['store', 'categorias']);
  }

  reloadPage() {
    window.location.reload();
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }

  aToLogin() {
    this.router.navigate(['/login']);
  }

  selectReporte(i: number) {
    this.reporte$.next(i);
    if (i === 0) {
      this.router.navigate(['reportes']);
    } else if (i === 1) {
      this.router.navigate(['reportes', 'generalItem']);
    } else if (i === 2) {
      this.router.navigate(['reportes', 'item']);
    }
  }


}
