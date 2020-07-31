import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Item, InventarioManagerService, Venta, ItemVendido, Documento, Order, DNI, RUC } from '../../../inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


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

interface CantidadSubConteo {
  name: string;
  nameSecond: string;
  cantidadDisponible: number;
  cantidadVenta: number;
}

interface PreVentaSimpleInfo {
  selectAcction: string;
  priceNoIGV: number;
  documentoTipo: string;
  docCod: number;
  cantidadVenta: number;
  cantidadDisponible: number;
  nameDocumento: string;
  priceIGV: number;
  cantidadList: CantidadSubConteo[];
}

@Component({
  selector: 'app-venta-dialog',
  templateUrl: './venta-dialog.component.html',
  styleUrls: ['./venta-dialog.component.css']
})
export class VentaDialogComponent implements OnInit {

  ventasActivas: Venta[];

  ventaForm: FormGroup;

  cantidadList: FormArray;

  ventaEnCurso = new BehaviorSubject<boolean>(false);

  disabled = new BehaviorSubject<boolean>(true);

  documentAccepted = new BehaviorSubject<boolean>(false);

  sum = 0;

  tiposDocumentos: TipoDoc[] = [
    {value: 'noone', viewValue: 'Sin Documento'},
    {value: 'factura', viewValue: 'Factura'},
    {value: 'boleta', viewValue: 'Boleta'},
  ];

  currentDocumentType = this.tiposDocumentos[0].value;
  totalPriceIGV: string;

  constructor(
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item,
    private formBuilder: FormBuilder,
    private inventarioMNG: InventarioManagerService,
    private router: Router) { }

