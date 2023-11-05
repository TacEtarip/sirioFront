import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes/reportes.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeneralItemComponent } from './general-item/general-item.component';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';
import { ReportePorItemComponent } from './reporte-por-item/reporte-por-item.component';

@NgModule({
  declarations: [
    ReportesComponent,
    ReporteGeneralComponent,
    ReportePorItemComponent,
    GeneralItemComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    ReportesRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatRippleModule,
    MatListModule,
    MatDividerModule,
    NgxChartsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
})
export class ReportesModule {}
