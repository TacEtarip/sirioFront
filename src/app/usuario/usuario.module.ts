import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditarCelularDialogComponent } from './editar-celular-dialog/editar-celular-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgregarDireccionDialogComponent } from './agregar-direccion-dialog/agregar-direccion-dialog.component';
import { CambiarContrasenaDialogComponent } from './cambiar-contrasena-dialog/cambiar-contrasena-dialog.component';
import { AgregarDocumentoDialogComponent } from './agregar-documento-dialog/agregar-documento-dialog.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [UsuarioComponent, EditarCelularDialogComponent,
    AgregarDireccionDialogComponent, CambiarContrasenaDialogComponent, AgregarDocumentoDialogComponent],
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
    MatSelectModule
  ]
})
export class UsuarioModule { }
