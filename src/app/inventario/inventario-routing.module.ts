import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  TipoRutaComponent } from './inventario/tipo-ruta/tipo-ruta.component';

import { InventarioComponent } from './inventario/inventario.component';
import { ItemPageComponent } from './inventario/item-page/item-page.component';

import { SubTipoRutaComponent } from './inventario/sub-tipo-ruta/sub-tipo-ruta.component';

const routes: Routes = [
  { path: '', component: InventarioComponent, children: [
    {path: ':tipo', component: TipoRutaComponent},
    {path: ':tipo/:subTipo', component: TipoRutaComponent},
    {path: ':tipo/:subTipo/:item', component: ItemPageComponent},
    {path: '', redirectTo: 'Destacado', pathMatch: 'full'}
  ]
  }

  /*  { path: 'all', component: InventarioComponent, children: [
    {path: 'test', component: TestComponentComponent}
  ]},
  {path: '', redirectTo: 'all', pathMatch: 'full'}*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
