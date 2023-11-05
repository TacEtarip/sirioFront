import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  InventarioManagerService,
  ItemsVentaForCard,
} from 'src/app/inventario-manager.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService, FullUser } from 'src/app/auth.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
})
export class PagoComponent implements OnInit {
  formContacto: UntypedFormGroup;

  formIsReady = new BehaviorSubject<boolean>(false);

  documentCharged = new BehaviorSubject<boolean>(false);

  carrito: ItemsVentaForCard[];
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private inv: InventarioManagerService
  ) {
    console.log(this.router.getCurrentNavigation().extras.state);
    if (this.router.getCurrentNavigation().extras.state === undefined) {
      this.router.navigate(['carrito']);
    }
  }

  ngOnInit(): void {
    this.auth.getOwnUser().subscribe((res) => {
      this.setForm(res);
    });
  }

  setForm(user: FullUser): void {
    console.log(user);
    this.formContacto = this.fb.group({
      nombre: this.fb.control(
        { value: user.nombre, disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(35),
        ])
      ),
      apellido: this.fb.control(
        { value: user.apellido, disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(35),
        ])
      ),
      documento: this.fb.control(
        { value: user.documento || '', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]{8}$|^[0-9]{11}$/),
        ])
      ),
      documentoShow: this.fb.control({ value: '', disabled: true }),
      email: this.fb.control(
        { value: user.email || '', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
        ])
      ),
      celular: this.fb.control(
        { value: user.celular || '', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(
            // tslint:disable-next-line: max-line-length
            /^[+][5][1][ ][0-9]{3}$[ ][0-9]{3}[ ][0-9]{3}$|^[0-9]{3}[-][0-9]{3}$[-][0-9]{3}$|^[+][5][1][0-9]{9}$|^[0-9]{9}$|^[+][5][1][ ][0-9]{9}$/
          ),
        ])
      ),
    });
    this.formContacto
      .get('documento')
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((doc) => {
        if (doc.length === 8) {
          this.documentCharged.next(true);
          this.formContacto.disable();
          this.inv.getDNI(doc).subscribe((dni) => {
            this.formContacto.enable();
            this.documentCharged.next(false);
            if (dni) {
              this.formContacto.get('documentoShow').setValue(dni.nombre);
              this.formContacto.get('documentoShow').disable();
            } else {
              this.formContacto.get('documentoShow').setValue('No Encontrado');
              this.formContacto.get('documentoShow').disable();
              this.formContacto.get('documento').setErrors({ incorrect: true });
            }
          });
        } else if (doc.length === 11) {
          this.formContacto.disable();
          this.documentCharged.next(true);
          this.inv.getRUC(doc).subscribe((ruc) => {
            this.formContacto.enable();
            this.documentCharged.next(false);
            if (ruc) {
              this.formContacto
                .get('documentoShow')
                .setValue(ruc.nombre_o_razon_social);
              this.formContacto.get('documentoShow').disable();
            } else {
              this.formContacto.get('documentoShow').setValue('No Encontrado');
              this.formContacto.get('documento').setErrors({ incorrect: true });
              this.formContacto.get('documentoShow').disable();
            }
          });
        }
      });
    this.formIsReady.next(true);
  }
}
