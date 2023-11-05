import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { VentaDialogComponent } from 'src/app/inventario/inventario/venta-dialog/venta-dialog.component';
import { SubTipoEditarComponent } from './../inventario/inventario/sub-tipo-editar/sub-tipo-editar.component';
import { UploadsDialogComponent } from './../inventario/inventario/uploads-dialog/uploads-dialog.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing.component';

import { AgregarClaseItemComponent } from './../inventario/inventario/agregar-clase-item/agregar-clase-item.component';
import { AgregarSubCategoriasComponent } from './../inventario/inventario/agregar-sub-categorias/agregar-sub-categorias.component';
import { EditarCantidadesDialogComponent } from './../inventario/inventario/editar-cantidades-dialog/editar-cantidades-dialog.component';
import { EditarClaseComponent } from './../inventario/inventario/editar-clase/editar-clase.component';
import { EditarItemDialogComponent } from './../inventario/inventario/editar-item-dialog/editar-item-dialog.component';
import { EliminarDialogComponent } from './../inventario/inventario/eliminar-dialog/eliminar-dialog.component';
import { EliminarSubTipoComponent } from './../inventario/inventario/eliminar-sub-tipo/eliminar-sub-tipo.component';
import { MarcasDialogComponent } from './../inventario/inventario/marcas-dialog/marcas-dialog.component';
import { NewItemDialogComponent } from './../inventario/inventario/new-item-dialog/new-item-dialog.component';
import { SeguroEliminarComponent } from './../inventario/inventario/seguro-eliminar/seguro-eliminar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { CategoriaCardComponent } from './categoria-card/categoria-card.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ChangeFoldersComponent } from './change-folders/change-folders.component';
import { ChangeOrderComponent } from './change-order/change-order.component';
import { ItemCardVendComponent } from './item-card-vend/item-card-vend.component';
import { ItemcardComponent } from './itemcard/itemcard.component';
import { MainCategoriaCardComponent } from './main-categoria-card/main-categoria-card.component';
import { MensajeTemplateComponent } from './mensaje-template/mensaje-template.component';
import { StoreMainComponent } from './store-main/store-main.component';
import { SubCategoriaCardComponent } from './sub-categoria-card/sub-categoria-card.component';
import { TagsComponent } from './tags/tags.component';
import { UploadCatImageComponent } from './upload-cat-image/upload-cat-image.component';

@NgModule({
  declarations: [
    LandingComponent,
    ItemcardComponent,
    StoreMainComponent,
    SeguroEliminarComponent,
    EditarClaseComponent,
    SubTipoEditarComponent,
    UploadsDialogComponent,
    NewItemDialogComponent,
    EditarItemDialogComponent,
    EliminarDialogComponent,
    CategoriaCardComponent,
    CategoriasComponent,
    MainCategoriaCardComponent,
    MarcasDialogComponent,
    AgregarSubCategoriasComponent,
    UploadCatImageComponent,
    VentaDialogComponent,
    AgregarClaseItemComponent,
    EditarCantidadesDialogComponent,
    EliminarSubTipoComponent,
    SubCategoriaCardComponent,
    ItemCardVendComponent,
    TagsComponent,
    CaracteristicasComponent,
    BusquedaComponent,
    ChangeOrderComponent,
    ChangeFoldersComponent,
    MensajeTemplateComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    LayoutModule,
    DragDropModule,
    MatExpansionModule,
  ],
})
export class LandingModule {}
