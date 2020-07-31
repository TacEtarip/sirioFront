import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { InventarioManagerService, Venta } from '../../../inventario-manager.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.css']
})
export class HistorialVentasComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['fecha', 'codigo', 'totalPrice', 'documento'];
  dataSource: MatTableDataSource<Venta>;
  dataSource$ = new Subject<MatTableDataSource<Venta>>();
  // dataSource$ = new BehaviorSubject<MatTableDataSource<PeriodicElement>>(null);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  /*@ViewChild(MatPaginator, {static: false}) set content(paginator: MatPaginator) {
  }*/

  dataForTable: Venta[] = [];

  ventasLength: number;

  ventasLength$ = new BehaviorSubject<number>(11);

  constructor(private inventarioMNG: InventarioManagerService) {

    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
   }

   ngAfterViewInit(): void {
    this.inventarioMNG.getVentasEJecutadas(10, 0, 'noone', 'noone').subscribe(res => {
      const temp = new MatTableDataSource(res);
      this.dataSource$.next(temp);
    });

    this.inventarioMNG.getCantidadVentasPorEstado('ejecutada').subscribe(res => {
      this.ventasLength$.next(res.cantidadVentas);
    });

    this.paginator.page.subscribe((res: PageEvent) => {
      this.newSource(res.pageIndex);
    });

   }

  ngOnInit(): void {
  }

  newSource(index: number) {
    this.inventarioMNG.getVentasEJecutadas(10, index * 10, 'noone', 'noone').subscribe(res => {
      const temp = new MatTableDataSource(res);
      this.dataSource$.next(temp);
    });
  }
  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
  }

}
