import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, UserRegister, FullUser, UserRegisterGoogle } from 'src/app/auth.service';
import { BehaviorSubject, Subject, Subscription, Observable, interval, observable, ReplaySubject } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import anime from 'animejs';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { distinctUntilChanged, first, debounceTime, timeInterval, tap, takeUntil, takeWhile, skip } from 'rxjs/operators';

interface TipoDoc {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy, AfterViewInit {

  registroForm: FormGroup;

  registroGoogleForm: FormGroup;

  fromToken = new BehaviorSubject<boolean>(false);

  sitekey: string;

  usuarioPost = new BehaviorSubject<FullUser>(null);

  temporalUserInfo: UserRegisterGoogle;

  processdone = false;

  state = 0;

  hide = true;

  justOnce = true;

  passSub: Subscription;

  tiposDocumentos: TipoDoc[] = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'ruc', viewValue: 'RUC'},
  ];

  contraValid = false;

  userExists = new BehaviorSubject(false);

  changingUser = new BehaviorSubject(false);

  userExistsG = new BehaviorSubject(false);

  changingUserG = new BehaviorSubject(false);

  emailExists = new BehaviorSubject(false);

  changingEmail = new BehaviorSubject(false);

  currentDocumentType = this.tiposDocumentos[0].value;

  subOne: Subscription;

  subTwo: Subscription;

  subThree: Subscription;

  subFour: Subscription;

  subFive: Subscription;

  reaload = new BehaviorSubject<boolean>(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private ar: ActivatedRoute) {
    this.sitekey = '6Lc-GTIaAAAAABaw-oeMyoV6jZvkn9jRdaUwa_VT';
    this.ar.paramMap.pipe(first()).subscribe( param => {
      const token = param.get('googleToken');
      if (token) {
        this.auth.getLoginInfoFTG(token).subscribe( res => {
          if (res) {
            this.temporalUserInfo = {nombre: res.given_name, apellido: res.family_name, email: res.email, googleCod: res.sub};
            this.fromToken.next(true);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(25)
      ])),
      apellido: this.fb.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(25)
      ])),
      email: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ])),
      celular: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern
        // tslint:disable-next-line: max-line-length
        (/^[+][5][1][ ][0-9]{3}$[ ][0-9]{3}[ ][0-9]{3}$|^[0-9]{3}[-][0-9]{3}$[-][0-9]{3}$|^[+][5][1][0-9]{9}$|^[0-9]{9}$|^[+][5][1][ ][0-9]{9}$/)
      ])),
      displayName: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(4),
        Validators.maxLength(12)
      ])),
      password: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*[A-Z]+[a-zA-Z0-9]*$/),
        Validators.pattern(/^[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*$/),
        Validators.pattern(/^[a-zA-Z0-9]*[a-z]+[a-zA-Z0-9]*$/),
        Validators.minLength(6),
        Validators.maxLength(20)
      ])),
      passwordConf: this.fb.control('', Validators.compose([
        Validators.required,
        this.confirmarPasswordV2('password')
      ])),
      captcha: this.fb.control(null, Validators.required),
      /*
      documentoTipo: this.fb.control(''),
      docCod: this.fb.control(''),
      nameDocumento: this.fb.control(''),
      direccion: this.fb.control(''),
      direccionDos: this.fb.control(''),
      ciudad: this.fb.control('Trujillo - La Libertad')*/
    });

    this.registroGoogleForm = this.fb.group({
      celular: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern
        // tslint:disable-next-line: max-line-length
        (/^[+][5][1][ ][0-9]{3}$[ ][0-9]{3}[ ][0-9]{3}$|^[0-9]{3}[-][0-9]{3}$[-][0-9]{3}$|^[+][5][1][0-9]{9}$|^[0-9]{9}$|^[+][5][1][ ][0-9]{9}$/)
      ])),
      displayName: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(4),
        Validators.maxLength(12)
      ])),
      password: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*[A-Z]+[a-zA-Z0-9]*$/),
        Validators.pattern(/^[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*$/),
        Validators.pattern(/^[a-zA-Z0-9]*[a-z]+[a-zA-Z0-9]*$/),
        Validators.minLength(6),
        Validators.maxLength(20)
      ])),
      passwordConf: this.fb.control('', Validators.compose([
        Validators.required,
        this.confirmarPasswordV2('password')
      ]))
    });
    this.reaload.next(false);
    this.subFour = this.reaload.pipe(skip(1), first()).subscribe(() => window.location.reload());
  }

  accederConGoogle() {
    window.open('https://inventario-sirio-dinar.herokuapp.com/auth/google', '_self');
  }

  ngAfterViewInit(): void {
    this.subOne = this.registroForm.get('displayName').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(400))
      .subscribe((changedValue: string) => {
          if (this.registroForm.get('displayName').valid) {
          this.auth.usernameExist(changedValue.toLowerCase()).subscribe(res => {
          this.userExists.next(res);
          this.changingUser.next(false);
        });
        }
    });

    this.subFive = this.registroGoogleForm.get('displayName').valueChanges
    .pipe(distinctUntilChanged(), debounceTime(400))
    .subscribe((changedValue: string) => {
        if (this.registroGoogleForm.get('displayName').valid) {
        this.auth.usernameExist(changedValue.toLowerCase()).subscribe(res => {
        this.userExistsG.next(res);
        this.changingUserG.next(false);
      });
      }
  });

    this.subTwo = this.registroForm.get('email').valueChanges
        .pipe(distinctUntilChanged(), debounceTime(800))
          .subscribe((changedValue: string) => {
            if (this.registroForm.get('email').valid) {
                this.auth.emailExist(changedValue.toLowerCase()).subscribe(res => {
                this.emailExists.next(res);
                this.changingEmail.next(false);
          });
      }
  });
  }

  errored() {
    alert(`reCAPTCHA error`);
  }

  resolved(captchaResponse) {
    console.log(captchaResponse);
  }

  confirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

  confirmarPasswordV2(fildToGet: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.parent) {
        if (control.parent.get(fildToGet).value === control.value) {
          return null;
        }
        return {error: true};
      }
    };
  }

  equalsPassword(controlForm: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any} | null => {
      return control.parent.get(controlForm).value === control.value
              ? null : {passError: {value: control.value}};
    };
  }

  trimThis(getString: string) {
    const temp = this.registroForm.get(getString);
    temp.setValue(temp.value.trim());
  }

  trimThisG(getString: string) {
    const temp = this.registroGoogleForm.get(getString);
    temp.setValue(temp.value.trim());
  }

  siguienteGo(): boolean {
    if (this.registroForm.get('nombre').valid &&
        this.registroForm.get('apellido').valid &&
        this.registroForm.get('email').valid &&
        this.registroForm.get('celular').valid) {
      return true;
    }
    return false;
  }

  activarCompro() {
    if (this.registroForm.get('password').valid) {
      this.registroForm.get('passwordConf').enable();
    }
  }

  comprobarContra() {

  }
  comprobarDOC() {

  }

  ngOnDestroy(): void {
    if (this.subOne) {
      this.subOne.unsubscribe();
    }

    if (this.subTwo) {
      this.subTwo.unsubscribe();
    }

    if (this.subThree) {
      this.subThree.unsubscribe();
    }

    if (this.subFour) {
      this.subFour.unsubscribe();
    }

    if (this.subFive) {
      this.subFive.unsubscribe();
    }
  }

  registrarUsuario(userRegister: UserRegister) {
    this.registroForm.disable();
    this.registroGoogleForm.disable();
    this.auth.registerLow(userRegister).subscribe((res) => {
      if (res) {
        this.registroForm.reset();
        this.usuarioPost.next(res);
        this.processdone = true;
        this.subThree = interval(5000).pipe(takeWhile( r => !this.reaload.value)).subscribe(() => {
          this.auth.isValid(res._id).subscribe((reloadRes) => {
            if (reloadRes) {
              this.reaload.next(true);
            }
          });
        });
      } else {
        this.registroForm.enable();
      }
    });
  }

  registrarUsuarioGoogle(userRegisterGoogle: {displayName: string, password: string, celular: string}) {
    this.registroGoogleForm.disable();
    const userRegister = { ...userRegisterGoogle, ...this.temporalUserInfo };
    this.auth.registerLow(userRegister).subscribe((res) => {
      if (res) {
        this.registroGoogleForm.reset();
        this.usuarioPost.next(res);
        this.processdone = true;
        this.subThree = interval(5000).pipe(takeWhile( r => !this.reaload.value)).subscribe(() => {
          this.auth.isValid(res._id).subscribe((reloadRes) => {
            if (reloadRes) {
              this.reaload.next(true);
            }
          });
        });
      } else {
        this.registroGoogleForm.enable();
      }
    });
  }

  animateTrans() {
    return anime.timeline({
      targets: '.formMult',
      duration: 500,
      easing: 'easeOutQuad'
    });
  }

  invalidateForChange() {
    this.changingUser.next(true);
  }

  invalidateForChangeG() {
    this.changingUserG.next(true);
  }

  invalidateForChangeEmail() {
    this.changingEmail.next(true);
  }

  next(): void {
    switch (this.state) {
      case 0:
          this.state = 1;
          this.animateTrans().add({
            translateX: (-312 - 48),
          });
          if (this.justOnce) {
            this.justOnce = false;
            this.registroForm.get('password').reset();
          }
          break;
      default:
          break;
    }
  }

  back(): void {
    switch (this.state) {
      case 1:
          this.state = 0;
          this.animateTrans().add({
            translateX: 0,
          });
          break;
      default:
          break;
    }
  }

  changeValidators() {
    /*
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
    }*/
  }

}
