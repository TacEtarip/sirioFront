import { FullUser, AuthService } from 'src/app/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contrasena-dialog',
  templateUrl: './cambiar-contrasena-dialog.component.html',
  styleUrls: ['./cambiar-contrasena-dialog.component.css']
})
export class CambiarContrasenaDialogComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public user: FullUser,
              public dialogRef: MatDialogRef<CambiarContrasenaDialogComponent>,
              private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
  }

}
