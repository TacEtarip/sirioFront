import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { UsuarioGuard } from './guards/usuario.guard';
import { VentasGuard } from './guards/ventas.guard';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'store', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
  { path: 'carrito', loadChildren: () => import('./carrito-compras/carrito-compras.module').then(m => m.CarritoComprasModule) },
  { path: 'servicio-al-cliente', loadChildren: () => import('./servicio-al-cliente/servicio-al-cliente.module')
  .then(m => m.ServicioAlClienteModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), canActivate: [LoginGuard]},
  { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)
  , canActivate: [VentasGuard], canLoad: [VentasGuard]},
  { path: 'reportes', loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule),
  canActivate: [VentasGuard], canLoad: [VentasGuard]},
  { path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
  , canActivate: [UsuarioGuard], canLoad: [UsuarioGuard]},
  { path: 'inventario', redirectTo: 'store', pathMatch: 'full'},
  { path: '', redirectTo: 'store', pathMatch: 'full'},
  { path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
