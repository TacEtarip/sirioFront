import { GeneralItemComponent } from './general-item/general-item.component';
import { ReportePorItemComponent } from './reporte-por-item/reporte-por-item.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesComponent } from './reportes/reportes.component';

import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';

const routes: Routes = [
  {
    path: '', component: ReportesComponent, children: [
      { path: 'general', component: ReporteGeneralComponent },
      { path: 'generalItem', component: GeneralItemComponent },
      { path: 'item', component: ReportePorItemComponent },
      { path: 'item/:itemCod', component: ReportePorItemComponent },
      {path: '', redirectTo: 'general', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
