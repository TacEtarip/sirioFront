import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { InventarioGuard } from './guards/inventario.guard';
import { VentasGuard } from './guards/ventas.guard';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {path: 'inventario', loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioModule)},
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), canActivate: [LoginGuard]},
  {path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)
  , canActivate: [VentasGuard], canLoad: [VentasGuard]},
  {path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
  , canActivate: [UsuarioGuard], canLoad: [UsuarioGuard]},
  {path: '', redirectTo: 'inventario', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
