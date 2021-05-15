import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { InventarioGuard } from './guards/inventario.guard';
import { LandingGuard } from './guards/landing.guard';
import { VentasGuard } from './guards/ventas.guard';
import { UsuarioGuard } from './guards/usuario.guard';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'store', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), canActivate: [LoginGuard]},
  {path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)
  , canActivate: [VentasGuard], canLoad: [VentasGuard]},
  {path: 'reportes', loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)},
  {path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
  , canActivate: [UsuarioGuard], canLoad: [UsuarioGuard]},
  {path: '', redirectTo: 'store', pathMatch: 'full'},
  {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
