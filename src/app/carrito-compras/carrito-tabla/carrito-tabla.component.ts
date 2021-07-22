import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService, ItemsVentaForCard, Venta } from './../../inventario-manager.service';

@Component({
  selector: 'app-carrito-tabla',
  templateUrl: './carrito-tabla.component.html',
  styleUrls: ['./carrito-tabla.component.css']
})
export class CarritoTablaComponent implements OnInit {

  dataSource: MatTableDataSource<ItemsVentaForCard>;

  dateSource$ = new BehaviorSubject<MatTableDataSource<ItemsVentaForCard>>(null);

  displayedColumns: string[] = ['numero', 'imagen', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total', 'delete'];

  showTable = new BehaviorSubject<boolean>(false);

  showMessage = new BehaviorSubject<boolean>(false);

  @ViewChild(MatPaginator, {static: false})  set content(paginator: MatPaginator) {
    if (paginator && this.dataSource) {
      this.dataSource.paginator = paginator;
      this.showTable.next(true);
    }
  }

  venta$ = new BehaviorSubject<Venta>(null);

  constructor(private inv: InventarioManagerService, public auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.getTtype() === 'low') {
      this.inv.getCarrito().subscribe(res => {
        if (res) {
          this.dataSource = new MatTableDataSource(res);
          this.dateSource$.next(this.dataSource);
        }
      });
    }
  }

}
