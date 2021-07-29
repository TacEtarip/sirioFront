import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService, ItemsVentaForCard, Venta } from './../../inventario-manager.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-carrito-tabla',
  templateUrl: './carrito-tabla.component.html',
  styleUrls: ['./carrito-tabla.component.css']
})
export class CarritoTablaComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<ItemsVentaForCard>;

  dateSource$ = new BehaviorSubject<MatTableDataSource<ItemsVentaForCard>>(null);

  displayedColumns: string[] = ['numero', 'imagen', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total', 'delete'];

  showTable = new Subject<boolean>();

  showMessage = new BehaviorSubject<boolean>(false);

  totalPrice$ = new BehaviorSubject<number>(0);

  cantidadesForm: FormGroup;

  cantidades: FormArray;

  itemsVendidosList: ItemsVentaForCard[];

  cargando$ = new BehaviorSubject<boolean>(false);

  subsI: Subscription;

  subsII = new Subscription();

  @ViewChild(MatPaginator, {static: false})  set content(paginator: MatPaginator) {

    if (paginator) {
      this.subsI = this.dateSource$.pipe(filter(x => x !== null)).subscribe(x => {
          this.dataSource.paginator = paginator;
          this.calcularTotal(x.data);
          this.showTable.next(true);
      });

    }
  }

  venta$ = new BehaviorSubject<Venta>(null);

  constructor(private inv: InventarioManagerService, public auth: AuthService, private fb: FormBuilder) { }

  ngOnDestroy(): void {
    if (this.subsI) {
      this.subsI.unsubscribe();
    }
    this.subsII.unsubscribe();
  }

  ngOnInit(): void {

    if (this.auth.getTtype() === 'low') {
      this.cantidadesForm = this.fb.group({
        cantidades: this.fb.array([]),
      });
      this.cantidades = this.cantidadesForm.get('cantidades') as FormArray;

      this.inv.getCarrito().subscribe(res => {
        if (res) {
          this.itemsVendidosList = res.carrito;
          console.log(res);
          this.addGroupFormArray(this.itemsVendidosList);
          this.dataSource = new MatTableDataSource(this.itemsVendidosList);
          this.dateSource$.next(this.dataSource);
        }
      });
    }
  }

  actQTY(index: number, value: number) {
    console.log(index);
    this.cantidades.at(index).get('cantidad').setValue(Math.round(value));
    if (this.itemsVendidosList[index].cantidadSC) {
      this.itemsVendidosList[index].cantidadSC.cantidadVenta = this.cantidades.at(index).get('cantidad').value;
    } else {
      this.itemsVendidosList[index].cantidad = this.cantidades.at(index).get('cantidad').value;
    }
    this.calcularTotal(this.itemsVendidosList);
  }

  actualizarCantidades() {

  }

  addGroupFormArray(items: ItemsVentaForCard[]) {
    this.subsII.unsubscribe();
    this.subsII = new Subscription();
    items.forEach((r, index) => {
      const group = this.fb.group({
        index: this.fb.control({ value: index, disabled: false}),
        cantidad: this.fb.control({ value: r.cantidadSC ? r.cantidadSC.cantidadVenta : r.cantidad, disabled: false},
          Validators.compose([
          Validators.required, Validators.min(1), Validators.max(r.cantidadDisponible)
        ]))
      });
      this.subsII.add(group.valueChanges.pipe(distinctUntilChanged((prev, curr) => prev.cantidad === curr.cantidad),
      debounceTime(400)).subscribe(vlGC => {
        this.actQTY(vlGC.index, vlGC.cantidad);
      }));
      this.cantidades.push(group);
    });
  }

  calcularTotal(itemsEnVenta: ItemsVentaForCard[]): void {
    let sum = 0;
    itemsEnVenta.forEach(item => {
        if (item.cantidadSC) {
          sum += (item.cantidadSC.cantidadVenta * item.priceIGV);
        } else {
          sum += item.cantidad * item.priceIGV;
        }
      });
    this.totalPrice$.next(sum);
  }

  removerProducto(item: ItemsVentaForCard) {
    this.cargando$.next(true);
    this.showTable.next(false);
    this.inv.removeItemDeCarrito(item).subscribe(res => {
      this.cargando$.next(false);
      if (res) {

        const indexToRMV = this.itemsVendidosList.indexOf(item);
        this.cantidades.removeAt(indexToRMV);
        this.itemsVendidosList.splice(indexToRMV, 1);
        this.itemsVendidosList.forEach((x, index) => {
          this.cantidades.at(index).get('index').setValue(index);
        });
        this.dataSource = new MatTableDataSource(this.itemsVendidosList);
        this.dateSource$.next(this.dataSource);
      }
    });
  }



}
