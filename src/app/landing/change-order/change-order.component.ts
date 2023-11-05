import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import {
  InventarioManagerService,
  Item,
  Tipo,
} from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-change-order',
  templateUrl: './change-order.component.html',
  styleUrls: ['./change-order.component.css'],
})
export class ChangeOrderComponent {
  timerSubject: Subscription;

  dragging = false;
  changed = new BehaviorSubject<boolean>(false);

  changing = new BehaviorSubject<boolean>(false);

  mockList: Tipo[];

  linksList: string[];

  mockListST: string[];

  mockListItems: Item[];

  @ViewChild('divToScroll') divToScroll: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ChangeOrderComponent>,
    private inv: InventarioManagerService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      categorias: Tipo[];
      items: Item[];
      subCategorias: { names: string[]; links: string[]; tipoCodigo: string };
    }
  ) {
    if (data.categorias) {
      this.mockList = [...data.categorias];
    } else if (data.subCategorias) {
      this.mockListST = [...data.subCategorias.names];
      this.linksList = [...data.subCategorias.links];
    } else if (data.items) {
      this.mockListItems = [...data.items];
    }
  }

  activateScroll(event) {
    if (this.dragging) {
      this.timerSubject = timer(0, 50).subscribe((x) => {
        const leftToScroll =
          this.divToScroll.nativeElement.scrollHeight -
          this.divToScroll.nativeElement.offsetHeight;
        if (leftToScroll < 0) {
          this.timerSubject.unsubscribe();
        } else {
          this.divToScroll.nativeElement.scrollTop += 10;
        }
      });
    }
  }

  stopScroll(event) {
    this.timerSubject.unsubscribe();
  }

  drop(event: CdkDragDrop<Tipo[]>) {
    this.changed.next(false);
    moveItemInArray(this.mockList, event.previousIndex, event.currentIndex);
  }

  dropSC(event: CdkDragDrop<Tipo[]>) {
    this.changed.next(false);
    moveItemInArray(this.mockListST, event.previousIndex, event.currentIndex);
    moveItemInArray(this.linksList, event.previousIndex, event.currentIndex);
  }

  dropItems(event: CdkDragDrop<Tipo[]>) {
    this.changed.next(false);
    moveItemInArray(
      this.mockListItems,
      event.previousIndex,
      event.currentIndex
    );
  }

  cambiarOrden() {
    this.changing.next(true);
    if (this.data.categorias) {
      this.inv.reOrderTipos(this.mockList).subscribe((res) => {
        this.changing.next(false);
        if (res) {
          this.changed.next(true);
          this.dialogRef.close(this.mockList);
        } else {
          this.changed.next(false);
        }
      });
    } else if (this.data.subCategorias) {
      this.inv
        .reOrderSubTipos(
          this.data.subCategorias.tipoCodigo,
          this.linksList,
          this.mockListST
        )
        .subscribe((res) => {
          this.changing.next(false);
          if (res) {
            this.changed.next(true);
            this.dialogRef.close(res);
          } else {
            this.changed.next(false);
          }
        });
    } else if (this.data.items) {
      this.inv.reOrderItems(this.mockListItems).subscribe((res) => {
        if (res) {
          this.changed.next(true);
          this.dialogRef.close(this.mockListItems);
        } else {
          this.changed.next(false);
        }
      });
    }
  }
}
