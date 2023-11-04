import { AuthService } from './../../../../auth.service';
import { Item, InventarioManagerService, Order, Venta, ItemVendido, DNI, RUC } from 'src/app/inventario-manager.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, FormControl, Validators, UntypedFormBuilder, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GenerarVentaComponent } from '../../ventas-activas/generar-venta/generar-venta.component';
import { distinctUntilChanged } from 'rxjs/operators';

export interface Documento {
  type: string;
  name: string;
  codigo: number;
  direccion: string;
}

@Component({
  selector: 'app-generar-coti',
  templateUrl: './generar-coti.component.html',
  styleUrls: ['./generar-coti.component.css']
})
export class GenerarCotiComponent implements OnInit, OnDestroy {

  documentoForm: UntypedFormGroup;
  subI: Subscription;

  constructor(private fb: UntypedFormBuilder, public dialog: MatDialog,
              public dialogRef: MatDialogRef<GenerarCotiComponent>, private invManager: InventarioManagerService,
              @Inject(MAT_DIALOG_DATA) public venta: Venta) { }
  ngOnDestroy(): void {
    this.subI.unsubscribe();
  }

  ngOnInit(): void {
    this.documentoForm = this.fb.group({
      codigo: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{8}$|^[0-9]{11}$/g),
      ])),
      name: this.fb.control({ value: '', disabled: true }),
      celular: this.fb.control('', Validators.compose([
        Validators.pattern
        (/^[+][5][1][ ][0-9]{3}$[ ][0-9]{3}[ ][0-9]{3}$|^[0-9]{3}[-][0-9]{3}$[-][0-9]{3}$|^[+][5][1][0-9]{9}$|^[0-9]{9}$|^[+][5][1][ ][0-9]{9}$/)
      ])),
      email: this.fb.control('', Validators.email),
    });

    this.subI = this.documentoForm.get('codigo').valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      if (this.documentoForm.get('codigo').valid) {
        this.comprobarDocV2(value);
      } else {
        this.documentoForm.get('name').reset();
      }
    });
  }

  openCrearCotiDialog(contacto: {codigo: string, name: string, celular: string, email: string}) {
    this.dialogRef.close(contacto);
  }

  comprobarDocV2(doc: string) {
    const docL = doc.length;
    if (docL === 8) {
      this.invManager.getDNI(doc).subscribe((res: DNI) => {
        if (res) {
          this.documentoForm.get('name').setValue(res.nombre);
        }
        else {
          this.documentoForm.get('name').setValue('');
          this.documentoForm.get('codigo').setErrors({incorrect: true});
        }
      });
    } else if (docL === 11) {
      this.invManager.getRUC(doc).subscribe((res: RUC) => {
        if (res) {
          this.documentoForm.get('name').setValue(res.nombre_o_razon_social);
        }
        else {
          this.documentoForm.get('name').setValue('');
          this.documentoForm.get('codigo').setErrors({incorrect: true});
        }
      });
    }
  }

  clonarCoti(contacto: {codigo: string, name: string, celular: string, email: string}) {
    this.venta.documento.codigo = parseInt(contacto.codigo, 10);
    this.venta.cliente_email = contacto.email || '';
    this.venta.celular_cliente = contacto.celular || '';
    this.venta.documento.name = contacto.name;
    if (contacto.codigo.length === 8) {
      this.venta.documento.type = 'boleta';
    } else {
      this.venta.documento.type = 'factura';
    }

    this.invManager.generarCotiNueva({venta: this.venta}).subscribe((res) => {
      // this.ventaEnCurso$.next(false);
      if (res) {
        if (res.coti) {
          this.dialogRef.close({  message: `SuccesAG ${res.coti.codigo}`, coti: res.coti });
        } else {
          alert(res.message);
          this.dialogRef.close({ message: 'notVentaG', coti: null });
        }
      }
      else {
        alert('Error desconocido, intenta denuevo en un momento.');
      }

    });
  }
}
