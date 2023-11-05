import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  InventarioManagerService,
  Tipo,
} from 'src/app/inventario-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarClaseComponent } from 'src/app/inventario/inventario/editar-clase/editar-clase.component';
import { SeguroEliminarComponent } from 'src/app/inventario/inventario/seguro-eliminar/seguro-eliminar.component';
import { UploadCatImageComponent } from './../upload-cat-image/upload-cat-image.component';

@Component({
  selector: 'app-main-categoria-card',
  templateUrl: './main-categoria-card.component.html',
  styleUrls: ['./main-categoria-card.component.css'],
})
export class MainCategoriaCardComponent implements OnInit {
  @Input() tipo: Tipo;
  @Output() deleteEvent = new EventEmitter<Tipo>();

  urlOfImage = new BehaviorSubject<string>(null);
  tipoName$ = new BehaviorSubject<string>('');

  constructor(
    private inv: InventarioManagerService,
    public auth: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.urlOfImage.next(
      'https://siriouploads.s3.amazonaws.com/' +
        `${this.tipo.link.split('.')[0]}.webp`
    );
    this.tipoName$.next(this.tipo.name);
  }

  openEditarNombreTipo() {
    const dialogRef = this.dialog.open(EditarClaseComponent, {
      width: '600px',
      data: this.tipo,
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((res: Tipo) => {
        if (res) {
          this.tipo = res;
          this.tipoName$.next(res.name);
        }
      });
  }

  openEliminarTipo() {
    const dialogRef = this.dialog.open(SeguroEliminarComponent, {
      width: '600px',
      data: this.tipo,
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((res: Tipo) => {
        this.deleteEvent.emit(res);
      });
  }

  openCambiarImagen() {
    const dialogRef = this.dialog.open(UploadCatImageComponent, {
      width: '600px',
      data: { tipo: this.tipo, item: null },
    });

    dialogRef.componentInstance.onUploaded.pipe(first()).subscribe((res) => {
      if (res) {
        this.tipo = res;
        this.tipoName$.next(res.name);
        this.urlOfImage.next(
          'https://siriouploads.s3.amazonaws.com/' +
            `${res.link.split('.')[0]}.webp`
        );
      }
    });
  }
}
