import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { InventarioGuard } from './guards/inventario.guard';
import { VentasGuard } from './guards/ventas.guard';

const routes: Routes = [
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), canActivate: [LoginGuard]},
  {path: 'inventario', loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioModule)
  , canActivate: [InventarioGuard], canLoad: [InventarioGuard]},
  {path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)
  , canActivate: [VentasGuard], canLoad: [VentasGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
