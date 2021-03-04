import { first } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FullUser, AuthService } from 'src/app/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarCelularDialogComponent } from '../editar-celular-dialog/editar-celular-dialog.component';
import { AgregarDireccionDialogComponent  } from '../agregar-direccion-dialog/agregar-direccion-dialog.component';
import { AgregarDocumentoDialogComponent } from '../agregar-documento-dialog/agregar-documento-dialog.component';
import { CambiarContrasenaDialogComponent } from '../cambiar-contrasena-dialog/cambiar-contrasena-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, OnDestroy {

  user = new BehaviorSubject<FullUser>(null);
  userPhone = new BehaviorSubject<string>(null);

  subOne: Subscription;
  subTwo: Subscription;


  constructor(private auth: AuthService,  public dialog: MatDialog, private _snackBar: MatSnackBar,
              private titleService: Title,
              private metaTagService: Meta,
              private router: Router) {
    this.auth.getUserInfo(auth.getUser()).subscribe((res => {
      this.user.next(res);
      this.userPhone.next(this.addSpaceCada(3, res.celular));
    }));
  }

  addSpaceCada(count = 1, celular: string, sepString = ' '): string {
    if (count >= celular.length) {
      return celular;
    }
    const stringArray = Array.from(celular);
    const setString = stringArray.splice(0, count);
    return setString.join('') + sepString + this.addSpaceCada(count, stringArray.join(''), sepString);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Sirio Dinar | Usuario');
    this.metaTagService.updateTag(
      { name: 'description', content: 'Informacion de Sirio Dinar usuario' }
    );
  }

  openEditarCelDialog(): void {
    const dialogRef = this.dialog.open(EditarCelularDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    this.subOne = dialogRef.afterClosed().pipe(first()).subscribe((res: FullUser) => {
      if (res) {
        this.user.next(res);
        this.userPhone.next(this.addSpaceCada(3, res.celular));
        this._snackBar.open('Celular Actualizado', 'Ok', { duration: 1500 });
      }
    });
  }

  openAgregarDireccionDialog(): void {
    const dialogRef = this.dialog.open(AgregarDireccionDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res: FullUser) => {
      if (res) {
        this.user.next(res);
        this._snackBar.open('Dirección Agregada', 'Ok', { duration: 1500 });
      }
    });
  }

  openAgregarDocumentoDialog(): void {
    const dialogRef = this.dialog.open(AgregarDocumentoDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res: FullUser) => {
      if (res) {
        this.user.next(res);
        this._snackBar.open('Documento Agregado', 'Ok', { duration: 1500 });
      }
    });
  }

  openEditarContrasena(): void {
    const dialogRef = this.dialog.open(CambiarContrasenaDialogComponent, {
      width: '600px',
      data: this.user.value,
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res: FullUser) => {
      if (res) {
        this.user.next(res);
        this._snackBar.open('Contraseña Cambiada', 'Ok', { duration: 1500 });
      }
    });
  }

  ngOnDestroy(): void {

  }

  goToInv() {
    this.router.navigate(['/inventario']);
  }

}
