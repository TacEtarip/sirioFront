import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-pre-excel-dialog',
  templateUrl: './pre-excel-dialog.component.html',
  styleUrls: ['./pre-excel-dialog.component.css'],
})
export class PreExcelDialogComponent implements OnInit {
  preCotiForm: UntypedFormGroup;
  ventaEnCurso$ = new BehaviorSubject<boolean>(false);

  image = true;
  constructor(
    private fb: UntypedFormBuilder,
    private invManager: InventarioManagerService,
    public dialogRef: MatDialogRef<PreExcelDialogComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public preInfoCoti: { cotiCod: string; pdf: boolean }
  ) {}

  ngOnInit(): void {
    this.preCotiForm = this.fb.group({
      observaciones: this.fb.control(
        '',
        Validators.compose([
          Validators.pattern(/^[a-zA-Z0-9.,_#\s\-]+$/),
          Validators.maxLength(500),
        ])
      ),
      envio: this.fb.control(
        '',
        Validators.compose([
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0),
        ])
      ),
      otro: this.fb.control(
        '',
        Validators.compose([
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0),
        ])
      ),
      porPagar: this.fb.control(
        '',
        Validators.compose([
          Validators.pattern(/^\d*\.?\d{0,2}$/),
          Validators.min(0),
        ])
      ),
    });
  }

  descargarExcel(value: {
    observaciones: string;
    envio: number;
    otro: number;
    porPagar: number;
  }) {
    this.ventaEnCurso$.next(true);
    this.invManager
      .getExcelCoti(this.preInfoCoti.cotiCod, value, this.image)
      .subscribe((res) => {
        if (res) {
          this.ventaEnCurso$.next(false);
          saveAs(res, `COTI-${this.preInfoCoti.cotiCod}`);
          this.dialogRef.close();
        } else {
          alert('Error al generar excel');
        }
      });
  }

  descargarPDF(value: {
    observaciones: string;
    envio: number;
    otro: number;
    porPagar: number;
  }) {
    this.ventaEnCurso$.next(true);
    this.invManager
      .getPdfCoti(this.preInfoCoti.cotiCod, value, this.image)
      .subscribe((res) => {
        if (res) {
          this.ventaEnCurso$.next(false);
          saveAs(res, `COTI-${this.preInfoCoti.cotiCod}`);
          this.dialogRef.close();
        } else {
          alert('Error al generar excel');
        }
      });
  }

  changeImageBoolean() {
    this.image = !this.image;
  }
}
