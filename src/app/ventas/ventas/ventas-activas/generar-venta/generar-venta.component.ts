import { AuthService } from './../../../../auth.service';
import { Item, InventarioManagerService, Order, Venta, ItemVendido } from 'src/app/inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TableVentaInfo } from '../venta-activa-card/venta-activa-card.component';

interface CantidadSubConteo {
  name: string;
  nameSecond: string;
  cantidadDisponible: number;
  cantidadVenta: number;
}

interface PreVentaSimpleInfo {
  name: string;
  selectAcction: string;
  priceNoIGV: number;
  documentoTipo: string;
  docCod: number;
  cantidadVenta: number;
  cantidadDisponible: number;
  nameDocumento: string;
  priceIGV: number;
  cantidadList: CantidadSubConteo[];
  metodoPagoOne: string;
  metodoPagoTwo: string;
  clienteEmail: string;
  peso?: number;
  documento_transportista?: string;
  placa_transportista?: string;
  denomicaion_transportista?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  direccion_partida?: string;
  departamento_llegada?: string;
  provincia_llegada?: string;
  distrito_llegada?: string;
  direccion_llegada?: string;
  cantidad?: number;
}

@Component({
  selector: 'app-generar-venta',
  templateUrl: './generar-venta.component.html',
  styleUrls: ['./generar-venta.component.css']
})
export class GenerarVentaComponent implements OnInit {

  ventaEnCurso$ = new BehaviorSubject<boolean>(false);

  cantidadList: FormArray;

  totalPriceIGV: string;

  sum = 0;

  ventaForm: FormGroup;

  filteredItem$ = new BehaviorSubject<Item[]>(null);

  item$ = new BehaviorSubject<Item>(null);

