import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService, FullUser } from 'src/app/auth.service';

@Component({
  selector: 'app-cambiar-contrasena-dialog',
  templateUrl: './cambiar-contrasena-dialog.component.html',
  styleUrls: ['./cambiar-contrasena-dialog.component.css'],
})
export class CambiarContrasenaDialogComponent implements OnInit, OnDestroy {
  passwordForm: UntypedFormGroup;

  hide = true;
  hideTwo = true;

  errorPassword = false;
  cargandoPassword = false;
  checkedPassword = false;

  passwordApro = false;

  subOne: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: FullUser,
    public dialogRef: MatDialogRef<CambiarContrasenaDialogComponent>,
    private fb: UntypedFormBuilder,
    private auth: AuthService
  ) {}

  ngOnDestroy(): void {
    this.subOne.unsubscribe();
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      passwordOld: this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]*[A-Z]+[a-zA-Z0-9]*$/),
          Validators.pattern(/^[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*$/),
          Validators.pattern(/^[a-zA-Z0-9]*[a-z]+[a-zA-Z0-9]*$/),
          Validators.minLength(6),
          Validators.maxLength(20),
        ])
      ),
      password: this.fb.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]*[A-Z]+[a-zA-Z0-9]*$/),
          Validators.pattern(/^[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*$/),
          Validators.pattern(/^[a-zA-Z0-9]*[a-z]+[a-zA-Z0-9]*$/),
          Validators.minLength(6),
          Validators.maxLength(20),
        ])
      ),
      passwordConf: this.fb.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          this.confirmarPasswordV2('password'),
        ])
      ),
    });

    this.subOne = this.passwordForm
      .get('passwordOld')
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(800))
      .subscribe((res) => {
        this.errorPassword = false;
        this.passwordApro = false;
        this.passwordForm.get('password').disable();
        this.passwordForm.get('passwordConf').disable();
        if (this.passwordForm.get('passwordOld').valid) {
          this.cargandoPassword = true;
          this.checkedPassword = true;
          this.auth.confirmarContr(res, this.user._id).subscribe((resCtr) => {
            this.cargandoPassword = false;
            if (resCtr) {
              if (resCtr.valid) {
                this.passwordForm.get('password').enable();
                this.passwordForm.get('passwordConf').enable();
                this.errorPassword = false;
                this.passwordApro = true;
              } else {
                this.errorPassword = true;
              }
            }
          });
        }
      });
  }

  confirmarPasswordV2(fildToGet: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.parent) {
        if (control.parent.get(fildToGet).value === control.value) {
          return null;
        }
        return { error: true };
      }
    };
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  trimThis(getString: string) {
    const temp = this.passwordForm.get(getString);
    temp.setValue(temp.value.trim());
  }

  cambiarContra(contraForm: { passwordOld: string; password: string }) {
    this.passwordForm.disable();
    this.auth.cambiarContra(contraForm, this.user._id).subscribe((res) => {
      if (res?.changed) {
        this.dialogRef.close(this.user);
      }
      this.passwordForm.enable();
    });
  }
}
