import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InventarioComponent } from './inventario/inventario.component';
import { InventarioRoutingModule } from './inventario-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { ListaPlegableComponent } from './inventario/lista-plegable/lista-plegable.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NewItemDialogComponent } from './inventario/new-item-dialog/new-item-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { VentaDialogComponent } from './inventario/venta-dialog/venta-dialog.component';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AgregarClaseItemComponent } from './inventario/agregar-clase-item/agregar-clase-item.component';
import {MatChipsModule} from '@angular/material/chips';
import { ItemCardComponent } from './inventario/item-card/item-card.component';
import { UploadsDialogComponent } from './inventario/uploads-dialog/uploads-dialog.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { EditarItemDialogComponent } from './inventario/editar-item-dialog/editar-item-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SeguroEliminarComponent } from './inventario/seguro-eliminar/seguro-eliminar.component';
import {MatDividerModule, MatDivider} from '@angular/material/divider';
import { EditarClaseComponent } from './inventario/editar-clase/editar-clase.component';
import { EliminarDialogComponent } from './inventario/eliminar-dialog/eliminar-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRippleModule} from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SubListaDesplegableComponent } from './inventario/sub-lista-desplegable/sub-lista-desplegable.component';
import { AgregarSubCategoriasComponent } from './inventario/agregar-sub-categorias/agregar-sub-categorias.component';
import { SubTipoEditarComponent } from './inventario/sub-tipo-editar/sub-tipo-editar.component';
import { EliminarSubTipoComponent } from './inventario/eliminar-sub-tipo/eliminar-sub-tipo.component';
import { TemporalShowItemInfoComponent } from './inventario/temporal-show-item-info/temporal-show-item-info.component';
import { MarcasDialogComponent } from './inventario/marcas-dialog/marcas-dialog.component';
import {MatListModule} from '@angular/material/list';
import { ShowItemTemporalComponent } from './inventario/show-item-temporal/show-item-temporal.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { EditarCantidadesDialogComponent } from './inventario/editar-cantidades-dialog/editar-cantidades-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [InventarioComponent, ListaPlegableComponent, NewItemDialogComponent,
    VentaDialogComponent, AgregarClaseItemComponent, ItemCardComponent, UploadsDialogComponent,
     EditarItemDialogComponent, SeguroEliminarComponent, EditarClaseComponent, EliminarDialogComponent,
     SubListaDesplegableComponent, AgregarSubCategoriasComponent, SubTipoEditarComponent, EliminarSubTipoComponent,
      TemporalShowItemInfoComponent, MarcasDialogComponent, ShowItemTemporalComponent, EditarCantidadesDialogComponent],
  imports: [
    CommonModule,
    InventarioRoutingModule,
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
    ReactiveFormsModule,
    ScrollingModule,
    MatTooltipModule,
    MatDividerModule,
    MatSnackBarModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule
  ]
})
export class InventarioModule { }
