import { InventarioManagerService } from 'src/app/inventario-manager.service';
import { BehaviorSubject } from 'rxjs';
import { Item, Tipo } from './../../inventario-manager.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-folders',
  templateUrl: './change-folders.component.html',
  styleUrls: ['./change-folders.component.css']
})
export class ChangeFoldersComponent implements OnInit {

  cambioFolderForm: FormGroup;

  tiposArray = new BehaviorSubject<Tipo[]>([]);

  subTipoArray = new BehaviorSubject<string[]>([]);

  constructor(private inv: InventarioManagerService , public dialogRef: MatDialogRef<ChangeFoldersComponent>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { item: Item }, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.cambioFolderForm = this.formBuilder.group({
      selectTipo: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ])),
      selectSubTipo: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ])),
    });
    this.inv.getTipos().subscribe(res => {
      const tipoAct = res.find(x => x.name === this.data.item.tipo);
      this.tiposArray.next(res);
      this.cambioFolderForm.get('selectTipo').setValue(tipoAct);
      this.subTipoArray.next(tipoAct.subTipo);
      this.cambioFolderForm.get('selectSubTipo').setValue(tipoAct.subTipo.find(x => x === this.data.item.subTipo));
    });
  }

  cambioTipo(e) {
    this.cambioFolderForm.get('selectSubTipo').reset();
    this.subTipoArray.next(e.value.subTipo);
  }

  cambiarCarpeta(r: {selectTipo: Tipo, selectSubTipo: string})  {
    this.cambioFolderForm.disable();
    this.inv.changeFolder(r.selectTipo.name, r.selectSubTipo, this.data.item.codigo).subscribe(res => {
      if (res) {
        this.snackBar.open(`${this.data.item.name} cambiado de carpeta!!`);
        this.dialogRef.close(this.data.item);
      } else {
        this.cambioFolderForm.enable();
      }
    });
  }

}
