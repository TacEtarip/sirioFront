import { FullUser, AuthService } from 'src/app/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, FormControl, Validators, UntypedFormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-editar-celular-dialog',
  templateUrl: './editar-celular-dialog.component.html',
  styleUrls: ['./editar-celular-dialog.component.css']
})
export class EditarCelularDialogComponent implements OnInit {

  celularForm: UntypedFormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public user: FullUser,
              public dialogRef: MatDialogRef<EditarCelularDialogComponent>,
              private fb: UntypedFormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.celularForm = this.fb.group({
      celular: this.fb.control(this.user.celular , Validators.compose([
        Validators.required,
        Validators.pattern
        (/^[+][5][1][ ][0-9]{3}$[ ][0-9]{3}[ ][0-9]{3}$|^[0-9]{3}[-][0-9]{3}$[-][0-9]{3}$|^[+][5][1][0-9]{9}$|^[0-9]{9}$|^[+][5][1][ ][0-9]{9}$/)
      ])),
    });
  }

  trimThis(getString: string) {
    const temp = this.celularForm.get(getString);
    temp.setValue(temp.value.trim());
  }

  actualizarCel(celularForm: { celular: string }): void {
    this.celularForm.disable();
    this.auth.actCelular(celularForm.celular, this.user._id).subscribe(res => {
      if (res) {
        this.dialogRef.close(res);
      }
      this.celularForm.enable();
    });
  }
}
