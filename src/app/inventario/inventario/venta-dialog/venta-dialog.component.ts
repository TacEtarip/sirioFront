import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import jsonCode from '../../../../assets/sunatCodes.json';
import {
  DNI,
  Documento,
  InventarioManagerService,
  Item,
  ItemVendido,
  Order,
  RUC,
  Venta,
} from '../../../inventario-manager.service';
import { AuthService } from './../../../auth.service';

export interface VentaSimple {
  codigo: string;
  totalPrice: number;
  totalPriceNoIGV: number;
  estado: string;
  documento: Documento;
  itemsVendidos: ItemVendido[];
  subConteosToUpdate: CantidadSubConteo[];
}

interface InfoVenta {
  subConteosToUpdate: CantidadSubConteo[];
  cantidadDisponible: number;
}

interface TipoDoc {
  value: string;
  viewValue: string;
}

interface MetodoPago {
  value: string;
  viewValue: string;
}

interface CantidadSubConteo {
  name: string;
  nameSecond: string;
  cantidadDisponible: number;
  cantidadVenta: number;
}

interface PreVentaSimpleInfo {
  costoPropio: number;
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
}

@Component({
  selector: 'app-venta-dialog',
  templateUrl: './venta-dialog.component.html',
  styleUrls: ['./venta-dialog.component.css'],
})
export class VentaDialogComponent implements OnInit, OnDestroy {
  generarGuia$ = new BehaviorSubject<boolean>(false);

  ventaForm: UntypedFormGroup;

  cantidadList: UntypedFormArray;

  ventaEnCurso = new BehaviorSubject<boolean>(false);

  disabled = new BehaviorSubject<boolean>(true);

  documentAccepted = new BehaviorSubject<boolean>(false);

  documentoFullInfo = new BehaviorSubject<any>(false);

  sum = 0;

  ubigeoPartida = '';

  tiposDocumentos: TipoDoc[] = [
    { value: 'noone', viewValue: 'Sin Documento' },
    { value: 'factura', viewValue: 'Factura' },
    { value: 'boleta', viewValue: 'Boleta' },
  ];

  metodosDePago: MetodoPago[] = [
    { value: 'efectivo', viewValue: 'Efectivo' },
    { value: 'tarjeta', viewValue: 'Tarjeta' },
    { value: 'yape', viewValue: 'Yape' },
    { value: 'otro', viewValue: 'Otro' },
  ];

  metodosDeTransporte: MetodoPago[] = [
    { value: '01', viewValue: 'Publico' },
    { value: '02', viewValue: 'Privado' },
  ];

  currentDocumentType = this.tiposDocumentos[0].value;
  currentMetodoPago = this.metodosDePago[0].value;
  currentTipoTransporte = this.metodosDeTransporte[0].value;

  totalPriceIGV: string;

  subOne: Subscription;

  subI: Subscription;
  subII: Subscription;
  subIII: Subscription;
  subIV: Subscription;
  subV: Subscription;
  subVI: Subscription;

  sunatCodes: any;

  filterDepartamentos: Array<any>;
  filterProvincias: Array<any>;
  filterDistritos: Array<any>;

  filterDepartamentosLlegada: Array<any>;
  filterProvinciasLlegada: Array<any>;
  filterDistritosLlegada: Array<any>;

  llegadaUbigeo = '';
  partidaUbigeo = '';

  indexProvincia = 0;

  ventaActiva = '';

  ventasActivas: string[];

  ventasActivasCtn: number;

  constructor(
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item,
    private formBuilder: UntypedFormBuilder,
    private inventarioMNG: InventarioManagerService,
    private router: Router,
    private auth: AuthService
  ) {
    this.sunatCodes = jsonCode;
  }

  ngOnDestroy(): void {
    this.subOne.unsubscribe();
    this.subI.unsubscribe();
    this.subII.unsubscribe();
    this.subIII.unsubscribe();
    this.subIV.unsubscribe();
    this.subV.unsubscribe();
    this.subVI.unsubscribe();
    this.generarGuia$.complete();
  }

