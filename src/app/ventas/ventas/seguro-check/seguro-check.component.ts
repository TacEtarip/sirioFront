import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seguro-check',
  templateUrl: './seguro-check.component.html',
  styleUrls: ['./seguro-check.component.css'],
})
export class SeguroCheckComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SeguroCheckComponent>,
    @Inject(MAT_DIALOG_DATA)
    public infoSeguroCheck: {
      titulo: string;
      mensaje: string;
      texto_boton: string;
    }
  ) {}

  ngOnInit(): void {}

  aceptado() {
    this.dialogRef.close(true);
  }
}
