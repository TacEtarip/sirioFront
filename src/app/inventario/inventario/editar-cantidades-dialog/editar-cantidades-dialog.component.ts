import { Component, OnInit, Inject, ɵConsole } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { Item, Order, SubConteo,  UploadCantidadSub, InventarioManagerService, UploadCantidadSimple} from '../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';




@Component({
  selector: 'app-editar-cantidades-dialog',
  templateUrl: './editar-cantidades-dialog.component.html',
  styleUrls: ['./editar-cantidades-dialog.component.css']
})
export class EditarCantidadesDialogComponent implements OnInit {
  editarCantForm: FormGroup;

  editarCantiSimpleForm: FormGroup;

  order: FormArray;

  cantidadTotal = new BehaviorSubject<number>(this.data.cantidad);

  constructor(public dialogRef: MatDialogRef<EditarCantidadesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Item,
              private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    if (this.data.subConteo) {
      this.editarCantForm = this.formBuilder.group({
        name: this.formBuilder.control({value: this.data.subConteo.name, disabled: true}, Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ])),
          costoVar: this.formBuilder.control(0,  Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
        ])),
        nameSecond: this.formBuilder.control({value: this.data.subConteo.nameSecond, disabled: true}, Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ])),
        comentario: this.formBuilder.control({value: '', disabled: false}, Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30)
          ])),
        order: this.formBuilder.array([]),
      });

      this.order = this.editarCantForm.get('order') as FormArray;

      this.data.subConteo.order.forEach( (ord: Order) => {
        this.addOrder(ord.name, ord.nameSecond, true, ord.cantidad);
      });
    } else {
      this.editarCantForm = this.formBuilder.group({
        costoVar: this.formBuilder.control(0,  Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
        ])),
        comentario: this.formBuilder.control({value: '', disabled: false}, Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30)
          ])),
        cantidad: this.formBuilder.control('', Validators.compose([
            Validators.required,
            Validators.pattern('^-?[0-9][^\.]*$'),
            Validators.min(0)
          ]))
      });
    }

  }

  addOrder(orderName: string, orderSecondName: string, disabledValue: boolean, cantidad: number) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control({value: orderName, disabled: disabledValue}, Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.formBuilder.control({value: orderSecondName, disabled: disabledValue}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidad: this.formBuilder.control(cantidad, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });

    this.order.push(fg);
  }

  agregarOrder() {
    this.addOrder('', '', false, 0);
  }

  eliminarOrder(index: number) {
    this.order.removeAt(index);
  }

  sumCantidades() {
    let suma = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.order.controls.length; index++) {
      suma += this.order.at(index).get('cantidad').value;
    }

    this.cantidadTotal.next(suma);
  }

  actCantidad() {
    this.cantidadTotal.next(this.editarCantForm.get('cantidad').value);
  }

  actualizarCantidades(formInfo) {
    const infoToUpload: UploadCantidadSub = {
      subConteo: { name: formInfo.name, nameSecond: formInfo.nameSecond, order: formInfo.order},
      cantidadAntigua: this.data.cantidad, cantidadNueva: this.cantidadTotal.value,
      costoVar: formInfo.costoVar,
      comentario: formInfo.comentario, codigo: this.data.codigo
    };
    this.inventarioMNG.uploadVariacion(infoToUpload).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
  }

  convertPriceIGV(){
      const numberPre: number = this.editarCantForm.get('costoVar').value;
      const valid: boolean = this.editarCantForm.get('costoVar').valid;
      this.editarCantForm.get('costoVar').setValue(this.rebrandNumber(valid, numberPre));
  }

  actualizarCantidadesSimple(formInfo) {
    const infoToUpload: UploadCantidadSimple = {
      cantidadAntigua: this.data.cantidad,
      cantidadNueva: this.cantidadTotal.value,
      costoVar: formInfo.costoVar,
      comentario: formInfo.comentario,
      codigo: this.data.codigo
    };
    this.inventarioMNG.uploadVariacionSimple(infoToUpload).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
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

}
