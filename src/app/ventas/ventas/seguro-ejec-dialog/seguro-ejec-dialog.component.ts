import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Venta, InventarioManagerService, RUC, DNI, Item } from 'src/app/inventario-manager.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import jsonCode from '../../../../assets/sunatCodes.json';


interface TipoDoc {
  value: string;
  viewValue: string;
}

interface MetodoPago {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-seguro-ejec-dialog',
  templateUrl: './seguro-ejec-dialog.component.html',
  styleUrls: ['./seguro-ejec-dialog.component.css']
})
export class SeguroEjecDialogComponent implements OnInit, OnDestroy {

  generarGuia$ = new BehaviorSubject<boolean>(false);

  ventaEjecutarForm: FormGroup;
  ventaEnCurso = new BehaviorSubject<boolean>(false);
  documentAccepted = new BehaviorSubject<boolean>(false);

  tiposDocumentos: TipoDoc[] = [
    {value: 'noone', viewValue: 'Sin Documento'},
    {value: 'factura', viewValue: 'Factura'},
    {value: 'boleta', viewValue: 'Boleta'},
  ];

  metodosDePago: MetodoPago[] = [
    {value: 'efectivo', viewValue: 'Efectivo'},
    {value: 'tarjeta', viewValue: 'Tarjeta'},
    {value: 'yape', viewValue: 'Yape'},
    {value: 'otro', viewValue: 'Otro'}
  ];

  currentMetodoPago = this.metodosDePago[0].value;
  currentDocumentType = this.tiposDocumentos[0].value;

  documentoFullInfo = new BehaviorSubject<any>(false);

  subOne: Subscription;

  filterDepartamentos: Array<any>;
  filterProvincias: Array<any>;
  filterDistritos: Array<any>;

  filterDepartamentosLlegada: Array<any>;
  filterProvinciasLlegada: Array<any>;
  filterDistritosLlegada: Array<any>;

  indexProvincia = 0;

  subI: Subscription;
  subII: Subscription;
  subIII: Subscription;
  subIV: Subscription;
  subV: Subscription;
  subVI: Subscription;

  constructor(public dialogRef: MatDialogRef<SeguroEjecDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public venta: Venta,
              private inventarioMNG: InventarioManagerService,
              private router: Router, private fb: FormBuilder) { }

  ngOnDestroy(): void {
    this.subOne.unsubscribe();
  }

