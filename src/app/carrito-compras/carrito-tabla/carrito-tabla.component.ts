import { InventarioManagerService, ItemsVentaForCard, ItemVendido, Venta } from './../../inventario-manager.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-carrito-tabla',
  templateUrl: './carrito-tabla.component.html',
  styleUrls: ['./carrito-tabla.component.css']
})
export class CarritoTablaComponent implements OnInit {

  dataSource: MatTableDataSource<ItemsVentaForCard>;

  dateSource$ = new BehaviorSubject<MatTableDataSource<ItemsVentaForCard>>(null);

  displayedColumns: string[] = ['numero', 'imagen', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total', 'delete'];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  venta$ = new BehaviorSubject<Venta>(null);

  constructor(private inv: InventarioManagerService) { }

  ngOnInit(): void {
    this.inv.getCarrito().subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
      }
    });
  }

}
