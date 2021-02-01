import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoginRoutingModule } from './login-routing.module';
import {MatButtonModule} from '@angular/material/button';

import {MatIconModule} from '@angular/material/icon';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RegistroComponent } from './registro/registro.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AutoComponent } from './auto/auto.component';
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
    RecaptchaFormsModule
  ]
})
export class LoginModule { }
