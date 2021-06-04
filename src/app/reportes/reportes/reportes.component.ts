import { InventarioManagerService } from 'src/app/inventario-manager.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  multi: any[];
  single: any[];
  clientes: any[];

  view: [number, number] = [800, 400];

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

  gananciaAprox = 0;

  costoStock = 0;

  ventasAprox = 0;

  gastosHistoricos = 0;

  ingresorHistoricos = 0;

  invercionTotal = 0;

  ingresoTotal = 0;

  gananciasVentasTotales = 0;

  gananciasVentasFueraStock = 0;

  gananciasVentasSoloStock = 0;

  itemMasVendidoCantidad = '';

  itemMayorGananciaVentas = { name: '', value: 0 };

  itemMasRentable = { name: '', balance: 0 };

  itemMenosRentable = { name: '', balance: 0 };

  clienteMasRegular = { name: '', cantida: 0 };

  clienteMayorIngreso = { name: '', cantidad: 0 };

  smallSubs: Subscription;

  constructor(public auth: AuthService, private inv: InventarioManagerService,
              private router: Router, breakpointObserver: BreakpointObserver) {
    const isSmallScreenObs = breakpointObserver.observe(['(max-width: 900px)', '(max-width: 700px)']);

    this.smallSubs = isSmallScreenObs.subscribe(res => {
      if (res.breakpoints['(max-width: 900px)'] === true) {
        this.view = [550, 300];
      }
    });

    inv.getGraphOverTimeInfo().subscribe(multi => {
      if (multi) {
        this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
        Object.assign(this, { multi } );
      }
    });

    inv.getGraphTopItemsFive().subscribe(single => {
      if (single) {
        this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
        this.itemMayorGananciaVentas.name = single[0].name;
        this.itemMayorGananciaVentas.value = single[0].series[1].value;
        Object.assign(this, { single } );
      }
    });

    inv.getGraphTopClientes().subscribe(clientes => {
      if (clientes) {
        this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
        this.clienteMayorIngreso.cantidad = clientes[0].value;
        this.clienteMayorIngreso.name = clientes[0].name;
        Object.assign(this, { clientes } );
      }
    });
   }

  getPorcentDeCrecimiento(multi: []): any {

  }

  ngOnInit(): void {

    this.inv.getItemMasVendidoCantidad().subscribe(res => {
      this.itemMasVendidoCantidad = res.name;
    });

    this.inv.getVentasPotenciales().subscribe(res => {
      this.costoStock = res.costoPropioTotalAprox;
      this.gananciaAprox = res.gananciaAprox;
      this.ventasAprox = res.ventasPosibles;
    });

    this.inv.getTotalVariaciones().subscribe(res => {
      this.gastosHistoricos = res.gastosInventario;
      this.ingresorHistoricos = res.gananciasInventario;
    });

    this.inv.getPeorMejorItem().subscribe(res => {
      this.itemMasRentable = res.mejor;
      this.itemMenosRentable = res.peor;
    });

    this.inv.getInvecionGananciasTotal().subscribe(res => {
      this.invercionTotal = res.gastoTotalHistorico;
      this.ingresoTotal = res.ingresoTotalHistorico;
    });

    this.inv.getGananciasTotalesSNS().subscribe(res => {
      this.gananciasVentasSoloStock = res.gananciaEnVentasDeTienda;
      this.gananciasVentasFueraStock = res.gananciaEnVentasFueraTienda;
      this.gananciasVentasTotales = res.gananciaEnVentas;
    });

    this.inv.getClienteMasRegular().subscribe(res => {
      this.clienteMasRegular.name = res.cliente;
      this.clienteMasRegular.cantida = res.numero;
    });
  }

  aInventario() {
    this.router.navigate(['store', 'categorias']);
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
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

}
