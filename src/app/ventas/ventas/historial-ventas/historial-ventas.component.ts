import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { InventarioManagerService, Venta } from '../../../inventario-manager.service';
import { BehaviorSubject, Subject } from 'rxjs';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { first, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import anime from 'animejs';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.css']
})
export class HistorialVentasComponent implements OnInit, AfterViewInit, OnDestroy {

  range: FormGroup;

  minDate: Date;
  maxDate: Date;

  showF = false;

  endISO$ = new BehaviorSubject<string>('noone');
  startISO$ = new BehaviorSubject<string>('noone');

  displayedColumns: string[] = ['fecha', 'codigo', 'totalPrice', 'documento', 'comprobante'];
  dataSource: MatTableDataSource<Venta>;
  dataSource$ = new Subject<MatTableDataSource<Venta>>();

  inDateSearch = new BehaviorSubject<boolean>(false);

  gettingInfo$ = new BehaviorSubject<boolean>(true);

  metodosDeBusqueda: { value: string[], viewValue: string }[] = [
    { value: ['ejecutada'], viewValue: 'Ejecutadas' },
    { value: ['anuladaPost'], viewValue: 'Anuladas' },
    { value: ['ejecutada', 'anuladaPost'], viewValue: 'Todas' }
  ];

  currentMetodoBusqueda = this.metodosDeBusqueda[0].value;

  tiposV: { value: string[], viewValue: string }[] = [
    { value: ['boleta', 'factura', 'noone'], viewValue: 'Todas' },
    { value: ['factura'], viewValue: 'Facturas' },
    { value: ['boleta'], viewValue: 'Boletas' },
    { value: ['noone'], viewValue: 'Sin Documento' },
  ];

  currentTipoV = this.tiposV[0].value;
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
    this.inventarioMNG.getVentasEJecutadas(10, 0, 'noone', 'noone', this.range.get('estado').value,
    this.range.get('tipo').value, this.range.get('busqueda').value).subscribe(res => {
      const temp = new MatTableDataSource(res);
      this.dataSource$.next(temp);
      this.gettingInfo$.next(false);
    });

    this.inventarioMNG.getCantidadVentasPorEstado(this.range.get('estado').value, 'noone', 'noone',
    this.range.get('tipo').value, this.range.get('busqueda').value).subscribe(res => {
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
      ])),
      estado: this.fb.control(this.metodosDeBusqueda[0].value),
      tipo: this.fb.control(this.currentTipoV),
      busqueda: this.fb.control('', Validators.compose([
        Validators.pattern(/^[a-zA-Z0-9.-_# ]*$/),
        Validators.minLength(2),
      ]))
    });

    this.range.get('estado').valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
      this.cargarVentas();
    });

    this.range.get('tipo').valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
      this.cargarVentas();
    });

    this.range.get('busqueda').valueChanges.pipe(distinctUntilChanged(), debounceTime(500)).subscribe(res => {
      if (this.range.get('busqueda').valid) {
        this.cargarVentas();
      }
    });
  }

  newSource(index: number) {
      this.inventarioMNG.getVentasEJecutadas(10, index * 10, this.startISO$.value,
         this.endISO$.value, this.range.get('estado').value, this.range.get('tipo').value,
         this.range.get('busqueda').value).subscribe(res => {
        this.gettingInfo$.next(false);
        const temp = new MatTableDataSource(res);
        this.dataSource$.next(temp);
      });
  }
  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
  }

  cargarVentas() {
    if (this.paginator.hasPreviousPage()) {
      this.paginator.firstPage();
    } else {
      this.gettingInfo$.next(true);
      this.inventarioMNG.getVentasEJecutadas(10, 0, this.startISO$.value,
        this.endISO$.value, this.range.get('estado').value, this.range.get('tipo').value,
        this.range.get('busqueda').value).subscribe(res => {
        this.gettingInfo$.next(false);
        const temp = new MatTableDataSource(res);
        this.dataSource$.next(temp);
      });
    }

    this.inventarioMNG
    .getCantidadVentasPorEstado(this.range.get('estado').value, this.startISO$.value, this.endISO$.value, this.range.get('tipo').value,
    this.range.get('busqueda').value)
    .subscribe(res => {
      if (res) {
        this.ventasLength$.next(res.cantidadVentas);
      } else {
        this.ventasLength$.next(0);
      }
    });
  }

  datePicked() {
    if (this.range.valid) {
      this.startISO$.next(this.range.get('start').value.toISOString());
      this.endISO$.next(this.range.get('end').value.toISOString());
      this.cargarVentas();
      // this.inDateSearch.next(true);
    }
  }

  animateTrans(showF: boolean) {
    return anime.timeline({
      duration: 250,
      easing: 'linear',
    });
  }

  showFilters() {
    this.showF = !this.showF;
    if (this.showF) {
      this.animateTrans(this.showF)
    .add({
      targets: '.sm1',
      height: this.getAnimationH(this.showF),
    })
    .add({
      targets: '.sm2',
      height: this.getAnimationH(this.showF),
    }, '-=100')
    .add({
      targets: '.sm3',
      height: this.getAnimationH(this.showF),
    }, '-=100');
    } else {
      this.animateTrans(this.showF)
      .add({
        targets: '.sm3',
        height: this.getAnimationH(this.showF),
      })
      .add({
        targets: '.sm2',
        height: this.getAnimationH(this.showF),
      }, '-=100')
      .add({
        targets: '.sm1',
        height: this.getAnimationH(this.showF),
      }, '-=100');
    }
  }

  getAnimationH(showF: boolean): any {
    return showF ? '81px' : '0px';
  }

  goToFullItemPage(row: Venta) {
    this.router.navigateByUrl(`/ventas/historialVentas/${row.codigo}`);
  }

  descargarExcel() {
    this.inventarioMNG.getExcelReport(this.startISO$.value, this.endISO$.value,
      this.range.get('estado').value,  this.range.get('tipo').value,  this.range.get('busqueda').value).subscribe(res => {
      saveAs(res, 'reporte.xlsx');
    });
  }
}