  constructor(private fb: FormBuilder, private invManager: InventarioManagerService,
              public dialogRef: MatDialogRef<GenerarVentaComponent>, private auth: AuthService,
              @Inject(MAT_DIALOG_DATA) public crear: { crear: boolean, ventaCod: string, item: TableVentaInfo }) { }

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      name: this.fb.control( '', Validators.compose([
        Validators.required,
      ])),
      codigo: this.fb.control({ value: '', disabled: true }, Validators.required),
      priceIGV: this.fb.control({ value: '' , disabled: false },  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.min(0.01)
      ])),
      priceNoIGV: this.fb.control({ value: '', disabled: true }),
      cantidad: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{0,}$/),
        Validators.min(1)
      ]))
    });

    if (this.crear.item) {
      this.ventaForm.get('name').disable();
      if (this.crear.item.codigo[2] !== 'N' && this.crear.item.codigo[3] !== 'I') {
        this.invManager.getItem(this.crear.item.codigo).subscribe(res => {
          this.item$.next(res);
        });
      } else {
        this.item$.next(null);
      }
    }

    if (!this.crear.item) {
      this.ventaForm.get('name').valueChanges.subscribe((changeV: string) => {
        if (changeV) {
          this.filterItemValue(changeV);
        } else {
          this.filteredItem$.next(null);
        }
    });
    }

    this.item$.subscribe(val => {
      this.ventaForm.get('codigo').setValue('');
      this.ventaForm.removeControl('cantidadDisponible');
      this.ventaForm.removeControl('cantidadVenta');
      this.ventaForm.removeControl('cantidadList');
      this.ventaForm.addControl('cantidad',  this.fb.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{0,}$/),
        Validators.min(1)
      ])));
      if (this.cantidadList) {
        this.cantidadList.clear();
      }
      if (!val && this.crear.item) {
        this.ventaForm.get('codigo').setValue(this.crear.item.codigo);
        this.ventaForm.get('priceIGV').setValue(this.crear.item.priceIGV);
        this.ventaForm.get('priceNoIGV').setValue(this.crear.item.priceNoIGV);
        this.ventaForm.get('name').setValue(this.crear.item);
        this.ventaForm.get('cantidad').setValue(this.crear.item.cantidad);
      }
      if (val) {
        this.ventaForm.removeControl('cantidad');
        if (!val.subConteo) {
          this.ventaForm.removeControl('cantidadList');
          this.ventaForm.addControl('cantidadDisponible',  this.fb.control({value: val.cantidad, disabled: true},
            Validators.compose([
            Validators.required,
            Validators.minLength(1)
          ])));
          this.ventaForm.addControl('cantidadVenta',  this.fb.control('',  Validators.compose([
            Validators.required,
            Validators.pattern(/^[0-9]{0,}$/),
            Validators.min(1)
          ])));
        } else {
          this.ventaForm.removeControl('cantidadDisponible');
          this.ventaForm.removeControl('cantidadVenta');
          this.ventaForm.addControl('cantidadList', this.fb.array([]));
          this.cantidadList = this.ventaForm.get('cantidadList') as FormArray;
          this.item$.value.subConteo.order.forEach((order: Order) => {
            if (order.cantidad > 0) {
              this.addOrder(order.name, order.nameSecond, order.cantidad);
            }
          });
        }
        this.ventaForm.get('codigo').setValue(val.codigo);
        this.ventaForm.get('priceIGV').setValue(val.priceIGV);
        this.ventaForm.get('priceNoIGV').setValue(val.priceNoIGV);
        this.ventaForm.get('name').setValue(val);
        // tslint:disable-next-line: no-string-literal

        if (this.crear.item) {
          this.ventaForm.get('priceIGV').setValue(this.crear.item.priceIGV);
          this.ventaForm.get('priceNoIGV').setValue(this.crear.item.priceNoIGV);
          if (this.ventaForm.contains('cantidadVenta')) {
            this.ventaForm.get('cantidadVenta').setValue(this.crear.item.cantidad);
          } else if (this.ventaForm.contains('cantidadList')) {
            this.invManager.getVenta(this.crear.ventaCod).subscribe(res => {
              const itemToM = res.itemsVendidos.find(item => item.name === this.crear.item.name);
              // tslint:disable-next-line: prefer-for-of
              itemToM.cantidadSC.forEach((ele, index) => {
                this.cantidadList.at(index).get('cantidadVenta').setValue(ele.cantidadVenta);
              });
            });
          }
        }

      }
    });
  }

  displayFn(item: Item): string {
    return item && item.name ? item.name : '';
  }

  selectItem(e: MatAutocompleteSelectedEvent) {
    this.item$.next(e.option.value);
    this.filteredItem$.next(null);
  }

  filterItemValue(value: string) {
    this.invManager.getListOfItemsFilteredByRegex(value, 15).subscribe(res => {
      if (res) {
        this.filteredItem$.next(res);
        if (res.length === 0) {
          this.item$.next(null);
        } else {
          const index = this.filteredItem$.value.findIndex((el) => el.name.toUpperCase() === (value.toUpperCase()));
          this.item$.next(this.filteredItem$.value[index]);
        }
      } else {
        this.filteredItem$.next(null);
      }
    });
  }

  changeNumber(){
    const numberPre: number = this.ventaForm.get('priceIGV').value;
    const numberNoIGVpre: number = this.getNoIGVPrice(numberPre);
    const valid: boolean = this.ventaForm.get('priceIGV').valid;

    const nmConvertido = this.rebrandNumber(valid, numberPre);
    const nmNoIGVConvertido = this.rebrandNumber(valid, numberNoIGVpre);

    if (nmConvertido !== '') {
      // this.ventaForm.get('priceIGV').setValue(nmConvertido);
      this.ventaForm.get('priceNoIGV').setValue(nmNoIGVConvertido);
      if (!this.item$.value) {
        this.actTotal('cantidad');
      }
      else if (!this.item$.value.subConteo) {
        this.actTotal('cantidadVenta');
      } else {
        this.sum = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let yindex = 0; yindex < this.cantidadList.controls.length; yindex++) {
        this.sum = this.sum + this.cantidadList.at(yindex).get('cantidadVenta').value;
        }
        const precio: number = this.ventaForm.get('priceIGV').value;
        this.totalPriceIGV = this.rebrandNumber(true, Math.round(((this.sum * precio) + Number.EPSILON) * 100) / 100).replace('.', ',');
      }
    }
  }

  addOrder(orderName: string, orderSecondName: string, cantidad: number) {
    const fg = this.fb.group({
      name: this.fb.control({value: orderName, disabled: true}, Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.fb.control({value: orderSecondName, disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidadDisponible: this.fb.control({value: cantidad, disabled: true}, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
      ])),
      cantidadVenta: this.fb.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });

    this.cantidadList.push(fg);
  }

  actTotal(nameFild: string) {

    this.sum = 0;
    if (this.item$.value &&
      (this.ventaForm.get(nameFild).value <= 0 || (this.item$.value.cantidad - this.ventaForm.get(nameFild).value) < 0)) {
      this.ventaForm.get(nameFild).setErrors({incorrect: true});
    }
    else {
      const cantidad: number = this.ventaForm.get(nameFild).value;
      const precio: number = this.ventaForm.get('priceIGV').value;
      this.sum = cantidad;
      this.totalPriceIGV = this.rebrandNumber(true, Math.round(((precio * cantidad) + Number.EPSILON) * 100) / 100).replace('.', ',');
    }
  }

  resetSum() {
    this.sum = 0;
  }

  getNoIGVPrice(igvPrice: number) {
    const aproxNoIGV = igvPrice / 1.18;
    return Math.round(((aproxNoIGV) + Number.EPSILON) * 100) / 100;
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

  actTotalForSubConteo(index: number) {
    const listRequired = this.cantidadList.at(index);
    this.sum = 0;
    if ((listRequired.get('cantidadDisponible').value - listRequired.get('cantidadVenta').value) < 0
        || listRequired.get('cantidadVenta').value < 0 || listRequired.get('cantidadVenta').value === null) {
        this.cantidadList.at(index).get('cantidadVenta').setErrors({incorrect: true});
        // this.actTotalForSubConteo(index);
    }
    else {

    // tslint:disable-next-line: prefer-for-of
    for (let yindex = 0; yindex < this.cantidadList.controls.length; yindex++) {
      this.sum = this.sum + this.cantidadList.at(yindex).get('cantidadVenta').value;
    }
    const precio: number = this.ventaForm.get('priceIGV').value;
    this.totalPriceIGV = this.rebrandNumber(true, Math.round(((this.sum * precio) + Number.EPSILON) * 100) / 100).replace('.', ',');
  }
  }

  generarCodigo(v: string): string {
    const randomN = Math.floor(Math.random() * 90 + 10);
    return v.charAt(0) + v.charAt(1) + 'NI' + randomN.toString();
  }

  crearNewVentaBody(preVentaInfo: PreVentaSimpleInfo) {
    let cSC: any[];
    if (this.item$.value && this.item$.value.subConteo) {
      cSC = preVentaInfo.cantidadList;
    } else{
      cSC = [];
    }
    let itemVendido: ItemVendido;
    const total =  parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round(((total / 1.18) + Number.EPSILON) * 100) / 100;
    if (this.item$.value) {
      itemVendido =
      {codigo: this.item$.value.codigo, name: this.item$.value.name, priceIGV: preVentaInfo.priceIGV,
        priceNoIGV: preVentaInfo.priceNoIGV, descripcion: this.item$.value.description,
        cantidadSC: cSC, cantidad: preVentaInfo.cantidadVenta, totalPrice: total, totalPriceNoIGV: totalNoIGV };
      if (this.item$.value.subConteo) {
        itemVendido.cantidad = this.sum;
      }
    } else {
      itemVendido =
      {codigo: this.generarCodigo(preVentaInfo.name), name: preVentaInfo.name, priceIGV: preVentaInfo.priceIGV,
        priceNoIGV: preVentaInfo.priceNoIGV, descripcion: '',
        cantidadSC: cSC, cantidad: preVentaInfo.cantidad, totalPrice: total, totalPriceNoIGV: totalNoIGV };
    }

    const bodyToSend: Venta =
    {
      documento:  {
        type: 'noone', name: '',
        codigo: null,
        direccion: '',
      },
        codigo: '', totalPrice: total,
        totalPriceNoIGV: totalNoIGV,
        estado: 'pendiente', itemsVendidos: [itemVendido], vendedor: this.auth.getUser(),
        tipoVendedor: this.auth.getTtype(), cliente_email: '',
        medio_de_pago: '',
    };

    this.ventaEnCurso$.next(true);

    return bodyToSend;
  }

  generarNuevaVenta(preVentaInfo: PreVentaSimpleInfo) {
    const bodyToSend = this.crearNewVentaBody(preVentaInfo);
    this.invManager.generarVentaNueva({venta: bodyToSend}).subscribe((res) => {
      this.ventaEnCurso$.next(false);
      if (res) {
        if (res.venta) {
          this.dialogRef.close({  message: `SuccesAG ${res.venta.codigo}`, venta: res.venta });
        } else {
          alert(res.message);
          this.dialogRef.close({ message: 'notVentaG', venta: null });
        }
      }
      else {
        alert('Error desconocido, intenta denuevo en un momento.');
      }

    });
  }

  agregarItemVenta(preVentaInfo: PreVentaSimpleInfo) {
    let cSC: any[];
    if (this.item$.value && this.item$.value.subConteo) {
      cSC = preVentaInfo.cantidadList;
    } else{
      cSC = [];
    }
    let itemVendido: ItemVendido;
    const total =  parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round(((total / 1.18) + Number.EPSILON) * 100) / 100;
    if (this.item$.value) {
      itemVendido =
      {codigo: this.item$.value.codigo, name: this.item$.value.name, priceIGV: preVentaInfo.priceIGV,
        priceNoIGV: preVentaInfo.priceNoIGV, descripcion: this.item$.value.description,
        cantidadSC: cSC, cantidad: preVentaInfo.cantidadVenta, totalPrice: total, totalPriceNoIGV: totalNoIGV };
      if (this.item$.value.subConteo) {
        itemVendido.cantidad = this.sum;
      }
    } else {
      if (this.crear.item) {
        itemVendido =
        {codigo: this.crear.item.codigo, name: this.crear.item.name, priceIGV: preVentaInfo.priceIGV,
          priceNoIGV: preVentaInfo.priceNoIGV, descripcion: '',
          cantidadSC: cSC, cantidad: preVentaInfo.cantidad, totalPrice: total, totalPriceNoIGV: totalNoIGV };
      } else {
        itemVendido =
        {codigo: this.generarCodigo(preVentaInfo.name), name: preVentaInfo.name, priceIGV: preVentaInfo.priceIGV,
          priceNoIGV: preVentaInfo.priceNoIGV, descripcion: '',
          cantidadSC: cSC, cantidad: preVentaInfo.cantidad, totalPrice: total, totalPriceNoIGV: totalNoIGV };
      }

    }
    this.ventaEnCurso$.next(true);
    this.invManager.agregarItemVenta(itemVendido, this.crear.ventaCod).subscribe((res) => {
      this.ventaEnCurso$.next(false);
      if (res) {
        this.dialogRef.close({venta: res.venta, message: `succesAI|${res.message}` });
      } else {
        alert('Ocurrio un error desconocido.');
        this.dialogRef.close({venta: res.venta, message: 'error' });
      }
    });

  }

}
