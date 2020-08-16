import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../../../inventario-manager.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { saveAs } from 'file-saver';

import { InventarioManagerService } from 'src/app/inventario-manager.service';

export interface SubConteoOrder {
  name: string;
  nameSecond: string;
  cantidad: number;
}


@Component({
  selector: 'app-temporal-show-item-info',
  templateUrl: './temporal-show-item-info.component.html',
  styleUrls: ['./temporal-show-item-info.component.css']
})
export class TemporalShowItemInfoComponent implements OnInit {
  panelOpenState = false;
  displayedColumnsPos: string[] = ['name', 'nameSecond', 'cantidad'];
  dataSource: MatTableDataSource<SubConteoOrder>;
  balance = 0;

  datasourceTest: SubConteoOrder[] = [{name: 'Test1', nameSecond: 'test2', cantidad: 2}];

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    if (this.data.subConteo) {
      this.dataSource.sort = sort;
    }
  }


  constructor( private inventarioMNG: InventarioManagerService, public dialogRef: MatDialogRef<TemporalShowItemInfoComponent>,
               @Inject(MAT_DIALOG_DATA) public data: Item) {
                 if (data.subConteo) {
                  this.dataSource = new MatTableDataSource(data.subConteo.order);
                 }
              }

  ngOnInit(): void {
    this.inventarioMNG.getItemBalance(this.data.codigo).subscribe((res) => {
      if (res) {
        this.balance = res.message;
      }
    });
    // this.dataSource.sort = this.sort;
  }

  descargarReporteItem() {
    this.inventarioMNG.getExcelReportItem(this.data.codigo).subscribe((res) => {
      if (res) {
        saveAs(res);
      }
    });
  }

}
