import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {InventarioManagerService, Tipo} from '../../../inventario-manager.service';

@Component({
  selector: 'app-editar-clase',
  templateUrl: './editar-clase.component.html',
  styleUrls: ['./editar-clase.component.css']
})
export class EditarClaseComponent implements OnInit {
  onSub = new EventEmitter();
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarClaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tipo,
    private formBuilder: FormBuilder,
    private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(this.data.name,  Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }

  onSubmit(tipo: Tipo) {
    tipo.name = tipo.name.trim();
    tipo.codigo = this.data.codigo;
    this.onSub.emit(tipo);
  }

}
