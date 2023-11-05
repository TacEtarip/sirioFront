import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

import { MatIconModule } from '@angular/material/icon';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { AutoComponent } from './auto/auto.component';
import { RegistroComponent } from './registro/registro.component';
@NgModule({
  declarations: [LoginComponent, RegistroComponent, AutoComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatSelectModule,
    MatAutocompleteModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
})
export class LoginModule {}
