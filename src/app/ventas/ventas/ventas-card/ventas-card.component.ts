import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

export interface Transaction {
  codigo: string;
  name: string;
  precioIGV: number;
  cantidad: number;
}
@Component({
  selector: 'app-ventas-card',
  templateUrl: './ventas-card.component.html',
  styleUrls: ['./ventas-card.component.css']
})
export class VentasCardComponent implements OnInit {
  cantidadForm: FormGroup;

  displayedColumns: string[] = ['codigo', 'name', 'cantidad', 'precioIGV'];
  transactions: Transaction[] = [
    {codigo: 'SD313', name: 'TEst', precioIGV: 34.20, cantidad: 4},
    {codigo: 'SD314', name: 'test2', precioIGV: 34.50, cantidad: 3},
  ];
  constructor(private formBuilder: FormBuilder) {
   }

  ngOnInit(): void {
    this.cantidadForm = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),
    });
  }

  getTotalCost() {
   // return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

}
