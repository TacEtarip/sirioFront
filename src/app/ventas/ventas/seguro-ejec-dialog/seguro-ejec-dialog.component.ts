import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Venta, InventarioManagerService, RUC, DNI } from 'src/app/inventario-manager.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';


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

  currentDocumentType = this.tiposDocumentos[0].value;
  currentMetodoPago = this.metodosDePago[0].value;

  documentoFullInfo = new BehaviorSubject<any>(false);

  subOne: Subscription;


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
      ]))
    });
    if (this.venta.documento.type !== 'noone') {
      this.ventaEjecutarForm.get('docCod').enable();
      this.documentAccepted.next(true);
    }
    if (this.venta.medio_de_pago.split('|')[0] !== 'efectivo') {
      this.ventaEjecutarForm.get('metodoPagoTwo').enable();
    }
    this.subOne = this.ventaEjecutarForm.get('metodoPagoOne').valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
      this.ventaEjecutarForm.get('metodoPagoTwo').reset();
      if (res === 'efectivo') {
        this.ventaEjecutarForm.get('metodoPagoTwo').disable();
      } else {
        this.ventaEjecutarForm.get('metodoPagoTwo').enable();
      }
    });
  }


  ejecutarVenta(ventaEjeInfo: {documentoTipo: string, docCod: number,
    nameDocumento: string, metodoPagoOne: string, metodoPagoTwo: string, clienteEmail: string}) {
    this.venta.documento.codigo = ventaEjeInfo.docCod || undefined;
    this.venta.documento.direccion = this.documentoFullInfo.value.direccion || undefined;
    this.venta.documento.name =  ventaEjeInfo.nameDocumento || undefined;
    this.venta.documento.type = ventaEjeInfo.documentoTipo;
    this.venta.medio_de_pago = ventaEjeInfo.metodoPagoOne + '|' + (ventaEjeInfo.metodoPagoTwo || ' ');
    this.venta.cliente_email = ventaEjeInfo.clienteEmail || undefined;
    this.venta.estado = 'ejecutada';
    this.ventaEnCurso.next(true);
    this.inventarioMNG.ejecutarVenta(this.venta).subscribe((res) => {
      this.ventaEnCurso.next(false);
      if (res) {
        console.log(res);
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
        this.inventarioMNG.getRUC(this.ventaEjecutarForm.get('docCod').value).subscribe((res: RUC) => {
          if (res) {
            this.ventaEjecutarForm.get('nameDocumento').setValue(res.nombre_o_razon_social);
            this.documentoFullInfo.next(res);
            this.documentAccepted.next(true);
          }
          else {
            this.ventaEjecutarForm.get('nameDocumento').setValue('');
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
}
