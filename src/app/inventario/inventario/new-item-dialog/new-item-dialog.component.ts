import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import { FormGroup, FormControl, Validators, FormBuilder, FormControlName, FormArray } from '@angular/forms';

import { InventarioManagerService, Item, SubConteo, Marca} from '../../../inventario-manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-new-item-dialog',
  templateUrl: './new-item-dialog.component.html',
  styleUrls: ['./new-item-dialog.component.css']
})
export class NewItemDialogComponent implements OnInit {

  marcasList = new BehaviorSubject<Marca[]>([]);

  onNewItem = new EventEmitter();

  subsAsignaciones = 0;

  myForm: FormGroup;

  scEnabled = false;

  textIndex;

  listOfOrders: FormArray[] = [];

  sumatorias: number[] = [0, 0];
  disponibles: number[] = [0, 0];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  subCant: string[] = [];
  removable = true;
  addOnBlur = true;
  subConteo: FormArray;
  dualActiveStates = [false, false];

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService,
              public dialogRef: MatDialogRef<NewItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {subTipo: string, parentTipoName: string}) { }

  ngOnInit(): void {
    this.inventarioMNG.getAllMarcas().subscribe((res: Marca[]) => {
      this.marcasList.next(res);
    });
    this.myForm = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ])),
      priceIGV: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1),
        Validators.min(0),
      ])),
      cantidad: this.formBuilder.control(0,  Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0),
      ])),
      unidadDeMedida: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ]))
      ,
      description: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ])),
      costoPropio: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1),
        Validators.min(0)
      ])),
      marca: this.formBuilder.control('',  Validators.compose([
      ])),
      subConteo: this.formBuilder.array([]),
    }
    );

    this.subConteo = this.myForm.get('subConteo') as FormArray;
  }

  sumCantidades(index: number, yindex: number) {
    this.sumatorias[index] = 0;
    this.listOfOrders[index].value.forEach( (fg) => {
      let toSum = fg.cantidad;
      if (toSum === null || toSum < 0) {
        toSum = 0;
      }
      this.sumatorias[index] += toSum;
    });
    const preDisponible = this.myForm.get('cantidad').value - this.sumatorias[index];
    if (preDisponible < 0) {
      this.listOfOrders[index].at(yindex).get('cantidad').setValue(0);
      this.sumCantidades(index, yindex);
    } else {
      this.disponibles[index] = this.myForm.get('cantidad').value - this.sumatorias[index];
    }
  }

  changeCantidadMain() {
    let index = -1;
    this.listOfOrders.forEach((fa: FormArray) => {
      index++;
      this.sumatorias[index] = 0;
      fa.value.forEach(fg => {
        let toSum = fg.cantidad;
        if (toSum === null || toSum < 0) {
        toSum = 0;
        }
        this.sumatorias[index] += toSum;
      });
      const preDisponible = this.myForm.get('cantidad').value - this.sumatorias[index];
      if (preDisponible < 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let yindex = 0; yindex < fa.value.length; yindex++) {
          fa.at(yindex).get('cantidad').setValue(0);
        }
        this.disponibles[index] = this.myForm.get('cantidad').value;
      } else {
        this.disponibles[index] = this.myForm.get('cantidad').value - this.sumatorias[index];
      }

    });
  }

  activateDualAss(index: number) {
    if (this.subConteo.at(index).get('nameSecond').valid && this.subConteo.at(index).get('nameSecond').value !== '') {
      this.dualActiveStates[index] = true;
        // tslint:disable-next-line: prefer-for-of
      for (let yindex = 0; yindex < this.listOfOrders[index].value.length; yindex++) {
        this.listOfOrders[index].at(yindex).get('nameSecond').enable();
      }
    } else {
      this.dualActiveStates[index] = false;

      for (let yindex = 0; yindex < this.listOfOrders[index].value.length; yindex++) {
          this.listOfOrders[index].at(yindex).get('nameSecond').disable();
          this.listOfOrders[index].at(yindex).get('nameSecond').reset();
      }
    }
  }

  addSC() {
    if (this.subsAsignaciones < 1) {
      const fg = this.formBuilder.group({
        name: this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
        ])),
        nameSecond: this.formBuilder.control('', Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(30)
          ])),
        order: this.formBuilder.array([])
       });
      this.addOrder(fg);
      this.subConteo.push(fg);
      this.listOfOrders.push(fg.get('order') as FormArray);
      this.subsAsignaciones++;
      this.disponibles[this.listOfOrders.length - 1] =  this.myForm.get('cantidad').value;
    }
  }

  addOrder(secondOrderFormGropup: FormGroup) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.formBuilder.control({value: '', disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidad: this.formBuilder.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });
    const tempFormArray = secondOrderFormGropup.get('order') as FormArray;
    tempFormArray.push(fg);
  }

  agregarSubAsig(index: number, yindex: number) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.formBuilder.control({value: '', disabled: !this.dualActiveStates[index]}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidad: this.formBuilder.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });
    this.listOfOrders[index].insert(yindex + 1, fg);
  }

  deleteSubAsig(index: number, yindex: number) {
    if (this.listOfOrders[index].length === 1) {
        if (index === 0) {
          this.dualActiveStates[0] = this.dualActiveStates[1];
          this.dualActiveStates[1] = false;
          this.disponibles[0] = this.disponibles[1];
          this.disponibles[1] = 0;
        }
        this.disponibles[1] = 0;
        this.subsAsignaciones--;
        this.listOfOrders[index].removeAt(yindex);
        this.listOfOrders.splice(index, 1);
        this.subConteo.removeAt(index);
    }else {
      this.listOfOrders[index].removeAt(yindex);
      this.sumCantidades(index, yindex);
    }
  }

  deleteCostAss(index: number) {
    if (index === 0) {
      this.dualActiveStates[0] = this.dualActiveStates[1];
      this.dualActiveStates[1] = false;
      this.disponibles[0] = this.disponibles[1];
      this.disponibles[1] = 0;
    }
    this.disponibles[1] = 0;
    this.subsAsignaciones--;
    this.listOfOrders.splice(index, 1);
    this.subConteo.removeAt(index);
  }


  changedInstanceCB() {
    this.scEnabled = !this.scEnabled;
    if (this.scEnabled) {
      this.myForm.get('scName').enable();
      this.myForm.get('scName').setValidators([Validators.minLength(3), Validators.required]);
    } else {
      this.myForm.get('scName').disable();
      this.myForm.get('scName').clearValidators();
      this.myForm.get('scName').reset();
    }
  }

  convertCostoPropio(){
    if (this.myForm.get('costoPropio').value !== '') {
      const numberPre: number = this.myForm.get('costoPropio').value;
      const valid: boolean = this.myForm.get('costoPropio').valid;
      this.myForm.get('costoPropio').setValue(this.rebrandNumber(valid, numberPre));
    }
  }

  convertPriceIGV(){
    const numberPre: number = this.myForm.get('priceIGV').value;
    const valid: boolean = this.myForm.get('priceIGV').valid;
    this.myForm.get('priceIGV').setValue(this.rebrandNumber(valid, numberPre));
  }

  rebrandNumber(valid: boolean, numberToRebrand: number) {
    const stringNumber = numberToRebrand.toString().trim().replace(',', '.');
    const indexOfComa = stringNumber.indexOf('.');
    let newNumber = '';
    if (valid) {
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
    return newNumber;
  }

  onSubmit(item: Item) {
    const newItem: Item = item;
    newItem.name = item.name.trim();
    newItem.description = item.description.trim();
    newItem.tipo = this.data.parentTipoName;
    newItem.subTipo = this.data.subTipo;

    if (this.subConteo.length > 0) {
      newItem.subConteo = this.subConteo.at(0).value;
      newItem.subConteo.name = newItem.subConteo.name.trim();
      if (newItem.subConteo.nameSecond) {
        newItem.subConteo.nameSecond = newItem.subConteo.nameSecond.trim();
      }
      newItem.subConteo.order.forEach( sc => {
        sc.name = sc.name.trim();
        if (sc.nameSecond) {
          sc.nameSecond = sc.nameSecond.trim();
        }
      });
    } else {
      newItem.subConteo = undefined;
    }
    this.inventarioMNG.addItem(newItem).subscribe((addedItem: Item) => {
      if (addedItem !== null) {
        this.myForm.reset();
        this.dialogRef.close(addedItem.codigo);
        // this.onNewItem.emit(addedItem.codigo);
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.subCant.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(sC: string): void {
    const index = this.subCant.indexOf(sC);

    if (index >= 0) {
      this.subCant.splice(index, 1);
    }
  }

  removeAll() {
    this.subCant.forEach(sc => {
      this.remove(sc);
    });
  }

  cantidadChanged() {
    this.removeAll();
    if (this.myForm.get('cantidad').valid === false) {
      // this.myForm.get('scName').setValue('');
      // this.scEnabled = false;
    }
  }

}
