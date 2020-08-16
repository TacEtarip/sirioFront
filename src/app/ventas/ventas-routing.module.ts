import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './ventas/ventas.component';

import { PostVentaComponent } from './ventas/post-venta/post-venta.component';
import { VentasActivasComponent } from './ventas/ventas-activas/ventas-activas.component';
import { HistorialVentasComponent } from './ventas/historial-ventas/historial-ventas.component';
import { Eject404Component } from './ventas/eject404/eject404.component';
import { VentaIndHistoriaComponent } from './ventas/historial-ventas/venta-ind-historia/venta-ind-historia.component';

const routes: Routes = [
  { path: '', component: VentasComponent, children: [
    {path: 'ventasActivas', component: VentasActivasComponent},
    {path: 'historialVentas', component: HistorialVentasComponent},
    {path: 'historialVentas/:ventaCod', component: VentaIndHistoriaComponent},
    {path: 'postVenta/:postVentaCod', component: PostVentaComponent},
    {path: 'eject/404', component: Eject404Component},
    {path: '', redirectTo: 'ventasActivas', pathMatch: 'full'}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
