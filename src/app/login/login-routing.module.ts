import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AutoComponent } from './auto/auto.component';

const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'registro/:googleToken', component: RegistroComponent },
  { path: 'auto/:token', component: AutoComponent },
  { path: 'login', component:  LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
