import { Component, OnInit } from '@angular/core';
import { InventarioManagerService, Venta } from '../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventas-activas',
  templateUrl: './ventas-activas.component.html',
  styleUrls: ['./ventas-activas.component.css']
})
export class VentasActivasComponent implements OnInit {

  constructor(private inventarioMNG: InventarioManagerService) { }

  ventasActivas = new BehaviorSubject<Venta[]>([]);

  ngOnInit(): void {
    this.inventarioMNG.getVentasActivas().subscribe((res) => {
      this.ventasActivas.next(res);
    });
  }

}
