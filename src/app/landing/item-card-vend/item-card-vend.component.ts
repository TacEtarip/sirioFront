import { ChangeFoldersComponent } from './../change-folders/change-folders.component';
import { AuthService } from './../../auth.service';
import { EliminarDialogComponent } from './../../inventario/inventario/eliminar-dialog/eliminar-dialog.component';
import { EditarCantidadesDialogComponent } from './../../inventario/inventario/editar-cantidades-dialog/editar-cantidades-dialog.component';
import { EditarItemDialogComponent } from './../../inventario/inventario/editar-item-dialog/editar-item-dialog.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item, InventarioManagerService } from 'src/app/inventario-manager.service';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UploadCatImageComponent } from '../upload-cat-image/upload-cat-image.component';
import { VentaDialogComponent } from 'src/app/inventario/inventario/venta-dialog/venta-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-item-card-vend',
  templateUrl: './item-card-vend.component.html',
  styleUrls: ['./item-card-vend.component.css']
})
export class ItemCardVendComponent implements OnInit {
  @Input() item: Item;
  @Input() tipoCodigo: string;

  @Output() deleteEvent = new EventEmitter<string>();
  @Output() changeCarpetaEvent = new EventEmitter<Item>();

  item$ = new BehaviorSubject<Item>(null);
  urlOfImage = new BehaviorSubject<string>(null);


  constructor(public dialog: MatDialog, public auth: AuthService,
              private inventarioMNG: InventarioManagerService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.item$.next(this.item);
    const preImageArray = this.item.photo.split('.');
    this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${preImageArray[0]}.webp`);
  }


  openDialogEditarCantidades() {
    const dialofRef = this.dialog.open(EditarCantidadesDialogComponent, {
      width: '800px',
      data: this.item$.value
    });
    dialofRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res) {
        this.item = res;
        this.item$.next(res);
      }
    });
  }


  openDialogEditarItem() {
    const dialogRef = this.dialog.open(EditarItemDialogComponent, {
      width: '800px',
      data: this.item$.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      this.inventarioMNG.getItem(this.item.codigo).subscribe(item => {
        if (item) {
          this.item = item;
          this.item$.next(item);
        }
      });
    });
  }

  openDialogCambiarImagen() {
    const dialogRef = this.dialog.open(UploadCatImageComponent, {
      width: '600px',
      data: { tipo: null, item: this.item$.value }
    });

    dialogRef.componentInstance.onUploaded.pipe(first()).subscribe(res => {
      if (res) {
        this.item = res;
        this.item$.next(res);
        this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${this.item$.value.photo.split('.')[0]}.webp`);
      }
    });
  }

  openDialogCambiarFolder() {
    const dialogRef = this.dialog.open(ChangeFoldersComponent, {
      width: '600px',
      data: { item: this.item$.value }
    });
    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if (res) {
        this.changeCarpetaEvent.emit(res);
      }
    });
  }

  openSeguroEliminarDialog() {
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '600px',
      data: this.item$.value
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if (res) {
        this.deleteEvent.emit(res);
      }
    });
  }

  openDialogVenta(): void {
    const dialogRef = this.dialog.open(VentaDialogComponent, {
      width: '600px',
      data: this.item$.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: {item: Item, message: string}) => {
      if (res) {
        if (res.message === 'Falta') {
          this.inventarioMNG.getItem(this.item$.value.codigo).subscribe((resNew: Item) => {
            this.item$.next(resNew);
          });
        }
        else  if (res.message === 'Succes') {
          this.snackBar.open('Item Vendido!!', '', {
          duration: 2000,
          });
          this.item$.next(res.item);
        }
        else  if (res.message.split(' ')[0] === 'SuccesAG') {
          this.snackBar.open('Venta Creada; Codigo: ' + res.message.split(' ')[1], '', {
            duration: 2000,
          });
        }
        else if (res.message.split('|')[0] === 'succesAI'){
          this.snackBar.open(res.message.split('|')[1], '', {
            duration: 2000,
          });
        }
      }
    });
  }

}
