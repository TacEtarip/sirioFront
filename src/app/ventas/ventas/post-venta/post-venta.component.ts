import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Venta, InventarioManagerService, ItemVendido } from 'src/app/inventario-manager.service';
import { BehaviorSubject } from 'rxjs';

interface TableData {
  codigo: string;
  name: string;
  cantidad: number;
  priceIGV: number;
  totalPrice: number;
}


@Component({
  selector: 'app-post-venta',
  templateUrl: './post-venta.component.html',
  styleUrls: ['./post-venta.component.css']
})
export class PostVentaComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'name', 'cantidad',  'priceIGV', 'totalPrice'];

  dataSource: TableData[] = [];

  dataSource$ = new BehaviorSubject<TableData[]>([]);

  dummyVenta: Venta = {codigo: '000000', totalPrice: 0, totalPriceNoIGV: 0, estado: '0000', documento: null, itemsVendidos: null};

  venta$ = new BehaviorSubject<Venta>(this.dummyVenta);

  constructor(private activatedRoute: ActivatedRoute, private inventarioMNG: InventarioManagerService, private router: Router) {
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(first()).subscribe(param => {
      const ruta = param.get('postVentaCod');

      this.inventarioMNG.getVenta(ruta).subscribe((res: Venta) => {
        if (res) {
          if (res.estado !== 'ejecutada') {
            this.router.navigate(['/ventas/eject/404']);
          }
        } else {
          this.router.navigate(['/ventas/eject/404']);
        }
        for (const item of res.itemsVendidos) {
          this.dataSource.push({codigo: item.codigo, name: item.name,
                                cantidad: item.cantidad, priceIGV: item.priceIGV,
                                totalPrice: item.totalPrice});
        }
        this.venta$.next(res);
        this.dataSource$.next(this.dataSource);
      });
    });
  }


  descargarPDF() {
    window.open('https://inventario-sirio-dinar.herokuapp.com/inventario/pdf/' + this.venta$.value.codigo + '.pdf', '_blank');
  }

}
