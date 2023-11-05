import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService, FullUser } from 'src/app/auth.service';

@Component({
  selector: 'app-agregar-direccion-dialog',
  templateUrl: './agregar-direccion-dialog.component.html',
  styleUrls: ['./agregar-direccion-dialog.component.css'],
})
export class AgregarDireccionDialogComponent implements OnInit {
  direccionForm: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: FullUser,
    public dialogRef: MatDialogRef<AgregarDireccionDialogComponent>,
    private fb: UntypedFormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.direccionForm = this.fb.group({
      dirOne: this.fb.control(
        this.user.dirOne || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,_#\s]+$/),
          Validators.minLength(6),
          Validators.maxLength(62),
        ])
      ),
      dirTwo: this.fb.control(
        this.user.dirTwo || '',
        Validators.compose([
          Validators.pattern(/^[a-zA-Z0-9.,_#\s]+$/),
          Validators.minLength(3),
          Validators.maxLength(62),
        ])
      ),
      reference: this.fb.control(
        this.user.reference || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9.,-_#\s]+$/),
          Validators.minLength(6),
          Validators.maxLength(62),
        ])
      ),
      ciudad: this.fb.control({
        value: 'Trujillo, La Libertad - Perú',
        disabled: true,
      }),
    });
  }

  trimThis(getString: string) {
    const temp = this.direccionForm.get(getString);
    temp.setValue(temp.value.trim());
  }

  agregarDireccion(direcionInfo: {
    dirOne: string;
    dirTwo: string;
    reference: string;
  }): void {
    this.direccionForm.disable();
    this.auth.agregarDireccion(direcionInfo, this.user._id).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      }
      this.direccionForm.enable();
    });
  }
}
