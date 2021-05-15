import { EliminarSubTipoComponent } from './../../inventario/inventario/eliminar-sub-tipo/eliminar-sub-tipo.component';
import { SubTipoEditarComponent } from './../../inventario/inventario/sub-tipo-editar/sub-tipo-editar.component';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { first, repeat, repeatWhen, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService } from 'src/app/inventario-manager.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-sub-categoria-card',
  templateUrl: './sub-categoria-card.component.html',
  styleUrls: ['./sub-categoria-card.component.css']
})
export class SubCategoriaCardComponent implements OnInit, OnDestroy {

  @Input() subTipo: string;
  @Input() codigoTipo: string;
  @Input() nameTipo: string;
  @Output() deleteEvent = new EventEmitter<string>();

  timerSubject: Subscription;

  urlOfImage = new BehaviorSubject<string>(null);
  tipoName$ = new BehaviorSubject<string>('');

  indexOfImages = 0;

  animate$ =  new BehaviorSubject<boolean>(false);

  theFirstImage = true;

  @ViewChild('imagebg') imageBG: ElementRef;

  constructor(private inv: InventarioManagerService, public auth: AuthService, public dialog: MatDialog) {
  }

  ngOnDestroy(): void {
    if (this.timerSubject) {
      this.timerSubject.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.inv.getPhotoTipoRandom(this.nameTipo, this.subTipo).subscribe(res => {
      this.timerSubject = timer(0, 2000).pipe(take(res.photos.length * 2), repeat()).subscribe(x => {
        if (x % 2 === 0) {
          this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${res.photos[x / 2].photo.split('.')[0]}.webp`);
        } else {
          this.animate$.next(false);
          if (x === 7) {
            this.timerSubject.unsubscribe();
          }
        }
      });
    });
    // this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${this.tipo.link.split('.')[0]}.webp`);
    this.tipoName$.next(this.subTipo);
  }

  imageLoaded(event) {
    if (this.theFirstImage) {
      console.log('here');
      this.theFirstImage = false;
    } else {
      this.animate$.next(true);
    }
  }

  openEditarNombreSubTipo() {
    const dialogRef = this.dialog.open(SubTipoEditarComponent, {
      width: '600px',
      data: { codigo: this.codigoTipo,  antiguoSubName: this.subTipo }
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res: string) => {
      if (res) {
        this.subTipo = res;
        this.tipoName$.next(res);
      }
    });
  }

  openEliminarSubTipo() {
    const dialogRef = this.dialog.open(EliminarSubTipoComponent, {
      width: '600px',
      data: {codigo: this.codigoTipo, subName: this.subTipo}
    });

    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res) {
        this.deleteEvent.emit(this.subTipo);
      }
    });
  }

}
