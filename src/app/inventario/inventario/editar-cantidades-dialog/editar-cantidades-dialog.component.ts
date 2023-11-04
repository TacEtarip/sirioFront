import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { InventarioManagerService, Item, Order, UploadCantidadSimple, UploadCantidadSub } from '../../../inventario-manager.service';





@Component({
  selector: 'app-editar-cantidades-dialog',
  templateUrl: './editar-cantidades-dialog.component.html',
  styleUrls: ['./editar-cantidades-dialog.component.css']
})
export class EditarCantidadesDialogComponent implements OnInit, OnDestroy {
  editarCantForm: UntypedFormGroup;

  editarCantiSimpleForm: UntypedFormGroup;

  order: UntypedFormArray;

  cantidadesEliminadasSC = [];

  agregarOption = [
    {value: true, viewValue: 'Agregar'},
    {value: false, viewValue: 'Reducir'},
  ];

  unicoSubCantidad = false;

  opcionStart = this.agregarOption[0].value;

  cantidadTotal = new BehaviorSubject<number>(0);

  agregar$ = new BehaviorSubject<boolean>(true);

  suma = 0;

  subI: Subscription;

  constructor(public dialogRef: MatDialogRef<EditarCantidadesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Item,
              private formBuilder: UntypedFormBuilder, private inventarioMNG: InventarioManagerService) { }
  ngOnDestroy(): void {
    this.subI.unsubscribe();
  }

