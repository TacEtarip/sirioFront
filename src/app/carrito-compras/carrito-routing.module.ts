import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarritoTablaComponent } from './carrito-tabla/carrito-tabla.component';

import { CarritoComponent } from './carrito/carrito.component';
import { PagoComponent } from './pago/pago.component';

const routes: Routes = [
  { path: '', component: CarritoComponent, children: [
    { path: 'listado', component: CarritoTablaComponent },
    { path: 'pago', component: PagoComponent },
    { path: '', redirectTo: 'listado', pathMatch: 'full' },
    { path: '**', redirectTo: 'listado' }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarritoRoutingModule { }
