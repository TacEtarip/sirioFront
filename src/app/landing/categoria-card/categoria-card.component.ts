import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tipo } from 'src/app/inventario-manager.service';
import { InventarioManagerService } from './../../inventario-manager.service';

@Component({
  selector: 'app-categoria-card',
  templateUrl: './categoria-card.component.html',
  styleUrls: ['./categoria-card.component.css']
})
export class CategoriaCardComponent implements OnInit {

  @Input() tipo: Tipo;
  urlOfImage = new BehaviorSubject<string>(null);


  constructor(private inv: InventarioManagerService) { }

  ngOnInit(): void {
    this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${this.tipo.link.split('.')[0]}.webp`);
  }

}
