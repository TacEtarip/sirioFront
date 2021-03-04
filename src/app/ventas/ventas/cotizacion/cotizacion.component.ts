import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenerarVentaComponent } from '../ventas-activas/generar-venta/generar-venta.component';
import { InventarioManagerService, Venta } from 'src/app/inventario-manager.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { GenerarCotiComponent } from './generar-coti/generar-coti.component';
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit, AfterViewInit, OnDestroy {

  estadoCoti$ = new BehaviorSubject<string>('pendiente');

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

  constructor(private inventarioMNG: InventarioManagerService, public dialog: MatDialog, private fb: FormBuilder, private router: Router) {
    this.minDate = new Date('2021-01-26T00:00:00+0000');
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 1);

    this.startISO$.next(this.minDate.toISOString());
    this.endISO$.next(this.maxDate.toISOString());
   }


   ngAfterViewInit(): void {
    this.inventarioMNG.getCotis(10, 0, 'noone', 'noone', this.estadoCoti$.value).subscribe(res => {
      const temp = new MatTableDataSource(res);
      this.dataSource$.next(temp);
      this.gettingInfo$.next(false);
    });

    this.inventarioMNG.getCotis(0, 0, 'noone', 'noone', this.estadoCoti$.value).subscribe(res => {
      this.ventasLength$.next(res.length);
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

  openCrearCotiDialog() {
    const dialogRef = this.dialog.open(GenerarCotiComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: {codigo: string, name: string, celular: string, email: string}) => {
      if (res) {
        const secondRef = this.dialog.open(GenerarVentaComponent, {
          width: '600px',
          data: {
            coti: true, crear: true, ventaCod: '', documento: res
          }
        });

        secondRef.afterClosed().pipe(first()).subscribe((resTwo: {  message: string, coti: Venta }) => {
          if (resTwo.coti) {
            this.router.navigateByUrl(`/ventas/cotizaciones/${resTwo.coti.codigo}`);
          } else {
            alert('Ocurrio un error!');
          }
        });
      }
    });
  }

  newSource(index: number) {
    this.inventarioMNG.getCotis(10, index * 10, this.startISO$.value, this.endISO$.value, this.estadoCoti$.value).subscribe(res => {
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
      this.inventarioMNG.getCotis(10, 0, this.startISO$.value, this.endISO$.value, this.estadoCoti$.value).subscribe(res => {
        this.gettingInfo$.next(false);
        const temp = new MatTableDataSource(res);
        this.dataSource$.next(temp);
      });
    }

    this.inventarioMNG
    .getCotis(0, 0, this.startISO$.value, this.endISO$.value, this.estadoCoti$.value)
    .subscribe(res => {
      if (res) {
        this.ventasLength$.next(res.length);
      } else {
        this.ventasLength$.next(0);
      }
    });
  }
}

goToFullCotiPage(row: Venta) {
  this.router.navigateByUrl(`/ventas/cotizaciones/${row.codigo}`);
}

}
