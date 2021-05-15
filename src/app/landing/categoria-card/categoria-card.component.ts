import { InventarioManagerService } from './../../inventario-manager.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-categoria-card',
  templateUrl: './categoria-card.component.html',
  styleUrls: ['./categoria-card.component.css']
})
export class CategoriaCardComponent implements OnInit {

  @Input() tipo: string;
  urlOfImage = new BehaviorSubject<string>(null);


  constructor(private inv: InventarioManagerService) { }

  ngOnInit(): void {
  }

}
