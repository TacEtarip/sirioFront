import { InventarioManagerService } from 'src/app/inventario-manager.service';
import { FullUser, AuthService } from 'src/app/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface TipoDoc {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-agregar-documento-dialog',
  templateUrl: './agregar-documento-dialog.component.html',
  styleUrls: ['./agregar-documento-dialog.component.css']
})
export class AgregarDocumentoDialogComponent implements OnInit {

  documentoForm: FormGroup;

  tiposDocumentos: TipoDoc[] = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'ruc', viewValue: 'RUC'},
  ];
  currentDocumentType = this.tiposDocumentos[0].value;

  subOne: Subscription;
  subTwo: Subscription;

  comprobado = false;

  constructor(@Inject(MAT_DIALOG_DATA) public user: FullUser,
              public dialogRef: MatDialogRef<AgregarDocumentoDialogComponent>,
              private fb: FormBuilder, private auth: AuthService,
              private invManager: InventarioManagerService) { }

  ngOnInit(): void {
    this.documentoForm = this.fb.group({
      tipoPersona: this.fb.control('dni', Validators.required),
      documento: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^[0-9]{8}$/)
      ])),
      nameDocumento: this.fb.control({ value: '', disabled: true })
    });

    this.subTwo = this.documentoForm.get('tipoPersona').valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
      this.documentoForm.get('nameDocumento').reset();
      if (res === 'dni') {
        this.documentoForm.get('documento').setValidators( Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]{8}$/)
        ]));
      } else {
        this.documentoForm.get('documento').setValidators( Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9]{11}$/)
        ]));
      }
      this.documentoForm.get('documento').updateValueAndValidity({ onlySelf: true });
    });

    this.subTwo = this.documentoForm.get('documento').valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
      this.documentoForm.get('nameDocumento').reset();
      this.comprobado = false;
      if (this.documentoForm.get('documento').valid) {
        if (this.documentoForm.get('tipoPersona').value === 'dni') {
          this.invManager.getDNI(res).subscribe(resDni => {
            if (resDni) {
              this.comprobado = true;
              this.documentoForm.get('nameDocumento').setValue(resDni.nombre);
            }
          });
        } else {
          this.invManager.getRUC(res).subscribe(resRuc => {
            if (resRuc) {
              this.comprobado = true;
              this.documentoForm.get('nameDocumento').setValue(resRuc.nombre_o_razon_social);
            }
          });
        }
      }
    });
  }

  trimThis(getString: string) {
    const temp = this.documentoForm.get(getString);
    temp.setValue(temp.value.trim());
  }

  agregarDocumento(documentoInfo: {tipoPersona: string, documento: string}) {
    this.auth.agregarDocumento(documentoInfo, this.user._id).subscribe(res => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
  }
}
