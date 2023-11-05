import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ContactoService } from 'src/app/contacto.service';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css'],
})
export class ContactanosComponent implements OnInit {
  formContacto: UntypedFormGroup;

  descripcion =
    'Contactanos. Tienda de indumentaria de seguridad a el mejor precio en Trujillo, venta al por menor y al por mayor;' +
    'guantes, respiradores, cascos, lentes, entre otros productos para tu seguridad o la de tus empleados. ' +
    'Además confeccionamos indumentaria de seguridad como chalecos con el logo de tu empresa. Para más información enviar un mensaje' +
    ' al +51 977 426 349, estamos para servirle.';

  constructor(
    private fb: UntypedFormBuilder,
    private ctnS: ContactoService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Contactanos | Sirio Dinar');
    this.metaTagService.updateTag({
      name: 'description',
      content: this.descripcion,
    });
    this.metaTagService.updateTag({
      property: 'og:url',
      content:
        'https://inventario.siriodinar.com/servicio-al-cliente/contactanos',
    });
    this.metaTagService.updateTag({
      property: 'og:title',
      content: 'Contactanos | Sirio Dinar',
    });
    this.metaTagService.updateTag({
      property: 'og:description',
      content: this.descripcion,
    });
    this.metaTagService.updateTag({
      property: 'og:image',
      content: 'https://inventario.siriodinar.com/assets/itemsSocial.jpg',
    });
    this.metaTagService.updateTag({
      property: 'og:image:alt',
      content: 'sirio presentacion',
    });
    this.metaTagService.updateTag({ property: 'og:type', content: 'website' });

    this.formContacto = this.fb.group({
      nombre: this.fb.control(
        { value: '', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(45),
        ])
      ),
      apellido: this.fb.control(
        { value: '', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(45),
        ])
      ),
      email: this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(60),
        ])
      ),
      mensaje: this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ])
      ),
    });
  }

  enviarMensaje(mensajeInfo: {
    nombre: string;
    apellido: string;
    email: string;
    mensaje: string;
  }) {
    if (this.formContacto.valid) {
      this.formContacto.disable();
      this.ctnS.enviarMensaje(mensajeInfo).subscribe((res) => {
        this.formContacto.enable();
        if (res.enviado) {
          this.formContacto.reset();
          this.snackBar.open('Mensaje Enviado', 'Ok', {
            duration: 5000,
          });
        }
      });
    }
  }
}
