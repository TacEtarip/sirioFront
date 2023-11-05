import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { StoreMainComponent } from './store-main/store-main.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      { path: 'main', component: StoreMainComponent },
      { path: 'busqueda', component: BusquedaComponent },
      { path: 'busqueda/:busqueda', component: BusquedaComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'categorias/:categoria', component: CategoriasComponent },
      { path: 'categorias/:categoria/:sub', component: CategoriasComponent },
      {
        path: 'categorias/:categoria/:sub/:item',
        component: CategoriasComponent,
      },
      { path: '', redirectTo: 'main', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
