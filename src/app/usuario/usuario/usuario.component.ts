import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, FullUser } from 'src/app/auth.service';
import { AgregarDireccionDialogComponent } from '../agregar-direccion-dialog/agregar-direccion-dialog.component';
import { AgregarDocumentoDialogComponent } from '../agregar-documento-dialog/agregar-documento-dialog.component';
import { CambiarContrasenaDialogComponent } from '../cambiar-contrasena-dialog/cambiar-contrasena-dialog.component';
import { EditarCelularDialogComponent } from '../editar-celular-dialog/editar-celular-dialog.component';
import {
  InventarioManagerService,
  Venta,
} from './../../inventario-manager.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit, OnDestroy {
  user = new BehaviorSubject<FullUser>(null);
  userPhone = new BehaviorSubject<string>(null);

  subOne: Subscription;
  subTwo: Subscription;

  ventasLastTen = new BehaviorSubject<Venta[]>([]);

  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private inv: InventarioManagerService,
    private metaTagService: Meta,
    private router: Router
  ) {
    this.auth.getUserInfo(auth.getUser()).subscribe((res) => {
      this.user.next(res);
      this.userPhone.next(this.addSpaceCada(3, res.celular));
      if (
        this.auth.getTtype() !== 'low' ||
        this.auth.getTtype() !== 'contador'
      ) {
        this.inv.getLast20Sales(res.username).subscribe((resT) => {
          this.ventasLastTen.next(resT);
        });
      }
    });
  }

  addSpaceCada(count = 1, celular: string = '', sepString = ' '): string {
    if (count >= celular.length) {
      return celular;
    }
    const stringArray = Array.from(celular);
    const setString = stringArray.splice(0, count);
    return (
      setString.join('') +
      sepString +
      this.addSpaceCada(count, stringArray.join(''), sepString)
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Usuario Panel | Sirio Dinar');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Panel de control de usuario sirio dianar.',
    });
    this.metaTagService.updateTag({
      property: 'og:url',
      content: 'https://inventario.siriodinar.com/usuario',
    });
    this.metaTagService.updateTag({
      property: 'og:title',
      content: 'Usuario Panel | Sirio Dinar',
    });
    this.metaTagService.updateTag({
      property: 'og:description',
      content: 'Panel de control de usuario sirio dianar.',
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
  }

  openEditarCelDialog(): void {
    const dialogRef = this.dialog.open(EditarCelularDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    this.subOne = dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((res: FullUser) => {
        if (res) {
          this.user.next(res);
          this.userPhone.next(this.addSpaceCada(3, res.celular));
          this.snackBar.open('Celular Actualizado', 'Ok', { duration: 1500 });
        }
      });
  }

  openAgregarDireccionDialog(): void {
    const dialogRef = this.dialog.open(AgregarDireccionDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((res: FullUser) => {
        if (res) {
          this.user.next(res);
          this.snackBar.open('Dirección Agregada', 'Ok', { duration: 1500 });
        }
      });
  }

  openAgregarDocumentoDialog(): void {
    const dialogRef = this.dialog.open(AgregarDocumentoDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((res: FullUser) => {
        if (res) {
          this.user.next(res);
          this.snackBar.open('Documento Agregado', 'Ok', { duration: 1500 });
        }
      });
  }

  openEditarContrasena(): void {
    const dialogRef = this.dialog.open(CambiarContrasenaDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((res: FullUser) => {
        if (res) {
          this.user.next(res);
          this.snackBar.open('Contraseña Cambiada', 'Ok', { duration: 1500 });
        }
      });
  }

  ngOnDestroy(): void {}

  goToInv() {
    this.router.navigate(['store', 'categorias']);
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
