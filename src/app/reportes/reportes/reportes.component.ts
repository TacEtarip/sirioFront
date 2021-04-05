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
  single: any[];
  clientes: any[];

  view: any[] = [700, 300];

  // options line chart
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

  colorSchemeBarItems = {
    domain: ['#E44D25', '#F0871A', '#FA6C1B']
  };

  colorSchemeBarItemsCliente = {
    domain: ['#E44D25', '#F0871A', '#FA6C1B', '#F01A51']
  };

  reporte$ = new BehaviorSubject(0);

  doneDataCollect$ = new BehaviorSubject<number>(0);

  constructor(public auth: AuthService, private inv: InventarioManagerService, private router: Router) {
    inv.getGraphOverTimeInfo().subscribe(multi => {
      if (multi) {
        this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
        Object.assign(this, { multi } );
      }
    });

    inv.getGraphTopItemsFive().subscribe(single => {
      if (single) {
        this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
        Object.assign(this, { single } );
      }
    });

    inv.getGraphTopClientes().subscribe(clientes => {
      if (clientes) {
        this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
        Object.assign(this, { clientes } );
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
