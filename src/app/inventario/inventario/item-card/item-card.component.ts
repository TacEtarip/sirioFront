import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { VentaDialogComponent } from '../venta-dialog/venta-dialog.component';
import { first } from 'rxjs/operators';
import { EditarItemDialogComponent } from '../editar-item-dialog/editar-item-dialog.component';
import { InventarioManagerService } from '../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { TemporalShowItemInfoComponent } from '../temporal-show-item-info/temporal-show-item-info.component';
import { EditarCantidadesDialogComponent } from '../editar-cantidades-dialog/editar-cantidades-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnInit {
  @Input() item: Item;

  @Output() deleteEvent = new EventEmitter<Item>();

  itemInfo = new BehaviorSubject<Item>(null);

  urlOfImage = new BehaviorSubject<string>(null);

  priceToShow = new BehaviorSubject<string>(null);


  constructor(public dialog: MatDialog, private inventarioMNG: InventarioManagerService,
              private snackBar: MatSnackBar, private router: Router, public authService: AuthService) {
               }

  ngOnInit(): void {
    this.itemInfo.next(this.item);
    this.priceToShow.next(this.rebrandNumber(true, this.itemInfo.value.priceIGV));
    const preImageArray = this.itemInfo.value.photo.split('.');
    this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${preImageArray[0]}.webp`);
  }

  openDialogVenta(): void {
    const dialogRef = this.dialog.open(VentaDialogComponent, {
      width: '600px',
      data: this.itemInfo.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: {item: Item, message: string}) => {
      if (res) {
        if (res.message === 'Falta') {
          this.inventarioMNG.getItem(this.itemInfo.value.codigo).subscribe((resNew: Item) => {
            this.itemInfo.next(res.item);
          });
        }
        else  if (res.message === 'Succes') {
          this.snackBar.open('Item Vendido!!', '', {
          duration: 2000,
          });
          this.itemInfo.next(res.item);
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

  openDialogEliminar() {
    this.deleteEvent.emit(this.itemInfo.value);
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

  conectartWpp() {
    window.open(`https://wa.me/51977426349?text=Buenas estoy interesado en ${this.item.name}, quisiera obtener más información`, '_blank');
  }

  openDialogEditar(): void {
    const dialogRef = this.dialog.open(EditarItemDialogComponent, {
      width: '800px',
      data: this.itemInfo.value,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      this.inventarioMNG.getItem(this.item.codigo).subscribe(item => {
        this.itemInfo.next(item);
        this.priceToShow.next(this.rebrandNumber(true, this.itemInfo.value.priceIGV));
        this.urlOfImage.next('https://inventario-sirio-dinar.herokuapp.com/inventario/image/' + this.itemInfo.value.photo);
      });
    });
  }

  openDialogEditarCantidades() {
    const dialofRef = this.dialog.open(EditarCantidadesDialogComponent, {
      width: '800px',
      data: this.itemInfo.value
    });
    dialofRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res) {
      this.itemInfo.next(res);
      }
    });
  }

  rebrandNumber(valid: boolean, numberToRebrand: number) {
    const stringNumber = numberToRebrand.toString().trim().replace(',', '.');
    const indexOfComa = stringNumber.indexOf('.');
    let newNumber = '';
    if (valid) {
      if (stringNumber.indexOf('.') === -1) {
        newNumber = stringNumber + '.00';
      } else if (stringNumber.charAt(indexOfComa + 1) === '') {
        newNumber = stringNumber + '00';
      } else if (stringNumber.charAt(indexOfComa + 2) === '') {
        newNumber = stringNumber + '0';
      } else {
        newNumber = stringNumber;
      }
    }
    return newNumber;
  }

  openItemInfo() {
    const dialogRef = this.dialog.open(TemporalShowItemInfoComponent, {
      width: '600px',
      data: this.item
    });
  }

  descargarFicha() {
    window.open('https://inventario-sirio-dinar.herokuapp.com/inventario/pdf/ficha-' + this.itemInfo.value.codigo + '.pdf', '_blank');
  }

  goToItemPage() {
    this.router.navigate(['/inventario', this.parsedRoute(this.itemInfo.value.tipo),
                          this.parsedRoute(this.itemInfo.value.subTipo), this.item.codigo]);
  }

  parsedRoute(ruta: string) {
    return ruta.trim().replace(/ /g, '_');
  }

}