  ngOnInit(): void {
    this.inventarioMNG.getVentasActivas().subscribe((res) => {
      this.ventasActivas = res;
      this.ventasActivasCtn = res.length;
    });

    this.ventaForm = this.formBuilder.group({
      selectAcction: this.formBuilder.control(
        'ventaSimple',
        Validators.compose([Validators.required])
      ),
      costoPropio: this.formBuilder.control(
        {
          value: this.rebrandNumber(true, this.item.costoPropio),
          disabled: false,
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0.01),
        ])
      ),
      priceIGV: this.formBuilder.control(
        { value: this.rebrandNumber(true, this.item.priceIGV), disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0.01),
        ])
      ),
      priceNoIGV: this.formBuilder.control({
        value: this.item.priceNoIGV,
        disabled: true,
      }),
      documentoTipo: this.formBuilder.control(
        this.tiposDocumentos[0].value,
        Validators.compose([Validators.required])
      ),
      docCod: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(11),
          Validators.maxLength(11),
        ])
      ),
      nameDocumento: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      metodoPagoOne: this.formBuilder.control('efectivo', Validators.required),
      metodoPagoTwo: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,_#\s]+$/),
          Validators.minLength(2),
        ])
      ),
      clienteEmail: this.formBuilder.control(
        '',
        Validators.compose([Validators.email])
      ),
      ///////////////////////////////////////////////////////////
      ///
      peso: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0.01),
        ])
      ),
      ///
      documento_transportista: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]{8}$|^[0-9]{11}$/g),
        ])
      ),
      ///
      placa_transportista: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9a-zA-Z_-]{3,}$/),
        ])
      ),
      ///
      denomicaion_transportista: this.formBuilder.control({
        value: '',
        disabled: true,
      }),
      //
      departamento: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required, this.validateDepartamento])
      ),
      provincia: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          this.validateProvincia('departamento'),
        ])
      ),
      distrito: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          this.validateDistrito('departamento', 'provincia'),
        ])
      ),
      ///
      direccion_partida: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,_#\s]+$/),
        ])
      ),
      ///
      departamento_llegada: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required, this.validateDepartamento])
      ),
      provincia_llegada: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          this.validateProvincia('departamento_llegada'),
        ])
      ),
      distrito_llegada: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          this.validateDistrito('departamento_llegada', 'provincia_llegada'),
        ])
      ),
      ///
      direccion_llegada: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,_#\s]+$/),
        ])
      ),
    });

    this.ventaForm
      .get('documento_transportista')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        if (this.ventaForm.get('documento_transportista').valid) {
          this.comprobarDocV2(value);
        } else {
          this.ventaForm.get('denomicaion_transportista').reset();
        }
      });

    this.generarGuia$.pipe(distinctUntilChanged()).subscribe((generar) => {
      if (generar) {
        this.ventaForm.get('peso').enable();
        this.ventaForm.get('documento_transportista').enable();
        this.ventaForm.get('placa_transportista').enable();
        this.ventaForm.get('departamento').enable();
        this.ventaForm.get('direccion_partida').enable();
        this.ventaForm.get('departamento_llegada').enable();
        this.ventaForm.get('direccion_llegada').enable();
      } else {
        this.ventaForm.get('peso').disable();
        this.ventaForm.get('documento_transportista').disable();
        this.ventaForm.get('placa_transportista').disable();
        this.ventaForm.get('departamento').disable();
        this.ventaForm.get('direccion_partida').disable();
        this.ventaForm.get('departamento_llegada').disable();
        this.ventaForm.get('direccion_llegada').disable();
      }
    });

    if (!this.item.subConteo) {
      this.ventaForm.addControl(
        'cantidadDisponible',
        this.formBuilder.control(
          { value: this.item.cantidad, disabled: true },
          Validators.compose([
            Validators.required,
            Validators.pattern('^-?[0-9][^.]*$'),
            Validators.minLength(1),
          ])
        )
      );
      this.ventaForm.addControl(
        'cantidadVenta',
        this.formBuilder.control(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^-?[0-9][^.]*$'),
            Validators.min(1),
          ])
        )
      );
    } else {
      this.ventaForm.addControl('cantidadList', this.formBuilder.array([]));
      this.cantidadList = this.ventaForm.get(
        'cantidadList'
      ) as UntypedFormArray;
      this.item.subConteo.order.forEach((order: Order) => {
        if (order.cantidad > 0) {
          this.addOrder(order.name, order.nameSecond, order.cantidad);
        }
      });
    }

    this.subI = this.ventaForm
      .get('departamento')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((r: string) => {
        this.checkDepartamento(r, 'provincia', 'departamento', 1);
      });

    this.subII = this.ventaForm
      .get('provincia')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((r: string) => {
        this.checkProvincia(r, 'provincia', 'departamento', 'distrito', 1);
      });

    this.subIII = this.ventaForm
      .get('distrito')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((r: string) => {
        this.checkDistrito(r, 'provincia', 'distrito', 1);
      });

    this.subIV = this.ventaForm
      .get('departamento_llegada')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((r: string) => {
        this.checkDepartamento(
          r,
          'provincia_llegada',
          'departamento_llegada',
          2
        );
      });

    this.subV = this.ventaForm
      .get('provincia_llegada')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((r: string) => {
        this.checkProvincia(
          r,
          'provincia_llegada',
          'departamento_llegada',
          'distrito_llegada',
          2
        );
      });

    this.subVI = this.ventaForm
      .get('distrito_llegada')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((r: string) => {
        this.checkDistrito(r, 'provincia_llegada', 'distrito_llegada', 2);
      });

    this.subOne = this.ventaForm
      .get('metodoPagoOne')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((res) => {
        this.ventaForm.get('metodoPagoTwo').reset();
        if (res === 'efectivo') {
          this.ventaForm.get('metodoPagoTwo').disable();
        } else {
          this.ventaForm.get('metodoPagoTwo').enable();
        }
      });
  }

  checkDepartamento(
    r: string,
    provincia: string,
    departamento: string,
    witchOne: number
  ) {
    if (witchOne === 1) {
      this.filterDepartamentos = new Array();
      this.filterProvincias = new Array();
    } else {
      this.filterDepartamentosLlegada = new Array();
      this.filterProvinciasLlegada = new Array();
    }
    this.ventaForm.get(provincia).reset();
    this.ventaForm.get(provincia).disable();
    if (r) {
      const testRegex = new RegExp('^' + r + '+[a-z ]*$', 'i');
      jsonCode.forEach((element) => {
        if (testRegex.test(element.departamento)) {
          if (witchOne === 1) {
            this.filterDepartamentos.push(element.departamento);
          } else {
            this.filterDepartamentosLlegada.push(element.departamento);
          }
        }
      });
    }
    if (this.ventaForm.get(departamento).valid) {
      this.ventaForm.get(provincia).enable();
    }
  }

  checkProvincia(
    r: string,
    provincia: string,
    departamento: string,
    distrito: string,
    witchOne: number
  ) {
    if (witchOne === 1) {
      this.filterProvincias = new Array();
      this.filterDistritos = new Array();
    } else {
      this.filterProvinciasLlegada = new Array();
      this.filterDistritosLlegada = new Array();
    }
    this.ventaForm.get(distrito).reset();
    this.ventaForm.get(distrito).disable();
    if (r) {
      const testRegex = new RegExp('^' + r + '+[a-z ]*$', 'i');
      const index = jsonCode.findIndex(
        (op) =>
          op.departamento ===
          this.ventaForm.get(departamento).value.toUpperCase()
      );
      this.indexProvincia = index;
      jsonCode[index].provincias.forEach((element) => {
        if (testRegex.test(element.provincia)) {
          if (witchOne === 1) {
            this.filterProvincias.push(element.provincia);
          } else {
            this.filterProvinciasLlegada.push(element.provincia);
          }
        }
      });
    }
    if (this.ventaForm.get(provincia).valid) {
      this.ventaForm.get(distrito).enable();
    }
  }

  checkDistrito(
    r: string,
    provincia: string,
    distrito: string,
    witchOne: number
  ) {
    if (witchOne === 1) {
      this.filterDistritos = new Array();
    } else {
      this.filterDistritosLlegada = new Array();
    }
    if (r) {
      const testRegex = new RegExp('^' + r + '+[a-z ]*$', 'i');
      const index = jsonCode[this.indexProvincia].provincias.findIndex(
        (op) =>
          op.provincia === this.ventaForm.get(provincia).value.toUpperCase()
      );
      jsonCode[this.indexProvincia].provincias[index].distritos.forEach(
        (element) => {
          if (testRegex.test(element.distrito)) {
            if (witchOne === 1) {
              this.filterDistritos.push(element.distrito);
            } else {
              this.filterDistritosLlegada.push(element.distrito);
            }
          }
        }
      );
    }
  }

  validateDepartamento(
    control: AbstractControl
  ): { [key: string]: any } | null {
    let match = 0;
    jsonCode.forEach((op) => {
      if (op.departamento === control.value.toUpperCase()) {
        match++;
      }
    });
    if (match >= 1) {
      return null;
    } else {
      return { valid: true };
    }
  }

  validateProvincia(departamento: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let match = 0;
      if (control.parent.get(departamento).valid) {
        const nIndex = jsonCode.findIndex(
          (op) =>
            op.departamento ===
            control.parent.get(departamento).value.toUpperCase()
        );
        jsonCode[nIndex].provincias.forEach((op) => {
          if (control.value) {
            if (op.provincia === control.value.toUpperCase()) {
              match++;
            }
          }
        });
      }

      if (match >= 1) {
        return null;
      } else {
        return { valid: true };
      }
    };
  }

  validateDistrito(departamento: string, provincia: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let match = 0;
      if (
        control.parent.get(departamento).valid &&
        control.parent.get(provincia).valid
      ) {
        const dIndex = jsonCode.findIndex(
          (op) =>
            op.departamento ===
            control.parent.get(departamento).value.toUpperCase()
        );
        const pIndex = jsonCode[dIndex].provincias.findIndex(
          (op) =>
            op.provincia === control.parent.get(provincia).value.toUpperCase()
        );
        jsonCode[dIndex].provincias[pIndex].distritos.forEach((op) => {
          if (control.value) {
            if (op.distrito === control.value.toUpperCase()) {
              match++;
            }
          }
        });
      }

      if (match >= 1) {
        return null;
      } else {
        return { valid: true };
      }
    };
  }

  addOrder(orderName: string, orderSecondName: string, cantidad: number) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control(
        { value: orderName, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
        ])
      ),
      nameSecond: this.formBuilder.control(
        { value: orderSecondName, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
        ])
      ),
      cantidadDisponible: this.formBuilder.control(
        { value: cantidad, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern('^-?[0-9][^.]*$'),
        ])
      ),
      cantidadVenta: this.formBuilder.control(
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern('^-?[0-9][^.]*$'),
          Validators.min(0),
        ])
      ),
    });

    this.cantidadList.push(fg);
  }

  activarGenerarGuiaForm() {
    this.generarGuia$.next(!this.generarGuia$.value);
  }

  actTotal() {
    this.sum = 0;
    if (
      this.ventaForm.get('cantidadVenta').value <= 0 ||
      this.item.cantidad - this.ventaForm.get('cantidadVenta').value < 0
    ) {
      this.ventaForm.get('cantidadVenta').setErrors({ incorrect: true });
    } else {
      const cantidad: number = this.ventaForm.get('cantidadVenta').value;
      const precio: number = this.ventaForm.get('priceIGV').value;
      this.sum = cantidad;
      this.totalPriceIGV = this.rebrandNumber(
        true,
        Math.round((precio * cantidad + Number.EPSILON) * 100) / 100
      ).replace('.', ',');
    }
  }

  resetSum() {
    this.sum = 0;
  }

  getNoIGVPrice(igvPrice: number) {
    const aproxNoIGV = igvPrice / 1.18;
    return Math.round((aproxNoIGV + Number.EPSILON) * 100) / 100;
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

  resetSome() {
    this.generarGuia$.next(false);
    this.ventaForm.get('documentoTipo').setValue('noone');
    this.ventaForm.get('metodoPagoOne').setValue('efectivo');
  }

  changeNumberOut() {
    const numberPre: number = this.ventaForm.get('priceIGV').value;
    const numberNoIGVpre: number = this.getNoIGVPrice(numberPre);
    const valid: boolean = this.ventaForm.get('priceIGV').valid;

    const nmConvertido = this.rebrandNumber(valid, numberPre);
    const nmNoIGVConvertido = this.rebrandNumber(valid, numberNoIGVpre);

    if (nmConvertido !== '') {
      this.ventaForm.get('priceIGV').setValue(nmConvertido);
      this.ventaForm.get('priceNoIGV').setValue(nmNoIGVConvertido);
      if (!this.item.subConteo) {
        this.actTotal();
      } else {
        this.sum = 0;
        // tslint:disable-next-line: prefer-for-of
        for (
          let yindex = 0;
          yindex < this.cantidadList.controls.length;
          yindex++
        ) {
          this.sum =
            this.sum + this.cantidadList.at(yindex).get('cantidadVenta').value;
        }
        const precio: number = this.ventaForm.get('priceIGV').value;
        this.totalPriceIGV = this.rebrandNumber(
          true,
          Math.round((this.sum * precio + Number.EPSILON) * 100) / 100
        ).replace('.', ',');
      }
    }
  }

  changeNumber() {
    const numberPre: number = this.ventaForm.get('priceIGV').value;
    const numberNoIGVpre: number = this.getNoIGVPrice(numberPre);
    const valid: boolean = this.ventaForm.get('priceIGV').valid;

    const nmConvertido = this.rebrandNumber(valid, numberPre);
    const nmNoIGVConvertido = this.rebrandNumber(valid, numberNoIGVpre);

    if (nmConvertido !== '') {
      this.ventaForm.get('priceNoIGV').setValue(nmNoIGVConvertido);
      if (!this.item.subConteo) {
        this.actTotal();
      } else {
        this.sum = 0;
        // tslint:disable-next-line: prefer-for-of
        for (
          let yindex = 0;
          yindex < this.cantidadList.controls.length;
          yindex++
        ) {
          this.sum =
            this.sum + this.cantidadList.at(yindex).get('cantidadVenta').value;
        }
        const precio: number = this.ventaForm.get('priceIGV').value;
        this.totalPriceIGV = this.rebrandNumber(
          true,
          Math.round((this.sum * precio + Number.EPSILON) * 100) / 100
        ).replace('.', ',');
      }
    }
  }

  changeValidators() {
    if (
      this.ventaForm.get('documentoTipo').value ===
      this.tiposDocumentos[1].value
    ) {
      this.ventaForm
        .get('docCod')
        .setValidators([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.required,
        ]);
      this.ventaForm.get('docCod').enable();
      this.ventaForm.get('nameDocumento').setValue('');
      this.ventaForm.get('docCod').reset();
    } else if (
      this.ventaForm.get('documentoTipo').value ===
      this.tiposDocumentos[2].value
    ) {
      this.ventaForm
        .get('docCod')
        .setValidators([
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.required,
        ]);
      this.ventaForm.get('docCod').enable();
      this.ventaForm.get('nameDocumento').setValue('');
      this.ventaForm.get('docCod').reset();
    } else {
      this.ventaForm.get('docCod').setValidators([]);
      this.ventaForm.get('docCod').disable();
      this.ventaForm.get('nameDocumento').setValue('');
      this.ventaForm.get('docCod').reset();
    }
  }

  comprobarDocV2(doc: string) {
    const docL = doc.length;
    if (docL === 8) {
      this.inventarioMNG.getDNI(doc).subscribe((res: DNI) => {
        if (res) {
          this.ventaForm.get('denomicaion_transportista').setValue(res.nombre);
        } else {
          this.ventaForm.get('denomicaion_transportista').setValue('');
          this.ventaForm
            .get('documento_transportista')
            .setErrors({ incorrect: true });
        }
      });
    } else if (docL === 11) {
      this.inventarioMNG.getRUC(doc).subscribe((res: RUC) => {
        if (res) {
          this.ventaForm
            .get('denomicaion_transportista')
            .setValue(res.nombre_o_razon_social);
        } else {
          this.ventaForm.get('denomicaion_transportista').setValue('');
          this.ventaForm
            .get('documento_transportista')
            .setErrors({ incorrect: true });
        }
      });
    }
  }

  comprobarDOC() {
    if (
      this.ventaForm.get('docCod').valid &&
      this.ventaForm.get('docCod').enabled
    ) {
      if (
        this.ventaForm.get('documentoTipo').value ===
        this.tiposDocumentos[1].value
      ) {
        this.inventarioMNG
          .getRUC(this.ventaForm.get('docCod').value)
          .subscribe((res: RUC) => {
            if (res) {
              this.ventaForm
                .get('nameDocumento')
                .setValue(res.nombre_o_razon_social);
              this.documentoFullInfo.next(res);
              this.documentAccepted.next(true);
            } else {
              this.ventaForm.get('nameDocumento').setValue('');
              this.documentoFullInfo.next(null);
              this.ventaForm.get('docCod').setErrors({ incorrect: true });
              this.documentAccepted.next(false);
            }
          });
      } else {
        this.inventarioMNG
          .getDNI(this.ventaForm.get('docCod').value)
          .subscribe((res: DNI) => {
            if (res) {
              this.documentoFullInfo.next(res);
              this.ventaForm.get('nameDocumento').setValue(res.nombre);
              this.documentAccepted.next(true);
            } else {
              this.documentoFullInfo.next(null);
              this.ventaForm.get('nameDocumento').setValue('');
              this.ventaForm.get('docCod').setErrors({ incorrect: true });
              this.documentAccepted.next(false);
            }
          });
      }
    } else {
      this.documentAccepted.next(false);
    }
  }

  changePrice() {
    if (this.disabled.value) {
      this.disabled.next(false);
      this.ventaForm.get('priceIGV').enable();
    } else {
      this.disabled.next(true);
      this.ventaForm.get('priceIGV').disable();
    }
  }

  crearNewVentaBody(preVentaInfo: PreVentaSimpleInfo) {
    let cSC: any[];
    if (this.item.subConteo) {
      cSC = preVentaInfo.cantidadList;
    } else {
      cSC = [];
    }
    const total = parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round((total / 1.18 + Number.EPSILON) * 100) / 100;
    const itemVendido: ItemVendido = {
      codigo: this.item.codigo,
      name: this.item.name,
      priceIGV: preVentaInfo.priceIGV,
      priceNoIGV: preVentaInfo.priceNoIGV,
      descripcion: this.item.description,
      priceCosto: preVentaInfo.costoPropio,
      cantidadSC: cSC,
      cantidad: preVentaInfo.cantidadVenta,
      totalPrice: total,
      totalPriceNoIGV: totalNoIGV,
    };
    if (this.item.subConteo) {
      itemVendido.cantidad = this.sum;
    }
    const bodyToSend: Venta = {
      documento: {
        type: 'noone',
        name: '',
        codigo: null,
        direccion: '',
      },
      codigo: '',
      totalPrice: total,
      totalPriceNoIGV: totalNoIGV,
      estado: 'pendiente',
      itemsVendidos: [itemVendido],
      vendedor: this.auth.getUser(),
      tipoVendedor: this.auth.getTtype(),
      cliente_email: '',
      medio_de_pago: '',
    };

    this.ventaEnCurso.next(true);

    return bodyToSend;
  }

  ventaCMN(preVentaInfo: PreVentaSimpleInfo, estado: string) {
    let cSC: any[];
    if (this.item.subConteo) {
      cSC = preVentaInfo.cantidadList;
    } else {
      cSC = [];
    }
    const total = parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round((total / 1.18 + Number.EPSILON) * 100) / 100;
    const itemVendido: ItemVendido = {
      codigo: this.item.codigo,
      name: this.item.name,
      priceIGV: preVentaInfo.priceIGV,
      priceNoIGV: preVentaInfo.priceNoIGV,
      descripcion: this.item.description,
      priceCosto: preVentaInfo.costoPropio,
      cantidadSC: cSC,
      cantidad: preVentaInfo.cantidadVenta,
      totalPrice: total,
      totalPriceNoIGV: totalNoIGV,
    };
    if (this.item.subConteo) {
      itemVendido.cantidad = this.sum;
    }
    const bodyToSend: Venta = {
      documento: {
        type: preVentaInfo.documentoTipo,
        name: preVentaInfo.nameDocumento,
        codigo: preVentaInfo.docCod,
        direccion: this.documentoFullInfo.value.direccion || '',
      },
      codigo: '',
      totalPrice: total,
      guia: false,
      totalPriceNoIGV: totalNoIGV,
      estado,
      itemsVendidos: [itemVendido],
      vendedor: this.auth.getUser(),
      tipoVendedor: this.auth.getTtype(),
      cliente_email: preVentaInfo.clienteEmail || '',
      medio_de_pago:
        preVentaInfo.metodoPagoOne + '|' + (preVentaInfo.metodoPagoTwo || ' '),
    };

    if (this.generarGuia$.value) {
      bodyToSend.guia = true;
      bodyToSend.peso = preVentaInfo.peso;
      bodyToSend.transportista_placa = preVentaInfo.placa_transportista;
      bodyToSend.transportista_codigo = preVentaInfo.documento_transportista;
      bodyToSend.transportista_nombre = preVentaInfo.denomicaion_transportista;
      bodyToSend.llegada_ubigeo = this.getUbigeo(
        preVentaInfo.departamento_llegada,
        preVentaInfo.provincia_llegada,
        preVentaInfo.distrito_llegada
      );
      bodyToSend.partida_ubigeo = this.getUbigeo(
        preVentaInfo.departamento,
        preVentaInfo.provincia,
        preVentaInfo.distrito
      );
      bodyToSend.llegada_direccion = preVentaInfo.direccion_llegada;
      bodyToSend.partida_direccion = preVentaInfo.direccion_partida;
      bodyToSend.bultos = itemVendido.cantidad;
    }

    this.ventaEnCurso.next(true);

    return bodyToSend;
  }

  getUbigeo(departamento: string, provincia: string, distrito: string): string {
    const indexD = jsonCode.findIndex(
      (res) => res.departamento === departamento
    );
    const indexP = jsonCode[indexD].provincias.findIndex(
      (res) => res.provincia === provincia
    );
    const distritoGet = jsonCode[indexD].provincias[indexP].distritos.find(
      (res) => res.distrito === distrito
    );
    return distritoGet.codigo;
  }

  ventaSimple(preVentaInfo: PreVentaSimpleInfo) {
    this.ventaForm.disable();

    const bodyToSend = this.ventaCMN(preVentaInfo, 'ejecutada');

    this.inventarioMNG
      .generarVentaSimple({ venta: bodyToSend })
      .subscribe((res) => {
        this.ventaEnCurso.next(false);
        if (res.message.split('||')[0] === 'Succes') {
          this.dialogRef.close();
          this.router.navigateByUrl(
            `/ventas/postVenta/${res.message.split('||')[1]}`
          );
        } else if (res.message === 'La Cantidad Ha Cambiado') {
          alert(
            'Ya no disponemos con la cantidad necesaria para realizar la venta'
          );
        } else {
          alert('Error al procesar la venta intentelo de nuevo en un momento!');
        }
        this.ventaForm.enable();
      });
  }

  generarNuevaVenta(preVentaInfo: PreVentaSimpleInfo) {
    this.ventaForm.disable();
    const bodyToSend = this.crearNewVentaBody(preVentaInfo);
    this.inventarioMNG
      .generarVentaNueva({ venta: bodyToSend })
      .subscribe((res) => {
        this.ventaEnCurso.next(false);
        if (res) {
          if (res.venta) {
            this.dialogRef.close({
              message: `SuccesAG ${res.venta.codigo}`,
              venta: res.venta,
            });
          } else {
            alert(res.message);
            this.dialogRef.close({ message: 'notVentaG', venta: null });
          }
        } else {
          alert('Error desconocido, intenta denuevo en un momento.');
          this.ventaForm.enable();
        }
      });
  }

  agregarItemVenta(preVentaInfo: PreVentaSimpleInfo) {
    this.ventaForm.disable();
    const total = parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round((total / 1.18 + Number.EPSILON) * 100) / 100;
    const bodyToSend: ItemVendido = {
      codigo: this.item.codigo,
      name: this.item.name,
      priceIGV: preVentaInfo.priceIGV,
      priceNoIGV: preVentaInfo.priceNoIGV,
      cantidad: preVentaInfo.cantidadVenta,
      cantidadSC: preVentaInfo.cantidadList,
      totalPrice: total,
      priceCosto: preVentaInfo.costoPropio,
      totalPriceNoIGV: totalNoIGV,
      descripcion: this.item.description,
    };

    if (this.item.subConteo) {
      bodyToSend.cantidad = this.sum;
    } else {
      bodyToSend.cantidadSC = [];
    }
    this.ventaEnCurso.next(true);
    this.inventarioMNG
      .agregarItemVenta(bodyToSend, this.ventaForm.get('selectAcction').value)
      .subscribe((res) => {
        this.ventaEnCurso.next(false);
        if (res) {
          this.dialogRef.close({
            item: this.item,
            message: `succesAI|${res.message}`,
          });
        } else {
          alert('Ocurrio un error desconocido.');
          this.dialogRef.close({ item: this.item, message: 'error' });
        }
        this.ventaForm.enable();
      });
  }

  actTotalForSubConteo(index: number) {
    const listRequired = this.cantidadList.at(index);
    this.sum = 0;
    if (
      listRequired.get('cantidadDisponible').value -
        listRequired.get('cantidadVenta').value <
        0 ||
      listRequired.get('cantidadVenta').value < 0 ||
      listRequired.get('cantidadVenta').value === null
    ) {
      this.cantidadList
        .at(index)
        .get('cantidadVenta')
        .setErrors({ incorrect: true });
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (
        let yindex = 0;
        yindex < this.cantidadList.controls.length;
        yindex++
      ) {
        this.sum =
          this.sum + this.cantidadList.at(yindex).get('cantidadVenta').value;
      }
      const precio: number = this.ventaForm.get('priceIGV').value;
      this.totalPriceIGV = this.rebrandNumber(
        true,
        Math.round((this.sum * precio + Number.EPSILON) * 100) / 100
      ).replace('.', ',');
    }
  }
}
