import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { PoliticaDeDevolucionComponent } from './politica-de-devolucion/politica-de-devolucion.component';
import { PoliticaDeEnvioComponent } from './politica-de-envio/politica-de-envio.component';
import { PoliticaDePrivacidadComponent } from './politica-de-privacidad/politica-de-privacidad.component';
import { ServicioAlClienteComponent } from './servicio-al-cliente/servicio-al-cliente.component';
import { TerminosYCondicionesComponent } from './terminos-y-condiciones/terminos-y-condiciones.component';


const routes: Routes = [
  { path: '', component: ServicioAlClienteComponent, children: [
    { path: 'contactanos', component: ContactanosComponent },
    { path: 'terminos-y-condiciones', component: TerminosYCondicionesComponent },
    { path: 'politica-de-privacidad', component: PoliticaDePrivacidadComponent },
    { path: 'politica-de-devolucion', component: PoliticaDeDevolucionComponent },
    { path: 'politica-de-envio', component: PoliticaDeEnvioComponent },
    { path: '', redirectTo: 'contactanos', pathMatch: 'full' }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioRoutingModule { }
