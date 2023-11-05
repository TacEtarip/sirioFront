import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatRippleModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VentasRoutingModule } from './ventas-routing.module';
import { CotizacionCardComponent } from './ventas/cotizacion/cotizacion-card/cotizacion-card.component';
import { CotizacionComponent } from './ventas/cotizacion/cotizacion.component';
import { FullCotiComponent } from './ventas/cotizacion/full-coti/full-coti.component';
import { GenerarCotiComponent } from './ventas/cotizacion/generar-coti/generar-coti.component';
import { PreExcelDialogComponent } from './ventas/cotizacion/pre-excel-dialog/pre-excel-dialog.component';
import { Eject404Component } from './ventas/eject404/eject404.component';
import { HistorialVentasComponent } from './ventas/historial-ventas/historial-ventas.component';
import { SeguroAnularComponent } from './ventas/historial-ventas/seguro-anular/seguro-anular.component';
import { VentaIndHistoriaComponent } from './ventas/historial-ventas/venta-ind-historia/venta-ind-historia.component';
import { PostVentaComponent } from './ventas/post-venta/post-venta.component';
import { SeguroCheckComponent } from './ventas/seguro-check/seguro-check.component';
import { SeguroEjecDialogComponent } from './ventas/seguro-ejec-dialog/seguro-ejec-dialog.component';
import { GenerarVentaComponent } from './ventas/ventas-activas/generar-venta/generar-venta.component';
import { VentaActivaCardComponent } from './ventas/ventas-activas/venta-activa-card/venta-activa-card.component';
import { VentasActivasComponent } from './ventas/ventas-activas/ventas-activas.component';
import { VentasComponent } from './ventas/ventas.component';

@NgModule({
  declarations: [
    VentasComponent,
    VentasActivasComponent,
    VentaActivaCardComponent,
    SeguroEjecDialogComponent,
    PostVentaComponent,
    HistorialVentasComponent,
    Eject404Component,
    VentaIndHistoriaComponent,
    SeguroAnularComponent,
    GenerarVentaComponent,
    CotizacionComponent,
    CotizacionCardComponent,
    GenerarCotiComponent,
    FullCotiComponent,
    PreExcelDialogComponent,
    SeguroCheckComponent,
  ],
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
    MatMenuModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class VentasModule {}
