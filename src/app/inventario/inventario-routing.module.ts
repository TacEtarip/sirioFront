import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioComponent } from './inventario/inventario.component';

const routes: Routes = [
  { path: '', component: InventarioComponent},

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
