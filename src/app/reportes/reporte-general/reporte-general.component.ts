import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService, Item } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.css']
})
export class ReporteGeneralComponent implements OnInit, OnDestroy {


  below = LegendPosition.Below;

  multi: any[];
  single: any[];
  clientes: any[];

  panelOpenState = false;

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

  itemsNoStock$ = new BehaviorSubject<Item[]>([]);

  itemsLowStock$ = new BehaviorSubject<Item[]>([]);

  gananciaAprox = new BehaviorSubject<number>(0);

  costoStock = new BehaviorSubject<number>(0);

  ventasAprox = new BehaviorSubject<number>(0);

  gastosHistoricos = new BehaviorSubject<number>(0);

  ingresorHistoricos = new BehaviorSubject<number>(0);

  invercionTotal = new BehaviorSubject<number>(0);

  ingresoTotal = new BehaviorSubject<number>(0);

  gananciasVentasTotales = new BehaviorSubject<number>(0);

  gananciasVentasFueraStock = new BehaviorSubject<number>(0);

  gananciasVentasSoloStock = new BehaviorSubject<number>(0);

  itemMasVendidoCantidad = new BehaviorSubject<{name: string, value: number}>({ name:  '', value: 0 }) ;

  itemMayorGananciaVentas = new BehaviorSubject<{name: string, value: number}>({ name:  '', value: 0 });

  itemMasRentable = new BehaviorSubject<{name: string, balance: number}>({ name: '', balance: 0 });

  itemMenosRentable = new BehaviorSubject<{name: string, balance: number}>({ name: '', balance: 0 });

  clienteMasRegular = new BehaviorSubject<{name: string, cantidad: number}>({ name: '', cantidad: 0 });

  clienteMayorIngreso = new BehaviorSubject<{name: string, cantidad: number}>({ name: '', cantidad: 0 });

  smallSubs: Subscription;

  itemMayorGananciaPosible = new BehaviorSubject<{name: string, value: number}>({name: '', value: 0});

  constructor(public auth: AuthService, private inv: InventarioManagerService,
              breakpointObserver: BreakpointObserver) {


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

inv.getItemMayorGananciaPosible().subscribe(res => {
if (res) {
this.itemMayorGananciaPosible.next({ name: res.name, value: res.balance });
}
});

inv.getGraphTopItemsFive().subscribe(single => {
if (single) {
this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
this.itemMayorGananciaVentas.next({ name: single[0].name, value: single[0].series[1].value });
Object.assign(this, { single } );
}
});

inv.getGraphTopClientes().subscribe(clientes => {
if (clientes) {
this.doneDataCollect$.next(this.doneDataCollect$.value + 1);
this.clienteMayorIngreso.next({ name: clientes[0].name, cantidad: clientes[0].value });

Object.assign(this, { clientes } );
}
});


}

getPorcentDeCrecimiento(multi: []): any {

}

  ngOnDestroy(): void {
    if (this.smallSubs) {
      this.smallSubs.unsubscribe();
    }
  }

ngOnInit(): void {

this.inv.getItemMasVendidoCantidad().subscribe(res => {
this.itemMasVendidoCantidad.next({ name: res.name, value: res.cantidad });
});

this.inv.getVentasPotenciales().subscribe(res => {
this.costoStock.next(res.costoPropioTotalAprox);
this.gananciaAprox.next(res.gananciaAprox);
this.ventasAprox.next(res.ventasPosibles);
});

this.inv.getTotalVariaciones().subscribe(res => {
this.gastosHistoricos.next(res.gastosInventario);
this.ingresorHistoricos.next(res.gananciasInventario);
});

this.inv.getPeorMejorItem().subscribe(res => {
  this.itemMasRentable.next(res.mejor);
  this.itemMenosRentable.next(res.peor);
});

this.inv.getInvecionGananciasTotal().subscribe(res => {
this.invercionTotal.next(res.gastoTotalHistorico);
this.ingresoTotal.next(res.ingresoTotalHistorico);
});

this.inv.getGananciasTotalesSNS().subscribe(res => {
this.gananciasVentasSoloStock.next(res.gananciaEnVentasDeTienda);
this.gananciasVentasFueraStock.next(res.gananciaEnVentasFueraTienda);
this.gananciasVentasTotales.next(res.gananciaEnVentas);
});

this.inv.getClienteMasRegular().subscribe(res => {
  this.clienteMasRegular.next({ name: res.cliente, cantidad: res.numero});
});

this.inv.getItemsNoStock().subscribe(res => {
this.itemsNoStock$.next(res);
});

this.inv.getItemsLowStock().subscribe(res => {
this.itemsLowStock$.next(res);
});
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
