import { Component, OnInit, EventEmitter } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { InventarioManagerService, Item} from '../../../inventario-manager.service';

@Component({
  selector: 'app-new-item-dialog',
  templateUrl: './new-item-dialog.component.html',
  styleUrls: ['./new-item-dialog.component.css']
})
export class NewItemDialogComponent implements OnInit {

  onNewItem = new EventEmitter();

  public tipoOn: string;

  myForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      priceIGV: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1)
      ])),
      cantidad: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.minLength(1)
      ])),
      unidadDeMedida: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ]))
      ,
      description: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ]))
    }
    );
  }

  testFocus(){
    const numberPre: number = this.myForm.get('priceIGV').value;
    const stringNumber = numberPre.toString().trim().replace(',', '.');
    const indexOfComa = stringNumber.indexOf('.');
    let newNumber = '';

    if (this.myForm.get('priceIGV').valid) {
        if (stringNumber.indexOf('.') === -1) {
          newNumber = stringNumber + '.00';
        } else if (stringNumber.charAt(indexOfComa + 1) === '') {
          newNumber = stringNumber + '00';
        } else if (stringNumber.charAt(indexOfComa + 2) === '') {
          newNumber = stringNumber + '0';
        } else {
          newNumber = stringNumber;
        }
  }
    if (newNumber !== '') {
      this.myForm.get('priceIGV').setValue(newNumber);
    }
  }

  onSubmit(item: Item) {
    const newItem: Item = item;
    newItem.tipo = this.tipoOn;
    this.inventarioMNG.addItem(newItem).subscribe((addedItem: Item) => {
      if (addedItem !== null) {
        this.myForm.reset();
        this.onNewItem.emit(addedItem.codigo);
      }
    });
  }


}
