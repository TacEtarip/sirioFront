import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {InventarioManagerService, Tipo} from '../../../inventario-manager.service';

@Component({
  selector: 'app-sub-tipo-editar',
  templateUrl: './sub-tipo-editar.component.html',
  styleUrls: ['./sub-tipo-editar.component.css']
})
export class SubTipoEditarComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SubTipoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {codigo: string, antiguoSubName: string},
    private formBuilder: FormBuilder,
    private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      newSubName: this.formBuilder.control(this.data.antiguoSubName,  Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }

  onSubmit(newSubTipo: {newSubName: string}) {
    this.inventarioMNG.updateSubTipoName(this.data.codigo, this.data.antiguoSubName, newSubTipo.newSubName).subscribe((res) => {
        this.dialogRef.close(newSubTipo.newSubName);
    });
  }


}