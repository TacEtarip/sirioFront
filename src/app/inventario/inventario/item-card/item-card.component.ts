import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import { VentaDialogComponent } from '../venta-dialog/venta-dialog.component';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  @Input() item: Item;

  urlOfImage: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.urlOfImage = 'http://localhost:5000/static/images/' + this.item.photo;
  }

  openDialogVenta(): void {
    this.dialog.open(VentaDialogComponent, {
      width: '400px',
    });
  }

}
