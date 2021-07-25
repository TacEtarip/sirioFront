import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarritoRoutingModule } from './carrito-routing.module';
import { CarritoTablaComponent } from './carrito-tabla/carrito-tabla.component';
import { CarritoComponent } from './carrito/carrito.component';



@NgModule({
  declarations: [
    CarritoComponent,
    CarritoTablaComponent
  ],
  imports: [
    CommonModule,
    CarritoRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatRippleModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class CarritoComprasModule { }
