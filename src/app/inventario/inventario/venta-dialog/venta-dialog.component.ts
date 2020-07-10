import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-venta-dialog',
  templateUrl: './venta-dialog.component.html',
  styleUrls: ['./venta-dialog.component.css']
})
export class VentaDialogComponent implements OnInit {

  disabled = true;

  constructor(public dialogRef: MatDialogRef<VentaDialogComponent>) { }

  ngOnInit(): void {
  }

  changePrice() {
    if (this.disabled) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

}
