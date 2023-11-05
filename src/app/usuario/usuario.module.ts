import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgregarDireccionDialogComponent } from './agregar-direccion-dialog/agregar-direccion-dialog.component';
import { AgregarDocumentoDialogComponent } from './agregar-documento-dialog/agregar-documento-dialog.component';
import { CambiarContrasenaDialogComponent } from './cambiar-contrasena-dialog/cambiar-contrasena-dialog.component';
import { EditarCelularDialogComponent } from './editar-celular-dialog/editar-celular-dialog.component';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario/usuario.component';

@NgModule({
  declarations: [
    UsuarioComponent,
    EditarCelularDialogComponent,
    AgregarDireccionDialogComponent,
    CambiarContrasenaDialogComponent,
    AgregarDocumentoDialogComponent,
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
})
export class UsuarioModule {}
