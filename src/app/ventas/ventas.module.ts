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
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { VentaIndHistoriaComponent } from './ventas/historial-ventas/venta-ind-historia/venta-ind-historia.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SeguroAnularComponent } from './ventas/historial-ventas/seguro-anular/seguro-anular.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { GenerarVentaComponent } from './ventas/ventas-activas/generar-venta/generar-venta.component';
import { CotizacionComponent } from './ventas/cotizacion/cotizacion.component';
import { CotizacionCardComponent } from './ventas/cotizacion/cotizacion-card/cotizacion-card.component';
import { GenerarCotiComponent } from './ventas/cotizacion/generar-coti/generar-coti.component';
import { FullCotiComponent } from './ventas/cotizacion/full-coti/full-coti.component';
import { PreExcelDialogComponent } from './ventas/cotizacion/pre-excel-dialog/pre-excel-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { SeguroCheckComponent } from './ventas/seguro-check/seguro-check.component';


@NgModule({
  declarations: [VentasComponent, VentasActivasComponent,
    VentaActivaCardComponent, SeguroEjecDialogComponent, PostVentaComponent, HistorialVentasComponent,
    Eject404Component, VentaIndHistoriaComponent, SeguroAnularComponent,
    GenerarVentaComponent, CotizacionComponent, CotizacionCardComponent, GenerarCotiComponent,
    FullCotiComponent, PreExcelDialogComponent, SeguroCheckComponent],
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
    MatRippleModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    MatAutocompleteModule,
    FormsModule,
    MatMenuModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class VentasModule { }
