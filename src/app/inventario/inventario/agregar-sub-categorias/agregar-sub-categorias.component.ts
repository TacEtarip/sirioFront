import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {InventarioManagerService} from '../../../inventario-manager.service';

@Component({
  selector: 'app-agregar-sub-categorias',
  templateUrl: './agregar-sub-categorias.component.html',
  styleUrls: ['./agregar-sub-categorias.component.css']
})
export class AgregarSubCategoriasComponent implements OnInit {

  onSucces = new EventEmitter();

  showMessage = false;

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<AgregarSubCategoriasComponent>,
              private formBuilder: FormBuilder,
              private inventarioMNG: InventarioManagerService,
              @Inject(MAT_DIALOG_DATA) public data: {codigo: string}) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      subTipo: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }


  onSubmit() {
    this.inventarioMNG.agregarSubTipo(this.form.get('subTipo').value, this.data.codigo).subscribe(() => {
      this.form.reset();
      this.showMessage = true;
      this.onSucces.emit();
    });
  }

}
