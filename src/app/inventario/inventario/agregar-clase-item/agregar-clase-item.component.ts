import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {InventarioManagerService} from '../../../inventario-manager.service';

@Component({
  selector: 'app-agregar-clase-item',
  templateUrl: './agregar-clase-item.component.html',
  styleUrls: ['./agregar-clase-item.component.css']
})
export class AgregarClaseItemComponent implements OnInit {
  onSub = new EventEmitter();

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<AgregarClaseItemComponent>,
              private formBuilder: FormBuilder,
              private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }


  onSubmit(name) {
    this.form.disable();
    this.inventarioMNG.addTipo(name.name.trim()).subscribe((result) => {
      if (result) {
       this.dialogRef.close(result);
      } else {
        this.form.enable();
        alert('Error al añadir categoria.');
      }
    });
  }
}
