import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasComponent } from './ventas/ventas.component';

import { VentasRoutingModule } from './ventas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTooltipModule} from '@angular/material/tooltip';
import { VentasCardComponent } from './ventas/ventas-card/ventas-card.component';
import {MatDividerModule, MatDivider} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import { VentasActivasComponent } from './ventas/ventas-activas/ventas-activas.component';
import { VentaActivaCardComponent } from './ventas/ventas-activas/venta-activa-card/venta-activa-card.component';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SeguroEjecDialogComponent } from './ventas/seguro-ejec-dialog/seguro-ejec-dialog.component';
import { PostVentaComponent } from './ventas/post-venta/post-venta.component';
import {MatRippleModule} from '@angular/material/core';
import { HistorialVentasComponent } from './ventas/historial-ventas/historial-ventas.component';
import { Eject404Component } from './ventas/eject404/eject404.component';


@NgModule({
  declarations: [VentasComponent, VentasCardComponent, VentasActivasComponent,
    VentaActivaCardComponent, SeguroEjecDialogComponent, PostVentaComponent, HistorialVentasComponent, Eject404Component],
  imports: [
    CommonModule,
    VentasRoutingModule,
    CommonModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatExpansionModule,
    DragDropModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatChipsModule,
    ScrollingModule,
    MatTooltipModule,
    MatDividerModule,
    MatTableModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ]
})
export class VentasModule { }
