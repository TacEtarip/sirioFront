import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reporte$ = new BehaviorSubject(0);

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  aInventario() {
    this.router.navigate(['/inventario']);
  }

  reloadPage() {
    window.location.reload();
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }

  aVentas(){
    this.router.navigate(['/ventas']);
  }

  aToLogin() {
    this.router.navigate(['/login']);
  }

  selectReporte(i: number) {
    this.reporte$.next(i);
  }

}
