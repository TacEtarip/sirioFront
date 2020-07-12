import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item, InventarioManagerService, Venta, ItemVendido, Documento } from '../../../inventario-manager.service';


interface TipoDoc {
  value: string;
  viewValue: string;
}

interface PreVentaInfo {
  codigo: string;
  priceIGV: number;
  priceNoIGV: number;
  cantidad: number;
  documentoTipo: string;
  docCod: number;
}

@Component({
  selector: 'app-venta-dialog',
  templateUrl: './venta-dialog.component.html',
  styleUrls: ['./venta-dialog.component.css']
})
export class VentaDialogComponent implements OnInit {

  ventaForm: FormGroup;

  disabled = true;

  tiposDocumentos: TipoDoc[] = [
    {value: 'factura', viewValue: 'Factura'},
    {value: 'boleta', viewValue: 'Boleta'},
  ];

  currentDocumentType = this.tiposDocumentos[0].value;
  totalPriceIGV: string;

  constructor(
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item,
    private formBuilder: FormBuilder,
    private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.ventaForm = this.formBuilder.group({
      codigo: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ])),
      priceIGV: this.formBuilder.control({value: this.rebrandNumber(true, this.item.priceIGV) , disabled: true},  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/)
      ])),
      priceNoIGV: this.formBuilder.control({value: this.item.priceNoIGV, disabled: true}),
      cantidad: this.formBuilder.control(1,  Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.minLength(1)
      ])),
      documentoTipo: this.formBuilder.control(this.tiposDocumentos[0].value,  Validators.compose([
        Validators.required
      ]))
      ,
      docCod: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]))
    }
    );
    this.totalPriceIGV = this.rebrandNumber(true, Math.round(((this.item.priceIGV * 1) + Number.EPSILON) * 100) / 100).replace('.', ',');
  }

  actTotal() {
    const cantidad: number = this.ventaForm.get('cantidad').value;
    const precio: number = this.ventaForm.get('priceIGV').value;
    this.totalPriceIGV = this.rebrandNumber(true, Math.round(((precio * cantidad) + Number.EPSILON) * 100) / 100).replace('.', ',');
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
      this.actTotal();
    }
  }

  changeValidators() {
    if (this.ventaForm.get('documentoTipo').value === this.tiposDocumentos[0].value) {
      this.ventaForm.get('docCod').setValidators([Validators.minLength(11), Validators.maxLength(11), Validators.required]);
      this.ventaForm.get('docCod').reset();
    } else {
      this.ventaForm.get('docCod').setValidators([Validators.minLength(8), Validators.maxLength(8), Validators.required]);
      this.ventaForm.get('docCod').reset();
    }
  }

  changePrice() {
    if (this.disabled) {
      this.disabled = false;
      this.ventaForm.get('priceIGV').enable();
    } else {
      this.ventaForm.get('priceIGV').disable();
      this.disabled = true;
    }
  }

  ventaSimple(preVentaInfo: PreVentaInfo) {
    preVentaInfo.priceIGV = this.ventaForm.get('priceIGV').value;
    preVentaInfo.priceNoIGV = this.ventaForm.get('priceNoIGV').value;
    const priceTigv = parseFloat(this.totalPriceIGV);
    const priceNoigvTotal = Math.round(((priceTigv / 1.18) + Number.EPSILON) * 100) / 100;
    const documento: Documento = {type: preVentaInfo.documentoTipo, codigo: preVentaInfo.docCod};
    const itemVendido: ItemVendido = {codigo: this.item.codigo, priceIGV: preVentaInfo.priceIGV,
                                      priceNoIGV: preVentaInfo.priceNoIGV, cantidad: preVentaInfo.cantidad};
    const itemsVendidos: ItemVendido[] = [itemVendido];
    const venta: Venta = {codigo: 'temp', estado: 'ejecutada', totalPrice: priceTigv,
                          totalPriceNoIGV: priceNoigvTotal, documento, itemsVendidos};
    venta.estado = 'ejecutada';
    this.inventarioMNG.generarVenta(venta).subscribe( (res) => {
      if (res !== false) {
        this.ventaForm.reset();
        this.dialogRef.close(res);
      } else {
        alert('Ocurrio un problema al momento de procesar la venta.');
      }

    });
  }

}
