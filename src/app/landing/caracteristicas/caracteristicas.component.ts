import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { InventarioManagerService, Item } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css']
})
export class CaracteristicasComponent implements OnInit {


  caracteristicaList = new BehaviorSubject<string[]>([]);

  form: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<CaracteristicasComponent>,
              private formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public item: Item,
              private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.caracteristicaList.next(this.item.caracteristicas);
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }

  onSubmit(caracteristicas: {name: string}) {
    this.inventarioMNG.addCaracteristica(caracteristicas.name.trim(), this.item.codigo).subscribe((res) => {
      if (res !== null) {
        this.form.reset();
        this.caracteristicaList.next(res.caracteristicas);
      }
    });
  }

  deleteCaracteristicas(matOptions: MatListOption[]) {
    this.form.disable();
    const arrayToDelete = (matOptions.map(x => x.value));
    this.inventarioMNG.deleteCaracteristicas(arrayToDelete, this.item.codigo).subscribe((res) => {
      this.form.enable();
      if (res) {
        this.caracteristicaList.next(res.caracteristicas);
      }
    });
  }

}