  ngOnInit(): void {
    this.cantidadTotal.next(this.data.cantidad);
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
        agregar: this.formBuilder.control(this.opcionStart, Validators.compose([
          Validators.required,
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

      this.order = this.editarCantForm.get('order') as UntypedFormArray;

      this.data.subConteo.order.forEach( (ord: Order) => {
        this.addOrder(ord.name, ord.nameSecond, true, true, ord.cantidad);
      });

      if (this.order.controls.length === 1) {
        this.unicoSubCantidad = true;
      }
    } else {
      this.editarCantForm = this.formBuilder.group({
        costoVar: this.formBuilder.control(0,  Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
        ])),
        agregar: this.formBuilder.control(this.opcionStart, Validators.compose([
          Validators.required,
        ])),
        comentario: this.formBuilder.control({value: '', disabled: false}, Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30)
          ])),
        cantidad: this.formBuilder.control('', Validators.compose([
            Validators.required,
            Validators.pattern('^-?[0-9][^\.]*$'),
            Validators.min(1)
          ]))
      });
    }

    this.subI = this.editarCantForm.get('agregar').valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      if (this.data.subConteo) {
        this.unicoSubCantidad = false;
        this.cantidadesEliminadasSC = [];
        this.order.controls.length = 0;
        this.data.subConteo.order.forEach( (ord: Order) => {
          this.addOrder(ord.name, ord.nameSecond, true, true, ord.cantidad);
        });

        this.order.controls.forEach((control, index) => {
          control.get('cantidad').setValue(0);
          if (value === false) {
            control.get('cantidad').clearValidators();
            control.get('cantidad').setValidators( Validators.compose([
              Validators.required,
              Validators.pattern('^-?[0-9][^\.]*$'),
              Validators.min(0),
              Validators.max(this.data.subConteo.order[index].cantidad)
            ]));
          } else {
            control.get('cantidad').clearValidators();
            control.get('cantidad').setValidators( Validators.compose([
              Validators.required,
              Validators.pattern('^-?[0-9][^\.]*$'),
              Validators.min(0),
            ]));
          }
        });
        // this.editarCantForm.get('agregar').setValidators();
        if (this.order.length === 1) {
          this.unicoSubCantidad = true;
        }
        this.agregar$.next(value);
        this.sumCantidades();
      } else {
        this.editarCantForm.get('cantidad').setValue('');
        this.editarCantForm.get('cantidad').clearValidators();
        if (value) {
          this.editarCantForm.get('cantidad').setValidators(Validators.compose([
            Validators.required,
            Validators.pattern('^-?[0-9][^\.]*$'),
            Validators.min(1)
          ]));
        } else {
          this.editarCantForm.get('cantidad').setValidators(Validators.compose([
            Validators.required,
            Validators.pattern('^-?[0-9][^\.]*$'),
            Validators.min(1),
            Validators.max(this.data.cantidad),
          ]));
        }

      }
    });
  }

  addOrder(orderName: string, orderSecondName: string, disabledValue: boolean, disabledValueTwo: boolean, cantidad: number) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control({value: orderName, disabled: disabledValue}, Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      ])),
      nameSecond: this.formBuilder.control({value: orderSecondName, disabled: disabledValueTwo}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidadAct: this.formBuilder.control({value: cantidad, disabled: true}),
      cantidad: this.formBuilder.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });
    this.order.push(fg);
  }

  agregarOrder() {
    if (this.order.at(0).get('nameSecond').value) {
      this.addOrder('', '', false, false, 0);
    } else {
      this.addOrder('', '', false, true, 0);
    }
    this.unicoSubCantidad = false;
  }

  eliminarOrder(index: number) {
    this.cantidadesEliminadasSC.push(this.order.controls[index].get('cantidadAct').value);
    this.order.removeAt(index);
    if (this.order.length === 1) {
      this.unicoSubCantidad = true;
    }
    this.sumCantidades();
  }

  checkExist(i: number, name: string) {
    let finded = 0;
    this.order.controls.forEach(ord => {
      if (ord.get(name).value === this.order.controls[i].get(name).value) {
        finded++;
      }
    });
    if (finded > 1) {
      this.order.controls[i].get(name).setErrors({ incorrect: true });
    }
  }

  sumCantidades() {
    let suma = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.order.controls.length; index++) {
      suma += this.order.at(index).get('cantidad').value;
    }
    this.suma = suma;
    let sumaCantidadesEliminadasSC = 0;
    this.cantidadesEliminadasSC.forEach(v => {
      sumaCantidadesEliminadasSC += v;
    });
    if (this.agregar$.value === true) {
      this.cantidadTotal.next(suma + this.data.cantidad);
    }  else {
      this.cantidadTotal.next(this.data.cantidad - suma < 0 ? 0 : this.data.cantidad - suma - sumaCantidadesEliminadasSC);
    }
  }

  actCantidad() {
    this.cantidadTotal.next(this.editarCantForm.get('cantidad').value);
  }

  getCantidadesTotalesDeOrder(orderArray: Order[]) {
    let cantidadTotal = 0;
    orderArray.forEach(order => {
      cantidadTotal += order.cantidad;
    });
    return cantidadTotal;
  }

  actualizarCantidades(formInfo) {
    this.editarCantForm.disable();
    let sumaCantidadesEliminadasSC = 0;
    this.cantidadesEliminadasSC.forEach(v => {
      sumaCantidadesEliminadasSC += v;
    });

    const infoToUpload: UploadCantidadSub = {
      subConteo: { name: formInfo.name.trim(), nameSecond: formInfo.nameSecond.trim() || '', order: formInfo.order},
      cantidad:
      formInfo.agregar ?
      this.getCantidadesTotalesDeOrder(formInfo.order) : this.getCantidadesTotalesDeOrder(formInfo.order) + sumaCantidadesEliminadasSC,
      tipo: formInfo.agregar,
      costoVar: formInfo.costoVar,
      comentario: formInfo.comentario.trim(), codigo: this.data.codigo
    };
    this.inventarioMNG.uploadVariacion(infoToUpload).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      } else {
      this.editarCantForm.enable();
      }
    });
  }

  convertPriceIGV(){
      const numberPre: number = this.editarCantForm.get('costoVar').value;
      const valid: boolean = this.editarCantForm.get('costoVar').valid;
      this.editarCantForm.get('costoVar').setValue(this.rebrandNumber(valid, numberPre));
  }

  actualizarCantidadesSimple(formInfo) {
    this.editarCantForm.disable();
    const infoToUpload: UploadCantidadSimple = {
      cantidad: formInfo.cantidad,
      tipo: formInfo.agregar,
      costoVar: formInfo.costoVar,
      comentario: formInfo.comentario.trim(),
      codigo: this.data.codigo
    };
    this.inventarioMNG.uploadVariacionSimple(infoToUpload).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      } else {
      this.editarCantForm.enable();
      this.editarCantForm.reset();
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
