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


@NgModule({
  declarations: [InventarioComponent, ListaPlegableComponent, NewItemDialogComponent,
    VentaDialogComponent, AgregarClaseItemComponent, ItemCardComponent, UploadsDialogComponent, EditarItemDialogComponent],
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
    MatTooltipModule
  ]
})
export class InventarioModule { }
