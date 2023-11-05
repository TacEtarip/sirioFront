import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { PoliticaDeDevolucionComponent } from './politica-de-devolucion/politica-de-devolucion.component';
import { PoliticaDeEnvioComponent } from './politica-de-envio/politica-de-envio.component';
import { PoliticaDePrivacidadComponent } from './politica-de-privacidad/politica-de-privacidad.component';
import { ServicioRoutingModule } from './servicio-al-cliente-routing.module';
import { ServicioAlClienteComponent } from './servicio-al-cliente/servicio-al-cliente.component';
import { TerminosYCondicionesComponent } from './terminos-y-condiciones/terminos-y-condiciones.component';

@NgModule({
  declarations: [
    ServicioAlClienteComponent,
    TerminosYCondicionesComponent,
    PoliticaDePrivacidadComponent,
    ContactanosComponent,
    PoliticaDeDevolucionComponent,
    PoliticaDeEnvioComponent,
  ],
  imports: [
    CommonModule,
    ServicioRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
  ],
})
export class ServicioAlClienteModule {}
