import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
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

  showTable = new Subject<boolean>();

  showMessage = new BehaviorSubject<boolean>(false);

  @ViewChild(MatPaginator, {static: false})  set content(paginator: MatPaginator) {
    console.log('at least here');
    console.log(paginator);
    console.log(this.dateSource$.value);

    if (paginator) {
      this.dateSource$.pipe(filter(x => x !== null), first()).subscribe(x => {
        console.log(x);
        if (x !== null) {
          console.log('here');
          this.dataSource.paginator = paginator;
          this.showTable.next(true);
          console.log(this.showTable);
        }
      });

    }
  }

  venta$ = new BehaviorSubject<Venta>(null);

  constructor(private inv: InventarioManagerService, public auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.getTtype() === 'low') {
      this.inv.getCarrito().subscribe(res => {
        if (res) {
          console.log(res);
          this.dataSource = new MatTableDataSource(res);
          this.dateSource$.next(this.dataSource);
        }
      });
    }
  }

}
