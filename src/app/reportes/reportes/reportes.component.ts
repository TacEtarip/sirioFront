import { InventarioManagerService } from 'src/app/inventario-manager.service';
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

  multi: any[];
  // view: any[] = [700, 300];

  // options
  legend: true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  yAxisLabel = 'Ventas (S/)';
  timeline = true;

  colorScheme = {
    domain: ['#E44D25', '#112E96']
  };

  reporte$ = new BehaviorSubject(0);

  doneDataCollect$ = new BehaviorSubject<boolean>(false);

  constructor(public auth: AuthService, private inv: InventarioManagerService, private router: Router) {
    inv.getGraphOverTimeInfo().subscribe(multi => {
      console.log({ multi });
      if (multi) {
        this.doneDataCollect$.next(true);
        console.log(this.doneDataCollect$.value);
        Object.assign(this, { multi } );
      }
    });
   }

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

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