  ngOnInit(): void {
    this.ventaEjecutarForm = this.fb.group({
      documentoTipo: this.fb.control(this.venta.documento.type || 'noone',  Validators.compose([
        Validators.required
      ]))
      ,
      docCod: this.fb.control({ value: this.venta.documento.codigo || '' , disabled: true },  Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ])),
      nameDocumento: this.fb.control({ value: this.venta.documento.name || ''  , disabled: true },  Validators.compose([
        Validators.required,
      ])),
      metodoPagoOne: this.fb.control(this.venta.medio_de_pago.split('|')[0] || 'efectivo', Validators.required),
      metodoPagoTwo: this.fb.control({ value: this.venta.medio_de_pago.split('|')[1] || '' , disabled: true }, Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.,_#\s]+$/),
        Validators.minLength(2)
      ])),
      clienteEmail: this.fb.control(this.venta.cliente_email || '', Validators.compose([
        Validators.email
      ])),

      direccionExtra: this.fb.control({ value: '', disabled: false }, Validators.compose([
        Validators.pattern(/^[a-zA-Z0-9.,_#\s\-]+$/)
      ])),
       ///////////////////////////////////////////////////////////
        ///
        peso: this.fb.control({value: '', disabled: true},  Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0.01)
        ])),
        ///
        documento_transportista: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]{8}$|^[0-9]{11}$/g),
        ])),
        ///
        placa_transportista: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9a-zA-Z_-]{3,}$/),
        ])),
        ///
        denomicaion_transportista: this.fb.control({ value: '', disabled: true }),
        //
        departamento: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          this.validateDepartamento
        ])),
        provincia: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          this.validateProvincia('departamento')
        ])),
        distrito: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          this.validateDistrito('departamento', 'provincia')
        ])),
        ///
        direccion_partida: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,_#\s\-]+$/)
        ])),
        ///
        departamento_llegada: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          this.validateDepartamento
        ])),
        provincia_llegada: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          this.validateProvincia('departamento_llegada')
        ])),
        distrito_llegada: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          this.validateDistrito('departamento_llegada', 'provincia_llegada')
        ])),
        ///
        direccion_llegada: this.fb.control({ value: '', disabled: true }, Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,_#\s\-]+$/)
        ]))
    });
    if (this.venta.documento.type !== 'noone') {
      this.ventaEjecutarForm.get('docCod').enable();
      this.documentAccepted.next(true);
    }

    this.subOne = this.ventaEjecutarForm.get('metodoPagoOne').valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
      this.ventaEjecutarForm.get('metodoPagoTwo').reset();
      if (res === 'efectivo') {
        this.ventaEjecutarForm.get('metodoPagoTwo').disable();
      } else {
        this.ventaEjecutarForm.get('metodoPagoTwo').enable();
      }
    });

    this.ventaEjecutarForm.get('documento_transportista').valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      if (this.ventaEjecutarForm.get('documento_transportista').valid) {
        this.comprobarDocV2(value);
      } else {
        this.ventaEjecutarForm.get('denomicaion_transportista').reset();
      }
    });

    this.generarGuia$.pipe(distinctUntilChanged()).subscribe(generar => {
      if (generar) {
        this.ventaEjecutarForm.get('peso').enable();
        this.ventaEjecutarForm.get('documento_transportista').enable();
        this.ventaEjecutarForm.get('placa_transportista').enable();
        this.ventaEjecutarForm.get('departamento').enable();
        this.ventaEjecutarForm.get('direccion_partida').enable();
        this.ventaEjecutarForm.get('departamento_llegada').enable();
        this.ventaEjecutarForm.get('direccion_llegada').enable();
      } else {
        this.ventaEjecutarForm.get('peso').disable();
        this.ventaEjecutarForm.get('documento_transportista').disable();
        this.ventaEjecutarForm.get('placa_transportista').disable();
        this.ventaEjecutarForm.get('departamento').disable();
        this.ventaEjecutarForm.get('direccion_partida').disable();
        this.ventaEjecutarForm.get('departamento_llegada').disable();
        this.ventaEjecutarForm.get('direccion_llegada').disable();
      }
    });

    this.subI = this.ventaEjecutarForm.get('departamento').valueChanges.pipe(distinctUntilChanged()).subscribe( (r: string) => {
      this.checkDepartamento(r, 'provincia', 'departamento', 1);
    });


    this.subII = this.ventaEjecutarForm.get('provincia').valueChanges.pipe(distinctUntilChanged()).subscribe( (r: string) => {
      this.checkProvincia(r, 'provincia', 'departamento', 'distrito', 1);
    });

    this.subIII = this.ventaEjecutarForm.get('distrito').valueChanges.pipe(distinctUntilChanged()).subscribe((r: string) => {
      this.checkDistrito(r, 'provincia', 'distrito', 1);
    });

    this.subIV = this.ventaEjecutarForm.get('departamento_llegada').valueChanges.pipe(distinctUntilChanged()).subscribe( (r: string) => {
      this.checkDepartamento(r, 'provincia_llegada', 'departamento_llegada', 2);
    });

    this.subV = this.ventaEjecutarForm.get('provincia_llegada').valueChanges.pipe(distinctUntilChanged()).subscribe( (r: string) => {
      this.checkProvincia(r, 'provincia_llegada', 'departamento_llegada', 'distrito_llegada', 2);
    });

    this.subVI = this.ventaEjecutarForm.get('distrito_llegada').valueChanges.pipe(distinctUntilChanged()).subscribe((r: string) => {
      this.checkDistrito(r, 'provincia_llegada', 'distrito_llegada', 2);
    });
  }

  checkDepartamento(r: string, provincia: string, departamento: string, witchOne: number) {
    if (witchOne === 1) {
      this.filterDepartamentos = new Array();
      this.filterProvincias = new Array();
    } else {
      this.filterDepartamentosLlegada = new Array();
      this.filterProvinciasLlegada = new Array();
    }
    this.ventaEjecutarForm.get(provincia).reset();
    this.ventaEjecutarForm.get(provincia).disable();
    if (r) {
      const testRegex = new RegExp('^' + r + '+[a-z ]*$', 'i');
      jsonCode.forEach(element => {
        if (testRegex.test(element.departamento)) {
          if (witchOne === 1) {
            this.filterDepartamentos.push(element.departamento);
          } else {
            this.filterDepartamentosLlegada.push(element.departamento);
          }
        }
      });
    }
    if (this.ventaEjecutarForm.get(departamento).valid) {
        this.ventaEjecutarForm.get(provincia).enable();
    }
  }

  checkProvincia(r: string, provincia: string, departamento: string, distrito: string, witchOne: number) {
    if (witchOne === 1) {
      this.filterProvincias = new Array();
      this.filterDistritos = new Array();
    } else {
      this.filterProvinciasLlegada = new Array();
      this.filterDistritosLlegada = new Array();
    }
    this.ventaEjecutarForm.get(distrito).reset();
    this.ventaEjecutarForm.get(distrito).disable();
    if (r) {
      const testRegex = new RegExp('^' + r + '+[a-z ]*$', 'i');
      const index = jsonCode.findIndex(op => op.departamento === this.ventaEjecutarForm.get(departamento).value.toUpperCase());
      this.indexProvincia = index;
      jsonCode[index].provincias.forEach(element => {
        if (testRegex.test(element.provincia)) {
          if (witchOne === 1) {
            this.filterProvincias.push(element.provincia);
          } else {
            this.filterProvinciasLlegada.push(element.provincia);
          }
        }
      });
    }
    if (this.ventaEjecutarForm.get(provincia).valid) {
      this.ventaEjecutarForm.get(distrito).enable();
    }
  }

  checkDistrito(r: string, provincia: string, distrito: string, witchOne: number) {
    if (witchOne === 1) {
      this.filterDistritos = new Array();
    } else {
      this.filterDistritosLlegada = new Array();
    }
    if (r) {
      const testRegex = new RegExp('^' + r + '+[a-z ]*$', 'i');
      const index = jsonCode[this.indexProvincia].provincias
      .findIndex(op => op.provincia === this.ventaEjecutarForm.get(provincia).value.toUpperCase());
      jsonCode[this.indexProvincia].provincias[index].distritos.forEach(element => {
        if (testRegex.test(element.distrito)) {
          if (witchOne === 1) {
            this.filterDistritos.push(element.distrito);
          } else {
            this.filterDistritosLlegada.push(element.distrito);
          }
        }
      });
    }
  }

  validateDepartamento(control: AbstractControl): {[key: string]: any} | null {
    let match = 0;
    jsonCode.forEach(op => {
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
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      let match = 0;
      if (control.parent.get(departamento).valid) {
          const nIndex = jsonCode.findIndex(op => op.departamento === control.parent.get(departamento).value.toUpperCase());
          jsonCode[nIndex].provincias.forEach(op => {
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
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      let match = 0;
      if (control.parent.get(departamento).valid && control.parent.get(provincia).valid) {
          const dIndex = jsonCode.findIndex(op => op.departamento === control.parent.get(departamento).value.toUpperCase());
          const pIndex = jsonCode[dIndex].provincias
          .findIndex(op => op.provincia === control.parent.get(provincia).value.toUpperCase());
          jsonCode[dIndex].provincias[pIndex].distritos.forEach(op => {
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


  ejecutarVenta(ventaEjeInfo: {documentoTipo: string, docCod: number,
    nameDocumento: string, metodoPagoOne: string, metodoPagoTwo: string, clienteEmail: string,
    peso: number, placa_transportista: string, documento_transportista: string, denomicaion_transportista: string,
    departamento_llegada: string, provincia_llegada: string, distrito_llegada: string, departamento: string
    provincia: string, distrito: string, direccion_llegada: string, direccion_partida: string, direccionExtra: string }) {
    this.venta.documento.codigo = ventaEjeInfo.docCod || undefined;
    this.venta.documento.direccion = ventaEjeInfo.direccionExtra || undefined;
    this.venta.documento.name =  ventaEjeInfo.nameDocumento || undefined;
    this.venta.documento.type = ventaEjeInfo.documentoTipo;
    this.venta.medio_de_pago = ventaEjeInfo.metodoPagoOne + '|' + (ventaEjeInfo.metodoPagoTwo || ' ');
    this.venta.cliente_email = ventaEjeInfo.clienteEmail || undefined;
    this.venta.estado = 'ejecutada';
    this.venta.guia = false;
    if (this.generarGuia$.value) {
      this.venta.guia = true;
      this.venta.peso = ventaEjeInfo.peso;
      this.venta.transportista_placa = ventaEjeInfo.placa_transportista;
      this.venta.transportista_codigo = ventaEjeInfo.documento_transportista;
      this.venta.transportista_nombre = ventaEjeInfo.denomicaion_transportista;
      this.venta.llegada_ubigeo =
      this.getUbigeo(ventaEjeInfo.departamento_llegada, ventaEjeInfo.provincia_llegada, ventaEjeInfo.distrito_llegada);
      this.venta.partida_ubigeo =
      this.getUbigeo(ventaEjeInfo.departamento, ventaEjeInfo.provincia, ventaEjeInfo.distrito);
      this.venta.llegada_direccion = ventaEjeInfo.direccion_llegada;
      this.venta.partida_direccion = ventaEjeInfo.direccion_partida;
      let cantidadTotal = 0;
      this.venta.itemsVendidos.forEach(item => {
        cantidadTotal += item.cantidad;
      });
      this.venta.bultos = cantidadTotal;
    }
    this.ventaEnCurso.next(true);
    this.inventarioMNG.ejecutarVenta(this.venta).subscribe((res) => {
      this.ventaEnCurso.next(false);
      if (res) {
        if (res.message.split('||')[0] === 'Succes') {
          this.router.navigateByUrl(`/ventas/postVenta/${res.message.split('||')[1]}`);
          this.dialogRef.close();
        } else{
          alert('Ya no se dispone con las cantidades suficientes para realizar esta venta.');
          this.dialogRef.close();
        }

      } else {
        alert('Ocurrio un error, intente denuevo en un momento.');
        this.dialogRef.close();
      }
    });
  }

  getUbigeo(departamento: string, provincia: string, distrito: string): string {
    const indexD = jsonCode.findIndex(res => res.departamento === departamento);
    const indexP = jsonCode[indexD].provincias.findIndex(res => res.provincia === provincia);
    const distritoGet = jsonCode[indexD].provincias[indexP].distritos.find(res => res.distrito === distrito);
    return distritoGet.codigo;
  }

  changeValidators() {
    if (this.ventaEjecutarForm.get('documentoTipo').value === this.tiposDocumentos[1].value) {
      this.ventaEjecutarForm.get('docCod').setValidators([Validators.minLength(11), Validators.maxLength(11), Validators.required]);
      this.ventaEjecutarForm.get('docCod').enable();
      this.ventaEjecutarForm.get('nameDocumento').setValue('');
      this.ventaEjecutarForm.get('docCod').reset();
    }
    else if (this.ventaEjecutarForm.get('documentoTipo').value === this.tiposDocumentos[2].value) {
      this.ventaEjecutarForm.get('docCod').setValidators([Validators.minLength(8), Validators.maxLength(8), Validators.required]);
      this.ventaEjecutarForm.get('docCod').enable();
      this.ventaEjecutarForm.get('nameDocumento').setValue('');
      this.ventaEjecutarForm.get('docCod').reset();
    }
    else {
      this.ventaEjecutarForm.get('docCod').setValidators([]);
      this.ventaEjecutarForm.get('docCod').disable();
      this.ventaEjecutarForm.get('nameDocumento').setValue('');
      this.ventaEjecutarForm.get('docCod').reset();
    }
  }

  comprobarDOC() {
    if (this.ventaEjecutarForm.get('docCod').valid && this.ventaEjecutarForm.get('docCod').enabled) {
      if (this.ventaEjecutarForm.get('documentoTipo').value === this.tiposDocumentos[1].value) {
        this.inventarioMNG.getRUC(this.ventaEjecutarForm.get('docCod').value).subscribe((res: any) => {
          if (res) {
            this.ventaEjecutarForm.get('nameDocumento').setValue(res.nombre_o_razon_social);
            this.ventaEjecutarForm.get('direccionExtra').setValue(res.direccion);
            this.documentoFullInfo.next(res);
            this.documentAccepted.next(true);
          }
          else {
            this.ventaEjecutarForm.get('nameDocumento').setValue('');
            this.ventaEjecutarForm.get('direccionExtra').setValue('');
            this.documentoFullInfo.next(null);
            this.ventaEjecutarForm.get('docCod').setErrors({incorrect: true});
          }
        });
      } else {
        this.inventarioMNG.getDNI(this.ventaEjecutarForm.get('docCod').value).subscribe((res: DNI) => {
          if (res) {
            this.documentoFullInfo.next(res);
            this.ventaEjecutarForm.get('nameDocumento').setValue(res.nombre);
            this.documentAccepted.next(true);
          }
          else {
            this.documentoFullInfo.next(null);
            this.ventaEjecutarForm.get('nameDocumento').setValue('');
            this.ventaEjecutarForm.get('docCod').setErrors({incorrect: true});
          }
        });
      }
    } else {
      this.documentAccepted.next(false);
    }
  }

  activarGenerarGuiaForm() {
    this.generarGuia$.next(!this.generarGuia$.value);
  }

  comprobarDocV2(doc: string) {
    const docL = doc.length;
    if (docL === 8) {
      this.inventarioMNG.getDNI(doc).subscribe((res: DNI) => {
        if (res) {
          this.ventaEjecutarForm.get('denomicaion_transportista').setValue(res.nombre);
        }
        else {
          this.ventaEjecutarForm.get('denomicaion_transportista').setValue('');
          this.ventaEjecutarForm.get('documento_transportista').setErrors({incorrect: true});
        }
      });
    } else if (docL === 11) {
      this.inventarioMNG.getRUC(doc).subscribe((res: RUC) => {
        if (res) {
          this.ventaEjecutarForm.get('denomicaion_transportista').setValue(res.nombre_o_razon_social);
        }
        else {
          this.ventaEjecutarForm.get('denomicaion_transportista').setValue('');
          this.ventaEjecutarForm.get('documento_transportista').setErrors({incorrect: true});
        }
      });
    }
  }

}
