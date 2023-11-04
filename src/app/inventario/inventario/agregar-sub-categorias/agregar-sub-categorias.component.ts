import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import {InventarioManagerService} from '../../../inventario-manager.service';

@Component({
  selector: 'app-agregar-sub-categorias',
  templateUrl: './agregar-sub-categorias.component.html',
  styleUrls: ['./agregar-sub-categorias.component.css']
})
export class AgregarSubCategoriasComponent implements OnInit {

  onSucces = new EventEmitter();

  showMessage = false;

  form: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<AgregarSubCategoriasComponent>,
              private formBuilder: UntypedFormBuilder,
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
    this.form.disable();
    const subTipoName = this.form.get('subTipo').value.trim();
    this.inventarioMNG.agregarSubTipo(subTipoName, this.data.codigo).subscribe((res) => {
      this.form.enable();
      if (res) {
        this.form.reset();
        this.showMessage = true;
      } else {
        this.form.enable();
        alert('Error al agregar una sub categoria');
      }
    });
  }

}
