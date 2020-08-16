import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { InventarioManagerService, Venta } from '../../../inventario-manager.service';
import { BehaviorSubject, Subject } from 'rxjs';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormGroup, FormControl, FormBuilder, Validator, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.css']
})
export class HistorialVentasComponent implements OnInit, AfterViewInit, OnDestroy {

  range: FormGroup;

  minDate: Date;
  maxDate: Date;

  endISO$ = new BehaviorSubject<string>('noone');
  startISO$ = new BehaviorSubject<string>('noone');

  displayedColumns: string[] = ['fecha', 'codigo', 'totalPrice', 'documento'];
  dataSource: MatTableDataSource<Venta>;
  dataSource$ = new Subject<MatTableDataSource<Venta>>();

  inDateSearch = new BehaviorSubject<boolean>(false);

  gettingInfo$ = new BehaviorSubject<boolean>(true);
  // dataSource$ = new BehaviorSubject<MatTableDataSource<PeriodicElement>>(null);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  /*@ViewChild(MatPaginator, {static: false}) set content(paginator: MatPaginator) {
  }*/

  dataForTable: Venta[] = [];

  ventasLength: number;

  ventasLength$ = new BehaviorSubject<number>(11);

  constructor(private inventarioMNG: InventarioManagerService, private fb: FormBuilder, private router: Router) {
    this.minDate = new Date('2020-07-26T00:00:00+0000');
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 1);

    this.startISO$.next(this.minDate.toISOString());
    this.endISO$.next(this.maxDate.toISOString());
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
   }

   ngAfterViewInit(): void {
    this.inventarioMNG.getVentasEJecutadas(10, 0, 'noone', 'noone').subscribe(res => {
      const temp = new MatTableDataSource(res);
      this.dataSource$.next(temp);
      this.gettingInfo$.next(false);
    });

    this.inventarioMNG.getCantidadVentasPorEstado('ejecutada', 'noone', 'noone').subscribe(res => {
      this.ventasLength$.next(res.cantidadVentas);
    });

    this.paginator.page.subscribe((res: PageEvent) => {
      this.gettingInfo$.next(true);
      this.newSource(res.pageIndex);
    });

   }

  ngOnInit(): void {
    this.range = this.fb.group({
      start: this.fb.control({value: '', disabled: false}, Validators.compose([
        Validators.required
      ])),
      end: this.fb.control({value: '', disabled: false}, Validators.compose([
        Validators.required
      ])),
    });
  }

  newSource(index: number) {
      this.inventarioMNG.getVentasEJecutadas(10, index * 10, this.startISO$.value, this.endISO$.value).subscribe(res => {
        this.gettingInfo$.next(false);
        const temp = new MatTableDataSource(res);
        this.dataSource$.next(temp);
      });
  }
  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
  }

  datePicked() {
    if (this.range.valid) {

      this.startISO$.next(this.range.get('start').value.toISOString());
      this.endISO$.next(this.range.get('end').value.toISOString());
      // this.inDateSearch.next(true);
      if (this.paginator.hasPreviousPage()) {
        this.paginator.firstPage();
      } else {
        this.gettingInfo$.next(true);
        this.inventarioMNG.getVentasEJecutadas(10, 0, this.startISO$.value, this.endISO$.value).subscribe(res => {
          this.gettingInfo$.next(false);
          const temp = new MatTableDataSource(res);
          this.dataSource$.next(temp);
        });
      }

      this.inventarioMNG
      .getCantidadVentasPorEstado('ejecutada', this.startISO$.value, this.endISO$.value)
      .subscribe(res => {
        if (res) {
          this.ventasLength$.next(res.cantidadVentas);
        } else {
          this.ventasLength$.next(0);
        }
      });
    }
  }

  goToFullItemPage(row: Venta) {
    this.router.navigateByUrl(`/ventas/historialVentas/${row.codigo}`);
  }

  descargarExcel() {
    this.inventarioMNG.getExcelReport(this.startISO$.value, this.endISO$.value).subscribe(res => {
      saveAs(res, 'reporte.xlsx');
    });
  }
}