  ngOnInit(): void {
      this.inventarioMNG.getVentasActivas().subscribe((res: Venta[]) => {
        this.ventasActivas = res;
      });
      this.ventaForm = this.formBuilder.group({
        selectAcction: this.formBuilder.control('',  Validators.compose([
          Validators.required
        ])),
        priceIGV: this.formBuilder.control({value: this.rebrandNumber(true, this.item.priceIGV) , disabled: true},  Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*\.?\d{0,2}$/)
        ])),
        priceNoIGV: this.formBuilder.control({value: this.item.priceNoIGV, disabled: true}),
        documentoTipo: this.formBuilder.control(this.tiposDocumentos[0].value,  Validators.compose([
          Validators.required
        ]))
        ,
        docCod: this.formBuilder.control({value: '' , disabled: true},  Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(11),
          Validators.maxLength(11)
        ])),
        nameDocumento: this.formBuilder.control({value: '' , disabled: true},  Validators.compose([
          Validators.required,
        ]))
      }
      );
      if (!this.item.subConteo) {
        this.ventaForm.addControl('cantidadDisponible',  this.formBuilder.control({value: this.item.cantidad, disabled: true},
          Validators.compose([
          Validators.required,
          Validators.pattern('^-?[0-9][^\.]*$'),
          Validators.minLength(1)
        ])));
        this.ventaForm.addControl('cantidadVenta',  this.formBuilder.control('',  Validators.compose([
          Validators.required,
          Validators.pattern('^-?[0-9][^\.]*$'),
          Validators.min(1)
        ])));
      } else {
        this.ventaForm.addControl('cantidadList', this.formBuilder.array([]));
        this.cantidadList = this.ventaForm.get('cantidadList') as FormArray;
        this.item.subConteo.order.forEach((order: Order) => {
          if (order.cantidad > 0) {
            this.addOrder(order.name, order.nameSecond, order.cantidad);
          }
        });
      }

    // this.totalPriceIGV = this.rebrandNumber(true, Math.round(((this.item.priceIGV * 1) + Number.EPSILON) * 100) / 100).replace('.', ',');
  }

  addOrder(orderName: string, orderSecondName: string, cantidad: number) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control({value: orderName, disabled: true}, Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.formBuilder.control({value: orderSecondName, disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidadDisponible: this.formBuilder.control({value: cantidad, disabled: true}, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
      ])),
      cantidadVenta: this.formBuilder.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });

    this.cantidadList.push(fg);
  }

  actTotal() {
    this.sum = 0;
    if (this.ventaForm.get('cantidadVenta').value <= 0 || (this.item.cantidad - this.ventaForm.get('cantidadVenta').value) < 0) {
      this.ventaForm.get('cantidadVenta').setErrors({incorrect: true});
    }
    else {
      const cantidad: number = this.ventaForm.get('cantidadVenta').value;
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

  changeNumber(){
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
        for (let yindex = 0; yindex < this.cantidadList.controls.length; yindex++) {
        this.sum = this.sum + this.cantidadList.at(yindex).get('cantidadVenta').value;
    }
        const precio: number = this.ventaForm.get('priceIGV').value;
        this.totalPriceIGV = this.rebrandNumber(true, Math.round(((this.sum * precio) + Number.EPSILON) * 100) / 100).replace('.', ',');
      }
    }
  }

  changeValidators() {
    if (this.ventaForm.get('documentoTipo').value === this.tiposDocumentos[1].value) {
      this.ventaForm.get('docCod').setValidators([Validators.minLength(11), Validators.maxLength(11), Validators.required]);
      this.ventaForm.get('docCod').enable();
      this.ventaForm.get('nameDocumento').setValue('');
      this.ventaForm.get('docCod').reset();
    }
    else if (this.ventaForm.get('documentoTipo').value === this.tiposDocumentos[2].value) {
      this.ventaForm.get('docCod').setValidators([Validators.minLength(8), Validators.maxLength(8), Validators.required]);
      this.ventaForm.get('docCod').enable();
      this.ventaForm.get('nameDocumento').setValue('');
      this.ventaForm.get('docCod').reset();
    }
    else {
      this.ventaForm.get('docCod').setValidators([]);
      this.ventaForm.get('docCod').disable();
      this.ventaForm.get('nameDocumento').setValue('');
      this.ventaForm.get('docCod').reset();
    }
  }

  comprobarDOC() {
    if (this.ventaForm.get('docCod').valid && this.ventaForm.get('docCod').enabled) {
      if (this.ventaForm.get('documentoTipo').value === this.tiposDocumentos[1].value) {
        this.inventarioMNG.getRUC(this.ventaForm.get('docCod').value).subscribe((res: RUC) => {
          if (res) {
            this.ventaForm.get('nameDocumento').setValue(res.nombre_o_razon_social);
            this.documentAccepted.next(true);
          }
          else {
            this.ventaForm.get('nameDocumento').setValue('');
            this.ventaForm.get('docCod').setErrors({incorrect: true});
          }
        });
      } else {
        this.inventarioMNG.getDNI(this.ventaForm.get('docCod').value).subscribe((res: DNI) => {
          if (res) {
            this.ventaForm.get('nameDocumento').setValue(res.nombre);
            this.documentAccepted.next(true);
          }
          else {
            this.ventaForm.get('nameDocumento').setValue('');
            this.ventaForm.get('docCod').setErrors({incorrect: true});
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

  ventaCMN(preVentaInfo: PreVentaSimpleInfo, estado: string) {
    let cSC: any[];
    if (this.item.subConteo) {
      cSC = preVentaInfo.cantidadList;

    } else{
      cSC = [];
    }
    const total =  parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round(((total / 1.18) + Number.EPSILON) * 100) / 100;
    const itemVendido: ItemVendido =
    {codigo: this.item.codigo, name: this.item.name, priceIGV: preVentaInfo.priceIGV,
      priceNoIGV: preVentaInfo.priceNoIGV, descripcion: this.item.description,
      cantidadSC: cSC, cantidad: preVentaInfo.cantidadVenta, totalPrice: total, totalPriceNoIGV: totalNoIGV };
    if (this.item.subConteo) {
      itemVendido.cantidad = this.sum;
    }
    const bodyToSend: Venta =
    {documento: {type: preVentaInfo.documentoTipo, name: preVentaInfo.nameDocumento, codigo: preVentaInfo.docCod},
     codigo: '', totalPrice: total,
     totalPriceNoIGV: totalNoIGV,
     estado, itemsVendidos: [itemVendido]};


    this.ventaEnCurso.next(true);

    return bodyToSend;
  }

  ventaSimple(preVentaInfo: PreVentaSimpleInfo) {

    const bodyToSend = this.ventaCMN(preVentaInfo, 'ejecutada');

    this.inventarioMNG.generarVentaSimple({venta: bodyToSend}).subscribe((res) => {
      this.ventaEnCurso.next(false);
      if (res.message.split('||')[0] === 'Succes') {
        this.dialogRef.close({item: res.item, message: 'Succes'});
        this.router.navigateByUrl(`/ventas/postVenta/${res.message.split('||')[1]}`);
      } else if (res.message === 'La Cantidad Ha Cambiado') {
        alert('Ya no disponemos con la cantidad necesaria para realizar la venta');
        this.dialogRef.close({item: res.item, message: 'Falta'});
      } else {
        alert('Error al procesar la venta intentelo de nuevo en un momento!');
        this.dialogRef.close({item: res.item, message: 'Error'});
      }
    });

  }

  generarNuevaVenta(preVentaInfo: PreVentaSimpleInfo) {
    const bodyToSend = this.ventaCMN(preVentaInfo, 'pendiente');
    this.inventarioMNG.generarVentaNueva({venta: bodyToSend}).subscribe((res) => {
      this.ventaEnCurso.next(false);
      if (res) {
        if (res.message === 'Ya tienes una venta pendiente') {
          alert(res.message);
          this.dialogRef.close({item: this.item, message: 'notVentaG'});
        }
        else {
          this.dialogRef.close({item: this.item, message: `SuccesAG ${res.venta.codigo}`});
        }
      }
      else {
        alert('Error desconocido, intenta denuevo en un momento.');
      }

    });
  }

  agregarItemVenta(preVentaInfo: PreVentaSimpleInfo) {
    const total =  parseFloat(this.totalPriceIGV.replace(',', '.'));
    const totalNoIGV = Math.round(((total / 1.18) + Number.EPSILON) * 100) / 100;
    const bodyToSend: ItemVendido = { codigo: this.item.codigo,
                                      name: this.item.name,
                                      priceIGV: preVentaInfo.priceIGV,
                                      priceNoIGV: preVentaInfo.priceNoIGV,
                                      cantidad: preVentaInfo.cantidadVenta,
                                      cantidadSC: preVentaInfo.cantidadList,
                                      totalPrice: total,
                                      totalPriceNoIGV: totalNoIGV,
                                      descripcion: this.item.description };

    if (this.item.subConteo) {
      bodyToSend.cantidad = this.sum;
    } else {
      bodyToSend.cantidadSC = [];
    }

    this.inventarioMNG.agregarItemVenta(bodyToSend, preVentaInfo.selectAcction).subscribe((res) => {
      if (res) {
        this.dialogRef.close({item: this.item, message: `succesAI|${res.message}` });
      } else {
        alert('Ocurrio un error desconocido.');
        this.dialogRef.close({item: this.item, message: 'error' });
      }
    });

  }

  actTotalForSubConteo(index: number) {
    const listRequired = this.cantidadList.at(index);
    this.sum = 0;
    if ((listRequired.get('cantidadDisponible').value - listRequired.get('cantidadVenta').value) < 0
        || listRequired.get('cantidadVenta').value < 0 || listRequired.get('cantidadVenta').value === null) {
        this.cantidadList.at(index).get('cantidadVenta').setValue(0);
        this.actTotalForSubConteo(index);
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

}
