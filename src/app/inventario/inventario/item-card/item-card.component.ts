import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { VentaDialogComponent } from '../venta-dialog/venta-dialog.component';
import { first } from 'rxjs/operators';
import { EditarItemDialogComponent } from '../editar-item-dialog/editar-item-dialog.component';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnInit {
  @Input() item: Item;

  urlOfImage: string;

  priceToShow: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.priceToShow = this.rebrandNumber(true, this.item.priceIGV);
    this.urlOfImage = 'https://inventario-sirio-dinar.herokuapp.com/inventario/image/' + this.item.photo;
  }

  openDialogVenta(): void {
    const dialogRef = this.dialog.open(VentaDialogComponent, {
      width: '400px',
      data: this.item,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if (res) {
      alert(`Venta de ${this.item.name} exitosa!!`);
      }
    });
  }

  openDialogEditar(): void {
    const dialogRef = this.dialog.open(EditarItemDialogComponent, {
      data: this.item,
    });

    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      /*if (res) {
      alert(`Venta de ${this.item.name} exitosa!!`);
      }*/
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

  descargarFicha() {
    window.open('https://inventario-sirio-dinar.herokuapp.com/inventario/pdf/ficha-' + this.item.codigo + '.pdf', '_blank');
  }

}
