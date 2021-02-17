import { filter } from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ItemsVentaForCard, InventarioManagerService, Venta, VentaSimpleEliminarInfo, VentaSimpleEliminarSCInfo } from '../../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SeguroEjecDialogComponent } from '../../seguro-ejec-dialog/seguro-ejec-dialog.component';
import { Router } from '@angular/router';
import { GenerarVentaComponent } from '../generar-venta/generar-venta.component';


export interface TableVentaInfo {
  codigo: string;
  name: string;
  subName: string;
  subNameSecond: string;
  cantidad: number;
  priceIGV: number;
  total: number;
  eliminar: boolean;
  priceNoIGV: number;
}

@Component({
  selector: 'app-venta-activa-card',
  templateUrl: './venta-activa-card.component.html',
  styleUrls: ['./venta-activa-card.component.css']
})
export class VentaActivaCardComponent implements OnInit, OnDestroy {

  @Input() ventaCod: Venta;

  venta$ = new BehaviorSubject<Venta>(null);

  displayedColumnsVenta: string[] = ['codigo', 'name', 'subName', 'subNameSecond', 'cantidad', 'priceIGV', 'total', 'eliminar'];

  tableVentaInfo$ = new BehaviorSubject<TableVentaInfo[]>([]);

  tableVentaInfo: TableVentaInfo[] = [];

  precios: number[] = [];

  costoTotal = new BehaviorSubject<number>(0);

    constructor(private inventarioMNG: InventarioManagerService, public dialog: MatDialog, private router: Router) {
    }
  ngOnDestroy(): void {
    this.venta$.complete();
  }

  ngOnInit(): void {
    this.venta$.next(this.ventaCod);
    this.venta$.subscribe((venta: Venta) => {
      if (venta) {
        this.crearCuadro(venta);
      }
    });
  }

  crearCuadro(venta: Venta) {
    this.tableVentaInfo = [];
    this.tableVentaInfo$.next([]);
    this.precios = [];
    this.costoTotal.next(0);
    this.inventarioMNG.obtenerCardPreInfoVenta(venta.codigo).subscribe((res) => {
      res.forEach(infoVenta => {
        if (infoVenta.cantidadSC && infoVenta.cantidadSC.cantidadVenta > 0) {
          const tableInfo: TableVentaInfo = {codigo: infoVenta.codigo, name: infoVenta.name,
            subName: infoVenta.cantidadSC.name, subNameSecond: infoVenta.cantidadSC.nameSecond,
            cantidad: infoVenta.cantidadSC.cantidadVenta, priceIGV: infoVenta.priceIGV,
            total: this.getTotal(infoVenta.cantidadSC.cantidadVenta, infoVenta.priceIGV) ,
            eliminar: true, priceNoIGV: infoVenta.priceNoIGV};
          this.tableVentaInfo.push(tableInfo);
          this.precios.push(tableInfo.total);
        }
        else if (!infoVenta.cantidadSC) {
          const tableInfo: TableVentaInfo = {codigo: infoVenta.codigo, name: infoVenta.name,
            subName: '...', subNameSecond: '...',
            cantidad: infoVenta.cantidad, priceIGV: infoVenta.priceIGV,
            total: this.getTotal(infoVenta.cantidad, infoVenta.priceIGV), eliminar: true, priceNoIGV: infoVenta.priceNoIGV};

          this.tableVentaInfo.push(tableInfo);
          this.precios.push(tableInfo.total);
        }
      });
      this.costoTotal.next(this.getVentaCostoTotal());
      this.tableVentaInfo$.next(this.tableVentaInfo);
    });
  }

  getTotal(n1: number, n2: number): number {
    return Math.round(((n1 * n2) + Number.EPSILON) * 100) / 100;
  }

  getVentaCostoTotal() {
    let sum = 0;
    this.precios.forEach(precio => {
      sum = sum + precio;
    });
    return sum;
  }

  ejecutarVenta() {
    this.dialog.open(SeguroEjecDialogComponent, {
      width: '600px',
      data: this.venta$.value,
    });
  }

  anularVenta() {
    this.inventarioMNG.anularVenta(this.venta$.value).subscribe((res) => {
      if (res) {
        window.location.reload();
      }
    });
  }

  getTotalCost() {
    // return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  eliminarItem(info: TableVentaInfo) {
    let countOfItem = 0;

    for (const ventaInfo of this.tableVentaInfo$.value) {
      if (ventaInfo.codigo === info.codigo) {
        countOfItem++;
      }
      if (countOfItem > 1) {
        break;
      }
    }


    if (info.subName !== '...' && countOfItem > 1 && this.tableVentaInfo$.value.length > 1) {
      let trueNameSecond = info.subNameSecond;
      if (trueNameSecond === '...') {
        trueNameSecond = '';
      }
      const eliminarItemSC: VentaSimpleEliminarSCInfo =
              { codigo: this.venta$.value.codigo, itemCodigo: info.codigo, cantidadVenta: info.cantidad,
                totalPriceSC:
                info.total,
                totalPriceNoIGVSC: (Math.round(((info.priceNoIGV * info.cantidad) + Number.EPSILON) * 100) / 100),
                name: info.subName,
                nameSecond: trueNameSecond };

      this.inventarioMNG.eliminarItemVentaSC(eliminarItemSC).subscribe(res => {
            if (res) {
              window.location.reload();
            }
      });
    }
    else if (this.tableVentaInfo$.value.length > 1) {
      const eliminarItemSimple: VentaSimpleEliminarInfo =
      { codigo: this.venta$.value.codigo, itemCodigo: info.codigo,
        totalItemPrice: info.total,
        totalItemPriceNoIGV:
        (Math.round(((info.priceNoIGV * info.cantidad) + Number.EPSILON) * 100) / 100)  };

      this.inventarioMNG.eliminarItemVenta(eliminarItemSimple).subscribe(res => {
        if (res) {
          window.location.reload();
        }
      });
    }
    else {
      this.anularVenta();
    }
  }

  openAddItemDialog() {
    const dialogRef = this.dialog.open(GenerarVentaComponent, {
      width: '600px',
      data: {
        crear: false, ventaCod: this.venta$.value.codigo
      }
    });

    dialogRef.afterClosed().subscribe((res: { message: string, venta: Venta }) => {
      if (res && res.venta) {
        this.venta$.next(res.venta);
      }
    });
  }
}
